import { z } from "zod";

export const newsletterSignupSchema = z.object({
  email: z.preprocess(
    (value) => (typeof value === "string" ? value : ""),
    z
      .string()
      .trim()
      .toLowerCase()
      .min(1, "Enter an email address.")
      .max(254, "Email address is too long.")
      .pipe(z.email("Enter a valid email address.")),
  ),
  company: z.preprocess(
    (value) => (typeof value === "string" ? value : ""),
    z.string().trim(),
  ),
});

export type NewsletterSignupInput = z.infer<typeof newsletterSignupSchema>;
