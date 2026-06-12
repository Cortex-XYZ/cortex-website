"use client";

import { useRef, type ReactNode } from "react";

import {
  HISTORY_MILESTONE_STAGGER,
  HISTORY_REVEAL_START,
  HISTORY_SUMMARY_DELAY,
} from "@/components/sections/history/history-scroll";
import { useReducedMotion } from "@/hooks/use-reduced-motion";
import { gsap, ScrollTrigger, useGSAP } from "@/lib/gsap-setup";
import {
  createBatchReveal,
  SCROLL_REVEAL_FROM,
  SCROLL_REVEAL_TO,
  SCROLL_TRIGGER_MARKERS,
  setScrollRevealRestingState,
} from "@/lib/scroll-trigger";

const HISTORY_MILESTONE_SELECTOR = "[data-history-milestone]";
const HISTORY_SUMMARY_SELECTOR = "[data-history-summary]";

type HistoryScrollMotionProps = {
  children: ReactNode;
};

export function HistoryScrollMotion({ children }: HistoryScrollMotionProps) {
  const scopeRef = useRef<HTMLDivElement>(null);
  const reducedMotion = useReducedMotion();

  useGSAP(
    () => {
      if (reducedMotion) {
        setScrollRevealRestingState(
          `${HISTORY_MILESTONE_SELECTOR}, ${HISTORY_SUMMARY_SELECTOR}`,
        );
        return;
      }

      createBatchReveal({
        selector: HISTORY_MILESTONE_SELECTOR,
        start: HISTORY_REVEAL_START,
        stagger: HISTORY_MILESTONE_STAGGER,
      });

      const scope = scopeRef.current;
      const summary = scope?.querySelector<HTMLElement>(HISTORY_SUMMARY_SELECTOR);
      const milestones = scope?.querySelectorAll<HTMLElement>(
        HISTORY_MILESTONE_SELECTOR,
      );
      const lastMilestone = milestones?.[milestones.length - 1];

      if (!summary || !lastMilestone) return;

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
