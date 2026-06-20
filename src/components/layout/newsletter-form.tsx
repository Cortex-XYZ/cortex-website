"use client";

import { useActionState, useEffect, useRef, useState } from "react";
import { CortexButton } from "@/components/cortex-button";
import { submitNewsletterSignup } from "@/lib/newsletter/actions";
import { newsletterInitialState } from "@/lib/newsletter/types";

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
  const emailInputRef = useRef<HTMLInputElement>(null);
  const [emailValue, setEmailValue] = useState("");
  const [messageDismissed, setMessageDismissed] = useState(false);
  const messageId = `${emailInputId}-message`;
  const hasMessage = state.message.length > 0;
  const showConfirmedMessage =
    state.status === "success" &&
    state.subscribedEmail === emailValue.trim().toLowerCase();
  const showMessage =
    !messageDismissed &&
    hasMessage &&
    (state.status === "error" ||
      (state.status === "success" && showConfirmedMessage));
  const showEmailError = !messageDismissed && Boolean(state.emailError);

  useEffect(() => {
    if (state.status === "success" && state.subscribedEmail) {
      emailInputRef.current?.focus();
    }
  }, [state.message, state.status, state.subscribedEmail]);

  function handleEmailChange(value: string) {
    setMessageDismissed(true);
    setEmailValue(value);
  }

  function handleSubmit() {
    setMessageDismissed(false);
  }

  return (
    <form
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
            data-status={state.status}
            aria-live="polite"
          >
            {state.message}
          </p>
        )}
      </div>
      <CortexButton
        type="submit"
        variant="primary"
        size="default"
        disabled={pending}
        className="site-footer-newsletter-button"
      >
        {pending ? "Subscribing" : submitLabel}
      </CortexButton>
    </form>
  );
}
