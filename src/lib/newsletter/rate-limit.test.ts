import { describe, expect, test } from "bun:test";
import {
  checkNewsletterRateLimit,
  getNewsletterRateLimitIdentifier,
} from "@/lib/newsletter/rate-limit";

function headersFrom(values: Record<string, string>): Headers {
  const headers = new Headers();

  for (const [key, value] of Object.entries(values)) {
    headers.set(key, value);
  }

  return headers;
}

function restoreEnv(name: string, value: string | undefined) {
  if (value === undefined) {
    delete process.env[name];
    return;
  }

  process.env[name] = value;
}

describe("getNewsletterRateLimitIdentifier", () => {
  test("uses the first x-forwarded-for IP", () => {
    const identifier = getNewsletterRateLimitIdentifier(
      headersFrom({
        "x-forwarded-for": "203.0.113.10, 198.51.100.20",
      }),
    );

    expect(identifier).toBe("203.0.113.10");
  });

  test("returns null when proxy headers are absent", () => {
    const identifier = getNewsletterRateLimitIdentifier(headersFrom({}));

    expect(identifier).toBeNull();
  });
});

describe("checkNewsletterRateLimit", () => {
  test("fails closed in production-like runtimes when the client IP is unknown", async () => {
    const previousEnv = {
      NODE_ENV: process.env.NODE_ENV,
      UPSTASH_REDIS_REST_TOKEN: process.env.UPSTASH_REDIS_REST_TOKEN,
      UPSTASH_REDIS_REST_URL: process.env.UPSTASH_REDIS_REST_URL,
      VERCEL_ENV: process.env.VERCEL_ENV,
    };

    process.env.UPSTASH_REDIS_REST_TOKEN = "token_test";
    process.env.UPSTASH_REDIS_REST_URL = "https://upstash.example";
    process.env.VERCEL_ENV = "production";

    try {
      const result = await checkNewsletterRateLimit(null);

      expect(result).toEqual({
        ok: false,
        code: "identifier",
        message: "We could not accept that request right now. Please try again.",
      });
    } finally {
      restoreEnv("NODE_ENV", previousEnv.NODE_ENV);
      restoreEnv(
        "UPSTASH_REDIS_REST_TOKEN",
        previousEnv.UPSTASH_REDIS_REST_TOKEN,
      );
      restoreEnv("UPSTASH_REDIS_REST_URL", previousEnv.UPSTASH_REDIS_REST_URL);
      restoreEnv("VERCEL_ENV", previousEnv.VERCEL_ENV);
    }
  });
});
