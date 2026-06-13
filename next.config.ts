import type { NextConfig } from "next";
import { withSentryConfig } from "@sentry/nextjs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import {
  PLAUSIBLE_ORIGIN_EVENT_URL,
  PLAUSIBLE_ORIGIN_SCRIPT_URL,
  PLAUSIBLE_PROXY_EVENT_PATH,
  PLAUSIBLE_PROXY_SCRIPT_PATH,
} from "./src/lib/observability/plausible";

const projectRoot = path.dirname(fileURLToPath(import.meta.url));

const nextConfig: NextConfig = {
  turbopack: {
    root: projectRoot,
  },
  async rewrites() {
    return [
      {
        source: PLAUSIBLE_PROXY_SCRIPT_PATH,
        destination: PLAUSIBLE_ORIGIN_SCRIPT_URL,
      },
      {
        source: PLAUSIBLE_PROXY_EVENT_PATH,
        destination: PLAUSIBLE_ORIGIN_EVENT_URL,
      },
    ];
  },
};

export default withSentryConfig(nextConfig, {
  org: process.env.SENTRY_ORG,
  project: process.env.SENTRY_PROJECT,
  authToken: process.env.SENTRY_AUTH_TOKEN,

  silent: !process.env.CI,

  sourcemaps: {
    disable: !process.env.SENTRY_AUTH_TOKEN,
  },

  release: {
    name: process.env.SENTRY_RELEASE ?? process.env.VERCEL_GIT_COMMIT_SHA,
    create: Boolean(process.env.SENTRY_AUTH_TOKEN),
    deploy: {
      env:
        process.env.VERCEL_ENV ??
        (process.env.NODE_ENV === "production" ? "production" : "development"),
    },
  },

  widenClientFileUpload: true,
});
