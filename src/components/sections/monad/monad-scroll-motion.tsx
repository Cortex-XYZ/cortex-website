"use client";

import { useRef, type ReactNode } from "react";

import {
  setMonadEnterRestingState,
  setupMonadEnter,
} from "@/components/sections/monad/monad-enter";
import { useReducedMotion } from "@/hooks/use-reduced-motion";
import { deferGsapSetup } from "@/lib/gsap-defer-setup";
import { useGSAP } from "@/lib/gsap-setup";

const MONAD_SECTION_SELECTOR = "[data-monad-section]";

type MonadScrollMotionProps = {
  children: ReactNode;
};

export function MonadScrollMotion({ children }: MonadScrollMotionProps) {
  const scopeRef = useRef<HTMLDivElement>(null);
  const reducedMotion = useReducedMotion();

  useGSAP(
    () => {
      const scope = scopeRef.current;
      if (!scope) return;

      const section = scope.closest<HTMLElement>(MONAD_SECTION_SELECTOR);
      if (!section) return;

      if (reducedMotion) {
        setMonadEnterRestingState(section);
        return;
      }

      return deferGsapSetup(() => setupMonadEnter(section));
    },
    { scope: scopeRef, dependencies: [reducedMotion] },
  );

  return (
    <div ref={scopeRef} className="contents">
      {children}
    </div>
  );
}
