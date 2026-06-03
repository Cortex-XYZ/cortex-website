import type { NextConfig } from "next";
import { withSentryConfig } from "@sentry/nextjs";

const nextConfig: NextConfig = {
  /* config options here */
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
