"use client";

import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { cn } from "@/lib/utils";

gsap.registerPlugin(useGSAP);

const SVG_NS = "http://www.w3.org/2000/svg";
const CENTER = 300;
const INNER_RADIUS = 30;
const OUTER_RADIUS = 270;
const STROKE_COLOR = "currentColor";
const STROKE_WIDTH = 1.5;
const MIN_RAYS = 8;
const MAX_RAYS = 84;
const STATIC_RAYS = 40; // midpoint per the reduced-motion contract
const CYCLE_DURATION = 3;

type Props = {
  active: boolean;
  className?: string;
};

export function RadiatingSegments({ active, className }: Props) {
  const rayLayerRef = useRef<SVGGElement>(null);

  useGSAP(
    () => {
      const rayLayer = rayLayerRef.current;
      if (!rayLayer) return;

      const lines: SVGLineElement[] = [];
      for (let i = 0; i < MAX_RAYS; i++) {
        const line = document.createElementNS(SVG_NS, "line");
        line.setAttribute("stroke", STROKE_COLOR);
        line.setAttribute("stroke-width", String(STROKE_WIDTH));
        line.setAttribute("stroke-linecap", "round");
        rayLayer.appendChild(line);
        lines.push(line);
      }

      function drawRays(count: number) {
        const step = (Math.PI * 2) / count;
        for (let i = 0; i < MAX_RAYS; i++) {
          const line = lines[i];
          if (i < count) {
            const angle = step * i;
            const cosA = Math.cos(angle);
            const sinA = Math.sin(angle);
            line.setAttribute("x1", String(CENTER + cosA * INNER_RADIUS));
            line.setAttribute("y1", String(CENTER + sinA * INNER_RADIUS));
            line.setAttribute("x2", String(CENTER + cosA * OUTER_RADIUS));
            line.setAttribute("y2", String(CENTER + sinA * OUTER_RADIUS));
            line.style.display = "";
          } else {
            line.style.display = "none";
          }
        }
      }

      const reduceMotion = window.matchMedia(
        "(prefers-reduced-motion: reduce)",
      ).matches;

      // Populated static frame: midpoint count (~40), evenly spaced.
      drawRays(STATIC_RAYS);

      if (!active || reduceMotion) {
        return () => {
          lines.forEach((line) => line.remove());
        };
      }

      const proxy = { phase: 0 };
      const timeline = gsap.timeline({ repeat: -1 });

      timeline.to(proxy, {
        phase: 1,
        duration: CYCLE_DURATION,
        ease: "none",
        onUpdate() {
          const t = (Math.sin(proxy.phase * Math.PI * 2 - Math.PI / 2) + 1) / 2;
          let count = Math.round(MIN_RAYS + t * (MAX_RAYS - MIN_RAYS));
          if (count % 2 !== 0) count++;
          drawRays(count);
        },
      });

      return () => {
        timeline.kill();
        lines.forEach((line) => line.remove());
      };
    },
    { dependencies: [active], revertOnUpdate: true, scope: rayLayerRef },
  );

  return (
    <div
      className={cn(
        "relative aspect-square w-35 sm:w-50 md:w-65 lg:w-81.5",
        className,
      )}
    >
      <svg
        aria-hidden="true"
        className="block h-full w-full"
        viewBox="0 0 600 600"
        xmlns="http://www.w3.org/2000/svg"
      >
        <g ref={rayLayerRef} />
      </svg>
    </div>
  );
}
