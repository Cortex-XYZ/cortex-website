import * as Sentry from "@sentry/nextjs";

export async function register() {
  const dsn = process.env.SENTRY_DSN;
  if (!dsn) return;

  if (process.env.NEXT_RUNTIME === "nodejs") {
    Sentry.init({
      dsn,
      enableLogs: true,
      tracesSampleRate: 0.1,
      sendDefaultPii: false,
      integrations: [
        Sentry.consoleLoggingIntegration({
          levels: ["log", "warn", "error"],
        }),
      ],
    });
  }

  if (process.env.NEXT_RUNTIME === "edge") {
    Sentry.init({
      dsn,
      enableLogs: true,
      tracesSampleRate: 0.1,
      sendDefaultPii: false,
      integrations: [
        Sentry.consoleLoggingIntegration({
          levels: ["log", "warn", "error"],
        }),
      ],
    });
  }
}

export const onRequestError = Sentry.captureRequestError;
