"use client";

import { useRef, type ReactNode } from "react";

import {
  HISTORY_LINE_DRAW_EASE,
  HISTORY_LINE_DRAW_START,
  HISTORY_LINE_SEGMENT_DRAW_DURATION,
  HISTORY_MILESTONE_STAGGER,
  HISTORY_REVEAL_START,
  HISTORY_SUMMARY_DELAY,
} from "@/components/sections/history/history-scroll";
import { BELOW_DESKTOP_MQL, DESKTOP_MQL } from "@/hooks/use-is-desktop";
import { useReducedMotion } from "@/hooks/use-reduced-motion";
import { gsap, ScrollTrigger, useGSAP } from "@/lib/gsap-setup";
import {
  createBatchReveal,
  createScrollTriggerConfig,
  playIfAlreadyInView,
  SCROLL_REVEAL_FROM,
  SCROLL_REVEAL_TO,
  SCROLL_TRIGGER_MARKERS,
  setScrollRevealRestingState,
} from "@/lib/scroll-trigger";

const HISTORY_MILESTONE_SELECTOR = "[data-history-milestone]";
const HISTORY_SUMMARY_SELECTOR = "[data-history-summary]";
const HISTORY_LINE_SELECTOR = "[data-history-line]";
const HISTORY_STEM_SELECTOR = "[data-history-stem]";
const HISTORY_DESKTOP_LINE_DRAW_ID_PREFIX = "history-line-draw";
const HISTORY_MOBILE_STEM_DRAW_ID_PREFIX = "history-stem-draw";

type HistoryScrollMotionProps = {
  children: ReactNode;
};

function setHistoryLineRestingState(scope: HTMLElement): void {
  const line = scope.querySelector<HTMLElement>(HISTORY_LINE_SELECTOR);
  const stems = scope.querySelectorAll<HTMLElement>(HISTORY_STEM_SELECTOR);

  if (line) {
    gsap.set(line, {
      scaleY: 1,
      transformOrigin: "top center",
      clearProps: "transform,transformOrigin",
    });
  }

  if (stems.length > 0) {
    gsap.set(stems, {
      scaleY: 1,
      transformOrigin: "top center",
      clearProps: "transform,transformOrigin",
    });
  }
}

function setupDesktopLineDraw(scope: HTMLElement): () => void {
  const line = scope.querySelector<HTMLElement>(HISTORY_LINE_SELECTOR);
  const milestones = Array.from(
    scope.querySelectorAll<HTMLElement>(HISTORY_MILESTONE_SELECTOR),
  );

  if (!line || milestones.length === 0) return () => {};

  gsap.set(line, {
    scaleY: 0,
    transformOrigin: "top center",
  });

  const drawLineToMilestone = (index: number) => {
    gsap.to(line, {
      scaleY: (index + 1) / milestones.length,
      duration: HISTORY_LINE_SEGMENT_DRAW_DURATION,
      ease: HISTORY_LINE_DRAW_EASE,
      overwrite: "auto",
    });
  };

  const triggers = milestones.map((milestone, index) => {
    const trigger = ScrollTrigger.create({
      id: `${HISTORY_DESKTOP_LINE_DRAW_ID_PREFIX}-${index + 1}`,
      trigger: milestone,
      start: HISTORY_LINE_DRAW_START,
      once: true,
      fastScrollEnd: true,
      invalidateOnRefresh: true,
      markers: SCROLL_TRIGGER_MARKERS,
      onEnter: () => {
        drawLineToMilestone(index);
      },
    });

    if (trigger.progress > 0) {
      drawLineToMilestone(index);
    }

    return trigger;
  });

  return () => {
    for (const trigger of triggers) {
      trigger.kill();
    }
    gsap.killTweensOf(line);
    gsap.set(line, { clearProps: "transform,transformOrigin" });
  };
}

function setupMobileStemDraw(scope: HTMLElement): () => void {
  const stems = Array.from(
    scope.querySelectorAll<HTMLElement>(HISTORY_STEM_SELECTOR),
  );

  if (stems.length === 0) return () => {};

  gsap.set(stems, {
    scaleY: 0,
    transformOrigin: "top center",
  });

  const timelines = stems.map((stem, index) => {
    const trigger = stem.closest<HTMLElement>(HISTORY_MILESTONE_SELECTOR) ?? stem;
    const drawTimeline = gsap.timeline({
      scrollTrigger: createScrollTriggerConfig(
        trigger,
        HISTORY_LINE_DRAW_START,
        `${HISTORY_MOBILE_STEM_DRAW_ID_PREFIX}-${index + 1}`,
      ),
    });

    drawTimeline.to(stem, {
      scaleY: 1,
      duration: HISTORY_LINE_SEGMENT_DRAW_DURATION,
      ease: HISTORY_LINE_DRAW_EASE,
    });
    playIfAlreadyInView(drawTimeline);

    return drawTimeline;
  });

  return () => {
    for (const timeline of timelines) {
      timeline.scrollTrigger?.kill();
      timeline.kill();
    }
    stems.forEach((stem) => {
      gsap.set(stem, { clearProps: "transform,transformOrigin" });
    });
  };
}

export function HistoryScrollMotion({ children }: HistoryScrollMotionProps) {
  const scopeRef = useRef<HTMLDivElement>(null);
  const reducedMotion = useReducedMotion();

  useGSAP(
    () => {
      const scope = scopeRef.current;
      if (!scope) return;

      if (reducedMotion) {
        setScrollRevealRestingState(
          `${HISTORY_MILESTONE_SELECTOR}, ${HISTORY_SUMMARY_SELECTOR}`,
        );
        setHistoryLineRestingState(scope);
        return;
      }

      createBatchReveal({
        selector: HISTORY_MILESTONE_SELECTOR,
        start: HISTORY_REVEAL_START,
        stagger: HISTORY_MILESTONE_STAGGER,
      });

      const summary = scope?.querySelector<HTMLElement>(HISTORY_SUMMARY_SELECTOR);
      const milestones = scope?.querySelectorAll<HTMLElement>(
        HISTORY_MILESTONE_SELECTOR,
      );
      const lastMilestone = milestones?.[milestones.length - 1];
      const matchMedia = gsap.matchMedia();

      matchMedia.add(DESKTOP_MQL, () => setupDesktopLineDraw(scope));
      matchMedia.add(BELOW_DESKTOP_MQL, () => setupMobileStemDraw(scope));

      if (!summary || !lastMilestone) {
        return () => {
          matchMedia.revert();
        };
      }

      gsap.set(summary, SCROLL_REVEAL_FROM);

      const summaryTrigger = ScrollTrigger.create({
        id: "history-summary",
        trigger: lastMilestone,
        start: HISTORY_REVEAL_START,
        once: true,
        fastScrollEnd: true,
        markers: SCROLL_TRIGGER_MARKERS,
        onEnter: () => {
          gsap.to(summary, {
            ...SCROLL_REVEAL_TO,
            delay: HISTORY_SUMMARY_DELAY,
            overwrite: true,
          });
        },
      });

      return () => {
        summaryTrigger.kill();
        matchMedia.revert();
      };
    },
    { scope: scopeRef, dependencies: [reducedMotion] },
  );

  return (
    <div ref={scopeRef} className="contents">
      {children}
    </div>
  );
}
