"use client";

import { useRef, type ReactNode } from "react";
import { useOnMount } from "@/hooks/use-on-mount";
import {
  enableSiteHeaderScrollMotion,
  syncSiteHeaderScrollState,
} from "@/lib/layout/site-header-scroll";

type SiteHeaderShellProps = {
  children: ReactNode;
};

export function SiteHeaderShell({ children }: SiteHeaderShellProps) {
  const headerRef = useRef<HTMLElement>(null);

  // useOnMount (useEffect) is intentional: SITE_HEADER_SCROLL_BOOTSTRAP_SCRIPT sets
  // html[data-header-scrolled] before first paint, so useLayoutEffect is not required.
  useOnMount(() => {
    const header = headerRef.current;
    if (!header) return;

    let isScrolled = false;

    const syncScrollState = () => {
      const next = syncSiteHeaderScrollState();
      if (next === isScrolled) return;
      isScrolled = next;
    };

    syncScrollState();
    enableSiteHeaderScrollMotion(header);

    window.addEventListener("scroll", syncScrollState, { passive: true });
    window.addEventListener("pageshow", syncScrollState);
    return () => {
      window.removeEventListener("scroll", syncScrollState);
      window.removeEventListener("pageshow", syncScrollState);
    };
  });

  return (
    <header ref={headerRef} className="site-header-shell">
      {children}
    </header>
  );
}
