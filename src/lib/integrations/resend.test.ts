import { beforeEach, describe, expect, mock, test } from "bun:test";
import { handleNewsletterSignup } from "@/lib/newsletter/submit";

type ResendApiError = {
  message: string;
  name?: string;
};

type ResendContact = {
  id: string;
  unsubscribed?: boolean;
};

type ResendSegmentAddResult = {
  data: Record<string, never> | null;
  error: ResendApiError | null;
};

type ResendSegmentListResult = {
  data: { data: Array<{ id: string }> };
  error: ResendApiError | null;
};

type ResendContactResult = {
  data: ResendContact | null;
  error: ResendApiError | null;
};

const segmentsAddMock = mock(async (): Promise<ResendSegmentAddResult> => ({
  data: {},
  error: null,
}));

const segmentsListMock = mock(async (): Promise<ResendSegmentListResult> => ({
  data: { data: [] },
  error: null,
}));

const contactsGetMock = mock(async (): Promise<ResendContactResult> => ({
  data: null,
  error: { name: "not_found", message: "not found" },
}));

const contactsCreateMock = mock(async (): Promise<ResendContactResult> => ({
  data: { id: "contact_1", unsubscribed: false },
  error: null,
}));

const contactsUpdateMock = mock(async (): Promise<ResendContactResult> => ({
  data: { id: "contact_1", unsubscribed: false },
  error: null,
}));

mock.module("resend", () => ({
  Resend: class MockResend {
    contacts = {
      get: contactsGetMock,
      create: contactsCreateMock,
      update: contactsUpdateMock,
      segments: {
        list: segmentsListMock,
        add: segmentsAddMock,
      },
    };
  },
}));

const { subscribeNewsletterContact } = await import("@/lib/integrations/resend");

const SEGMENT_ID = "seg_test";
const EMAIL = "person@example.com";

function createFormData(fields: Record<string, string>): FormData {
  const formData = new FormData();

  for (const [key, value] of Object.entries(fields)) {
    formData.set(key, value);
  }

  return formData;
}

function mockExistingContactNotInSegmentFlow() {
  contactsGetMock.mockImplementation(async () => ({
    data: { id: "contact_1", unsubscribed: false },
    error: null,
  }));
  segmentsListMock.mockImplementation(async () => ({
    data: { data: [] },
    error: null,
  }));
}

function resetResendMocks() {
  segmentsAddMock.mockReset();
  segmentsListMock.mockReset();
  contactsGetMock.mockReset();
  contactsCreateMock.mockReset();
  contactsUpdateMock.mockReset();

  segmentsAddMock.mockImplementation(async () => ({ data: {}, error: null }));
  segmentsListMock.mockImplementation(async () => ({
    data: { data: [] },
    error: null,
  }));
  contactsGetMock.mockImplementation(async () => ({
    data: null,
    error: { name: "not_found", message: "not found" },
  }));
  contactsCreateMock.mockImplementation(async () => ({
    data: { id: "contact_1", unsubscribed: false },
    error: null,
  }));
  contactsUpdateMock.mockImplementation(async () => ({
    data: { id: "contact_1", unsubscribed: false },
    error: null,
  }));
}

