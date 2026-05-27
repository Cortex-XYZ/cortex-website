import type { ExternalHref } from "./types";
import type { SectionContent } from "./types";

export type EventLocation = {
  city: string;
  region?: string;
};

export type CortexEvent = {
  id: string;
  label: string;
  title: string;
  date: string;
  dateLabel: string;
  location: EventLocation;
  description: string;
  /** External registration/detail URL (currently Luma, may change). */
  url?: ExternalHref;
};

export const eventsSection = {
  id: "events",
  title: "Upcoming Events.",
  description: "",
  // TODO: populate with real events once Luma links are available.
  // Each event should include a `url` pointing to its Luma page (or
  // whatever external platform is used at launch).
  events: [] satisfies readonly CortexEvent[],
} as const satisfies SectionContent & {
  events: readonly CortexEvent[];
};
