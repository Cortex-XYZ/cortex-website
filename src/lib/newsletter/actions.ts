"use server";

import { headers } from "next/headers";
import { subscribeNewsletterContact } from "@/lib/integrations/resend";
import { verifyTurnstileToken } from "@/lib/integrations/turnstile";
import {
  checkNewsletterRateLimit,
  getNewsletterClientIp,
  getNewsletterRateLimitIdentifier,
} from "@/lib/newsletter/rate-limit";
import { handleNewsletterSignup } from "@/lib/newsletter/submit";
import type { NewsletterFormState } from "@/lib/newsletter/types";

export async function submitNewsletterSignup(
  _prevState: NewsletterFormState,
  formData: FormData,
): Promise<NewsletterFormState> {
  const headersList = await headers();
  const clientIp = getNewsletterClientIp(headersList);
  const rateLimitIdentifier = getNewsletterRateLimitIdentifier(headersList);

  return handleNewsletterSignup(formData, {
    rateLimit: () => checkNewsletterRateLimit(rateLimitIdentifier),
    subscribe: subscribeNewsletterContact,
    turnstile: (token) => verifyTurnstileToken({ remoteIp: clientIp, token }),
  });
}
