import * as Sentry from "@sentry/nextjs";
import {
  NEWSLETTER_TURNSTILE_ACTION,
  NEWSLETTER_TURNSTILE_ERROR_MESSAGE,
} from "@/lib/newsletter/turnstile";

const TURNSTILE_SITEVERIFY_URL =
  "https://challenges.cloudflare.com/turnstile/v0/siteverify";
const TURNSTILE_TEST_ACTION = "test";
const TURNSTILE_TEST_SECRET_KEYS = new Set([
  "1x0000000000000000000000000000000AA",
  "2x0000000000000000000000000000000AA",
]);

type TurnstileFetch = (input: string, init?: RequestInit) => Promise<Response>;

type TurnstileSiteverifyResponse = {
  action?: string;
  success?: boolean;
  "error-codes"?: string[];
  hostname?: string;
};

export type TurnstileVerificationResult =
  | {
      ok: true;
    }
  | {
      ok: false;
      code: "configuration" | "invalid" | "missing-token" | "network";
      message: string;
      errorCodes?: string[];
    };

type VerifyTurnstileTokenOptions = {
  allowedHostnames?: readonly string[] | string;
  deploymentHostname?: string;
  expectedAction?: string;
  fetcher?: TurnstileFetch;
  remoteIp?: string | null;
  secretKey?: string;
  token: FormDataEntryValue | null;
};

function normalizeTurnstileHostname(hostname: string): string {
  const withoutProtocol = hostname
    .trim()
    .replace(/^[a-z][a-z\d+.-]*:\/\//i, "");
  const withoutPath = withoutProtocol.split("/")[0] || "";
  const withoutPort = withoutPath.split(":")[0] || "";

  return withoutPort.toLowerCase().replace(/\.$/, "");
}

const LOCAL_DEV_TURNSTILE_HOSTNAMES = [
  "localhost",
  "127.0.0.1",
  "0.0.0.0",
] as const;

function isLocalDevelopmentRuntime(): boolean {
  return process.env.NODE_ENV === "development";
}

function parseAllowedHostnames(
  allowedHostnames: readonly string[] | string | undefined,
): string[] {
  const values =
    typeof allowedHostnames === "string"
      ? allowedHostnames.split(/[,\s]+/)
      : allowedHostnames || [];

  return values
    .map((hostname) => normalizeTurnstileHostname(hostname))
    .filter(Boolean);
}

export function resolveTurnstileAllowedHostnames(
  configuredHostnames: readonly string[] | string | undefined = process.env
    .TURNSTILE_ALLOWED_HOSTNAMES,
  deploymentHostname: string | undefined = process.env.VERCEL_URL,
): string[] {
  const hostnames = new Set(parseAllowedHostnames(configuredHostnames));

  if (deploymentHostname) {
    const normalizedDeploymentHostname =
      normalizeTurnstileHostname(deploymentHostname);

    if (normalizedDeploymentHostname) {
      hostnames.add(normalizedDeploymentHostname);
    }
  }

  if (hostnames.size === 0 && isLocalDevelopmentRuntime()) {
    return [...LOCAL_DEV_TURNSTILE_HOSTNAMES];
  }

  return [...hostnames];
}

function isAllowedTurnstileHostname(
  hostname: string,
  allowedHostnames: readonly string[],
): boolean {
  return allowedHostnames.some((allowed) => {
    if (allowed.startsWith("*.")) {
      const suffix = allowed.slice(1);

      return hostname.endsWith(suffix);
    }

    return hostname === allowed;
  });
}

function getExpectedActions(
  secretKey: string,
  expectedAction: string,
): Set<string> {
  const actions = new Set([expectedAction]);

  if (TURNSTILE_TEST_SECRET_KEYS.has(secretKey)) {
    actions.add(TURNSTILE_TEST_ACTION);
  }

  return actions;
}

export async function verifyTurnstileToken({
  allowedHostnames = process.env.TURNSTILE_ALLOWED_HOSTNAMES,
  deploymentHostname = process.env.VERCEL_URL,
  expectedAction = NEWSLETTER_TURNSTILE_ACTION,
  fetcher = fetch,
  remoteIp,
  secretKey = process.env.TURNSTILE_SECRET_KEY,
  token,
}: VerifyTurnstileTokenOptions): Promise<TurnstileVerificationResult> {
  const responseToken = typeof token === "string" ? token.trim() : "";
  const normalizedAllowedHostnames = resolveTurnstileAllowedHostnames(
    allowedHostnames,
    deploymentHostname,
  );

  if (!secretKey) {
    return {
      ok: false,
      code: "configuration",
      message: NEWSLETTER_TURNSTILE_ERROR_MESSAGE,
    };
  }

  if (!responseToken) {
    return {
      ok: false,
      code: "missing-token",
      message: NEWSLETTER_TURNSTILE_ERROR_MESSAGE,
    };
  }

  if (normalizedAllowedHostnames.length === 0) {
    return {
      ok: false,
      code: "configuration",
      message: NEWSLETTER_TURNSTILE_ERROR_MESSAGE,
    };
  }

  const body = new URLSearchParams({
    response: responseToken,
    secret: secretKey,
  });

  if (remoteIp) {
    body.set("remoteip", remoteIp);
  }

  try {
    const response = await fetcher(TURNSTILE_SITEVERIFY_URL, {
      body,
      method: "POST",
    });
    const result = (await response.json()) as TurnstileSiteverifyResponse;

    if (!response.ok || !result.success) {
      return {
        ok: false,
        code: "invalid",
        message: NEWSLETTER_TURNSTILE_ERROR_MESSAGE,
        errorCodes: result["error-codes"],
      };
    }

    const expectedActions = getExpectedActions(secretKey, expectedAction);

    if (!result.action || !expectedActions.has(result.action)) {
      return {
        ok: false,
        code: "invalid",
        message: NEWSLETTER_TURNSTILE_ERROR_MESSAGE,
        errorCodes: ["action-mismatch"],
      };
    }

    const hostname = result.hostname
      ? normalizeTurnstileHostname(result.hostname)
      : "";

    if (
      !hostname ||
      !isAllowedTurnstileHostname(hostname, normalizedAllowedHostnames)
    ) {
      return {
        ok: false,
        code: "invalid",
        message: NEWSLETTER_TURNSTILE_ERROR_MESSAGE,
        errorCodes: ["hostname-mismatch"],
      };
    }

    return { ok: true };
  } catch (error) {
    Sentry.captureException(error);

    return {
      ok: false,
      code: "network",
      message: NEWSLETTER_TURNSTILE_ERROR_MESSAGE,
    };
  }
}
