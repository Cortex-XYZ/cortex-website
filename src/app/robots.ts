import type { MetadataRoute } from "next";

import { IS_INDEXABLE_HOST, SITE_URL } from "@/lib/site";

export default function robots(): MetadataRoute.Robots {
  // Preview/staging hosts (e.g. preview.cortexglobal.xyz) must not be indexed.
  if (!IS_INDEXABLE_HOST) {
    return { rules: { userAgent: "*", disallow: "/" } };
  }

  return {
    rules: { userAgent: "*", allow: "/" },
    sitemap: `${SITE_URL}/sitemap.xml`,
  };
}
