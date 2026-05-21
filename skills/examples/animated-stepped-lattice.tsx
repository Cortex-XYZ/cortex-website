"use client";

import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";

gsap.registerPlugin(useGSAP);

const SVG_NS = "http://www.w3.org/2000/svg";
const VIEWBOX = 600;
const PADDING = 40;
const CANVAS = VIEWBOX - 2 * PADDING; // 520
const STROKE_COLOR = "currentColor";
const STROKE_WIDTH = 2.5;
const DOT_SIZE = 6;
const DOT_MODULO = 4;
const MIN_COLUMNS = 8;
const MAX_COLUMNS = 15;
const COLUMN_SPAN = MAX_COLUMNS - MIN_COLUMNS;
const CYCLE_DURATION = 5;

// Pre-allocate enough paths and dots for MAX_COLUMNS
const MAX_PATHS = 2 * MAX_COLUMNS + 1;
const MAX_DOTS = (MAX_COLUMNS + 1) * (MAX_COLUMNS + 1);

type DotPosition = {
  x: number;
  y: number;
};

type LatticeFrame = {
  pathData: string[];
  dotPositions: DotPosition[];
};

function buildLatticeFrame(columns: number): LatticeFrame {
  const stepSize = CANVAS / columns;
  const pathData: string[] = [];
  const dotPositions: DotPosition[] = [];

  for (let d = -columns; d <= columns; d += 2) {
    const numSteps = columns - Math.abs(d);
    if (numSteps <= 0) continue;

    let startX: number;
    let startY: number;

    if (d >= 0) {
      startX = PADDING + d * stepSize;
      startY = PADDING;
    } else {
      startX = PADDING;
      startY = PADDING + Math.abs(d) * stepSize;
    }

    let pathD = `M ${startX} ${startY}`;
    let x = startX;
    let y = startY;

    for (let i = 0; i < numSteps; i++) {
      x += stepSize;
      pathD += ` H ${x}`;
      y += stepSize;
      pathD += ` V ${y}`;
    }

    pathData.push(pathD);
  }

  for (let col = 0; col <= columns; col++) {
    for (let row = 0; row <= columns; row++) {
      if ((col + row) % DOT_MODULO !== 0) continue;

      dotPositions.push({
        x: PADDING + col * stepSize,
        y: PADDING + row * stepSize,
      });
    }
  }

  return { pathData, dotPositions };
}

/**
 * Stepped Lattice starter-kit example.
 *
 * Contract:
 * - Generate the stairstep diagonal weave algorithmically.
 * - Animate column count 15→8→15 via continuous sine wave.
 * - Pre-allocate path and rect DOM pools at MAX_COLUMNS capacity.
 * - Reposition and show/hide per frame via drawLattice().
 * - Do not update React state during the animation loop.
 *
 * See `skills/examples/stepped-lattice.md` for the parameter contract.
 */
export function AnimatedSteppedLatticeExample() {
  const layerRef = useRef<SVGGElement>(null);

  useGSAP(
    () => {
      const layer = layerRef.current;
      if (!layer) return;

      const reduceMotion = window.matchMedia(
        "(prefers-reduced-motion: reduce)",
      ).matches;

      // Pre-allocate path pool
      const paths: SVGPathElement[] = [];
      for (let i = 0; i < MAX_PATHS; i++) {
        const path = document.createElementNS(SVG_NS, "path");
        path.setAttribute("fill", "none");
        path.setAttribute("stroke", STROKE_COLOR);
        path.setAttribute("stroke-width", String(STROKE_WIDTH));
        path.setAttribute("d", "M 0 0");
        path.style.display = "none";
        layer.appendChild(path);
        paths.push(path);
      }

      // Pre-allocate dot pool
      const dots: SVGRectElement[] = [];
      for (let i = 0; i < MAX_DOTS; i++) {
        const rect = document.createElementNS(SVG_NS, "rect");
        rect.setAttribute("width", String(DOT_SIZE));
        rect.setAttribute("height", String(DOT_SIZE));
        rect.setAttribute("fill", STROKE_COLOR);
        rect.style.display = "none";
        layer.appendChild(rect);
        dots.push(rect);
      }

      // Cache geometry for each integer column count once.
      const frameCache = new Map<number, LatticeFrame>();
      for (let columns = MIN_COLUMNS; columns <= MAX_COLUMNS; columns++) {
        frameCache.set(columns, buildLatticeFrame(columns));
      }

      let lastColumns = -1;

      function drawLattice(columns: number) {
        if (columns === lastColumns) return;
        const frame = frameCache.get(columns);
        if (!frame) return;

        const pathCount = frame.pathData.length;
        for (let i = 0; i < pathCount; i++) {
          const path = paths[i];
          path.setAttribute("d", frame.pathData[i]);
          path.style.display = "";
        }

        // Hide unused paths
        for (let i = pathCount; i < MAX_PATHS; i++) {
          paths[i].style.display = "none";
        }

        const dotCount = frame.dotPositions.length;
        for (let i = 0; i < dotCount; i++) {
          const rect = dots[i];
          const dot = frame.dotPositions[i];
          rect.setAttribute("x", String(dot.x - DOT_SIZE / 2));
          rect.setAttribute("y", String(dot.y - DOT_SIZE / 2));
          rect.style.display = "";
        }

        // Hide unused dots
        for (let i = dotCount; i < MAX_DOTS; i++) {
          dots[i].style.display = "none";
        }

        lastColumns = columns;
      }

      // Draw initial state at peak columns so the first motion contracts.
      drawLattice(MAX_COLUMNS);

      if (reduceMotion) {
        return () => {
          paths.forEach((p) => p.remove());
          dots.forEach((r) => r.remove());
        };
      }

      // Continuous sine wave animation — no seams, no repeat delay
      const proxy = { phase: 0 };
      const timeline = gsap.timeline({ repeat: -1 });

      timeline.to(proxy, {
        phase: 1,
        duration: CYCLE_DURATION,
        ease: "none",
        onUpdate() {
          const t = (Math.sin(proxy.phase * Math.PI * 2 + Math.PI / 2) + 1) / 2;
          const columns = Math.round(MIN_COLUMNS + t * COLUMN_SPAN);
          drawLattice(columns);
        },
      });

      return () => {
        timeline.kill();
        paths.forEach((p) => p.remove());
        dots.forEach((r) => r.remove());
      };
    },
    { dependencies: [], scope: layerRef },
  );

  return (
    <div className="relative aspect-square w-full overflow-hidden rounded-lg border border-border-default bg-bg-inverse p-6 text-bg-canvas">
      <svg
        aria-hidden="true"
        className="block h-full w-full"
        viewBox={`0 0 ${VIEWBOX} ${VIEWBOX}`}
        xmlns="http://www.w3.org/2000/svg"
      >
        <g ref={layerRef} />
      </svg>
    </div>
  );
}
