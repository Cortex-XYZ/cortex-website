import type { ExternalHref } from "./types";
import type { SectionContent } from "./types";

export type CortexEventCategory =
  | "onboarding"
  | "blitz"
  | "product"
  | "global";

export type CortexEventHub = "NGA" | "NYC" | "IND" | "GLOBAL";

export type CortexEvent = {
  id: string;
  category: CortexEventCategory;
  categoryLabel: string;
  hub: CortexEventHub;
  title: string;
  /** Machine-readable ISO date for the `dateTime` attribute. */
  date: string;
  dateLabel: string;
  location: string;
  description: string;
  /** External registration/detail URL (currently Luma, may change). */
  url?: ExternalHref;
};

export const eventsSection = {
  id: "events",
  title: "Upcoming Events.",
  description: "",
  emptyState: "No upcoming events right now. Check back soon.",
  // Content-driven: whatever ships in this array at launch is what the
  // section renders. Each event's `url` should point to its Luma page.
  events: [
    {
      id: "us-east-dev-blitz",
      category: "blitz",
      categoryLabel: "Blitz / Devs",
      hub: "NYC",
      title: "US East dev blitz",
      date: "2026-06-07",
      dateLabel: "June 7, 2026",
      location: "New York",
      description:
        "A builder-focused program for engineering support, technical education, and planning around ETH NY with Cortex US East leaders.",
      url: "https://lu.ma/cortex-us-east-dev-blitz",
    },
  ] satisfies readonly CortexEvent[],
} as const satisfies SectionContent & {
  emptyState: string;
  events: readonly CortexEvent[];
};
