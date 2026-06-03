"use client";

import dynamic from "next/dynamic";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { ChevronDown, TextAlignJustify } from "lucide-react";
import { CortexButton } from "@/components/cortex-button";
import { CortexMark } from "@/components/logos/cortex-mark";
import { CortexWordmark } from "@/components/logos/cortex-wordmark";
import { ctaButton, navItems } from "@/lib/content/nav";
import { cn } from "@/lib/utils";

const MobileNav = dynamic(
  () =>
    import("@/components/layout/mobile-nav").then((m) => ({
      default: m.MobileNav,
    })),
  { ssr: false },
);

let mobileNavPreload: Promise<unknown> | undefined;

function preloadMobileNav() {
  mobileNavPreload ??= import("@/components/layout/mobile-nav");
  void mobileNavPreload;
}

export function SiteHeader() {
  const [isMegaOpen, setIsMegaOpen] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [mobileNavMounted, setMobileNavMounted] = useState(false);
  const headerRef = useRef<HTMLElement>(null);

  // Keep scroll styling outside React state so threshold changes do not re-render the header.
  useEffect(() => {
    const header = headerRef.current;
    if (!header) return;

    const threshold = 20;
    let isScrolled = false;

    const syncScrollState = () => {
      const next = window.scrollY > threshold;
      if (next === isScrolled) return;
      isScrolled = next;
      header.dataset.scrolled = String(next);
    };

    syncScrollState();
    window.addEventListener("scroll", syncScrollState, { passive: true });
    return () => window.removeEventListener("scroll", syncScrollState);
  }, []);

  useEffect(() => {
    if (!isMegaOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setIsMegaOpen(false);
    };
    const onClickOutside = (e: MouseEvent) => {
      if (headerRef.current && !headerRef.current.contains(e.target as Node)) {
        setIsMegaOpen(false);
      }
    };
    document.addEventListener("keydown", onKey);
    document.addEventListener("mousedown", onClickOutside);
    return () => {
      document.removeEventListener("keydown", onKey);
      document.removeEventListener("mousedown", onClickOutside);
    };
  }, [isMegaOpen]);

  const aboutItem = navItems.find((item) => item.megaNav);
  const directLinks = navItems.filter(
    (item): item is { label: string; href: string } => !item.megaNav,
  );

  return (
    <header ref={headerRef} data-scrolled="false" className="site-header-shell">
      <div className="site-container site-header-bar">
        <div className="flex items-center gap-12">
          <Link
            href="/"
            aria-label="Cortex Global home"
            className="flex shrink-0 items-center gap-2"
          >
            <CortexMark className="size-6 w-auto text-brand-cortex-orange" />
            <CortexWordmark className="size-6 w-auto text-text-secondary" />
          </Link>

          <nav className="hidden items-center gap-16 lg:flex">
            {aboutItem?.megaNav && (
              <div
                className="relative"
                onMouseEnter={() => setIsMegaOpen(true)}
                onMouseLeave={() => setIsMegaOpen(false)}
              >
                <button
                  className="flex cursor-pointer items-center gap-1 text-nav text-text-secondary transition-colors hover:text-text-primary"
                  onClick={() => setIsMegaOpen((o) => !o)}
                  aria-expanded={isMegaOpen}
                  aria-haspopup="true"
                >
                  {aboutItem.label}
                  <ChevronDown
                    className={cn(
                      "size-4 transition-transform duration-200",
                      isMegaOpen && "rotate-180",
                    )}
                  />
                </button>

                <div
                  className={cn(
                    "mega-nav-popover",
                    isMegaOpen
                      ? "opacity-100 translate-y-0 pointer-events-auto"
                      : "opacity-0 -translate-y-1 pointer-events-none",
                  )}
                  role="menu"
                >
                  {/* Active tab indicator */}
                  <div className="mega-nav-indicator" />
                  {/* Columns */}
                  <div className="flex">
                    {aboutItem.megaNav.map((column, i) => (
                      <div
                        key={column.heading}
                        className={cn(
                          "mega-nav-column",
                          i > 0 && "mega-nav-column-attached",
                        )}
                      >
                        <p className="mega-nav-heading">{column.heading}</p>
                        <div className="flex flex-col">
                          {column.links.map((link, j) => (
                            <div key={`${link.href}-${link.label}`}>
                              {j > 0 && <div className="mega-nav-separator" />}
                              <Link
                                href={link.href}
                                role="menuitem"
                                onClick={() => setIsMegaOpen(false)}
                                className="mega-nav-link"
                              >
                                <span className="mega-nav-link-label">
                                  {link.label}
                                </span>
                                <span className="mega-nav-link-description">
                                  {link.description}
                                </span>
                              </Link>
                            </div>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {directLinks.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="text-nav text-text-secondary transition-colors hover:text-text-primary"
              >
                {item.label}
              </Link>
            ))}
          </nav>
        </div>

        <div className="flex items-center gap-4">
          <CortexButton
            asChild
            className="hidden sm:inline-flex font-bold plausible-event-name=CTA+Click plausible-event-location=header plausible-event-label=stake"
          >
            <Link href={ctaButton.href}>{ctaButton.label}</Link>
          </CortexButton>
          <button
            className="text-text-primary lg:hidden"
            onPointerEnter={preloadMobileNav}
            onFocus={preloadMobileNav}
            onPointerDown={preloadMobileNav}
            onClick={() => {
              setMobileNavMounted(true);
              setIsMobileOpen(true);
            }}
            aria-label="Open menu"
          >
            <TextAlignJustify className="size-7 -mt-1" />
          </button>
        </div>
      </div>

      {mobileNavMounted && (
        <MobileNav open={isMobileOpen} onClose={() => setIsMobileOpen(false)} />
      )}
    </header>
  );
}
