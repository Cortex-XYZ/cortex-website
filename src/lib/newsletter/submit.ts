import { newsletterSignupSchema } from "@/lib/schemas/newsletter";
import type { NewsletterSubscribeResult } from "@/lib/integrations/resend";
import type { NewsletterRateLimitResult } from "@/lib/newsletter/rate-limit";
import type { NewsletterFormState } from "@/lib/newsletter/types";

type NewsletterSubscribe = (email: string) => Promise<NewsletterSubscribeResult>;
type NewsletterRateLimit = () => Promise<NewsletterRateLimitResult>;

type HandleNewsletterSignupOptions = {
  rateLimit?: NewsletterRateLimit;
  subscribe: NewsletterSubscribe;
};

const SUBSCRIBED_MESSAGE =
  "You have successfully subscribed to the Cortex update list.";
const ALREADY_SUBSCRIBED_MESSAGE = "Your email has already been submitted.";
const GENERIC_ERROR_MESSAGE =
  "We could not subscribe that email right now. Please try again.";

export async function handleNewsletterSignup(
  formData: FormData,
  { rateLimit, subscribe }: HandleNewsletterSignupOptions,
): Promise<NewsletterFormState> {
  const company = formData.get("company");

  if (typeof company === "string" && company.trim()) {
    return {
      status: "success",
      message: SUBSCRIBED_MESSAGE,
    };
  }

  const parsed = newsletterSignupSchema.safeParse({
    email: formData.get("email"),
    company: formData.get("company"),
  });

  if (!parsed.success) {
    const errors = parsed.error.flatten().fieldErrors;

    return {
      status: "error",
      message: errors.email?.[0] || GENERIC_ERROR_MESSAGE,
      emailError: errors.email?.[0],
    };
  }

  const rateLimitResult = await rateLimit?.();

  if (rateLimitResult && !rateLimitResult.ok) {
    return {
      status: "error",
      message: rateLimitResult.message,
    };
  }

  const result = await subscribe(parsed.data.email);

  if (!result.ok) {
    const configurationMessage =
      result.code === "configuration"
        ? "Newsletter setup is missing required Resend environment variables."
        : GENERIC_ERROR_MESSAGE;

    return {
      status: "error",
      message: configurationMessage,
    };
  }

  return {
    status: "success",
    message: result.alreadySubscribed
      ? ALREADY_SUBSCRIBED_MESSAGE
      : SUBSCRIBED_MESSAGE,
    subscribedEmail: parsed.data.email,
  };
}
