"use client";

import {
  useActionState,
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";
import type { SubmitEvent } from "react";
import { CortexButton } from "@/components/cortex-button";
import { submitNewsletterSignup } from "@/lib/newsletter/actions";
import {
  NEWSLETTER_TURNSTILE_ACTION,
  NEWSLETTER_TURNSTILE_ERROR_MESSAGE,
  NEWSLETTER_TURNSTILE_FIELD,
} from "@/lib/newsletter/turnstile";
import { newsletterInitialState } from "@/lib/newsletter/types";

const TURNSTILE_ONLOAD_CALLBACK = "cortexTurnstileOnLoad";
const TURNSTILE_SCRIPT_SRC = `https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit&onload=${TURNSTILE_ONLOAD_CALLBACK}`;
const TURNSTILE_SCRIPT_ID = "turnstile-script";
const TURNSTILE_SITE_KEY = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY?.trim();
const TURNSTILE_CHALLENGE_TIMEOUT_MS = 15_000;
const TURNSTILE_SCRIPT_STATUS_DATA_KEY = "turnstileStatus";

type TurnstileScriptStatus = "error" | "loaded" | "loading";

type NewsletterFormProps = {
  emailInputId: string;
  placeholder: string;
  submitLabel: string;
};

type TurnstileWidgetId = string;

type TurnstileChallenge = {
  reject: (reason?: unknown) => void;
  resolve: (token: string) => void;
  timeoutId: number;
};

type TurnstileApi = {
  execute(container: HTMLElement | string): void;
  isExpired(widgetId: TurnstileWidgetId): boolean;
  remove(widgetId: TurnstileWidgetId): void;
  render(
    container: HTMLElement,
    options: {
      action: string;
      appearance: "always" | "execute" | "interaction-only";
      callback: (token: string) => void;
      "error-callback": () => void;
      "expired-callback": () => void;
      execution: "render" | "execute";
      sitekey: string;
      "timeout-callback": () => void;
    },
  ): TurnstileWidgetId | undefined;
  reset(widgetId: TurnstileWidgetId): void;
};

declare global {
  interface Window {
    cortexTurnstileOnLoad?: () => void;
    turnstile?: TurnstileApi;
  }
}

function isCompatibleTurnstileScript(script: HTMLScriptElement): boolean {
  return (
    !script.async &&
    !script.defer &&
    script.src.includes(TURNSTILE_ONLOAD_CALLBACK)
  );
}

function removeTurnstileScript(): void {
  document.getElementById(TURNSTILE_SCRIPT_ID)?.remove();
  delete window.turnstile;
}

export default function NewsletterForm({
  emailInputId,
  placeholder,
  submitLabel,
}: NewsletterFormProps) {
  const [state, formAction, pending] = useActionState(
    submitNewsletterSignup,
    newsletterInitialState,
  );
  const formRef = useRef<HTMLFormElement>(null);
  const emailInputRef = useRef<HTMLInputElement>(null);
  const turnstileContainerRef = useRef<HTMLDivElement>(null);
  const turnstileTokenInputRef = useRef<HTMLInputElement>(null);
  const turnstileWidgetIdRef = useRef<TurnstileWidgetId | null>(null);
  const turnstileChallengeRef = useRef<TurnstileChallenge | null>(null);
  const [emailValue, setEmailValue] = useState("");
  const [submittedEmail, setSubmittedEmail] = useState("");
  const [clearedSuccessEmail, setClearedSuccessEmail] = useState<
    string | undefined
  >();
  const [messageDismissed, setMessageDismissed] = useState(false);
  const [turnstileScriptReady, setTurnstileScriptReady] = useState(false);
  const [turnstilePending, setTurnstilePending] = useState(false);
  const [clientMessage, setClientMessage] = useState("");
  const messageId = `${emailInputId}-message`;
  const activeMessage = clientMessage || state.message;
  const activeStatus = clientMessage ? "error" : state.status;
  const hasMessage = activeMessage.length > 0;
  const showConfirmedMessage =
    state.status === "success" && state.subscribedEmail === submittedEmail;
  const showMessage =
    !messageDismissed &&
    hasMessage &&
    (Boolean(clientMessage) ||
      state.status === "error" ||
      (state.status === "success" && showConfirmedMessage));
  const showEmailError = !messageDismissed && Boolean(state.emailError);
  const submitPending = pending || turnstilePending;

  if (
    state.status === "success" &&
    state.subscribedEmail &&
    state.subscribedEmail !== clearedSuccessEmail
  ) {
    setClearedSuccessEmail(state.subscribedEmail);
    setEmailValue("");
  }

  const clearTurnstileToken = useCallback(() => {
    if (turnstileTokenInputRef.current) {
      turnstileTokenInputRef.current.value = "";
    }
  }, []);

  const resolveTurnstileChallenge = useCallback((token: string) => {
    const challenge = turnstileChallengeRef.current;

    if (!challenge) return;

    window.clearTimeout(challenge.timeoutId);
    turnstileChallengeRef.current = null;
    setTurnstilePending(false);

    const normalizedToken = token.trim();

    if (turnstileTokenInputRef.current) {
      turnstileTokenInputRef.current.value = normalizedToken;
    }

    challenge.resolve(normalizedToken);
  }, []);

  const rejectTurnstileChallenge = useCallback(() => {
    const challenge = turnstileChallengeRef.current;

    if (challenge) {
      window.clearTimeout(challenge.timeoutId);
      challenge.reject(new Error(NEWSLETTER_TURNSTILE_ERROR_MESSAGE));
      turnstileChallengeRef.current = null;
    }

    clearTurnstileToken();
    setTurnstilePending(false);
  }, [clearTurnstileToken]);

  const resetTurnstileWidget = useCallback(() => {
    const widgetId = turnstileWidgetIdRef.current;

    if (widgetId && window.turnstile) {
      window.turnstile.reset(widgetId);
    }
  }, []);

  useEffect(() => {
    if (state.status === "success" && state.subscribedEmail) {
      emailInputRef.current?.focus();
    }
  }, [state.message, state.status, state.subscribedEmail]);

  useEffect(() => {
    if (!TURNSTILE_SITE_KEY) return;

    let cancelled = false;

    function setScriptStatus(
      script: HTMLScriptElement | null,
      status: TurnstileScriptStatus,
    ) {
      if (script) {
        script.dataset[TURNSTILE_SCRIPT_STATUS_DATA_KEY] = status;
      }
    }

    function markTurnstileReady(script: HTMLScriptElement | null) {
      if (cancelled) return;

      if (!window.turnstile) {
        setScriptStatus(script, "error");
        handleError(script);
        return;
      }

      setScriptStatus(script, "loaded");

      if (!cancelled) {
        setTurnstileScriptReady(true);
      }
    }

    function handleLoad(event: Event) {
      markTurnstileReady(event.currentTarget as HTMLScriptElement | null);
    }

    function handleError(script: HTMLScriptElement | null = null) {
      if (cancelled) return;
      setScriptStatus(script, "error");
      setTurnstileScriptReady(false);
      setClientMessage(NEWSLETTER_TURNSTILE_ERROR_MESSAGE);
      setMessageDismissed(false);
    }

    function handleScriptError(event: Event) {
      handleError(event.currentTarget as HTMLScriptElement | null);
    }

    window[TURNSTILE_ONLOAD_CALLBACK] = () => {
      const script = document.getElementById(
        TURNSTILE_SCRIPT_ID,
      ) as HTMLScriptElement | null;

      markTurnstileReady(script);
    };

    const existingScript = document.getElementById(
      TURNSTILE_SCRIPT_ID,
    ) as HTMLScriptElement | null;

    if (existingScript && !isCompatibleTurnstileScript(existingScript)) {
      removeTurnstileScript();
    }

    const compatibleScript = document.getElementById(
      TURNSTILE_SCRIPT_ID,
    ) as HTMLScriptElement | null;

    if (window.turnstile && compatibleScript) {
      const loadedScript = compatibleScript;

      window.queueMicrotask(() => markTurnstileReady(loadedScript));

      return () => {
        cancelled = true;
        delete window[TURNSTILE_ONLOAD_CALLBACK];
      };
    }

    if (compatibleScript) {
      const existingStatus = compatibleScript.dataset[
        TURNSTILE_SCRIPT_STATUS_DATA_KEY
      ] as TurnstileScriptStatus | undefined;

      if (existingStatus === "loaded") {
        const loadedScript = compatibleScript;

        window.queueMicrotask(() => markTurnstileReady(loadedScript));

        return () => {
          cancelled = true;
          delete window[TURNSTILE_ONLOAD_CALLBACK];
        };
      }

      if (existingStatus === "error") {
        removeTurnstileScript();
      }
    }

    const loadingScript = document.getElementById(
      TURNSTILE_SCRIPT_ID,
    ) as HTMLScriptElement | null;

    if (loadingScript) {
      loadingScript.addEventListener("load", handleLoad, { once: true });
      loadingScript.addEventListener("error", handleScriptError, {
        once: true,
      });

      return () => {
        cancelled = true;
        delete window[TURNSTILE_ONLOAD_CALLBACK];
        loadingScript.removeEventListener("load", handleLoad);
        loadingScript.removeEventListener("error", handleScriptError);
      };
    }

    const script = document.createElement("script");
    const nonce =
      document.querySelector<HTMLScriptElement>("script[nonce]")?.nonce;

    script.id = TURNSTILE_SCRIPT_ID;
    script.src = TURNSTILE_SCRIPT_SRC;
    // Dynamically inserted scripts default to async; Turnstile rejects that.
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
      delete window[TURNSTILE_ONLOAD_CALLBACK];
      script.removeEventListener("load", handleLoad);
      script.removeEventListener("error", handleScriptError);
    };
  }, []);

  useEffect(() => {
    if (!TURNSTILE_SITE_KEY || state.status === "idle" || pending) return;

    clearTurnstileToken();
    resetTurnstileWidget();
  }, [clearTurnstileToken, pending, resetTurnstileWidget, state.status]);

  useEffect(() => {
    if (
      !TURNSTILE_SITE_KEY ||
      !turnstileScriptReady ||
      !turnstileContainerRef.current ||
      turnstileWidgetIdRef.current ||
      !window.turnstile
    ) {
      return;
    }

    const widgetId = window.turnstile.render(turnstileContainerRef.current, {
      action: NEWSLETTER_TURNSTILE_ACTION,
      appearance: "execute",
      callback: resolveTurnstileChallenge,
      "error-callback": rejectTurnstileChallenge,
      "expired-callback": rejectTurnstileChallenge,
      execution: "execute",
      sitekey: TURNSTILE_SITE_KEY,
      "timeout-callback": rejectTurnstileChallenge,
    });

    if (widgetId) {
      turnstileWidgetIdRef.current = widgetId;
    }

    return () => {
      const renderedWidgetId = turnstileWidgetIdRef.current;

      if (renderedWidgetId && window.turnstile) {
        window.turnstile.remove(renderedWidgetId);
        turnstileWidgetIdRef.current = null;
      }
    };
  }, [
    clearTurnstileToken,
    rejectTurnstileChallenge,
    resolveTurnstileChallenge,
    turnstileScriptReady,
  ]);

  function handleEmailChange(value: string) {
    setMessageDismissed(true);
    setClientMessage("");
    setEmailValue(value);
  }

  const executeTurnstile = useCallback(() => {
    const turnstile = window.turnstile;
    const widgetId = turnstileWidgetIdRef.current;
    const container = turnstileContainerRef.current;

    if (!turnstile || !widgetId || !container) {
      return Promise.reject(new Error(NEWSLETTER_TURNSTILE_ERROR_MESSAGE));
    }

    clearTurnstileToken();
    setTurnstilePending(true);

    return new Promise<string>((resolve, reject) => {
      const timeoutId = window.setTimeout(() => {
        turnstileChallengeRef.current = null;
        clearTurnstileToken();
        setTurnstilePending(false);
        reject(new Error(NEWSLETTER_TURNSTILE_ERROR_MESSAGE));
      }, TURNSTILE_CHALLENGE_TIMEOUT_MS);

      turnstileChallengeRef.current = {
        reject,
        resolve,
        timeoutId,
      };

      try {
        turnstile.reset(widgetId);
        turnstile.execute(container);
      } catch (error) {
        window.clearTimeout(timeoutId);
        turnstileChallengeRef.current = null;
        clearTurnstileToken();
        setTurnstilePending(false);
        reject(error);
      }
    });
  }, [clearTurnstileToken]);

  function handleSubmit(event: SubmitEvent<HTMLFormElement>) {
    setSubmittedEmail(emailValue.trim().toLowerCase());
    setMessageDismissed(false);
    setClientMessage("");

    if (!TURNSTILE_SITE_KEY) return;

    const widgetId = turnstileWidgetIdRef.current;
    const token = turnstileTokenInputRef.current?.value.trim();
    const tokenExpired =
      widgetId && window.turnstile
        ? window.turnstile.isExpired(widgetId)
        : true;

    if (token && !tokenExpired) {
      if (pending) {
        event.preventDefault();
      }

      return;
    }

    if (submitPending) {
      event.preventDefault();
      return;
    }

    event.preventDefault();

    void executeTurnstile()
      .then(() => {
        formRef.current?.requestSubmit();
      })
      .catch(() => {
        setClientMessage(NEWSLETTER_TURNSTILE_ERROR_MESSAGE);
        setMessageDismissed(false);
        emailInputRef.current?.focus();
      });
  }

  return (
    <>
      <form
        ref={formRef}
        action={formAction}
        className="site-footer-newsletter"
        onSubmit={handleSubmit}
      >
        <div className="site-footer-email-shell">
          <label htmlFor={emailInputId} className="sr-only">
            Email address
          </label>
          <input
            ref={emailInputRef}
            id={emailInputId}
            type="email"
            name="email"
            autoComplete="email"
            placeholder={placeholder}
            required
            value={emailValue}
            onChange={(event) => handleEmailChange(event.target.value)}
            aria-invalid={showEmailError ? "true" : undefined}
            aria-describedby={showMessage ? messageId : undefined}
            suppressHydrationWarning
            className="site-footer-email-input"
          />
          <input
            ref={turnstileTokenInputRef}
            type="hidden"
            name={NEWSLETTER_TURNSTILE_FIELD}
          />
          <div ref={turnstileContainerRef} aria-hidden="true" />
          {/* Honeypot */}
          <div className="site-footer-honeypot" aria-hidden="true">
            <label htmlFor={`${emailInputId}-company`}>Company</label>
            <input
              id={`${emailInputId}-company`}
              type="text"
              name="company"
              tabIndex={-1}
              autoComplete="off"
            />
          </div>
          {showMessage && (
            <p
              id={messageId}
              className="site-footer-newsletter-message"
              data-status={activeStatus}
              aria-live="polite"
            >
              {activeMessage}
            </p>
          )}
        </div>
        <CortexButton
          type="submit"
          variant="primary"
          size="default"
          disabled={submitPending}
          className="site-footer-newsletter-button"
        >
          {turnstilePending
            ? "Verifying"
            : pending
              ? "Subscribing"
              : submitLabel}
        </CortexButton>
      </form>
    </>
  );
}
