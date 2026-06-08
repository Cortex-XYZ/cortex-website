import { externalLinks, monadLinkKeys, type ExternalLinkKey } from "./links";
import type { SectionContent } from "./types";

export type MonadCardLink = {
  text: string;
  linkKey: ExternalLinkKey;
};

export type MonadCard = {
  id: string;
  title: string;
  anchorId: string;
  paragraphs: readonly string[];
  detailLinks?: readonly MonadCardLink[];
};

export type MonadInteractiveLink = {
  text: string;
  href: string;
  channel?: "x";
};

export type MonadInteractiveCard = {
  id: string;
  title: string;
  anchorId?: string;
  paragraphs: readonly string[];
  links: readonly MonadInteractiveLink[];
};

export const monadSection = {
  id: "monad",
  eyebrow: "Monad History and Team",
  title: "The ecosystem context behind the work.",
  description:
    "Monad context, founding story, core team, and ecosystem programs that Cortex builders connect to.",
  links: monadLinkKeys.map((key) => ({
    key,
    ...externalLinks[key],
  })),
  cards: [
    {
      id: "what-is-monad",
      title: "What is Monad",
      anchorId: "monad",
      paragraphs: [
        "Monad is a high-performance, layer-1 blockchain designed to achieve speeds of up to 10,000 transactions per second (TPS) with sub-second finality and near-zero fees. It is fully compatible with the Ethereum Virtual Machine (EVM), allowing developers to seamlessly deploy existing Ethereum smart contracts without altering their code.",
      ],
      detailLinks: [{ text: "monad.xyz", linkKey: "monadFoundation" }],
    },
    {
      id: "monad-history",
      title: "Monad History",
      anchorId: "monad-history",
      paragraphs: [
        "Monad was founded in 2022 by Keone Hon, James Hunsaker, and Eunice Giarta with a clear technical thesis: keep Ethereum's developer experience, but rebuild the underlying system for far higher performance. In December 2024, Monad Labs evolved into two focused organizations: Monad Foundation, which supports ecosystem growth, governance, documentation, and adoption; and Category Labs, which leads protocol research and core software development. Monad's public testnet launched in February 2025, followed by Monad Public Mainnet on November 24, 2025.",
      ],
      detailLinks: [
        { text: "Monad Foundation", linkKey: "monadFoundation" },
        { text: "Category Labs", linkKey: "categoryLabs" },
      ],
    },
    {
      id: "monad-team",
      title: "Monad Team",
      anchorId: "monad-team",
      paragraphs: [
        "Monad was founded by Keone Hon, James Hunsaker, and Eunice Giarta, with roots in high-performance trading systems, fintech, and product leadership. Keone Hon and Eunice Giarta lead Monad Foundation, focusing on adoption, community, developer education, and network growth. James Hunsaker leads Category Labs, the engineering and research team behind the core Monad protocol. Together, the team brings a performance-first mindset into blockchain infrastructure, with the goal of making onchain applications faster, cheaper, and easier to scale.",
      ],
      detailLinks: [
        { text: "Keone Hon", linkKey: "keoneHonX" },
        { text: "James Hunsaker", linkKey: "jamesHunsakerX" },
        { text: "Eunice Giarta", linkKey: "euniceGiartaX" },
      ],
    },
    {
      id: "nitro-and-programs",
      title: "Nitro and Programs",
      anchorId: "monad-links",
      paragraphs: [
        "Monad supports builders through a structured set of ecosystem programs. Nitro is Monad Foundation's accelerator for teams already building and shipping, offering selected teams funding, mentorship, KPI check-ins, and a demo day in front of investors. It sits alongside builder initiatives such as Blitz, hackathons, Foundry, Monad Madness, Momentum, and AI Blueprint. Together, these programs create a path from first experiments to funded companies, helping developers move from ideas to real products on Monad.",
      ],
      detailLinks: [{ text: "Nitro", linkKey: "nitro" }],
    },
  ] satisfies readonly MonadCard[],
} as const satisfies SectionContent & {
  links: readonly ((typeof externalLinks)[ExternalLinkKey] & {
    key: ExternalLinkKey;
  })[];
  cards: readonly MonadCard[];
};
