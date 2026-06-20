import { newsletterSignupSchema } from "@/lib/schemas/newsletter";
import type { TurnstileVerificationResult } from "@/lib/integrations/turnstile";
import type { NewsletterSubscribeResult } from "@/lib/integrations/resend";
import type { NewsletterRateLimitResult } from "@/lib/newsletter/rate-limit";
import { NEWSLETTER_TURNSTILE_FIELD } from "@/lib/newsletter/turnstile";
import {
  NEWSLETTER_SUBMISSION_ID_FIELD,
  type NewsletterFormState,
} from "@/lib/newsletter/types";

type NewsletterSubscribe = (email: string) => Promise<NewsletterSubscribeResult>;
type NewsletterRateLimit = () => Promise<NewsletterRateLimitResult>;
type NewsletterTurnstileVerify = (
  token: FormDataEntryValue | null,
) => Promise<TurnstileVerificationResult>;

type HandleNewsletterSignupOptions = {
  rateLimit?: NewsletterRateLimit;
  subscribe: NewsletterSubscribe;
  turnstile?: NewsletterTurnstileVerify;
};

const SUBSCRIBED_MESSAGE =
  "You have successfully subscribed to the Cortex update list.";
const ALREADY_SUBSCRIBED_MESSAGE = "Your email has already been submitted.";
const GENERIC_ERROR_MESSAGE =
  "We could not subscribe that email right now. Please try again.";

function getSubmissionId(formData: FormData): string | undefined {
  const submissionId = formData.get(NEWSLETTER_SUBMISSION_ID_FIELD);

  return typeof submissionId === "string" && submissionId.trim()
    ? submissionId.trim()
    : undefined;
}

export async function handleNewsletterSignup(
  formData: FormData,
  { rateLimit, subscribe, turnstile }: HandleNewsletterSignupOptions,
): Promise<NewsletterFormState> {
  const submissionId = getSubmissionId(formData);
  const withSubmissionId = (
    state: Omit<NewsletterFormState, "submissionId">,
  ): NewsletterFormState =>
    submissionId ? { ...state, submissionId } : state;
  const company = formData.get("company");

  if (typeof company === "string" && company.trim()) {
    return withSubmissionId({
      status: "success",
      message: SUBSCRIBED_MESSAGE,
    });
  }

  const parsed = newsletterSignupSchema.safeParse({
    email: formData.get("email"),
    company: formData.get("company"),
  });

  if (!parsed.success) {
    const errors = parsed.error.flatten().fieldErrors;

    return withSubmissionId({
      status: "error",
      message: errors.email?.[0] || GENERIC_ERROR_MESSAGE,
      emailError: errors.email?.[0],
    });
  }

  const rateLimitResult = await rateLimit?.();

  if (rateLimitResult && !rateLimitResult.ok) {
    return withSubmissionId({
      status: "error",
      message: rateLimitResult.message,
    });
  }

  const turnstileResult = await turnstile?.(
    formData.get(NEWSLETTER_TURNSTILE_FIELD),
  );

  if (turnstileResult && !turnstileResult.ok) {
    return withSubmissionId({
      status: "error",
      message: turnstileResult.message,
    });
  }

  const result = await subscribe(parsed.data.email);

  if (!result.ok) {
    const configurationMessage =
      result.code === "configuration"
        ? "Newsletter setup is missing required Resend environment variables."
        : GENERIC_ERROR_MESSAGE;

    return withSubmissionId({
      status: "error",
      message: configurationMessage,
    });
  }

  return withSubmissionId({
    status: "success",
    message: result.alreadySubscribed
      ? ALREADY_SUBSCRIBED_MESSAGE
      : SUBSCRIBED_MESSAGE,
    subscribedEmail: parsed.data.email,
  });
}
