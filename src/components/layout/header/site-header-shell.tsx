"use client";

import { useEffect, useRef, type ReactNode } from "react";

type SiteHeaderShellProps = {
  children: ReactNode;
};

export function SiteHeaderShell({ children }: SiteHeaderShellProps) {
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

  return (
    <header ref={headerRef} data-scrolled="false" className="site-header-shell">
      {children}
    </header>
  );
}
