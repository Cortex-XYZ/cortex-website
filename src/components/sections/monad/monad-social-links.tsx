import {
  CategoryLabsGlyph,
  MiplandGlyph,
  MonadFoundationGlyph,
} from "@/components/icons/monad-social-glyphs";
import { SOCIAL_GLYPHS } from "@/components/icons/social-glyphs";
import { MonadSocialLinkItem } from "@/components/sections/monad/monad-social-link-item";
import { FileText } from "lucide-react";
import { monadSection } from "@/lib/content/monad";
import type { ExternalLinkChannel } from "@/lib/content/links";
import type { ComponentType } from "react";

type MonadSectionLink = (typeof monadSection.links)[number];

const WEBSITE_GLYPHS: Record<
  string,
  ComponentType<{ className?: string }> | undefined
> = {
  monadFoundation: MonadFoundationGlyph,
  monadDocs: FileText,
  mipland: MiplandGlyph,
  categoryLabs: CategoryLabsGlyph,
};

function MonadSocialGlyph({ link }: { link: MonadSectionLink }) {
  const channel = link.channel as ExternalLinkChannel | undefined;
  const SocialGlyph = channel ? SOCIAL_GLYPHS[channel] : undefined;

  if (SocialGlyph) return <SocialGlyph className="size-full" />;

  const WebsiteGlyph = WEBSITE_GLYPHS[link.key];
  if (WebsiteGlyph) return <WebsiteGlyph className="size-5" />;

  return null;
}

export function MonadSocialLinks() {
  return (
    <ul className="monad-social-list" aria-label="Monad links">
      {monadSection.links.map((link) => {
        const label = "ariaLabel" in link ? link.ariaLabel : link.label;

        return (
          <li key={link.key}>
            <MonadSocialLinkItem
              href={link.href}
              ariaLabel={label}
              linkKey={link.key}
              tooltipLabel={link.label}
            >
              <MonadSocialGlyph link={link} />
            </MonadSocialLinkItem>
          </li>
        );
      })}
    </ul>
  );
}
