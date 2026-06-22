import type { ContentImage, ExternalHref, SectionContent } from "./types";

export type EventLocation = {
  city: string;
  region?: string;
};

export type CortexEvent = {
  id: string;
  label: string;
  title: string;
  /** ISO UTC event start instant, sourced from Luma. */
  startsAt: `${string}T${string}Z`;
  /** ISO UTC event end instant, sourced from Luma. */
  endsAt: `${string}T${string}Z`;
  /** Display label for the event date. */
  dateLabel: string;
  location: EventLocation;
  description: string;
  image?: ContentImage;
  /** External registration/detail URL (currently Luma, may change). */
  url?: ExternalHref;
  rsvpLabel?: string;
};

export const eventsSection = {
  id: "events",
  titleLines: ["Upcoming", "Events."],
  followUp: {
    title: "More events are coming soon.",
    description:
      "New hub sessions, builder meetups, and partner gatherings will appear here as dates lock.",
  },
  rsvpLabel: "RSVP",
  events: [
    {
      id: "cortex-connex-tech-fest",
      label: "GLOBAL",
      title: "Cortex CONNEX Tech Fest",
      startsAt: "2026-06-27T13:00:00Z", // 9:00 AM EDT
      endsAt: "2026-06-28T01:00:00Z", // 9:00 PM EDT
      dateLabel: "Jun 27, 2026",
      location: {
        city: "Online",
        region: "GLOBAL",
      },
      description:
        "Workshops for participants of all interests and levels. AI and Blockchain basics to advanced concepts - led by our expert team. Newcomers friendly.",
      image: {
        src: "/images/events/627.png",
        alt: "Cortex CONNEX Tech Festival poster for June 27, 2026",
      },
      url: "https://luma.com/vcdd20wc?utm_source=cortex_website",
    },
  ] satisfies readonly CortexEvent[],
} as const satisfies Pick<SectionContent, "id"> & {
  titleLines: readonly string[];
  followUp: {
    title: string;
    description: string;
  };
  rsvpLabel: string;
  events: readonly CortexEvent[];
};
