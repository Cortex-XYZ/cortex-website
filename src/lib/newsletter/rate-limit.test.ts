import { describe, expect, test } from "bun:test";
import { getNewsletterRateLimitIdentifier } from "@/lib/newsletter/rate-limit";

function headersFrom(values: Record<string, string>): Headers {
  const headers = new Headers();

  for (const [key, value] of Object.entries(values)) {
    headers.set(key, value);
  }

  return headers;
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

  test("falls back to local when proxy headers are absent", () => {
    const identifier = getNewsletterRateLimitIdentifier(headersFrom({}));

    expect(identifier).toBe("local");
  });
});
