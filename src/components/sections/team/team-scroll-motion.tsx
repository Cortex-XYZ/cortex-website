"use client";

import { useRef, type ReactNode } from "react";

import {
  setTeamEnterRestingState,
  setupTeamDesktopEnter,
  setupTeamMobileEnter,
} from "@/components/sections/team/team-enter";
import {
  setupTeamDesktopLineDraw,
  setupTeamMobileLineDraw,
} from "@/components/sections/team/team-line-draw";
import { BELOW_DESKTOP_MQL, DESKTOP_MQL } from "@/hooks/use-is-desktop";
import { useReducedMotion } from "@/hooks/use-reduced-motion";
import { deferGsapSetup } from "@/lib/gsap-defer-setup";
import { gsap, useGSAP } from "@/lib/gsap-setup";

const TEAM_SECTION_SELECTOR = "[data-team-section]";

type TeamScrollMotionProps = {
  children: ReactNode;
};

export function TeamScrollMotion({ children }: TeamScrollMotionProps) {
  const scopeRef = useRef<HTMLDivElement>(null);
  const reducedMotion = useReducedMotion();

  useGSAP(
    () => {
      const scope = scopeRef.current;
      if (!scope) return;

      const section = scope.closest<HTMLElement>(TEAM_SECTION_SELECTOR);
      if (!section) return;

      if (reducedMotion) {
        setTeamEnterRestingState(section);
        return;
      }

      return deferGsapSetup(() => {
        const matchMedia = gsap.matchMedia();

        matchMedia.add(DESKTOP_MQL, () => {
          const cleanupLineDraw = setupTeamDesktopLineDraw(section);
          const cleanupEnter = setupTeamDesktopEnter(section);

          return () => {
            cleanupEnter();
            cleanupLineDraw();
          };
        });

        matchMedia.add(BELOW_DESKTOP_MQL, () => {
          const cleanupLineDraw = setupTeamMobileLineDraw(section);
          const cleanupEnter = setupTeamMobileEnter(section);

          return () => {
            cleanupEnter();
            cleanupLineDraw();
          };
        });

        return () => {
          matchMedia.revert();
        };
      });
    },
    { scope: scopeRef, dependencies: [reducedMotion] },
  );

  return (
    <div ref={scopeRef} className="contents">
      {children}
    </div>
  );
}
