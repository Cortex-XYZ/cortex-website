"use client";

import { useSyncExternalStore } from "react";

const REDUCED_MOTION_MQL = "(prefers-reduced-motion: reduce)";

let reducedMotionMediaQuery: MediaQueryList | null = null;

function getReducedMotionMediaQuery(): MediaQueryList {
  if (reducedMotionMediaQuery === null) {
    reducedMotionMediaQuery = window.matchMedia(REDUCED_MOTION_MQL);
  }
  return reducedMotionMediaQuery;
}

function subscribeReducedMotion(onChange: () => void): () => void {
  const mql = getReducedMotionMediaQuery();
  mql.addEventListener("change", onChange);
  return () => mql.removeEventListener("change", onChange);
}

function getReducedMotionSnapshot(): boolean {
  return getReducedMotionMediaQuery().matches;
}

function getReducedMotionServerSnapshot(): boolean {
  return false;
}

/** SSR-safe, subscribed read of `prefers-reduced-motion: reduce`. */
export function useReducedMotion() {
  return useSyncExternalStore(
    subscribeReducedMotion,
    getReducedMotionSnapshot,
    getReducedMotionServerSnapshot,
  );
}