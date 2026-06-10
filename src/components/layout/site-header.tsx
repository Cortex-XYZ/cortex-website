import Link from "next/link";
import { HashLink } from "@/components/hash-link";
import { CortexButton } from "@/components/cortex-button";
import { HeaderMegaNav } from "@/components/layout/header/header-mega-nav";
import { HeaderUpcomingEvent } from "@/components/layout/header/header-upcoming-event";
import { SiteHeaderMobileMenu } from "@/components/layout/header/site-header-mobile-menu";
import { SiteHeaderShell } from "@/components/layout/header/site-header-shell";
import { CortexMark } from "@/components/logos/cortex-mark";
import { CortexWordmark } from "@/components/logos/cortex-wordmark";
import { aboutNavItem, ctaButton, directNavLinks } from "@/lib/content/nav";

export function SiteHeader() {
  return (
    <SiteHeaderShell>
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
            {aboutNavItem?.megaNav && (
              <HeaderMegaNav
                label={aboutNavItem.label}
                columns={aboutNavItem.megaNav}
              />
            )}

            {directNavLinks.map((item) => (
              <HashLink
                key={item.href}
                href={item.href}
                className="text-nav text-text-secondary transition-colors hover:text-text-primary"
              >
                {item.label}
              </HashLink>
            ))}
          </nav>
        </div>

        <div className="flex items-center gap-4">
          <HeaderUpcomingEvent className="hidden sm:inline-flex" />
          <CortexButton asChild className="hidden font-bold sm:inline-flex">
            <Link href={ctaButton.href}>{ctaButton.label}</Link>
          </CortexButton>
          <SiteHeaderMobileMenu />
        </div>
      </div>
    </SiteHeaderShell>
  );
}
