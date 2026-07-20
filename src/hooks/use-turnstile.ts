"use client";

import * as Sentry from "@sentry/nextjs";
import { useCallback, useEffect, useRef, useState } from "react";

const ONLOAD_CALLBACK = "cortexTurnstileOnLoad";
const SCRIPT_SRC = `https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit&onload=${ONLOAD_CALLBACK}`;
const SCRIPT_ID = "turnstile-script";
const CHALLENGE_TIMEOUT_MS = 15_000;
const SCRIPT_STATUS_KEY = "turnstileStatus";

type ScriptStatus = "error" | "loaded" | "loading";
type WidgetId = string;

type Challenge = {
  reject: (reason?: unknown) => void;
  resolve: (token: string) => void;
  timeoutId: number;
};

type TurnstileApi = {
  execute(container: HTMLElement | string): void;
  remove(widgetId: WidgetId): void;
  render(
    container: HTMLElement,
    options: {
      action: string;
      appearance: "always" | "execute" | "interaction-only";
      callback: (token: string) => void;
      "error-callback": (errorCode: string) => void;
      "expired-callback": () => void;
      execution: "render" | "execute";
      sitekey: string;
      "timeout-callback": () => void;
    },
  ): WidgetId | undefined;
  reset(widgetId: WidgetId): void;
};

declare global {
  interface Window {
    cortexTurnstileOnLoad?: () => void;
    turnstile?: TurnstileApi;
  }
}

function isCompatibleScript(script: HTMLScriptElement): boolean {
  return (
    !script.async && !script.defer && script.src.includes(ONLOAD_CALLBACK)
  );
}

function removeScript(): void {
  document.getElementById(SCRIPT_ID)?.remove();
  delete window.turnstile;
}

export type UseTurnstileOptions = {
  action: string;
  errorMessage: string;
  siteKey: string | undefined;
};

export type UseTurnstileReturn = {
  containerRef: React.RefObject<HTMLDivElement | null>;
  enabled: boolean;
  error: string | null;
  execute: () => Promise<string>;
  pending: boolean;
  reset: () => void;
  tokenRef: React.RefObject<HTMLInputElement | null>;
};

