"use client";

import { useRef, type ReactNode } from "react";

import {
  setEventsEnterRestingState,
  setupEventsEnter,
} from "@/components/sections/events/events-enter";
import { useReducedMotion } from "@/hooks/use-reduced-motion";
import { deferGsapSetup } from "@/lib/gsap-defer-setup";
import { useGSAP } from "@/lib/gsap-setup";

const EVENTS_SECTION_SELECTOR = "[data-events-section]";

type EventsScrollMotionProps = {
  children: ReactNode;
};

export function EventsScrollMotion({ children }: EventsScrollMotionProps) {
  const scopeRef = useRef<HTMLDivElement>(null);
  const reducedMotion = useReducedMotion();

  useGSAP(
    () => {
      const scope = scopeRef.current;
      if (!scope) return;

      const section = scope.closest<HTMLElement>(EVENTS_SECTION_SELECTOR);
      if (!section) return;

      if (reducedMotion) {
        setEventsEnterRestingState(section);
        return;
      }

      return deferGsapSetup(() => setupEventsEnter(section));
    },
    { scope: scopeRef, dependencies: [reducedMotion] },
  );

  return (
    <div ref={scopeRef} className="contents">
      {children}
    </div>
  );
}
