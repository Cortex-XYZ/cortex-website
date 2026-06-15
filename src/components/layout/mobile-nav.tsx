"use client";

import { HashLink } from "@/components/hash-link";
import { reconcileHashFocusOnDialogClose } from "@/lib/hash-navigation";
import { useState } from "react";
import { ChevronDown, Clock, X } from "lucide-react";
import {
  Sheet,
  SheetContent,
  SheetClose,
  SheetTitle,
} from "@/components/ui/sheet";
import { CortexMark } from "@/components/logos/cortex-mark";
import { aboutNavItem, ctaButton, directNavLinks } from "@/lib/content/nav";
import { cn } from "@/lib/utils";

interface MobileNavProps {
  open: boolean;
  onClose: () => void;
}

export function MobileNav({ open, onClose }: MobileNavProps) {
  const [isAboutOpen, setIsAboutOpen] = useState(true);

  return (
    <Sheet open={open} onOpenChange={(v) => !v && onClose()}>
      <SheetContent
        side="right"
        showCloseButton={false}
        aria-describedby={undefined}
        className="mobile-nav-panel"
        onCloseAutoFocus={(event) => {
          if (reconcileHashFocusOnDialogClose()) {
            event.preventDefault();
          }
        }}
      >
        <SheetTitle className="sr-only">Navigation</SheetTitle>

        {/* Top bar */}
        <div className="mobile-nav-topbar">
          <CortexMark className="mt-1 size-5 w-auto text-brand-cortex-orange" />
          <SheetClose asChild>
            <button className="text-text-primary" aria-label="Close menu">
              <X className="size-7" />
            </button>
          </SheetClose>
        </div>

        {/* Nav items */}
        <nav className="flex flex-1 flex-col overflow-y-auto px-6 pt-4">
          {aboutNavItem?.megaNav && (
            <>
              <button
                className="flex w-full items-center justify-between py-4 text-left"
                onClick={() => setIsAboutOpen((o) => !o)}
                aria-expanded={isAboutOpen}
              >
                <span className="mobile-nav-primary-text">
                  {aboutNavItem.label}
                </span>
                <ChevronDown
                  className={cn(
                    "size-7 text-brand-cortex-orange transition-transform duration-200",
                    isAboutOpen && "rotate-180",
                  )}
                />
              </button>

              <div
                className={cn(
                  "grid transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)]",
                  isAboutOpen ? "grid-rows-[1fr]" : "grid-rows-[0fr]",
                )}
              >
                <div className="overflow-hidden">
                  <div className="flex flex-col pb-3 pl-2 pt-1">
                    {aboutNavItem.megaNav.map((column, i) => (
                      <div key={column.heading}>
                        {i > 0 && (
                          <div className="my-5 h-px w-full bg-neutral-neural-dark" />
                        )}
                        <div className="flex flex-col gap-2">
                          <p className="mobile-nav-section-label">
                            {column.heading}
                          </p>
                          {column.links.map((link) => (
                            <HashLink
                              key={link.href}
                              href={link.href}
                              onClick={onClose}
                              className="flex flex-col py-1.5"
                            >
                              <span className="mobile-nav-link-label">
                                {link.label}
                              </span>
                            </HashLink>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </>
          )}

          {directNavLinks.map((item) => (
            <HashLink
              key={item.href}
              href={item.href}
              onClick={onClose}
              className="mobile-nav-primary-text block py-4"
            >
              {item.label}
            </HashLink>
          ))}
        </nav>

        {/* TEMP(staking-page): disabled CTA row — restore HashLink to /stake when ready. */}
        <div className="shrink-0">
          <div className="h-px w-full bg-neutral-neural-dark" />
          <div
            className="mobile-nav-cta-row"
            aria-disabled="true"
            aria-label={`${ctaButton.label} — ${ctaButton.comingSoonLabel}`}
          >
            <span className="mobile-nav-cta-label">{ctaButton.label}</span>
            <span className="mobile-nav-cta-status">
              <Clock
                className="mobile-nav-cta-clock"
                aria-hidden="true"
                strokeWidth={1.75}
              />
              <span className="mobile-nav-cta-coming-soon">
                {ctaButton.comingSoonLabel}
              </span>
            </span>
          </div>
          <div className="h-1 w-full bg-brand-cortex-orange" />
        </div>
      </SheetContent>
    </Sheet>
  );
}