export function useTurnstile({
  action,
  errorMessage,
  siteKey,
}: UseTurnstileOptions): UseTurnstileReturn {
  const containerRef = useRef<HTMLDivElement>(null);
  const tokenRef = useRef<HTMLInputElement>(null);
  const widgetIdRef = useRef<WidgetId | null>(null);
  const challengeRef = useRef<Challenge | null>(null);
  const [scriptReady, setScriptReady] = useState(false);
  const [pending, setPending] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const clearToken = useCallback(() => {
    if (tokenRef.current) {
      tokenRef.current.value = "";
    }
  }, []);

  const resolveChallenge = useCallback((token: string) => {
    const challenge = challengeRef.current;

    if (!challenge) return;

    window.clearTimeout(challenge.timeoutId);
    challengeRef.current = null;
    setPending(false);
    setError(null);

    const normalizedToken = token.trim();

    if (tokenRef.current) {
      tokenRef.current.value = normalizedToken;
    }

    challenge.resolve(normalizedToken);
  }, []);

  const rejectChallenge = useCallback(() => {
    const challenge = challengeRef.current;

    if (!challenge) return;

    window.clearTimeout(challenge.timeoutId);
    challenge.reject(new Error(errorMessage));
    challengeRef.current = null;
    clearToken();
    setPending(false);
    setError(errorMessage);
  }, [clearToken, errorMessage]);

  const handleWidgetError = useCallback(
    (errorCode: string) => {
      Sentry.logger.warn("Newsletter Turnstile widget error", {
        turnstile_action: action,
        turnstile_error_code: errorCode.trim(),
      });
      rejectChallenge();
    },
    [action, rejectChallenge],
  );

  const resetWidget = useCallback(() => {
    const widgetId = widgetIdRef.current;

    if (widgetId && window.turnstile) {
      window.turnstile.reset(widgetId);
    }
  }, []);

  const reset = useCallback(() => {
    clearToken();
    resetWidget();
    setError(null);
  }, [clearToken, resetWidget]);

  const execute = useCallback(() => {
    const turnstile = window.turnstile;
    const widgetId = widgetIdRef.current;
    const container = containerRef.current;

    if (!turnstile || !widgetId || !container) {
      setError(errorMessage);
      return Promise.reject(new Error(errorMessage));
    }

    clearToken();
    setPending(true);
    setError(null);

    return new Promise<string>((resolve, reject) => {
      const timeoutId = window.setTimeout(() => {
        challengeRef.current = null;
        clearToken();
        setPending(false);
        setError(errorMessage);
        reject(new Error(errorMessage));
      }, CHALLENGE_TIMEOUT_MS);

      challengeRef.current = { reject, resolve, timeoutId };

      try {
        turnstile.reset(widgetId);
        turnstile.execute(container);
      } catch (err) {
        window.clearTimeout(timeoutId);
        challengeRef.current = null;
        clearToken();
        setPending(false);
        setError(errorMessage);
        reject(err);
      }
    });
  }, [clearToken, errorMessage]);

  useEffect(() => {
    if (!siteKey) return;

    let cancelled = false;

    function setScriptStatus(
      script: HTMLScriptElement | null,
      status: ScriptStatus,
    ) {
      if (script) {
        script.dataset[SCRIPT_STATUS_KEY] = status;
      }
    }

    function markReady(script: HTMLScriptElement | null) {
      if (cancelled) return;

      if (!window.turnstile) {
        setScriptStatus(script, "error");
        handleError(script);
        return;
      }

      setScriptStatus(script, "loaded");

      if (!cancelled) {
        setScriptReady(true);
        setError(null);
      }
    }

    function handleLoad(event: Event) {
      markReady(event.currentTarget as HTMLScriptElement | null);
    }

    function handleError(script: HTMLScriptElement | null = null) {
      if (cancelled) return;
      setScriptStatus(script, "error");
      setScriptReady(false);
      setError(errorMessage);
    }

    function handleScriptError(event: Event) {
      handleError(event.currentTarget as HTMLScriptElement | null);
    }

    window[ONLOAD_CALLBACK] = () => {
      const script = document.getElementById(
        SCRIPT_ID,
      ) as HTMLScriptElement | null;

      markReady(script);
    };

    const existingScript = document.getElementById(
      SCRIPT_ID,
    ) as HTMLScriptElement | null;

    if (existingScript && !isCompatibleScript(existingScript)) {
      removeScript();
    }

    const compatibleScript = document.getElementById(
      SCRIPT_ID,
    ) as HTMLScriptElement | null;

    if (window.turnstile && compatibleScript) {
      const loadedScript = compatibleScript;

      window.queueMicrotask(() => markReady(loadedScript));

      return () => {
        cancelled = true;
        delete window[ONLOAD_CALLBACK];
      };
    }

    if (compatibleScript) {
      const existingStatus = compatibleScript.dataset[
        SCRIPT_STATUS_KEY
      ] as ScriptStatus | undefined;

      if (existingStatus === "loaded") {
        const loadedScript = compatibleScript;

        window.queueMicrotask(() => markReady(loadedScript));

        return () => {
          cancelled = true;
          delete window[ONLOAD_CALLBACK];
        };
      }

      if (existingStatus === "error") {
        removeScript();
      }
    }

    const loadingScript = document.getElementById(
      SCRIPT_ID,
    ) as HTMLScriptElement | null;

    if (loadingScript) {
      loadingScript.addEventListener("load", handleLoad, { once: true });
      loadingScript.addEventListener("error", handleScriptError, {
        once: true,
      });

      return () => {
        cancelled = true;
        delete window[ONLOAD_CALLBACK];
        loadingScript.removeEventListener("load", handleLoad);
        loadingScript.removeEventListener("error", handleScriptError);
      };
    }

    const script = document.createElement("script");
    const nonce =
      document.querySelector<HTMLScriptElement>("script[nonce]")?.nonce;

    script.id = SCRIPT_ID;
    script.src = SCRIPT_SRC;
    script.async = false;
    script.defer = false;
    setScriptStatus(script, "loading");

    if (nonce) {
      script.nonce = nonce;
    }

    script.addEventListener("load", handleLoad, { once: true });
    script.addEventListener("error", handleScriptError, { once: true });
    document.head.append(script);

    return () => {
      cancelled = true;
      delete window[ONLOAD_CALLBACK];
      script.removeEventListener("load", handleLoad);
      script.removeEventListener("error", handleScriptError);
    };
  }, [siteKey, errorMessage]);

  useEffect(() => {
    if (
      !siteKey ||
      !scriptReady ||
      !containerRef.current ||
      widgetIdRef.current ||
      !window.turnstile
    ) {
      return;
    }

    const widgetId = window.turnstile.render(containerRef.current, {
      action,
      appearance: "execute",
      callback: resolveChallenge,
      "error-callback": handleWidgetError,
      "expired-callback": rejectChallenge,
      execution: "execute",
      sitekey: siteKey,
      "timeout-callback": rejectChallenge,
    });

    if (widgetId) {
      widgetIdRef.current = widgetId;
    }

    return () => {
      const renderedWidgetId = widgetIdRef.current;

      if (renderedWidgetId && window.turnstile) {
        window.turnstile.remove(renderedWidgetId);
        widgetIdRef.current = null;
      }
    };
  }, [
    action,
    handleWidgetError,
    rejectChallenge,
    resolveChallenge,
    scriptReady,
    siteKey,
  ]);

  return {
    containerRef,
    enabled: Boolean(siteKey),
    error,
    execute,
    pending,
    reset,
    tokenRef,
  };
}
