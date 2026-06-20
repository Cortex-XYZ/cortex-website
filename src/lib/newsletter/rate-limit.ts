import * as Sentry from "@sentry/nextjs";
import { Ratelimit } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis";
import { isIP } from "node:net";

const NEWSLETTER_RATE_LIMIT_REQUESTS = 5;
const NEWSLETTER_RATE_LIMIT_WINDOW = "1 m";
const NEWSLETTER_RATE_LIMIT_PREFIX = "cortex:newsletter";
const LOCAL_RATE_LIMIT_IDENTIFIER = "local";

type HeaderReader = {
  get(name: string): string | null;
};

type ForwardedIpOptions = {
  skipLoopback: boolean;
};

export type NewsletterRateLimitResult =
  | {
      ok: true;
      skipped?: boolean;
    }
  | {
      ok: false;
      code: "configuration" | "identifier" | "limited" | "storage";
      message: string;
      reset?: number;
    };

let newsletterRateLimiter: Ratelimit | null = null;

function isProductionLikeRuntime(): boolean {
  return (
    process.env.NODE_ENV === "production" ||
    process.env.VERCEL_ENV === "preview" ||
    process.env.VERCEL_ENV === "production"
  );
}

function hasUpstashConfig(): boolean {
  return Boolean(
    process.env.UPSTASH_REDIS_REST_URL && process.env.UPSTASH_REDIS_REST_TOKEN,
  );
}

function getNewsletterRateLimiter(): Ratelimit {
  newsletterRateLimiter ??= new Ratelimit({
    redis: Redis.fromEnv({ enableTelemetry: false }),
    limiter: Ratelimit.slidingWindow(
      NEWSLETTER_RATE_LIMIT_REQUESTS,
      NEWSLETTER_RATE_LIMIT_WINDOW,
    ),
    analytics: false,
    prefix: NEWSLETTER_RATE_LIMIT_PREFIX,
  });

  return newsletterRateLimiter;
}

function normalizeForwardedIp(value: string | null): string | null {
  const trimmed = value?.trim();

  if (!trimmed || trimmed.toLowerCase() === "unknown") return null;

  let candidate =
    trimmed.startsWith('"') && trimmed.endsWith('"')
      ? trimmed.slice(1, -1).trim()
      : trimmed;

  const bracketedAddress = candidate.match(/^\[([^\]]+)\](?::\d+)?$/);

  if (bracketedAddress) {
    candidate = bracketedAddress[1];
  }

  const mappedIpv4Address = candidate.match(
    /^::ffff:(\d{1,3}(?:\.\d{1,3}){3})(?::\d+)?$/i,
  );

  if (mappedIpv4Address && isIP(mappedIpv4Address[1]) === 4) {
    return mappedIpv4Address[1];
  }

  const ipv4Address = candidate.match(
    /^(\d{1,3}(?:\.\d{1,3}){3})(?::\d+)?$/,
  );

  if (ipv4Address && isIP(ipv4Address[1]) === 4) {
    return ipv4Address[1];
  }

  return isIP(candidate) ? candidate.toLowerCase() : null;
}

function isLoopbackIp(ipAddress: string): boolean {
  return (
    ipAddress === "::1" ||
    ipAddress === "0:0:0:0:0:0:0:1" ||
    ipAddress === "127.0.0.1" ||
    ipAddress.startsWith("127.")
  );
}

function firstUsableForwardedIp(
  values: (string | null)[],
  { skipLoopback }: ForwardedIpOptions,
): string | null {
  const normalizedIps = values
    .map((value) => normalizeForwardedIp(value))
    .filter((value): value is string => Boolean(value));

  if (skipLoopback) {
    return normalizedIps.find((ipAddress) => !isLoopbackIp(ipAddress)) ?? null;
  }

  return normalizedIps[0] ?? null;
}

function firstForwardedIp(
  value: string | null,
  options: ForwardedIpOptions,
): string | null {
  if (!value) return null;

  return firstUsableForwardedIp(value.split(","), options);
}

function firstStandardForwardedIp(
  value: string | null,
  options: ForwardedIpOptions,
): string | null {
  if (!value) return null;

  const forwardedForValues = value.split(",").map((entry) => {
    const forPart = entry
      .split(";")
      .find((part) => part.trim().toLowerCase().startsWith("for="));

    return forPart?.split("=").slice(1).join("=") ?? null;
  });

  return firstUsableForwardedIp(forwardedForValues, options);
}

function headerIp(
  value: string | null,
  options: ForwardedIpOptions,
): string | null {
  return firstUsableForwardedIp([value], options);
}

export function getNewsletterClientIp(headersList: HeaderReader): string | null {
  const options = { skipLoopback: isProductionLikeRuntime() };

  return (
    firstForwardedIp(headersList.get("x-vercel-forwarded-for"), options) ??
    headerIp(headersList.get("cf-connecting-ip"), options) ??
    headerIp(headersList.get("x-real-ip"), options) ??
    firstStandardForwardedIp(headersList.get("forwarded"), options) ??
    firstForwardedIp(headersList.get("x-forwarded-for"), options)
  );
}

export function getNewsletterRateLimitIdentifier(
  headersList: HeaderReader,
): string | null {
  return getNewsletterClientIp(headersList);
}

export async function checkNewsletterRateLimit(
  identifier: string | null,
): Promise<NewsletterRateLimitResult> {
  const rateLimitIdentifier = identifier?.trim() || null;

  if (!hasUpstashConfig()) {
    if (!isProductionLikeRuntime()) {
      return { ok: true, skipped: true };
    }

    return {
      ok: false,
      code: "configuration",
      message:
        "Newsletter rate limiting is missing required Upstash environment variables.",
    };
  }

  if (!rateLimitIdentifier && isProductionLikeRuntime()) {
    return {
      ok: false,
      code: "identifier",
      message: "We could not accept that request right now. Please try again.",
    };
  }

  try {
    const result = await getNewsletterRateLimiter().limit(
      rateLimitIdentifier ?? LOCAL_RATE_LIMIT_IDENTIFIER,
    );

    if (!result.success) {
      return {
        ok: false,
        code: "limited",
        message: "Too many attempts. Please try again in a few minutes.",
        reset: result.reset,
      };
    }

    return { ok: true };
  } catch (error) {
    Sentry.captureException(error);

    return {
      ok: false,
      code: "storage",
      message: "We could not accept that request right now. Please try again.",
    };
  }
}
