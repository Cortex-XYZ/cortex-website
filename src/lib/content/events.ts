import type { ContentImage, ExternalHref, SectionContent } from "./types";

export type EventLocation = {
  city: string;
  region?: string;
};

export type CortexEvent = {
  id: string;
  label: string;
  title: string;
  /** ISO calendar date (YYYY-MM-DD), interpreted as UTC midnight. */
  date: string;
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
      date: "2026-06-27",
      dateLabel: "Jun 27, 2026",
      location: {
        city: "Online",
        region: "GLOBAL",
      },
      // TODO: Replace placeholder description with final CONNEX Tech Fest copy before launch.
      description:
        "Placeholder event description for Cortex CONNEX Tech Fest. This copy should be changed before launch.",
      image: {
        src: "/images/events/627.png",
        alt: "Cortex CONNEX Tech Festival poster for June 27, 2026",
      },
      // TODO: Temporary Luma profile link — replace with the CONNEX Tech Fest event page URL once available.
      url: "https://luma.com/user/Cortex_Global",
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
