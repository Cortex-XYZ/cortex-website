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

async function verifyNewsletterSubscription(
  resend: Resend,
  email: string,
  segmentId: string,
): Promise<NewsletterSubscribeResult | null> {
  const contact = await resend.contacts.get({ email });

  if (contact.error || !contact.data) {
    return {
      ok: false,
      code: "resend",
      message: getResendErrorMessage(contact.error),
    };
  }

  if (contact.data.unsubscribed) {
    return {
      ok: false,
      code: "resend",
      message: "Resend did not confirm the newsletter subscription.",
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

  const inSegment = contactSegments.data.data.some(
    (segment) => segment.id === segmentId,
  );

  if (!inSegment) {
    return {
      ok: false,
      code: "resend",
      message: "Resend did not confirm the newsletter subscription.",
    };
  }

  return null;
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
  } else {
    const createContact = await resend.contacts.create({
      email,
      unsubscribed: false,
    });

    if (createContact.error) {
      return {
        ok: false,
        code: "resend",
        message: getResendErrorMessage(createContact.error),
      };
    }
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
    (segment) => segment.id === config.segmentId,
  );

  if (!alreadyInSegment) {
    const addSegment = await resend.contacts.segments.add({
      email,
      segmentId: config.segmentId,
    });

    if (addSegment.error) {
      return {
        ok: false,
        code: "resend",
        message: getResendErrorMessage(addSegment.error),
      };
    }
  }

  const verificationError = await verifyNewsletterSubscription(
    resend,
    email,
    config.segmentId,
  );

  if (verificationError) {
    return verificationError;
  }

  return {
    ok: true,
    alreadySubscribed: alreadyInSegment,
  };
}
