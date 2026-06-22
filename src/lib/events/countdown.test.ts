import { describe, expect, test } from "bun:test";
import { getEventTimingState } from "@/lib/events/countdown";

const STARTS_AT = "2026-06-27T13:00:00Z";
const ENDS_AT = "2026-06-28T01:00:00Z";

describe("getEventTimingState", () => {
  test("counts down to the exact start instant", () => {
    const state = getEventTimingState(
      STARTS_AT,
      ENDS_AT,
      Date.parse("2026-06-27T00:00:00Z"),
    );

    expect(state).toEqual({
      status: "countdown",
      days: 0,
      hours: 13,
      minutes: 0,
      seconds: 0,
      label: "Today",
      clock: "13:00:00",
    });
  });

  test("shows countdown one minute before start", () => {
    const state = getEventTimingState(
      STARTS_AT,
      ENDS_AT,
      Date.parse("2026-06-27T12:59:00Z"),
    );

    expect(state).toEqual({
      status: "countdown",
      days: 0,
      hours: 0,
      minutes: 1,
      seconds: 0,
      label: "Today",
      clock: "00:01:00",
    });
  });

  test("returns live status at the exact start instant", () => {
    const state = getEventTimingState(
      STARTS_AT,
      ENDS_AT,
      Date.parse("2026-06-27T13:00:00Z"),
    );

    expect(state).toEqual({ status: "live", label: "Happening now" });
  });

  test("returns live status during the event", () => {
    const state = getEventTimingState(
      STARTS_AT,
      ENDS_AT,
      Date.parse("2026-06-27T18:00:00Z"),
    );

    expect(state).toEqual({ status: "live", label: "Happening now" });
  });

  test("returns ended status at the exact end instant", () => {
    const state = getEventTimingState(
      STARTS_AT,
      ENDS_AT,
      Date.parse("2026-06-28T01:00:00Z"),
    );

    expect(state).toEqual({ status: "ended", label: "Event ended" });
  });

  test("returns ended status after the event", () => {
    const state = getEventTimingState(
      STARTS_AT,
      ENDS_AT,
      Date.parse("2026-06-28T05:00:00Z"),
    );

    expect(state).toEqual({ status: "ended", label: "Event ended" });
  });

  test("shows days label for multi-day countdown", () => {
    const state = getEventTimingState(
      STARTS_AT,
      ENDS_AT,
      Date.parse("2026-06-24T13:00:00Z"),
    );

    expect(state?.status).toBe("countdown");
    if (state?.status === "countdown") {
      expect(state.days).toBe(3);
      expect(state.label).toBe("3 days left");
    }
  });

  test("shows singular day label", () => {
    const state = getEventTimingState(
      STARTS_AT,
      ENDS_AT,
      Date.parse("2026-06-26T13:00:00Z"),
    );

    expect(state?.status).toBe("countdown");
    if (state?.status === "countdown") {
      expect(state.days).toBe(1);
      expect(state.label).toBe("1 day left");
    }
  });
});
