"use client";

import * as Sentry from "@sentry/nextjs";
import { useEffect } from "react";

const GLOBAL_ERROR_RETRY_STYLES = `
button[data-global-error-retry] {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  margin: 0;
  border: none;
  border-radius: 9999px;
  height: 2.125rem;
  padding: 0 1.875rem;
  background-color: #ff5e00;
  color: #ffffff;
  font-family: ui-sans-serif, system-ui, sans-serif;
  font-size: 0.875rem;
  font-weight: 600;
  line-height: 1;
  cursor: pointer;
  transition: background-color 150ms ease;
}
button[data-global-error-retry]:hover {
  background-color: #ff6a14;
}
`;

export default function GlobalError({
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
    <html lang="en" style={{ height: "100%" }}>
      <head>
        <style
          dangerouslySetInnerHTML={{ __html: GLOBAL_ERROR_RETRY_STYLES }}
        />
      </head>
      <body
        style={{
          margin: 0,
          minHeight: "100dvh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: "#111111",
          color: "#d9d9d9",
          fontFamily: "ui-sans-serif, system-ui, sans-serif",
          WebkitFontSmoothing: "antialiased",
          MozOsxFontSmoothing: "grayscale",
        }}
      >
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: "2rem",
            textAlign: "center",
            padding: "1.5rem",
          }}
        >
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: "1rem",
            }}
          >
            <h1
              style={{
                margin: 0,
                fontFamily: "ui-sans-serif, system-ui, sans-serif",
                fontSize: "1.5rem",
                fontWeight: 600,
                lineHeight: 1.25,
                color: "#ff5e00",
              }}
            >
              Something went wrong
            </h1>
            <p
              style={{
                margin: 0,
                maxWidth: "20rem",
                fontSize: "0.875rem",
                lineHeight: 1.5,
                color: "#d9d9d9",
              }}
            >
              The page failed to load. Please try again, or come back later.
            </p>
          </div>
          <button
            type="button"
            data-global-error-retry
            onClick={() => unstable_retry()}
          >
            Try again
          </button>
        </div>
      </body>
    </html>
  );
}
