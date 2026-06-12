"use client";

import { useCallback, useState } from "react";

type UseInViewResult = {
  /** Attach to the element whose viewport visibility should be tracked. */
  ref: (node: Element | null) => (() => void) | undefined;
  inView: boolean;
};

/**
 * Tracks whether an element intersects the viewport, for pausing ambient
 * animation loops (WebGL frameloop, infinite GSAP timelines) off-screen.
 *
 * `inView` flips to true as soon as 1px is visible and back to false only
 * when the element is fully out of view, so loops never pause mid-frame
 * while partially visible. Defaults to true (SSR and pre-observe), so
 * content is never blocked from animating before the observer fires.
 */
export function useInView(): UseInViewResult {
  const [inView, setInView] = useState(true);

  const ref = useCallback((node: Element | null) => {
    if (!node || typeof IntersectionObserver === "undefined") return;

    const observer = new IntersectionObserver(([entry]) => {
      setInView(entry.isIntersecting);
    });
    observer.observe(node);

    return () => {
      observer.disconnect();
      setInView(true);
    };
  }, []);

  return { ref, inView };
}
