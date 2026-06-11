"use client";

import { useRef, type ReactNode } from "react";

import {
  setServicesEnterRestingState,
  setupServicesEnter,
} from "@/components/sections/services/services-enter";
import { useReducedMotion } from "@/hooks/use-reduced-motion";
import { deferGsapSetup } from "@/lib/gsap-defer-setup";
import { useGSAP } from "@/lib/gsap-setup";

const SERVICES_SECTION_SELECTOR = "[data-services-section]";

type ServicesScrollMotionProps = {
  children: ReactNode;
};

export function ServicesScrollMotion({ children }: ServicesScrollMotionProps) {
  const scopeRef = useRef<HTMLDivElement>(null);
  const reducedMotion = useReducedMotion();

  useGSAP(
    () => {
      const scope = scopeRef.current;
      if (!scope) return;

      const section = scope.closest<HTMLElement>(SERVICES_SECTION_SELECTOR);
      if (!section) return;

      if (reducedMotion) {
        setServicesEnterRestingState(section);
        return;
      }

      return deferGsapSetup(() => setupServicesEnter(section));
    },
    { scope: scopeRef, dependencies: [reducedMotion] },
  );

  return (
    <div ref={scopeRef} className="contents">
      {children}
    </div>
  );
}
