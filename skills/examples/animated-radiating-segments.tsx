"use client";

import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";

gsap.registerPlugin(useGSAP);

const SVG_NS = "http://www.w3.org/2000/svg";
const CENTER = 300;
const INNER_RADIUS = 30;
const OUTER_RADIUS = 270;
const STROKE_COLOR = "currentColor";
const STROKE_WIDTH = 1.5;
const MIN_RAYS = 8;
const MAX_RAYS = 84;
const CYCLE_DURATION = 3;

/**
 * Radiating Segments starter-kit example.
 *
 * Contract:
 * - Create MAX_RAYS line elements once as a DOM pool.
 * - On each GSAP update, compute the current ray count (sine easing
 *   between MIN_RAYS and MAX_RAYS) and reposition all visible lines
 *   to be evenly distributed around the circle — matching the Pattern
 *   Studio slider behavior where rays redistribute, not just appear.
 * - Ray count is forced even so the horizontal axis (0° and 180°)
 *   is always present.
 * - Do not create or destroy DOM during the animation loop.
 * - Do not update React state during the animation loop.
 *
 * See `skills/examples/radiating-segments.md` for the parameter contract.
 */
export function AnimatedRadiatingSegmentsExample() {
  const rayLayerRef = useRef<SVGGElement>(null);

  useGSAP(
    () => {
      const rayLayer = rayLayerRef.current;
      if (!rayLayer) return;

      const reduceMotion = window.matchMedia(
        "(prefers-reduced-motion: reduce)",
      ).matches;

      // Create a pool of line elements — reused every frame
      const lines: SVGLineElement[] = [];
      for (let i = 0; i < MAX_RAYS; i++) {
        const line = document.createElementNS(SVG_NS, "line");
        line.setAttribute("stroke", STROKE_COLOR);
        line.setAttribute("stroke-width", String(STROKE_WIDTH));
        line.setAttribute("stroke-linecap", "round");
        rayLayer.appendChild(line);
        lines.push(line);
      }

      // Position lines for a given even count, hide the rest
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

      // Set initial state
      drawRays(MIN_RAYS);

      if (reduceMotion) {
        return () => {
          lines.forEach((line) => line.remove());
        };
      }

      // Single continuous sine wave — no seams, no repeat delay.
      // Linear 0→1 drives a sine curve that naturally breathes.
      const proxy = { phase: 0 };

      const timeline = gsap.timeline({ repeat: -1 });

      timeline.to(proxy, {
        phase: 1,
        duration: CYCLE_DURATION,
        ease: "none",
        onUpdate() {
          // Sine wave: 0 → 1 → 0 with smooth curvature at both ends
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
    { dependencies: [], scope: rayLayerRef },
  );

  return (
    <div className="relative aspect-square w-full overflow-hidden rounded-lg border border-border-default bg-bg-inverse p-6 text-bg-canvas">
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
