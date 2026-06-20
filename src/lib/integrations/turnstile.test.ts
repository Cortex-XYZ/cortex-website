import { afterEach, describe, expect, mock, test } from "bun:test";
import {
  isNewsletterTurnstileEnabled,
  resolveTurnstileAllowedHostnames,
  verifyTurnstileToken,
} from "@/lib/integrations/turnstile";

describe("verifyTurnstileToken", () => {
  test("requires allowed hostnames before calling Siteverify", async () => {
    const fetcher = mock(async () => Response.json({ success: true }));

    const result = await verifyTurnstileToken({
      allowedHostnames: "",
      deploymentHostname: "",
      fetcher,
      secretKey: "secret_test",
      token: "token_test",
    });

    expect(result).toEqual({
      ok: false,
      code: "configuration",
      message: "Verification failed. Please try again.",
    });
    expect(fetcher).not.toHaveBeenCalled();
  });

  test("rejects a missing token before calling Siteverify", async () => {
    const fetcher = mock(async () => Response.json({ success: true }));

    const result = await verifyTurnstileToken({
      fetcher,
      secretKey: "secret_test",
      token: "",
    });

    expect(result).toEqual({
      ok: false,
      code: "missing-token",
      message: "Verification failed. Please try again.",
    });
    expect(fetcher).not.toHaveBeenCalled();
  });

  test("rejects whitespace-only secret keys before calling Siteverify", async () => {
    const fetcher = mock(async () => Response.json({ success: true }));

    const result = await verifyTurnstileToken({
      fetcher,
      secretKey: "   ",
      token: "token_test",
    });

    expect(result).toEqual({
      ok: false,
      code: "configuration",
      message: "Verification failed. Please try again.",
    });
    expect(fetcher).not.toHaveBeenCalled();
  });

  test("trims secret keys before calling Siteverify", async () => {
    const fetcher = mock(async (_input, init) => {
      const body = init?.body;

      expect(body).toBeInstanceOf(URLSearchParams);
      expect((body as URLSearchParams).get("secret")).toBe("secret_test");

      return Response.json({
        action: "newsletter",
        hostname: "www.cortexglobal.xyz",
        success: true,
      });
    });

    const result = await verifyTurnstileToken({
      allowedHostnames: ["www.cortexglobal.xyz"],
      fetcher,
      secretKey: "  secret_test  ",
      token: "token_test",
    });

    expect(result).toEqual({ ok: true });
    expect(fetcher).toHaveBeenCalledTimes(1);
  });

  test("accepts a valid Siteverify response for the newsletter action and hostname", async () => {
    const fetcher = mock(async () =>
      Response.json({
        action: "newsletter",
        hostname: "www.cortexglobal.xyz",
        success: true,
      }),
    );

    const result = await verifyTurnstileToken({
      allowedHostnames: "cortexglobal.xyz,www.cortexglobal.xyz",
      fetcher,
      remoteIp: "203.0.113.10",
      secretKey: "secret_test",
      token: "token_test",
    });

    expect(result).toEqual({ ok: true });
    expect(fetcher).toHaveBeenCalledTimes(1);
  });

  test("maps a failed Siteverify response to an invalid result", async () => {
    const fetcher = mock(async () =>
      Response.json({
        success: false,
        "error-codes": ["invalid-input-response"],
      }),
    );

    const result = await verifyTurnstileToken({
      allowedHostnames: ["www.cortexglobal.xyz"],
      fetcher,
      remoteIp: "203.0.113.10",
      secretKey: "secret_test",
      token: "token_test",
    });

    expect(result).toEqual({
      ok: false,
      code: "invalid",
      message: "Verification failed. Please try again.",
      errorCodes: ["invalid-input-response"],
    });
    expect(fetcher).toHaveBeenCalledTimes(1);
  });

  test("rejects a Siteverify response with a mismatched action", async () => {
    const fetcher = mock(async () =>
      Response.json({
        action: "login",
        hostname: "www.cortexglobal.xyz",
        success: true,
      }),
    );

    const result = await verifyTurnstileToken({
      allowedHostnames: ["www.cortexglobal.xyz"],
      fetcher,
      secretKey: "secret_test",
      token: "token_test",
    });

    expect(result).toEqual({
      ok: false,
      code: "invalid",
      message: "Verification failed. Please try again.",
      errorCodes: ["action-mismatch"],
    });
  });

  test("rejects a Siteverify response with a mismatched hostname", async () => {
    const fetcher = mock(async () =>
      Response.json({
        action: "newsletter",
        hostname: "attacker.example",
        success: true,
      }),
    );

    const result = await verifyTurnstileToken({
      allowedHostnames: ["www.cortexglobal.xyz"],
      fetcher,
      secretKey: "secret_test",
      token: "token_test",
    });

    expect(result).toEqual({
      ok: false,
      code: "invalid",
      message: "Verification failed. Please try again.",
      errorCodes: ["hostname-mismatch"],
    });
  });

  test("accepts Cloudflare test-secret responses with the dummy test action", async () => {
    const fetcher = mock(async () =>
      Response.json({
        action: "test",
        hostname: "localhost",
        success: true,
      }),
    );

    const result = await verifyTurnstileToken({
      allowedHostnames: ["localhost"],
      fetcher,
      secretKey: "1x0000000000000000000000000000000AA",
      token: "XXXX.DUMMY.TOKEN.XXXX",
    });

    expect(result).toEqual({ ok: true });
  });

  test("accepts a preview hostname through a wildcard allowlist entry", async () => {
    const fetcher = mock(async () =>
      Response.json({
        action: "newsletter",
        hostname: "cortex-website-git-main.vercel.app",
        success: true,
      }),
    );

    const result = await verifyTurnstileToken({
      allowedHostnames: ["cortexglobal.xyz", "*.vercel.app"],
      fetcher,
      secretKey: "secret_test",
      token: "token_test",
    });

    expect(result).toEqual({ ok: true });
  });

  test("accepts the current Vercel deployment hostname when it is not listed explicitly", async () => {
    const fetcher = mock(async () =>
      Response.json({
        action: "newsletter",
        hostname: "cortex-website-preview.vercel.app",
        success: true,
      }),
    );

    const result = await verifyTurnstileToken({
      allowedHostnames: ["cortexglobal.xyz", "www.cortexglobal.xyz"],
      deploymentHostname: "cortex-website-preview.vercel.app",
      fetcher,
      secretKey: "secret_test",
      token: "token_test",
    });

    expect(result).toEqual({ ok: true });
  });
});

