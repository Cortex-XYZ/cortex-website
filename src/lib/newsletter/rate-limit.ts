import * as Sentry from "@sentry/nextjs";
import { Ratelimit } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis";

const NEWSLETTER_RATE_LIMIT_REQUESTS = 5;
const NEWSLETTER_RATE_LIMIT_WINDOW = "1 m";
const NEWSLETTER_RATE_LIMIT_PREFIX = "cortex:newsletter";
const LOCAL_RATE_LIMIT_IDENTIFIER = "local";

type HeaderReader = {
  get(name: string): string | null;
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

function firstForwardedIp(value: string | null): string | null {
  if (!value) return null;

  return value
    .split(",")
    .map((item) => item.trim())
    .find(Boolean) ?? null;
}

export function getNewsletterClientIp(headersList: HeaderReader): string | null {
  return (
    firstForwardedIp(headersList.get("x-forwarded-for")) ??
    firstForwardedIp(headersList.get("x-vercel-forwarded-for")) ??
    headersList.get("cf-connecting-ip") ??
    headersList.get("x-real-ip")
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
