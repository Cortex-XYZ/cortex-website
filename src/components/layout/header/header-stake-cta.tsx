"use client";

import { CortexButton } from "@/components/cortex-button";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { ctaButton } from "@/lib/content/nav";
import { Clock } from "lucide-react";

/**
 * TEMP(staking-page): disabled stake CTA for desktop header.
 * Replace with a linked CortexButton to /stake when the staking page ships.
 */
export function HeaderStakeCta() {
  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <CortexButton
          type="button"
          animated={false}
          aria-disabled="true"
          className="header-stake-cta hidden font-bold lg:inline-flex"
        >
          {ctaButton.label}
        </CortexButton>
      </TooltipTrigger>
      <TooltipContent
        side="bottom"
        sideOffset={16}
        className="header-stake-cta-tooltip border-border-default! bg-bg-canvas! text-text-muted! shadow-lg"
      >
        <Clock className="header-stake-cta-clock" strokeWidth={1.75} />
        <span className="relative z-10">{ctaButton.comingSoonLabel}</span>
      </TooltipContent>
    </Tooltip>
  );
}
