import type { SectionContent } from "./types";

export type HistoryMilestone = {
  id: string;
  dateLabel: string;
  title: string;
  body: string;
};

export const historySection = {
  id: "history",
  eyebrow: "History",
  title: "History",
  /**
   * Scroll-triggered callout that appears left of the timeline near the later
   * milestones. Not a section heading — render it as a pinned or reveal
   * element during the scroll sequence.
   */
  scrollCallout:
    "In just one quarter, Cortex evolved from a blueprint into an active, self-sustaining global workforce, proving that the future of digital infrastructure is built from the ground up.",
  milestones: [
    {
      id: "seed-planted",
      dateLabel: "Feb 2025",
      title: "Seed planted",
      body: "Cortex initiated its foundational program design and launched a global recruitment campaign to identify and prepare the next generation of regional leaders.",
    },
    {
      id: "orientation-planted",
      dateLabel: "Mar 2025",
      title: "Orientation and relationships planted",
      body: "28 core candidates onboarded through an intensive initial orientation, beginning the cross-border relationships and team dynamics behind the global network.",
    },
    {
      id: "leadership-program",
      dateLabel: "Apr 2026",
      title: "Leadership program executed",
      body: "A rigorous three-week leadership program met three times a week, using portfolio-based milestones to translate theory into immediate, localized action.",
    },
    {
      id: "regional-activation",
      dateLabel: "Activation",
      title: "Regional activation",
      body: "Africa / Lagos Blitz was executed by Cortex NG leaders. North America / ETH NY mobilization began with Cortex US East alongside new Miami events.Europe & Asia / Helsinki initiatives launched, Turkiye Blitz was revised for longer-term retention, and similar ecosystem strategies were deployed across India.",
    },
    {
      id: "cortex-connect",
      dateLabel: "Q2 2026",
      title: "Cortex connect",
      body: "Formal global hybrid events will connect local communities in person while linking them digitally around the world.",
    },
  ] satisfies readonly HistoryMilestone[],
} as const satisfies SectionContent & {
  scrollCallout: string;
  milestones: readonly HistoryMilestone[];
};
