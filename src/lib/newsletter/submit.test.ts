import { describe, expect, test } from "bun:test";
import type { NewsletterSubscribeResult } from "@/lib/integrations/resend";
import type { NewsletterRateLimitResult } from "@/lib/newsletter/rate-limit";
import { handleNewsletterSignup } from "@/lib/newsletter/submit";

function createFormData(fields: Record<string, string>): FormData {
  const formData = new FormData();

  for (const [key, value] of Object.entries(fields)) {
    formData.set(key, value);
  }

  return formData;
}

function createSubscribeSpy(result: NewsletterSubscribeResult) {
  const calls: string[] = [];

  return {
    calls,
    subscribe: async (email: string) => {
      calls.push(email);
      return result;
    },
  };
}

function createRateLimitSpy(result: NewsletterRateLimitResult) {
  let calls = 0;

  return {
    get calls() {
      return calls;
    },
    rateLimit: async () => {
      calls += 1;
      return result;
    },
  };
}

const subscribedResult: NewsletterSubscribeResult = {
  ok: true,
  alreadySubscribed: false,
};

describe("handleNewsletterSignup", () => {
  test("rejects invalid email before subscribing", async () => {
    const subscribeSpy = createSubscribeSpy(subscribedResult);
    const result = await handleNewsletterSignup(
      createFormData({
        email: "not-an-email",
        company: "",
      }),
      {
        subscribe: subscribeSpy.subscribe,
      },
    );

    expect(result).toEqual({
      status: "error",
      message: "Enter a valid email address.",
      emailError: "Enter a valid email address.",
    });
    expect(subscribeSpy.calls).toEqual([]);
  });

  test("silently accepts honeypot submissions without subscribing", async () => {
    const subscribeSpy = createSubscribeSpy(subscribedResult);
    const result = await handleNewsletterSignup(
      createFormData({
        email: "person@example.com",
        company: "Bot Corp",
      }),
      {
        subscribe: subscribeSpy.subscribe,
      },
    );

    expect(result).toEqual({
      status: "success",
      message: "You have successfully subscribed to the Cortex update list.",
    });
    expect(subscribeSpy.calls).toEqual([]);
  });

  test("normalizes valid email and subscribes it", async () => {
    const subscribeSpy = createSubscribeSpy(subscribedResult);
    const rateLimitSpy = createRateLimitSpy({ ok: true });
    const result = await handleNewsletterSignup(
      createFormData({
        email: " Person@Example.COM ",
        company: "",
      }),
      {
        rateLimit: rateLimitSpy.rateLimit,
        subscribe: subscribeSpy.subscribe,
      },
    );

    expect(result).toEqual({
      status: "success",
      message: "You have successfully subscribed to the Cortex update list.",
      subscribedEmail: "person@example.com",
    });
    expect(rateLimitSpy.calls).toBe(1);
    expect(subscribeSpy.calls).toEqual(["person@example.com"]);
  });

  test("does not subscribe when the rate limit blocks the request", async () => {
    const subscribeSpy = createSubscribeSpy(subscribedResult);
    const rateLimitSpy = createRateLimitSpy({
      ok: false,
      code: "limited",
      message: "Too many attempts. Please try again in a few minutes.",
      reset: 20_000,
    });
    const result = await handleNewsletterSignup(
      createFormData({
        email: "person@example.com",
        company: "",
      }),
      {
        rateLimit: rateLimitSpy.rateLimit,
        subscribe: subscribeSpy.subscribe,
      },
    );

    expect(result).toEqual({
      status: "error",
      message: "Too many attempts. Please try again in a few minutes.",
    });
    expect(rateLimitSpy.calls).toBe(1);
    expect(subscribeSpy.calls).toEqual([]);
  });

  test("does not subscribe when production rate-limit configuration is missing", async () => {
    const subscribeSpy = createSubscribeSpy(subscribedResult);
    const rateLimitSpy = createRateLimitSpy({
      ok: false,
      code: "configuration",
      message:
        "Newsletter rate limiting is missing required Upstash environment variables.",
    });
    const result = await handleNewsletterSignup(
      createFormData({
        email: "person@example.com",
        company: "",
      }),
      {
        rateLimit: rateLimitSpy.rateLimit,
        subscribe: subscribeSpy.subscribe,
      },
    );

    expect(result).toEqual({
      status: "error",
      message:
        "Newsletter rate limiting is missing required Upstash environment variables.",
    });
    expect(rateLimitSpy.calls).toBe(1);
    expect(subscribeSpy.calls).toEqual([]);
  });

  test("returns already-submitted message when Resend confirms an existing segment member", async () => {
    const subscribeSpy = createSubscribeSpy({
      ok: true,
      alreadySubscribed: true,
    });
    const result = await handleNewsletterSignup(
      createFormData({
        email: "person@example.com",
        company: "",
      }),
      {
        subscribe: subscribeSpy.subscribe,
      },
    );

    expect(result).toEqual({
      status: "success",
      message: "Your email has already been submitted.",
      subscribedEmail: "person@example.com",
    });
    expect(subscribeSpy.calls).toEqual(["person@example.com"]);
  });

  test("returns configuration errors without exposing Resend internals", async () => {
    const subscribeSpy = createSubscribeSpy({
      ok: false,
      code: "configuration",
      message: "missing env",
    });
    const result = await handleNewsletterSignup(
      createFormData({
        email: "person@example.com",
        company: "",
      }),
      {
        subscribe: subscribeSpy.subscribe,
      },
    );

    expect(result).toEqual({
      status: "error",
      message: "Newsletter setup is missing required Resend environment variables.",
    });
    expect(subscribeSpy.calls).toEqual(["person@example.com"]);
  });

  test("returns a generic message for Resend API failures", async () => {
    const subscribeSpy = createSubscribeSpy({
      ok: false,
      code: "resend",
      message: "upstream detail",
    });
    const result = await handleNewsletterSignup(
      createFormData({
        email: "person@example.com",
        company: "",
      }),
      {
        subscribe: subscribeSpy.subscribe,
      },
    );

    expect(result).toEqual({
      status: "error",
      message: "We could not subscribe that email right now. Please try again.",
    });
    expect(subscribeSpy.calls).toEqual(["person@example.com"]);
  });
});
