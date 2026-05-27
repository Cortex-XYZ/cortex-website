"use client";

import { useState, type FormEvent } from "react";
import { CortexButton } from "@/components/cortex-button";
import { footerContent } from "@/lib/content/footer";

// Until a real subscribe endpoint exists, the form composes a mailto to the
// Cortex contact address with the entered address prefilled in the body.
export function FooterNewsletter() {
  const [email, setEmail] = useState("");

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const trimmed = email.trim();
    const base = footerContent.newsletterCta.href;
    const target = trimmed
      ? `${base}?subject=Subscribe%20to%20Cortex%20updates&body=${encodeURIComponent(
          `Please add ${trimmed} to the Cortex network updates list.`,
        )}`
      : base;
    window.location.href = target;
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="flex w-full flex-col gap-6"
      noValidate
    >
      <div className="flex flex-col gap-2">
        <label htmlFor="footer-email" className="sr-only">
          Email address
        </label>
        <input
          id="footer-email"
          type="email"
          name="email"
          autoComplete="email"
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          placeholder={footerContent.email.label}
          className="w-full border-0 border-b border-action-primary bg-transparent pb-3 font-open text-body-sm text-text-primary placeholder:text-text-muted focus:outline-none focus-visible:border-action-primary-hover sm:text-body"
        />
      </div>

      <CortexButton type="submit" variant="primary" size="lg" className="w-fit">
        {footerContent.newsletterCta.label}
      </CortexButton>
    </form>
  );
}