describe("subscribeNewsletterContact", () => {
  beforeEach(() => {
    process.env.RESEND_API_KEY = "re_test";
    process.env.RESEND_SEGMENT_ID = SEGMENT_ID;
    resetResendMocks();
  });

  test("existing contact already in segment returns alreadySubscribed: true", async () => {
    contactsGetMock.mockImplementation(async () => ({
      data: { id: "contact_1", unsubscribed: false },
      error: null,
    }));
    segmentsListMock.mockImplementation(async () => ({
      data: { data: [{ id: SEGMENT_ID }] },
      error: null,
    }));

    const result = await subscribeNewsletterContact(EMAIL);

    expect(result).toEqual({ ok: true, alreadySubscribed: true });
    expect(contactsCreateMock).not.toHaveBeenCalled();
    expect(contactsUpdateMock).not.toHaveBeenCalled();
    expect(segmentsAddMock).not.toHaveBeenCalled();
  });

  test("unsubscribed existing contact already in segment is reactivated", async () => {
    contactsGetMock.mockImplementation(async () => ({
      data: { id: "contact_1", unsubscribed: true },
      error: null,
    }));
    segmentsListMock.mockImplementation(async () => ({
      data: { data: [{ id: SEGMENT_ID }] },
      error: null,
    }));

    const result = await subscribeNewsletterContact(EMAIL);

    expect(result).toEqual({ ok: true, alreadySubscribed: false });
    expect(contactsUpdateMock).toHaveBeenCalledWith({
      email: EMAIL,
      unsubscribed: false,
    });
    expect(segmentsAddMock).not.toHaveBeenCalled();
  });

  test("new contact is created with the newsletter segment in one call", async () => {
    const result = await subscribeNewsletterContact(EMAIL);

    expect(result).toEqual({ ok: true, alreadySubscribed: false });
    expect(contactsCreateMock).toHaveBeenCalledWith({
      email: EMAIL,
      unsubscribed: false,
      segments: [{ id: SEGMENT_ID }],
    });
    expect(segmentsListMock).not.toHaveBeenCalled();
    expect(segmentsAddMock).not.toHaveBeenCalled();
  });

  test("existing contact not in segment succeeds when first segment add succeeds", async () => {
    mockExistingContactNotInSegmentFlow();

    const result = await subscribeNewsletterContact(EMAIL);

    expect(result).toEqual({ ok: true, alreadySubscribed: false });
    expect(contactsUpdateMock).not.toHaveBeenCalled();
    expect(contactsCreateMock).not.toHaveBeenCalled();
    expect(segmentsListMock).toHaveBeenCalledTimes(1);
    expect(segmentsAddMock).toHaveBeenCalledTimes(1);
  });

  test("unsubscribed existing contact already in segment gets the success message", async () => {
    contactsGetMock.mockImplementation(async () => ({
      data: { id: "contact_1", unsubscribed: true },
      error: null,
    }));
    segmentsListMock.mockImplementation(async () => ({
      data: { data: [{ id: SEGMENT_ID }] },
      error: null,
    }));

    const result = await handleNewsletterSignup(
      createFormData({
        email: EMAIL,
        company: "",
      }),
      {
        subscribe: subscribeNewsletterContact,
      },
    );

    expect(result).toEqual({
      status: "success",
      message: "You have successfully subscribed to the Cortex update list.",
      subscribedEmail: EMAIL,
    });
  });

  test("segment add fails once, retry succeeds, result is success", async () => {
    mockExistingContactNotInSegmentFlow();
    segmentsAddMock
      .mockImplementationOnce(async () => ({
        data: null,
        error: { message: "transient failure" },
      }))
      .mockImplementationOnce(async () => ({ data: {}, error: null }));

    const result = await subscribeNewsletterContact(EMAIL);

    expect(result).toEqual({ ok: true, alreadySubscribed: false });
    expect(segmentsAddMock).toHaveBeenCalledTimes(2);
  });

  test("segment add fails twice, result is ok: false", async () => {
    mockExistingContactNotInSegmentFlow();
    segmentsAddMock.mockImplementation(async () => ({
      data: null,
      error: { message: "persistent failure" },
    }));

    const result = await subscribeNewsletterContact(EMAIL);

    expect(result).toEqual({
      ok: false,
      code: "resend",
      message: "persistent failure",
    });
    expect(segmentsAddMock).toHaveBeenCalledTimes(2);
  });

  test("segment add fails twice and signup returns the generic retry message", async () => {
    mockExistingContactNotInSegmentFlow();
    segmentsAddMock.mockImplementation(async () => ({
      data: null,
      error: { message: "persistent failure" },
    }));

    const result = await handleNewsletterSignup(
      createFormData({
        email: EMAIL,
        company: "",
      }),
      {
        subscribe: subscribeNewsletterContact,
      },
    );

    expect(result).toEqual({
      status: "error",
      message: "We could not subscribe that email right now. Please try again.",
    });
    expect(segmentsAddMock).toHaveBeenCalledTimes(2);
  });
});
