export const SITE_NAME = "Cortex Global" as const;

export const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL ?? "https://www.cortexglobal.xyz";

export const SITE_TAGLINE = "Local Service. Global Impact." as const;

export const SITE_DESCRIPTION =
  "Cortex serves all individual, business, and community needs through our globally distributed professional network — local citizens providing expertise, guidance, and connection to the top industry professionals in all verticals. Everything for Everyone. Everywhere." as const;

export const TWITTER_HANDLE = "Cortex_Global_" as const;

export const OG_IMAGE_PATH = "/images/og.png" as const;

/** Bump to bust social-platform image caches without changing routes or image paths. */
export const OG_CACHE_VERSION = "3" as const;

export const OG_PAGE_URL = `/?v=${OG_CACHE_VERSION}` as const;

export const OG_IMAGE = {
  url: `${OG_IMAGE_PATH}?v=${OG_CACHE_VERSION}`,
  width: 2170,
  height: 1139,
  alt: `${SITE_NAME} — ${SITE_TAGLINE}`,
} as const;
