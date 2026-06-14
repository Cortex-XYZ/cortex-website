import { siteLinks } from "./links";
import type { ContentCta, SectionContent } from "./types";

export type HeroParagraph = {
  /** Word or phrase rendered with emphasis (e.g. bold + primary color). */
  emphasis?: string;
  text: string;
};

export const heroSection = {
  id: "hero",
  title: "Local Service.\nGlobal Impact.",
  paragraphs: [
    {
      emphasis: "Cortex",
      text: "serves all individual, business, and community needs from our local hubs —\nlocal citizens providing expertise, guidance, and connection to the top industry professionals in all verticals — around the world.",
    },
    {
      text: "Everything for Everyone. Everywhere.",
    },
  ] satisfies readonly HeroParagraph[],
  mobileParagraphs: [
    {
      emphasis: "Cortex",
      text: "connects people, businesses, and communities with trusted local experts — anywhere in the world.",
    },
  ] satisfies readonly HeroParagraph[],
  primaryCta: {
    label: "I am new here",
    href: siteLinks.start.href,
  } satisfies ContentCta,
  secondaryCta: {
    label: "I am in community",
    href: siteLinks.services.href,
  } satisfies ContentCta,
} as const satisfies SectionContent & {
  paragraphs: readonly HeroParagraph[];
  mobileParagraphs: readonly HeroParagraph[];
  primaryCta: ContentCta;
  secondaryCta: ContentCta;
};
