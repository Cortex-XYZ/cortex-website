"use client";

import { usePathname } from "next/navigation";
import { useOnMount } from "@/hooks/use-on-mount";
import { ScrollTrigger } from "@/lib/gsap-setup";
import {
  cancelRouteHashNavigation,
  enableHashScrollSpy,
  prepareForRouteHashNavigation,
  scrollToHashFromLocation,
} from "@/lib/hash-navigation";

const HASH_SCROLL_REFRESH_TIMEOUT_MS = 1500;
const DESKTOP_MQL = "(min-width: 1280px)";
const REDUCED_MOTION_MQL = "(prefers-reduced-motion: reduce)";
const MISSION_SECTION_ID = "mission";
const MISSION_STACK_SCROLL_ID = "mission-stack-scroll";
const HASH_TARGETS_BEFORE_MISSION = new Set(["hero", MISSION_SECTION_ID]);

function getHashIdFromLocation(): string {
  try {
    return decodeURIComponent(window.location.hash.slice(1));
  } catch {
    return window.location.hash.slice(1);
  }
}

function shouldWaitForMissionStackBeforeHashScroll(): boolean {
  if (!window.matchMedia(DESKTOP_MQL).matches) return false;
  if (window.matchMedia(REDUCED_MOTION_MQL).matches) return false;
  if (ScrollTrigger.getById(MISSION_STACK_SCROLL_ID)) return false;

  const hashId = getHashIdFromLocation();
  if (!hashId || HASH_TARGETS_BEFORE_MISSION.has(hashId)) return false;

  const target = document.getElementById(hashId);
  const mission = document.getElementById(MISSION_SECTION_ID);
  if (!target || !mission) return true;

  return Boolean(
    mission.compareDocumentPosition(target) & Node.DOCUMENT_POSITION_FOLLOWING,
  );
}

function runHashScrollAfterScrollTriggersReady(): () => void {
  if (!window.location.hash) return () => {};

  prepareForRouteHashNavigation();

  let cancelled = false;
  let outerRafId: number | null = null;
  let innerRafId: number | null = null;
  let scrollRafId: number | null = null;
  let timeoutId: number | undefined;
  let settled = false;

  const teardown = () => {
    ScrollTrigger.removeEventListener("refresh", handleRefresh);
    if (outerRafId !== null) {
      window.cancelAnimationFrame(outerRafId);
      outerRafId = null;
    }
    if (innerRafId !== null) {
      window.cancelAnimationFrame(innerRafId);
      innerRafId = null;
    }
    if (scrollRafId !== null) {
      window.cancelAnimationFrame(scrollRafId);
      scrollRafId = null;
    }
    if (timeoutId !== undefined) {
      window.clearTimeout(timeoutId);
      timeoutId = undefined;
    }
  };

  function settle() {
    if (settled) return;
    settled = true;
    teardown();

    scrollRafId = window.requestAnimationFrame(() => {
      scrollRafId = null;
      if (cancelled) return;
      scrollToHashFromLocation();
    });
  }

  function handleRefresh() {
    if (shouldWaitForMissionStackBeforeHashScroll()) return;
    settle();
  }

  ScrollTrigger.addEventListener("refresh", handleRefresh);
  timeoutId = window.setTimeout(settle, HASH_SCROLL_REFRESH_TIMEOUT_MS);

  outerRafId = window.requestAnimationFrame(() => {
    outerRafId = null;
    innerRafId = window.requestAnimationFrame(() => {
      innerRafId = null;
      if (cancelled) return;
      ScrollTrigger.refresh(true);
    });
  });

  return () => {
    cancelled = true;
    teardown();
    cancelRouteHashNavigation();
  };
}

function HashScrollOnNavigate() {
  useOnMount(() => {
    return runHashScrollAfterScrollTriggersReady();
  });

  return null;
}

export function HashScrollSync() {
  const pathname = usePathname();

  useOnMount(() => {
    const onHashChange = () => scrollToHashFromLocation();
    window.addEventListener("hashchange", onHashChange);
    const disableHashScrollSpy = enableHashScrollSpy();

    return () => {
      window.removeEventListener("hashchange", onHashChange);
      disableHashScrollSpy();
    };
  });

  return <HashScrollOnNavigate key={pathname} />;
}
