"use client";

import { useRef } from "react";
import { useReducedMotion } from "@/hooks/use-reduced-motion";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { cn } from "@/lib/utils";

gsap.registerPlugin(useGSAP);

const SVG_NS = "http://www.w3.org/2000/svg";
const CENTER = 300;
const VIEWBOX = 600;
const GRID_SIZE = 22;
const GRID_START = 40;
const GRID_END = 560;
const GRID_STEP = (GRID_END - GRID_START) / (GRID_SIZE - 1);
const CORNER_DIST = Math.hypot(CENTER - GRID_START, CENTER - GRID_START);
const BASE_DOT = 4;
const RADIUS_EXPONENT = 1.4;
const PEAK_RADIUS = 12.5;

type PulseDot = {
  circle: SVGCircleElement;
  baseRadius: number;
  distance: number;
};

type Props = {
  active: boolean;
  className?: string;
};

// The parent Mission surface owns the "only one loop at a time" contract by
// flipping `active` on exactly one instance. This component is layout-agnostic:
// it just runs the wave while active and shows a populated static frame
// (baseline radii) when inactive or when reduced motion is requested.
export function PulseField({ active, className }: Props) {
  const reduceMotion = useReducedMotion();
  const dotLayerRef = useRef<SVGGElement>(null);

  useGSAP(
    () => {
      const dotLayer = dotLayerRef.current;
      if (!dotLayer) return;

      const dots: PulseDot[] = [];
      for (let row = 0; row < GRID_SIZE; row++) {
        const cy = GRID_START + row * GRID_STEP;
        for (let col = 0; col < GRID_SIZE; col++) {
          const cx = GRID_START + col * GRID_STEP;
          const distance = Math.hypot(cx - CENTER, cy - CENTER);
          const baseRadius =
            BASE_DOT *
            Math.pow(1 - Math.pow(distance / CORNER_DIST, RADIUS_EXPONENT), 1);
          if (baseRadius <= 0) continue;

          const circle = document.createElementNS(SVG_NS, "circle");
          circle.setAttribute("cx", String(cx));
          circle.setAttribute("cy", String(cy));
          circle.setAttribute("r", String(baseRadius));
          circle.setAttribute("fill", "currentColor");
          dotLayer.appendChild(circle);

          dots.push({ circle, baseRadius, distance });
        }
      }
      if (!active || reduceMotion) {
        return () => {
          dots.forEach(({ circle }) => circle.remove());
        };
      }

      const maxBaseRadius = Math.max(
        ...dots.map(({ baseRadius }) => baseRadius),
      );
      const maxDistance = Math.max(...dots.map(({ distance }) => distance));
      const radiusScale = PEAK_RADIUS / maxBaseRadius;
      const timeline = gsap.timeline({ repeat: -1, repeatDelay: 0.15 });

      dots.forEach(({ circle, distance, baseRadius }) => {
        const distanceRatio = distance / maxDistance;
        const start = distanceRatio * 1.15;
        const peakRadius = Math.min(baseRadius * radiusScale, PEAK_RADIUS);

        timeline.to(
          circle,
          {
            attr: { r: peakRadius },
            duration: 0.52,
            ease: "sine.out",
            opacity: 1,
          },
          start,
        );

        timeline.to(
          circle,
          {
            attr: { r: baseRadius },
            duration: 0.95,
            ease: "sine.inOut",
            opacity: 0.74 + (1 - distanceRatio) * 0.26,
          },
          start + 0.48,
        );
      });

      return () => {
        timeline.kill();
        dots.forEach(({ circle }) => circle.remove());
      };
    },
    { dependencies: [active, reduceMotion], revertOnUpdate: true, scope: dotLayerRef },
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
        viewBox={`0 0 ${VIEWBOX} ${VIEWBOX}`}
        xmlns="http://www.w3.org/2000/svg"
      >
        <g ref={dotLayerRef} />
      </svg>
    </div>
  );
}
