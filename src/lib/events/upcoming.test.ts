import { describe, expect, test } from "bun:test";
import type { CortexEvent } from "@/lib/content/events";
import {
  getNextUpcomingEvent,
  getUpcomingEvents,
} from "@/lib/events/upcoming";

function createEvent(id: string, startsAt: `${string}T${string}Z`): CortexEvent {
  return {
    id,
    label: "GLOBAL",
    title: id,
    startsAt,
    endsAt: "2026-06-28T01:00:00Z",
    dateLabel: "Jun 27, 2026",
    location: {
      city: "Online",
      region: "GLOBAL",
    },
    description: "Test event",
  };
}

describe("getUpcomingEvents", () => {
  test("excludes events whose start instant has passed", () => {
    const now = Date.parse("2026-06-27T13:00:01Z");
    const upcoming = getUpcomingEvents(
      [
        createEvent("past", "2026-06-26T23:00:00Z"),
        createEvent("just-started", "2026-06-27T13:00:00Z"),
        createEvent("future", "2026-06-28T13:00:00Z"),
      ],
      now,
    );

    expect(upcoming.map((event) => event.id)).toEqual(["future"]);
  });

  test("excludes events at the exact start instant", () => {
    const now = Date.parse("2026-06-27T13:00:00Z");
    const upcoming = getUpcomingEvents(
      [createEvent("starting-now", "2026-06-27T13:00:00Z")],
      now,
    );

    expect(upcoming).toEqual([]);
  });

  test("includes events that have not started yet", () => {
    const now = Date.parse("2026-06-27T12:59:59Z");
    const upcoming = getUpcomingEvents(
      [createEvent("almost", "2026-06-27T13:00:00Z")],
      now,
    );

    expect(upcoming.map((event) => event.id)).toEqual(["almost"]);
  });

  test("sorts upcoming events by their exact start instant", () => {
    const now = Date.parse("2026-06-27T00:00:00Z");
    const upcoming = getUpcomingEvents(
      [
        createEvent("later", "2026-06-27T18:00:00Z"),
        createEvent("earlier", "2026-06-27T13:00:00Z"),
      ],
      now,
    );

    expect(upcoming.map((event) => event.id)).toEqual(["earlier", "later"]);
  });
});

describe("getNextUpcomingEvent", () => {
  test("returns only the earliest upcoming event for the header promo", () => {
    const now = Date.parse("2026-06-27T00:00:00Z");
    const next = getNextUpcomingEvent(
      [
        createEvent("later", "2026-06-27T18:00:00Z"),
        createEvent("earlier", "2026-06-27T13:00:00Z"),
        createEvent("latest", "2026-06-28T13:00:00Z"),
      ],
      now,
    );

    expect(next?.id).toBe("earlier");
  });

  test("returns undefined when every event has started", () => {
    const now = Date.parse("2026-06-27T13:00:00Z");
    const next = getNextUpcomingEvent(
      [createEvent("starting-now", "2026-06-27T13:00:00Z")],
      now,
    );

    expect(next).toBeUndefined();
  });
});
