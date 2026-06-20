import { Resend } from "resend";

type ResendNewsletterConfig =
  | {
      ok: true;
      apiKey: string;
      segmentId: string;
    }
  | {
      ok: false;
      message: string;
    };

export type NewsletterSubscribeResult =
  | {
      ok: true;
      alreadySubscribed: boolean;
    }
  | {
      ok: false;
      code: "configuration" | "resend";
      message: string;
    };

function getNewsletterConfig(): ResendNewsletterConfig {
  const apiKey = process.env.RESEND_API_KEY;
  const segmentId = process.env.RESEND_SEGMENT_ID;

  if (!apiKey || !segmentId) {
    return {
      ok: false,
      message: "Newsletter capture is missing Resend configuration.",
    };
  }

  return {
    ok: true,
    apiKey,
    segmentId,
  };
}

function isMissingContactError(errorName: string | undefined): boolean {
  return errorName === "not_found";
}

function getResendErrorMessage(error: { message: string } | null): string {
  return error?.message || "Resend rejected the newsletter subscription.";
}

type SegmentAddClient = {
  contacts: {
    segments: {
      add: (params: {
        email: string;
        segmentId: string;
      }) => Promise<{
        error: { message: string } | null;
      }>;
    };
  };
};

function wait(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function addContactToNewsletterSegment(
  client: SegmentAddClient,
  email: string,
  segmentId: string,
): Promise<{ ok: true } | { ok: false; message: string }> {
  const firstAttempt = await client.contacts.segments.add({ email, segmentId });

  if (!firstAttempt.error) {
    return { ok: true };
  }

  await wait(1_000);

  const secondAttempt = await client.contacts.segments.add({ email, segmentId });

  if (!secondAttempt.error) {
    return { ok: true };
  }

  return {
    ok: false,
    message: getResendErrorMessage(secondAttempt.error),
  };
}

export async function subscribeNewsletterContact(
  email: string,
): Promise<NewsletterSubscribeResult> {
  const config = getNewsletterConfig();

  if (!config.ok) {
    return {
      ok: false,
      code: "configuration",
      message: config.message,
    };
  }

  try {
    return await subscribeWithResend(email, config);
  } catch {
    return {
      ok: false,
      code: "resend",
      message: "Resend is not reachable right now.",
    };
  }
}

async function subscribeExistingContact(
  resend: Resend,
  email: string,
  segmentId: string,
): Promise<NewsletterSubscribeResult> {
  const updateContact = await resend.contacts.update({
    email,
    unsubscribed: false,
  });

  if (updateContact.error) {
    return {
      ok: false,
      code: "resend",
      message: getResendErrorMessage(updateContact.error),
    };
  }

  const contactSegments = await resend.contacts.segments.list({
    email,
    limit: 100,
  });

  if (contactSegments.error) {
    return {
      ok: false,
      code: "resend",
      message: getResendErrorMessage(contactSegments.error),
    };
  }

  const alreadyInSegment = contactSegments.data.data.some(
    (segment) => segment.id === segmentId,
  );

  if (alreadyInSegment) {
    return {
      ok: true,
      alreadySubscribed: true,
    };
  }

  const addSegment = await addContactToNewsletterSegment(resend, email, segmentId);

  if (!addSegment.ok) {
    return {
      ok: false,
      code: "resend",
      message: addSegment.message,
    };
  }

  return {
    ok: true,
    alreadySubscribed: false,
  };
}

async function subscribeWithResend(
  email: string,
  config: { apiKey: string; segmentId: string },
): Promise<NewsletterSubscribeResult> {
  const resend = new Resend(config.apiKey);
  const existingContact = await resend.contacts.get({ email });

  if (existingContact.error && !isMissingContactError(existingContact.error.name)) {
    return {
      ok: false,
      code: "resend",
      message: getResendErrorMessage(existingContact.error),
    };
  }

  if (existingContact.data) {
    return subscribeExistingContact(resend, email, config.segmentId);
  }

  const createContact = await resend.contacts.create({
    email,
    unsubscribed: false,
    segments: [{ id: config.segmentId }],
  });

  if (createContact.error) {
    return {
      ok: false,
      code: "resend",
      message: getResendErrorMessage(createContact.error),
    };
  }

  return {
    ok: true,
    alreadySubscribed: false,
  };
}
