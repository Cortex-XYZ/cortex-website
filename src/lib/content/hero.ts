import { siteLinks } from "./links";
import type { ContentCta, SectionContent } from "./types";

export type HeroParagraph = {
  /** Word or phrase rendered with emphasis (e.g. bold + primary color). */
  emphasis?: string;
  text: string;
  /** Continuation rendered after a tablet-only line break (md–lg). */
  tabletLine?: string;
};

export const heroSection = {
  id: "hero",
  title: "Local Service.\nGlobal Impact.",
  paragraphs: [
    {
      emphasis: "Cortex",
      text: "serves all individual, business, and community needs through our globally distributed professional network —",
      tabletLine:
        "local citizens providing expertise, guidance, and connection to the top industry professionals in all verticals.",
    },
    {
      text: "Everything for Everyone. Everywhere.",
    },
  ] satisfies readonly HeroParagraph[],
  mobileParagraphs: [
    {
      emphasis: "Cortex",
      text: "serves individual, business, and community needs through a globally distributed professional network.",
    },
  ] satisfies readonly HeroParagraph[],
  primaryCta: {
    label: "New to Cortex",
    href: siteLinks.start.href,
  } satisfies ContentCta,
  secondaryCta: {
    label: "Cortex Community",
    href: siteLinks.services.href,
  } satisfies ContentCta,
} as const satisfies SectionContent & {
  paragraphs: readonly HeroParagraph[];
  mobileParagraphs: readonly HeroParagraph[];
  primaryCta: ContentCta;
  secondaryCta: ContentCta;
};
