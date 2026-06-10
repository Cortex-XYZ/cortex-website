import type { CortexEvent } from "@/lib/content/events";
import { getUtcDateKey } from "@/lib/events/countdown";

/** Hourly ISR for date-aware event visibility (header promo, Events section). */
export const EVENTS_DATE_REVALIDATE_SECONDS = 3600;

export function getUpcomingEvents(
  events: readonly CortexEvent[],
  today = getUtcDateKey(new Date()),
): CortexEvent[] {
  return events
    .filter((event) => event.date >= today)
    .sort((a, b) => a.date.localeCompare(b.date));
}

export function getNextUpcomingEvent(
  events: readonly CortexEvent[],
  today = getUtcDateKey(new Date()),
): CortexEvent | undefined {
  return getUpcomingEvents(events, today)[0];
}