describe("resolveTurnstileAllowedHostnames", () => {
  test("merges configured hostnames with the deployment hostname", () => {
    expect(
      resolveTurnstileAllowedHostnames(
        "cortexglobal.xyz, www.cortexglobal.xyz",
        "cortex-website-preview.vercel.app",
      ),
    ).toEqual([
      "cortexglobal.xyz",
      "www.cortexglobal.xyz",
      "cortex-website-preview.vercel.app",
    ]);
  });
});

describe("isNewsletterTurnstileEnabled", () => {
  const originalSiteKey = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY;
  const originalSecretKey = process.env.TURNSTILE_SECRET_KEY;

  afterEach(() => {
    if (originalSiteKey === undefined) {
      delete process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY;
    } else {
      process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY = originalSiteKey;
    }

    if (originalSecretKey === undefined) {
      delete process.env.TURNSTILE_SECRET_KEY;
    } else {
      process.env.TURNSTILE_SECRET_KEY = originalSecretKey;
    }
  });

  test("requires both the public site key and secret key", () => {
    process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY = "site-key";
    process.env.TURNSTILE_SECRET_KEY = "secret-key";

    expect(isNewsletterTurnstileEnabled()).toBe(true);
  });

  test("rejects a secret-only configuration", () => {
    delete process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY;
    process.env.TURNSTILE_SECRET_KEY = "secret-key";

    expect(isNewsletterTurnstileEnabled()).toBe(false);
  });

  test("rejects a site-key-only configuration", () => {
    process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY = "site-key";
    delete process.env.TURNSTILE_SECRET_KEY;

    expect(isNewsletterTurnstileEnabled()).toBe(false);
  });

  test("ignores whitespace-only env values", () => {
    process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY = "   ";
    process.env.TURNSTILE_SECRET_KEY = "secret-key";

    expect(isNewsletterTurnstileEnabled()).toBe(false);
  });
});
