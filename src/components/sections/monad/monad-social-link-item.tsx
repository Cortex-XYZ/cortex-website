"use client";

import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";

type MonadSocialLinkItemProps = {
  href: string;
  ariaLabel: string;
  linkKey: string;
  tooltipLabel: string;
  children: React.ReactNode;
};

export function MonadSocialLinkItem({
  href,
  ariaLabel,
  linkKey,
  tooltipLabel,
  children,
}: MonadSocialLinkItemProps) {
  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <a
          href={href}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={ariaLabel}
          className="monad-social-link"
          data-monad-link-key={linkKey}
        >
          {children}
        </a>
      </TooltipTrigger>
      <TooltipContent
        side="top"
        sideOffset={8}
        className="hidden xl:inline-flex rounded-full [--foreground:var(--brand-cortex-carbon)] text-neutral-silver-gray"
      >
        {tooltipLabel}
      </TooltipContent>
    </Tooltip>
  );
}
