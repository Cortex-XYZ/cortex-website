"use client";

import { useSyncExternalStore } from "react";

/** Tailwind `xl` — Mission/Monad desktop layout, event cursor preview, etc. */
export const DESKTOP_MQL = "(min-width: 1280px)";

/** Tailwind `lg` — hero live WebGL gate; static globe below this width. */
export const LARGE_SCREEN_MQL = "(min-width: 1024px)";

const mediaQueryCache = new Map<string, MediaQueryList>();

function getMediaQuery(mql: string): MediaQueryList {
  let query = mediaQueryCache.get(mql);
  if (!query) {
    query = window.matchMedia(mql);
    mediaQueryCache.set(mql, query);
  }
  return query;
}

function subscribeMediaQuery(mql: string, onChange: () => void): () => void {
  const query = getMediaQuery(mql);
  query.addEventListener("change", onChange);
  return () => query.removeEventListener("change", onChange);
}

function getMediaQuerySnapshot(mql: string): boolean {
  return getMediaQuery(mql).matches;
}

function getMediaQueryServerSnapshot(): boolean {
  return false;
}

export function useMediaQuery(mql: string) {
  return useSyncExternalStore(
    (onChange) => subscribeMediaQuery(mql, onChange),
    () => getMediaQuerySnapshot(mql),
    getMediaQueryServerSnapshot,
  );
}

export function useIsDesktop() {
  return useMediaQuery(DESKTOP_MQL);
}

export function useIsLargeScreen() {
  return useMediaQuery(LARGE_SCREEN_MQL);
}
