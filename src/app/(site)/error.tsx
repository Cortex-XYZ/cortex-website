"use client";

import * as Sentry from "@sentry/nextjs";
import { useEffect } from "react";
import { CortexButton } from "@/components/cortex-button";

export default function SiteError({
  error,
  unstable_retry,
}: {
  error: Error & { digest?: string };
  unstable_retry: () => void;
}) {
  useEffect(() => {
    Sentry.captureException(error);
  }, [error]);

  return (
    <main className="site-container flex min-h-screen items-center justify-center pt-(--site-header-height) text-center">
      <div className="flex max-w-xl flex-col items-center gap-8">
        <div className="flex flex-col items-center gap-4">
          <p className="font-mona text-label font-extrabold tracking-(--text-label-letter-spacing) text-action-primary uppercase">
            Error
          </p>
          <h1 className="font-mona text-event-heading leading-none font-extrabold text-text-secondary">
            Something went wrong
          </h1>
          <p className="max-w-md text-body-xs leading-normal text-text-secondary md:text-body-sm">
            The page failed to load. Please try again, or come back later.
          </p>
        </div>
        <CortexButton
          type="button"
          animated={false}
          onClick={() => unstable_retry()}
        >
          Try again
        </CortexButton>
      </div>
    </main>
  );
}
