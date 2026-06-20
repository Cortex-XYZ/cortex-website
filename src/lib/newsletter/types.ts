export type NewsletterFormState = {
  status: "idle" | "success" | "error";
  message: string;
  emailError?: string;
  submissionId?: string;
  subscribedEmail?: string;
};

export const NEWSLETTER_SUBMISSION_ID_FIELD = "newsletterSubmissionId";

export const newsletterInitialState = {
  status: "idle",
  message: "",
} satisfies NewsletterFormState;
