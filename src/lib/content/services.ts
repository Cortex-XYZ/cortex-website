import { siteLinks } from "./links";
import type { ContentCta, InternalHref, SectionContent } from "./types";

export type ServiceVisualVariant =
  | "education"
  | "events"
  | "services"
  | "research"
  | "staking";

export type ServiceCard = {
  id: ServiceVisualVariant;
  title: string;
  href: InternalHref;
  description: string;
  visualVariant: ServiceVisualVariant;
};

export const servicesSection = {
  id: "services",
  title: "Services are\nthe main\nutility layer.",
  description:
    "Cortex turns local trust into useful programming, practical support, and service infrastructure for builders, partners, and communities.",
  cards: [
    {
      id: "education",
      title: "Education",
      href: siteLinks.education.href,
      description:
        "We offer learning opportunities for every interest, need, level, and objective. Whether someone is new to blockchain, or seeking opportunities to do deep technical research, we provide elite level educational offerings.",
      visualVariant: "education",
    },
    {
      id: "events",
      title: "Events",
      href: siteLinks.events.href,
      description:
        "We believe that social, collaborative, enjoyable events are integral to our mission. Hosting various types of events is core to our mission of service to all needs.",
      visualVariant: "events",
    },
    {
      id: "services",
      title: "Services",
      href: siteLinks.services.href,
      description:
        "While each region has industry experts leading locally, we also work very closely together as a Cortex Global Team — allowing us to provide top services in any area through our extended network.",
      visualVariant: "services",
    },
    {
      id: "research",
      title: "Research",
      href: siteLinks.research.href,
      description:
        "Deep research and reports for university, business, corporate, and finance audiences, alongside OSS and ecosystem insight.",
      visualVariant: "research",
    },
    {
      id: "staking",
      title: "Staking",
      href: siteLinks.staking.href,
      description:
        "Stake with Cortex to support education, events, services, local programs, and future community spaces.",
      visualVariant: "staking",
    },
  ] satisfies readonly ServiceCard[],
  cta: {
    label: "Let's Talk",
    href: siteLinks.contact.href,
  } satisfies ContentCta,
} as const satisfies SectionContent & {
  cards: readonly ServiceCard[];
  cta: ContentCta;
};
