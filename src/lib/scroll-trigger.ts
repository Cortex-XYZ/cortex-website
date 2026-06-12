import { gsap, ScrollTrigger } from "@/lib/gsap-setup";
import { MOTION_DURATION, MOTION_EASE, MOTION_START } from "@/lib/motion/tokens";

let scheduledRefreshRafId: number | null = null;

/**
 * Queue a single ScrollTrigger.refresh() after layout-affecting setup.
 * Multiple section enter setups during hydration coalesce into one recalculation.
 */
export function scheduleScrollTriggerRefresh(): void {
  if (scheduledRefreshRafId !== null) {
    cancelAnimationFrame(scheduledRefreshRafId);
  }
  scheduledRefreshRafId = requestAnimationFrame(() => {
    scheduledRefreshRafId = null;
    ScrollTrigger.refresh();
  });
}

/** ScrollTrigger start/end markers (set true only while tuning triggers). */
export const SCROLL_TRIGGER_MARKERS = false;

export const SCROLL_REVEAL_FROM: gsap.TweenVars = {
  autoAlpha: 0,
  y: 24,
};

export const SCROLL_REVEAL_TO: gsap.TweenVars = {
  autoAlpha: 1,
  y: 0,
  duration: MOTION_DURATION.entrance,
  ease: MOTION_EASE.reveal,
};

export type BatchRevealOptions = {
  /** Selector scoped by the parent `useGSAP({ scope })` context. */
  selector: string;
  start?: string;
  once?: boolean;
  stagger?: number;
  from?: gsap.TweenVars;
  to?: gsap.TweenVars;
};

/**
 * ScrollTrigger.batch reveal for elements that share the same entrance motion.
 * Call inside `useGSAP()` with a scoped container ref.
 */
export function createBatchReveal({
  selector,
  start = MOTION_START.batch,
  once = true,
  stagger = 0.1,
  from = SCROLL_REVEAL_FROM,
  to = SCROLL_REVEAL_TO,
}: BatchRevealOptions): ScrollTrigger[] {
  gsap.set(selector, from);

  return ScrollTrigger.batch(selector, {
    start,
    once,
    fastScrollEnd: true,
    onEnter: (elements) => {
      gsap.to(elements, { ...to, stagger, overwrite: true });
    },
  });
}

export type ScrollRevealOptions = {
  trigger: Element | string;
  start?: string;
  once?: boolean;
  from?: gsap.TweenVars;
  to?: gsap.TweenVars;
  refreshPriority?: number;
  id?: string;
};

/** Single-element scroll reveal. Call inside `useGSAP()` with a scoped container ref. */
export function createScrollReveal({
  trigger,
  start = MOTION_START.batch,
  once = true,
  from = SCROLL_REVEAL_FROM,
  to = SCROLL_REVEAL_TO,
  refreshPriority,
  id,
}: ScrollRevealOptions): ScrollTrigger {
  gsap.set(trigger, from);

  return ScrollTrigger.create({
    trigger,
    start,
    once,
    id,
    refreshPriority,
    fastScrollEnd: true,
    markers: SCROLL_TRIGGER_MARKERS,
    onEnter: () => {
      gsap.to(trigger, { ...to, overwrite: true });
    },
  });
}

/** Skip motion and leave targets at their resting visible state. */
export function setScrollRevealRestingState(
  targets: Element | Element[] | string,
): void {
  gsap.set(targets, { autoAlpha: 1, y: 0, clearProps: "transform" });
}

/** Scroll position (px) for aligning an element below a fixed header. */
export function getScrollTargetY(element: Element, offsetY = 0): number {
  const top = element.getBoundingClientRect().top + window.scrollY;
  return Math.max(0, top - offsetY);
}

/** Shared ScrollTrigger vars for timeline-driven section entrances. */
export function createScrollTriggerConfig(
  trigger: HTMLElement,
  start: string,
  id: string,
): ScrollTrigger.Vars {
  return {
    id,
    trigger,
    start,
    once: true,
    fastScrollEnd: true,
    invalidateOnRefresh: true,
    markers: SCROLL_TRIGGER_MARKERS,
    toggleActions: "play none none none",
  };
}

/**
 * Play a scroll-linked timeline immediately when its trigger is already active
 * (e.g. section mounted while scrolled into view).
 */
export function playIfAlreadyInView(timeline: gsap.core.Timeline): void {
  const scrollTrigger = timeline.scrollTrigger;
  if (!scrollTrigger) return;

  if (scrollTrigger.progress === 1) {
    timeline.progress(1);
    return;
  }

  if (scrollTrigger.isActive && timeline.progress() < 1) {
    timeline.play(0);
  }
}

