import { footerContent } from "@/lib/content/footer";

const HASH_FOCUS_TARGET_IDS: Partial<Record<string, string>> = {
  [footerContent.id]: footerContent.emailInputId,
};

let pendingHashFocusId: string | null = null;

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

function getScrollBehavior(): ScrollBehavior {
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches
    ? "auto"
    : "smooth";
}

const FOCUS_AFTER_SCROLL_MAX_MS = 1500;

let activeScrollObserver: IntersectionObserver | null = null;
let activeScrollFocusTimer: number | undefined;

function cancelPendingScrollFocus(): void {
  activeScrollObserver?.disconnect();
  activeScrollObserver = null;
  if (activeScrollFocusTimer !== undefined) {
    window.clearTimeout(activeScrollFocusTimer);
    activeScrollFocusTimer = undefined;
  }
}

function applyHashTargetFocus(id: string): void {
  const focusId = HASH_FOCUS_TARGET_IDS[id];
  if (!focusId) return;

  const focusTarget = document.getElementById(focusId);
  if (focusTarget instanceof HTMLInputElement) {
    focusTarget.focus({ preventScroll: true });
  }
}

function focusHashTargetWhenVisible(id: string): void {
  const focusId = HASH_FOCUS_TARGET_IDS[id];
  if (!focusId) return;

  const focusTarget = document.getElementById(focusId);
  if (!(focusTarget instanceof HTMLInputElement)) return;

  cancelPendingScrollFocus();

  if (getScrollBehavior() === "auto") {
    applyHashTargetFocus(id);
    return;
  }

  let settled = false;

  const settle = () => {
    if (settled) return;
    settled = true;
    cancelPendingScrollFocus();
    applyHashTargetFocus(id);
  };

  if (typeof IntersectionObserver === "undefined") {
    activeScrollFocusTimer = window.setTimeout(() => {
      cancelPendingScrollFocus();
      applyHashTargetFocus(id);
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

  activeScrollObserver = observer;
  observer.observe(focusTarget);
  activeScrollFocusTimer = window.setTimeout(settle, FOCUS_AFTER_SCROLL_MAX_MS);
}

/** Radix sheets restore focus to the trigger on close; refocus hash targets instead. */
export function reconcileHashFocusOnDialogClose(): boolean {
  const id = pendingHashFocusId;
  if (!id) return false;

  pendingHashFocusId = null;
  applyHashTargetFocus(id);
  return true;
}

export function scrollToHashId(hash: string): void {
  const id = decodeURIComponent(hash);
  const target = document.getElementById(id);
  target?.scrollIntoView({ behavior: getScrollBehavior(), block: "start" });

  if (HASH_FOCUS_TARGET_IDS[id]) {
    pendingHashFocusId = id;
  }

  const hasOpenDialog = document.querySelector(
    '[data-slot="sheet-content"][data-state="open"]',
  );

  if (!hasOpenDialog) {
    focusHashTargetWhenVisible(id);
    pendingHashFocusId = null;
  }
}

export function navigateToHash(hash: string): void {
  const nextHash = `#${hash}`;

  if (window.location.hash !== nextHash) {
    history.pushState(null, "", nextHash);
  }

  scrollToHashId(hash);
}

export function scrollToHashFromLocation(): void {
  const hash = window.location.hash.slice(1);
  if (hash) scrollToHashId(hash);
}
