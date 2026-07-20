"use client";

import { CircleCheck, Loader2 } from "lucide-react";
import { useActionState, useEffect, useRef, useState } from "react";
import type { SubmitEvent } from "react";
import { CortexButton } from "@/components/cortex-button";
import { useTurnstile } from "@/hooks/use-turnstile";
import { submitNewsletterSignup } from "@/lib/newsletter/actions";
import {
  NEWSLETTER_TURNSTILE_ACTION,
  NEWSLETTER_TURNSTILE_ERROR_MESSAGE,
  NEWSLETTER_TURNSTILE_FIELD,
} from "@/lib/newsletter/turnstile";
import {
  NEWSLETTER_SUBMISSION_ID_FIELD,
  newsletterInitialState,
} from "@/lib/newsletter/types";

const TURNSTILE_SITE_KEY = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY?.trim();

type NewsletterFormProps = {
  emailInputId: string;
  placeholder: string;
  submitLabel: string;
};

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
  const submissionIdInputRef = useRef<HTMLInputElement>(null);
  const turnstileReentryRef = useRef(false);
  const {
    containerRef: turnstileContainerRef,
    enabled: turnstileEnabled,
    error: turnstileError,
    execute: executeTurnstile,
    pending: turnstilePending,
    reset: resetTurnstile,
    tokenRef: turnstileTokenRef,
  } = useTurnstile({
    action: NEWSLETTER_TURNSTILE_ACTION,
    errorMessage: NEWSLETTER_TURNSTILE_ERROR_MESSAGE,
    siteKey: TURNSTILE_SITE_KEY,
  });
  const [emailValue, setEmailValue] = useState("");
  const [submittedEmail, setSubmittedEmail] = useState("");
  const [activeSubmissionId, setActiveSubmissionId] = useState("");
  const [clearedSuccessSubmissionId, setClearedSuccessSubmissionId] = useState<
    string | undefined
  >();
  const [messageDismissed, setMessageDismissed] = useState(false);

  const messageId = `${emailInputId}-message`;
  const activeMessage = turnstileError || state.message;
  const activeStatus = turnstileError ? "error" : state.status;
  const messageKey = turnstileError || state.submissionId || activeMessage;
  const hasMessage = activeMessage.length > 0;
  const stateBelongsToActiveSubmission =
    Boolean(state.submissionId) && state.submissionId === activeSubmissionId;
  const showConfirmedMessage =
    stateBelongsToActiveSubmission &&
    state.status === "success" &&
    state.subscribedEmail === submittedEmail;
  const showMessage =
    !messageDismissed &&
    hasMessage &&
    (Boolean(turnstileError) ||
      (stateBelongsToActiveSubmission && state.status === "error") ||
      (state.status === "success" && showConfirmedMessage));
  const showEmailError =
    !messageDismissed &&
    stateBelongsToActiveSubmission &&
    Boolean(state.emailError);
  const submitPending = pending || turnstilePending;

  if (
    state.status === "success" &&
    state.subscribedEmail &&
    state.submissionId &&
    state.submissionId !== clearedSuccessSubmissionId
  ) {
    setClearedSuccessSubmissionId(state.submissionId);
    setEmailValue("");
    setMessageDismissed(false);
  }

  useEffect(() => {
    if (state.status === "idle" || pending) return;
    resetTurnstile();
  }, [pending, state.status, resetTurnstile]);

  function handleEmailChange(value: string) {
    setMessageDismissed(true);
    setEmailValue(value);
  }

  function handleSubmit(event: SubmitEvent<HTMLFormElement>) {
    const submissionId = crypto.randomUUID();

    if (submissionIdInputRef.current) {
      submissionIdInputRef.current.value = submissionId;
    }

    setActiveSubmissionId(submissionId);
    setSubmittedEmail(emailValue.trim().toLowerCase());
    setMessageDismissed(false);

    if (!turnstileEnabled) return;

    if (turnstileReentryRef.current) {
      turnstileReentryRef.current = false;

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
        turnstileReentryRef.current = true;
        formRef.current?.requestSubmit();
      })
      .catch(() => {
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
            ref={submissionIdInputRef}
            type="hidden"
            name={NEWSLETTER_SUBMISSION_ID_FIELD}
          />
          <input
            ref={turnstileTokenRef}
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
              key={messageKey}
              id={messageId}
              className="site-footer-newsletter-message"
              data-status={activeStatus}
              aria-live="polite"
            >
              {activeStatus === "success" && (
                <CircleCheck
                  className="site-footer-newsletter-success-icon"
                  aria-hidden
                />
              )}
              <span>{activeMessage}</span>
            </p>
          )}
        </div>
        <CortexButton
          type="submit"
          variant="primary"
          size="default"
          animated={false}
          disabled={submitPending}
          aria-busy={submitPending}
          aria-label={submitPending ? `${submitLabel} in progress` : submitLabel}
          className="site-footer-newsletter-button"
        >
          {submitPending ? (
            <Loader2
              className="size-4 motion-safe:animate-spin"
              aria-hidden
            />
          ) : (
            submitLabel
          )}
        </CortexButton>
      </form>
    </>
  );
}
