"use client";

import * as Sentry from "@sentry/nextjs";
import { useEffect } from "react";

export default function GlobalError({
  error,
}: {
  error: Error & { digest?: string };
}) {
  useEffect(() => {
    Sentry.captureException(error);
  }, [error]);

  return (
    <html lang="en" className="dark h-full antialiased">
      <body className="min-h-full flex items-center justify-center">
        <div className="flex flex-col items-center gap-4 text-center">
          <h1 className="text-2xl font-semibold text-brand-cortex-orange">
            Something went wrong
          </h1>
          <p className="text-sm text-text-secondary">
            An unexpected error occurred. The team has been notified.
          </p>
        </div>
      </body>
    </html>
  );
}
