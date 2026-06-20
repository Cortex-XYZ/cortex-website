export type NewsletterFormState = {
  status: "idle" | "success" | "error";
  message: string;
  emailError?: string;
  subscribedEmail?: string;
};

export const newsletterInitialState = {
  status: "idle",
  message: "",
} satisfies NewsletterFormState;
