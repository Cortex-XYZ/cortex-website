"use client";

import { useRef, type ReactNode, type RefObject } from "react";

import { useIsDesktop } from "@/hooks/use-is-desktop";
import { useOnMount } from "@/hooks/use-on-mount";
import { useReducedMotion } from "@/hooks/use-reduced-motion";

type HeroTitleMotionProps = {
  children: ReactNode;
};

/**
 * Mounted only when the hero title should animate (desktop, motion allowed),
 * so GSAP SplitText is downloaded on demand and never ships to mobile/tablet
 * or reduced-motion visitors. Unmounting reverts the split via cleanup.
 */
function HeroTitleEnterEffect({
  scopeRef,
}: {
  scopeRef: RefObject<HTMLDivElement | null>;
}) {
  useOnMount(() => {
    let cancelled = false;
    let cleanup: (() => void) | undefined;

    void import("@/components/sections/hero/hero-title-enter").then(
      ({ setupHeroTitleEnter }) => {
        const scope = scopeRef.current;
        if (cancelled || !scope) return;
        cleanup = setupHeroTitleEnter(scope);
      },
    );

    return () => {
      cancelled = true;
      cleanup?.();
    };
  });

  return null;
}

export function HeroTitleMotion({ children }: HeroTitleMotionProps) {
  const scopeRef = useRef<HTMLDivElement>(null);
  const isDesktop = useIsDesktop();
  const reducedMotion = useReducedMotion();

  return (
    <div ref={scopeRef} className="contents">
      {isDesktop && !reducedMotion ? (
        <HeroTitleEnterEffect scopeRef={scopeRef} />
      ) : null}
      {children}
    </div>
  );
}
