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
    {
      id: "tokenomics-101",
      label: "GLOBAL",
      title: "Tokenomics 101",
      startsAt: "2026-07-28T14:30:00Z", // 10:30 AM EDT
      endsAt: "2026-07-28T15:30:00Z", // 11:30 AM EDT
      dateLabel: "Jul 28, 2026",
      location: {
        city: "Online",
        region: "GLOBAL",
      },
      description:
        "When designing tokenomics for a project, there always feels like the number of variables and considerations keeps growing, making the process feel like hitting a moving target. This workshop will demonstrate a foundational framework to have all the pieces participants need organized, weighted, and layered for a strong plan of action.",
      image: {
        src: "/images/events/728.png",
        alt: "Tokenomics 101 poster for July 28, 2026",
      },
      url: "https://luma.com/pmvvsz4b?utm_source=cortex_website",
    },
    {
      id: "cortex-atlanta-stablecoins-payments-institutional-digital-assets",
      label: "ATLANTA",
      title:
        "Cortex Atlanta: Stablecoins, Payments & Institutional Digital Assets",
      startsAt: "2026-08-11T22:00:00Z", // 6:00 PM EDT
      endsAt: "2026-08-12T00:00:00Z", // 8:00 PM EDT
      dateLabel: "Aug 11, 2026",
      location: {
        city: "Social Space, Atlanta BeltLine",
        region: "ATLANTA",
      },
      description:
        "Atlanta runs the rails. Transaction Alley moves a huge share of the country's payments, and the next chapter is being written onchain. This off the record gathering brings founders, fintech operators, CISOs, general counsels, investors, and crypto-native builders into one serious room for a vendor-neutral stablecoins and institutional adoption segment, followed by conversation over tacos and drinks. CertiK is the security partner for the evening.",
      image: {
        src: "/images/events/811.png",
        alt: "Cortex Atlanta poster for Stablecoins, Payments & Institutional Digital Assets on August 11, 2026",
      },
      url: "https://luma.com/37jf3t95?utm_source=cortex_website",
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
