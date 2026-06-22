import type { CortexEvent } from "@/lib/content/events";

/** Hourly ISR for event visibility (header promo, Events section). */
export const EVENTS_DATE_REVALIDATE_SECONDS = 3600;

export function getUpcomingEvents(
  events: readonly CortexEvent[],
  now = Date.now(),
): CortexEvent[] {
  return events
    .filter((event) => new Date(event.startsAt).getTime() > now)
    .sort((a, b) => a.startsAt.localeCompare(b.startsAt));
}

export function getNextUpcomingEvent(
  events: readonly CortexEvent[],
  now = Date.now(),
): CortexEvent | undefined {
  return getUpcomingEvents(events, now)[0];
}
