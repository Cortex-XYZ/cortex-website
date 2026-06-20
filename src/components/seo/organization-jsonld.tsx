import { cortexSocialLinkKeys, externalLinks } from "@/lib/content/links";
import {
  OG_IMAGE_PATH,
  SITE_DESCRIPTION,
  SITE_NAME,
  SITE_URL,
} from "@/lib/site";

// Organization structured data (schema.org) for rich results / knowledge panel.
// schema.org consumers require absolute URLs, so everything resolves against
// SITE_URL (driven by NEXT_PUBLIC_SITE_URL).
const organizationSchema = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: SITE_NAME,
  url: SITE_URL,
  logo: `${SITE_URL}${OG_IMAGE_PATH}`,
  description: SITE_DESCRIPTION,
  sameAs: cortexSocialLinkKeys.map((key) => externalLinks[key].href),
};

export function OrganizationJsonLd() {
  return (
    <script
      type="application/ld+json"
      // Serialized from trusted constants only — no user input is interpolated.
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(organizationSchema).replace(/</g, "\\u003c"),
      }}
    />
  );
}
