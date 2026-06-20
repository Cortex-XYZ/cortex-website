import { eventsSection } from "@/lib/content/events";
import { footerContent } from "@/lib/content/footer";
import { heroSection } from "@/lib/content/hero";
import { historySection } from "@/lib/content/history";
import { missionSection } from "@/lib/content/mission";
import { monadSection } from "@/lib/content/monad";
import { servicesSection } from "@/lib/content/services";
import { teamSection } from "@/lib/content/team";
import { gsap, ScrollTrigger } from "@/lib/gsap-setup";
import { getScrollTargetY } from "@/lib/scroll-trigger";

/** Homepage section anchors in scroll order (includes Monad topic sub-anchors). */
export const HASH_SPY_IDS = [
  heroSection.id,
  missionSection.id,
  historySection.id,
  teamSection.id,
  monadSection.id,
  ...monadSection.cards
    .map((card) => card.anchorId)
    .filter((anchorId) => anchorId !== monadSection.id),
  servicesSection.id,
  eventsSection.id,
  footerContent.id,
] as const;

const HASH_FOCUS_TARGET_IDS: Partial<Record<string, string>> = {
  [footerContent.id]: footerContent.emailInputId,
};

export type ParsedHashHref = {
  pathname: string;
  hash: string;
};

export function parseHashHref(href: string): ParsedHashHref | null {
  const hashIndex = href.indexOf("#");
  if (hashIndex === -1) return null;

  const hash = href.slice(hashIndex + 1);
  if (!hash) return null;

  return {
    pathname: href.slice(0, hashIndex) || "/",
    hash,
  };
}

