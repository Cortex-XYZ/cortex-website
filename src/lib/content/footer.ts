import {
  contactEmail,
  cortexSocialLinkKeys,
  externalLinks,
  siteLinks,
  type ExternalLinkKey,
} from "./links";
import type { ContentCta, InternalHref, SectionContent } from "./types";

export type FooterColumnLink = {
  label: string;
  href: InternalHref;
};

export type FooterColumn = {
  title: string;
  links: readonly FooterColumnLink[];
};

export const footerContent = {
  id: "footer",
  title: "Build local. Connect human. Shape what is next.",
  description:
    "Get Cortex updates on local hubs, education tracks, events, services, and ways to support the network.",
  tagline: "Open innovation, made local. Open to all.",
  email: contactEmail,
  newsletterCta: {
    label: "Subscribe",
    href: contactEmail.href,
  } satisfies ContentCta,
  columns: [
    {
      title: "About",
      links: [
        siteLinks.mission,
        siteLinks.history,
        siteLinks.team,
        { label: "Monad context", href: siteLinks.monad.href },
      ],
    },
    {
      title: "Services",
      links: [
        siteLinks.education,
        siteLinks.events,
        siteLinks.services,
        siteLinks.research,
        siteLinks.staking,
      ],
    },
    {
      title: "Legal",
      links: [siteLinks.privacy, siteLinks.terms],
    },
  ] satisfies readonly FooterColumn[],
  socialLinks: cortexSocialLinkKeys.map((key) => ({
    key,
    ...externalLinks[key],
  })),
  copyright: "© 2026 Cortex Global. All rights reserved.",
} as const satisfies SectionContent & {
  tagline: string;
  email: typeof contactEmail;
  newsletterCta: ContentCta;
  columns: readonly FooterColumn[];
  socialLinks: readonly ((typeof externalLinks)[ExternalLinkKey] & {
    key: ExternalLinkKey;
  })[];
  copyright: string;
};
