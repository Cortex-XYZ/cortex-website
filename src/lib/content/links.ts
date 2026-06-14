import type { ExternalHref, InternalHref } from "./types";

export type SiteLink = {
  label: string;
  href: InternalHref;
};

export const siteLinks = {
  home: { label: "Home", href: "/" },
  mission: { label: "Mission", href: "/#mission" },
  history: { label: "History", href: "/#history" },
  team: { label: "Team", href: "/#team" },
  monad: { label: "What is Monad", href: "/#monad" },
  monadHistory: { label: "Monad history", href: "/#monad-history" },
  monadLinks: { label: "Monad links", href: "/#monad-links" },
  start: { label: "New here?", href: "/#mission" },
  services: { label: "Services", href: "/#services" },
  education: { label: "Education", href: "/#services" }, // TODO: Need to update for v-2 version where we will have a separate education page
  events: { label: "Events", href: "/#events" }, // TODO: Need to update for v-2 version where we will have a separate events page
  research: { label: "Research", href: "/#services" }, // TODO: Need to update for v-2 version where we will have a separate research page
  staking: { label: "Staking", href: "/#services" }, // TODO: Need to update for v-2 version where we will have a separate staking page
  contact: { label: "Contact", href: "/#footer" }, // TODO: Currently this is the footer contact link, but we need to update it to be the contact page link or other appropriate link
  privacy: { label: "Privacy policy", href: "/privacy" },
  terms: { label: "Terms of use", href: "/terms" },
} as const satisfies Record<string, SiteLink>;

/** TEMP(staking-page): no href until /stake ships; swap for siteLinks.stake. */
export const stakeCta = {
  label: "Stake to Support",
  comingSoonLabel: "Coming Soon",
} as const;

export type SiteLinkKey = keyof typeof siteLinks;

export type ExternalLinkCategory =
  | "cortex-social"
  | "monad"
  | "monad-program"
  | "person";

export type ExternalLinkChannel =
  | "website"
  | "x"
  | "instagram"
  | "tiktok"
  | "linkedin"
  | "youtube"
  | "github"

export type ExternalLink = {
  label: string;
  href: ExternalHref;
  category: ExternalLinkCategory;
  channel?: ExternalLinkChannel;
  ariaLabel?: string;
};

export const externalLinks = {
  cortexX: {
    label: "X",
    href: "https://x.com/cortex_global_",
    category: "cortex-social",
    channel: "x",
    ariaLabel: "Cortex Global on X",
  },
  cortexInstagram: {
    label: "Instagram",
    href: "https://www.instagram.com/cortex_global",
    category: "cortex-social",
    channel: "instagram",
    ariaLabel: "Cortex Global on Instagram",
  },
  cortexTikTok: {
    label: "TikTok",
    href: "https://www.tiktok.com/@cortex.global1",
    category: "cortex-social",
    channel: "tiktok",
    ariaLabel: "Cortex Global on TikTok",
  },
  cortexLinkedIn: {
    label: "LinkedIn",
    href: "https://www.linkedin.com/company/cortexglobalservices",
    category: "cortex-social",
    channel: "linkedin",
    ariaLabel: "Cortex Global on LinkedIn",
  },
  cortexYouTube: {
    label: "YouTube",
    href: "https://www.youtube.com/@cortexglobalinit",
    category: "cortex-social",
    channel: "youtube",
    ariaLabel: "Cortex Global on YouTube",
  },
  cortexGitHub: {
    label: "GitHub",
    href: "https://github.com/Cortex-XYZ",
    category: "cortex-social",
    channel: "github",
    ariaLabel: "Cortex Global on GitHub",
  },
  categoryLabs: {
    label: "Category Labs",
    href: "https://www.category.xyz/",
    category: "monad",
    channel: "website",
  },
  monadFoundation: {
    label: "Monad Foundation",
    href: "https://monad.xyz/",
    category: "monad",
    channel: "website",
  },
  monadDocs: {
    label: "Monad Docs",
    href: "https://docs.monad.xyz/",
    category: "monad",
    channel: "website",
  },
  mipland: {
    label: "MIPLand",
    href: "https://mipland.com/",
    category: "monad",
    channel: "website",
  },
  monadYouTube: {
    label: "YouTube",
    href: "https://www.youtube.com/@MonadFoundation",
    category: "monad",
    channel: "youtube",
    ariaLabel: "Monad Foundation on YouTube",
  },
  monadX: {
    label: "X",
    href: "https://x.com/monad",
    category: "monad",
    channel: "x",
    ariaLabel: "Monad on X",
  },
  nitro: {
    label: "Nitro",
    href: "https://nitroacc.xyz/",
    category: "monad-program",
    channel: "website",
  },
  keoneHonX: {
    label: "Keone Hon",
    href: "https://x.com/keoneHD",
    category: "person",
    channel: "x",
  },
  jamesHunsakerX: {
    label: "James Hunsaker",
    href: "https://x.com/_jhunsaker",
    category: "person",
    channel: "x",
  },
  euniceGiartaX: {
    label: "Eunice Giarta",
    href: "https://x.com/0x_eunice",
    category: "person",
    channel: "x",
  },
} as const satisfies Record<string, ExternalLink>;

export type ExternalLinkKey = keyof typeof externalLinks;

// Order matches the Figma footer spec exactly.
export const cortexSocialLinkKeys = [
  "cortexX",
  "cortexGitHub",
  "cortexYouTube",
  "cortexInstagram",
  "cortexLinkedIn",
  "cortexTikTok",
] as const satisfies readonly ExternalLinkKey[];

export const monadLinkKeys = [
  "monadX",
  "monadYouTube",
  "monadFoundation",
  "monadDocs",
  "mipland",
  "categoryLabs",
] as const satisfies readonly ExternalLinkKey[];

// TODO: Need to verify this
export const contactEmail = {
  label: "becool@cortexglobal.xyz",
  href: "mailto:becool@cortexglobal.xyz",
} as const satisfies SiteLink;