function prefersReducedMotion(): boolean {
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

/** Header height for scroll offset (matches scroll-margin-top on sections). */
function getHeaderOffset(): number {
  const raw = getComputedStyle(document.documentElement)
    .getPropertyValue("--site-header-height")
    .trim();
  if (raw.endsWith("rem")) {
    return (
      parseFloat(raw) *
      parseFloat(getComputedStyle(document.documentElement).fontSize)
    );
  }
  if (raw.endsWith("px")) return parseFloat(raw);
  return 90;
}

function getLocationHashId(): string {
  try {
    return decodeURIComponent(window.location.hash.slice(1));
  } catch {
    return window.location.hash.slice(1);
  }
}

function isElementFocusedWithin(element: Element): boolean {
  const activeElement = document.activeElement;
  return activeElement instanceof Element && element.contains(activeElement);
}

function isNearPageBottom(): boolean {
  const maxScroll = ScrollTrigger.maxScroll(window);
  return Number.isFinite(maxScroll) && maxScroll - window.scrollY <= 4;
}

function isFooterActive(footer: Element, currentHashId: string): boolean {
  const rect = footer.getBoundingClientRect();
  const headerOffset = getHeaderOffset();
  const footerVisibleBelowHeader =
    rect.bottom > headerOffset && rect.top < window.innerHeight;

  if (!footerVisibleBelowHeader) {
    return false;
  }

  if (currentHashId === footerContent.id || isElementFocusedWithin(footer)) {
    return true;
  }

  if (isNearPageBottom()) {
    return true;
  }

  const readingLine = Math.max(headerOffset + 1, window.innerHeight * 0.7);
  return rect.top <= readingLine;
}

const FOCUS_AFTER_SCROLL_MAX_MS = 1500;

/** Hash targets inside client-only islands (e.g. Monad topic cards) may not be mounted yet on a cold deep link; wait briefly for them. */
const HASH_TARGET_MOUNT_MAX_WAIT_MS = 3000;

/** Smooth scroll only for short hops; long jumps (e.g. hero → #events) jump instantly. */
const HASH_SMOOTH_SCROLL_MAX_DISTANCE_PX = () => window.innerHeight * 1.25;
const HASH_SPY_PROBE_TOLERANCE_PX = 24;
const SERVICES_HASH_HOLD_RATIO = 0.25;

function shouldPreferServicesHash(headerOffset: number): boolean {
  const target = document.getElementById(servicesSection.id);
  if (!target) return false;

  const rect = target.getBoundingClientRect();
  const topHoldLine = Math.max(
    headerOffset + HASH_SPY_PROBE_TOLERANCE_PX,
    window.innerHeight * SERVICES_HASH_HOLD_RATIO,
  );

  return rect.top <= topHoldLine && rect.bottom > headerOffset;
}

class HashNavigationRuntime {
  private pendingHashFocusId: string | null = null;
  private hashSpyPaused = false;
  private hashSpyRafId: number | null = null;
  private activeScrollObserver: IntersectionObserver | null = null;
  private activeScrollFocusTimer: number | undefined;
  private cancelTargetMountWait: (() => void) | null = null;

  private cancelPendingScrollFocus(): void {
    this.activeScrollObserver?.disconnect();
    this.activeScrollObserver = null;
    if (this.activeScrollFocusTimer !== undefined) {
      window.clearTimeout(this.activeScrollFocusTimer);
      this.activeScrollFocusTimer = undefined;
    }
  }

  private applyHashTargetFocus(id: string): void {
    const focusId = HASH_FOCUS_TARGET_IDS[id];
    if (!focusId) return;

    const focusTarget = document.getElementById(focusId);
    if (focusTarget instanceof HTMLInputElement) {
      focusTarget.focus({ preventScroll: true });
    }
  }

  private focusHashTargetWhenVisible(id: string): void {
    const focusId = HASH_FOCUS_TARGET_IDS[id];
    if (!focusId) return;

    const focusTarget = document.getElementById(focusId);
    if (!(focusTarget instanceof HTMLInputElement)) return;

    this.cancelPendingScrollFocus();

    if (prefersReducedMotion()) {
      this.applyHashTargetFocus(id);
      return;
    }

    let settled = false;

    const settle = () => {
      if (settled) return;
      settled = true;
      this.cancelPendingScrollFocus();
      this.applyHashTargetFocus(id);
    };

    if (typeof IntersectionObserver === "undefined") {
      this.activeScrollFocusTimer = window.setTimeout(() => {
        this.cancelPendingScrollFocus();
        this.applyHashTargetFocus(id);
      }, FOCUS_AFTER_SCROLL_MAX_MS);
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        if (
          entries.some(
            (entry) => entry.isIntersecting && entry.intersectionRatio >= 0.25,
          )
        ) {
          settle();
        }
      },
      { threshold: [0, 0.25] },
    );

    this.activeScrollObserver = observer;
    observer.observe(focusTarget);
    this.activeScrollFocusTimer = window.setTimeout(
      settle,
      FOCUS_AFTER_SCROLL_MAX_MS,
    );
  }

  /** Radix sheets restore focus to the trigger on close; refocus hash targets instead. */
  reconcileHashFocusOnDialogClose(): boolean {
    const id = this.pendingHashFocusId;
    if (!id) return false;

    this.pendingHashFocusId = null;
    this.applyHashTargetFocus(id);
    return true;
  }

  prepareForRouteHashNavigation(): void {
    this.cancelTargetMountWait?.();
    this.cancelPendingScrollFocus();
    this.hashSpyPaused = true;
  }

  cancelRouteHashNavigation(): void {
    this.cancelTargetMountWait?.();
    this.cancelPendingScrollFocus();
    gsap.killTweensOf(window);
    this.hashSpyPaused = false;
  }

  private resumeHashSpy(): void {
    this.hashSpyPaused = false;
    this.syncHashFromScroll();
  }

  private scrollWindowTo(targetScrollY: number, smooth: boolean): void {
    gsap.killTweensOf(window);

    if (!smooth) {
      window.scrollTo({ top: targetScrollY, behavior: "auto" });
      ScrollTrigger.update();
      this.resumeHashSpy();
      return;
    }

    let settled = false;
    const settleScroll = () => {
      if (settled) return;
      settled = true;
      ScrollTrigger.update();
      this.resumeHashSpy();
    };

    gsap.to(window, {
      scrollTo: {
        y: targetScrollY,
        autoKill: true,
        onAutoKill: settleScroll,
      },
      duration: 0.8,
      ease: "power2.inOut",
      onComplete: settleScroll,
    });
  }

  private resolveActiveHashId(): string {
    const currentHashId = getLocationHashId();
    const headerOffset = getHeaderOffset();
    const footer = document.getElementById(footerContent.id);

    if (footer && isFooterActive(footer, currentHashId)) {
      return footerContent.id;
    }

    if (shouldPreferServicesHash(headerOffset)) {
      return servicesSection.id;
    }

    const probe = headerOffset + HASH_SPY_PROBE_TOLERANCE_PX;
    let activeId: string = HASH_SPY_IDS[0];

    for (const id of HASH_SPY_IDS) {
      const target = document.getElementById(id);
      if (!target) continue;

      const rect = target.getBoundingClientRect();
      if (rect.top <= probe && rect.bottom > headerOffset) {
        activeId = id;
        continue;
      }
      if (rect.top > probe) break;
    }

    return activeId;
  }

  private getHashSpyUrl(activeId: string): string {
    const path = window.location.pathname || "/";

    if (activeId === heroSection.id) {
      return path;
    }

    return `${path}#${activeId}`;
  }

  syncHashFromScroll(): void {
    if (this.hashSpyPaused) return;
    if ((window.location.pathname || "/") !== "/") return;

    const activeId = this.resolveActiveHashId();
    const nextUrl = this.getHashSpyUrl(activeId);
    const currentUrl = `${window.location.pathname}${window.location.hash}`;

    if (nextUrl === currentUrl) return;

    history.replaceState(null, "", nextUrl);
  }

  private scheduleSync(): void {
    if (this.hashSpyPaused) return;
    if (this.hashSpyRafId !== null) return;

    this.hashSpyRafId = window.requestAnimationFrame(() => {
      this.hashSpyRafId = null;
      this.syncHashFromScroll();
    });
  }

  private teardownHashScrollSpy(): void {
    if (this.hashSpyRafId !== null) {
      window.cancelAnimationFrame(this.hashSpyRafId);
      this.hashSpyRafId = null;
    }
    this.hashSpyPaused = false;
    this.pendingHashFocusId = null;
    this.cancelPendingScrollFocus();
    this.cancelTargetMountWait?.();
  }

  enableHashScrollSpy(): () => void {
    const scheduleSync = () => {
      this.scheduleSync();
    };

    const onScroll = () => {
      scheduleSync();
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("focusin", scheduleSync);
    window.addEventListener("pageshow", scheduleSync);

    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("focusin", scheduleSync);
      window.removeEventListener("pageshow", scheduleSync);
      this.teardownHashScrollSpy();
    };
  }

  /** Deep-link targets in client-only islands mount after hydration; retry once they appear. */
  private scrollWhenTargetMounts(id: string): void {
    if (typeof MutationObserver === "undefined") return;

    const timer = window.setTimeout(() => {
      cleanup();
      this.resumeHashSpy();
    }, HASH_TARGET_MOUNT_MAX_WAIT_MS);

    const observer = new MutationObserver(() => {
      if (!document.getElementById(id)) return;
      cleanup();
      this.scrollToHashId(id);
    });

    const cleanup = () => {
      window.clearTimeout(timer);
      observer.disconnect();
      this.cancelTargetMountWait = null;
    };

    this.cancelTargetMountWait = cleanup;
    observer.observe(document.body, { childList: true, subtree: true });
  }

  scrollToHashId(hash: string): void {
    const id = decodeURIComponent(hash);

    this.cancelTargetMountWait?.();

    const target = document.getElementById(id);
    if (!target) {
      this.scrollWhenTargetMounts(id);
      return;
    }

    this.hashSpyPaused = true;

    const headerOffset = getHeaderOffset();
    const targetScrollY = getScrollTargetY(target, headerOffset);
    const scrollDistance = Math.abs(targetScrollY - window.scrollY);
    const smooth =
      !prefersReducedMotion() &&
      scrollDistance <= HASH_SMOOTH_SCROLL_MAX_DISTANCE_PX();

    this.scrollWindowTo(targetScrollY, smooth);

    if (HASH_FOCUS_TARGET_IDS[id]) {
      this.pendingHashFocusId = id;
    }

    const hasOpenDialog = document.querySelector(
      '[data-slot="sheet-content"][data-state="open"]',
    );

    if (!hasOpenDialog) {
      this.focusHashTargetWhenVisible(id);
      this.pendingHashFocusId = null;
    }
  }

  navigateToHash(hash: string): void {
    const nextHash = `#${hash}`;

    if (window.location.hash !== nextHash) {
      history.pushState(null, "", nextHash);
    }

    this.scrollToHashId(hash);
  }

  navigateToTop(): void {
    const path = window.location.pathname || "/";

    this.cancelTargetMountWait?.();
    this.hashSpyPaused = true;

    if (window.location.hash) {
      history.replaceState(null, "", path);
    }

    const scrollDistance = Math.abs(window.scrollY);
    const smooth =
      !prefersReducedMotion() &&
      scrollDistance <= HASH_SMOOTH_SCROLL_MAX_DISTANCE_PX();

    this.scrollWindowTo(0, smooth);
  }

  scrollToHashFromLocation(): void {
    const hash = window.location.hash.slice(1);
    if (hash) this.scrollToHashId(hash);
  }
}

const hashNavigationRuntime = new HashNavigationRuntime();

export function reconcileHashFocusOnDialogClose(): boolean {
  return hashNavigationRuntime.reconcileHashFocusOnDialogClose();
}

export function syncHashFromScroll(): void {
  hashNavigationRuntime.syncHashFromScroll();
}

export function enableHashScrollSpy(): () => void {
  return hashNavigationRuntime.enableHashScrollSpy();
}

export function scrollToHashId(hash: string): void {
  hashNavigationRuntime.scrollToHashId(hash);
}

export function navigateToHash(hash: string): void {
  hashNavigationRuntime.navigateToHash(hash);
}

export function prepareForRouteHashNavigation(): void {
  hashNavigationRuntime.prepareForRouteHashNavigation();
}

export function cancelRouteHashNavigation(): void {
  hashNavigationRuntime.cancelRouteHashNavigation();
}

export function navigateToTop(): void {
  hashNavigationRuntime.navigateToTop();
}

export function navigateToHome(): void {
  hashNavigationRuntime.navigateToTop();
}

export function scrollToHashFromLocation(): void {
  hashNavigationRuntime.scrollToHashFromLocation();
}
