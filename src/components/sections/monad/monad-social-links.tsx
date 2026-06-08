"use client";

import {
  CategoryLabsGlyph,
  MiplandGlyph,
  MonadFoundationGlyph,
} from "@/components/icons/monad-social-glyphs";
import { SOCIAL_GLYPHS } from "@/components/icons/social-glyphs";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { FileText } from "lucide-react";
import { monadSection } from "@/lib/content/monad";
import type { ExternalLinkChannel } from "@/lib/content/links";

type MonadSectionLink = (typeof monadSection.links)[number];

const WEBSITE_GLYPHS: Record<
  string,
  React.ComponentType<{ className?: string }> | undefined
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
            <Tooltip>
              <TooltipTrigger asChild>
                <a
                  href={link.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={label}
                  className="monad-social-link"
                  data-monad-link-key={link.key}
                >
                  <MonadSocialGlyph link={link} />
                </a>
              </TooltipTrigger>
              <TooltipContent
                side="top"
                sideOffset={8}
                className="hidden xl:inline-flex rounded-full [--foreground:var(--brand-cortex-carbon)] text-neutral-silver-gray"
              >
                {link.label}
              </TooltipContent>
            </Tooltip>
          </li>
        );
      })}
    </ul>
  );
}
