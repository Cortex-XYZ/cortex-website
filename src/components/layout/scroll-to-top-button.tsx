"use client";

import { ChevronUp } from "lucide-react";
import { useCallback, useState } from "react";
import { useOnMount } from "@/hooks/use-on-mount";
import { footerContent } from "@/lib/content/footer";
import { navigateToTop } from "@/lib/hash-navigation";
import { SITE_HEADER_SCROLL_THRESHOLD } from "@/lib/layout/site-header-scroll";
import { cn } from "@/lib/utils";

/** Reserve the fixed button footprint so it hides before overlapping footer chrome. */
function getFooterOverlapRootMargin(): string {
  const rem =
    parseFloat(getComputedStyle(document.documentElement).fontSize) || 16;
  const reservePx = Math.round(6.5 * rem);
  return `0px 0px -${reservePx}px 0px`;
}

export function ScrollToTopButton() {
  const [visible, setVisible] = useState(false);

  useOnMount(() => {
    let footerOverlaps = false;

    const syncVisibility = () => {
      const scrolledPastHeader = window.scrollY > SITE_HEADER_SCROLL_THRESHOLD;
      setVisible(scrolledPastHeader && !footerOverlaps);
    };

    const footerBottom = document
      .getElementById(footerContent.id)
      ?.querySelector<HTMLElement>(".site-footer-bottom");

    let observer: IntersectionObserver | undefined;

    if (footerBottom) {
      observer = new IntersectionObserver(
        (entries) => {
          footerOverlaps = entries.some((entry) => entry.isIntersecting);
          syncVisibility();
        },
        { rootMargin: getFooterOverlapRootMargin(), threshold: 0 },
      );
      observer.observe(footerBottom);
    }

    syncVisibility();
    window.addEventListener("scroll", syncVisibility, { passive: true });
    window.addEventListener("pageshow", syncVisibility);

    return () => {
      observer?.disconnect();
      window.removeEventListener("scroll", syncVisibility);
      window.removeEventListener("pageshow", syncVisibility);
    };
  });

  const handleClick = useCallback(() => {
    navigateToTop();
  }, []);

  return (
    <button
      type="button"
      onClick={handleClick}
      aria-label="Scroll to top"
      aria-hidden={!visible}
      tabIndex={visible ? 0 : -1}
      className={cn(
        "scroll-to-top-button",
        visible && "scroll-to-top-button--visible",
      )}
    >
      <ChevronUp
        aria-hidden
        className="scroll-to-top-button-icon"
        strokeWidth={2.25}
      />
    </button>
  );
}
