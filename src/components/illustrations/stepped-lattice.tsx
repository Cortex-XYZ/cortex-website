"use client";

import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { cn } from "@/lib/utils";

gsap.registerPlugin(useGSAP);

const SVG_NS = "http://www.w3.org/2000/svg";
const VIEWBOX = 600;
const PADDING = 40;
const CANVAS = VIEWBOX - 2 * PADDING;
const STROKE_COLOR = "currentColor";
const STROKE_WIDTH = 2.5;
const DOT_SIZE = 6;
const DOT_MODULO = 4;
const MIN_COLUMNS = 8;
const MAX_COLUMNS = 15;
const STATIC_COLUMNS = 11; // midpoint per the reduced-motion contract
const COLUMN_SPAN = MAX_COLUMNS - MIN_COLUMNS;
const CYCLE_DURATION = 5;

const MAX_PATHS = 2 * MAX_COLUMNS + 1;
const MAX_DOTS = (MAX_COLUMNS + 1) * (MAX_COLUMNS + 1);

type DotPosition = { x: number; y: number };
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

type Props = {
  active: boolean;
  className?: string;
};

export function SteppedLattice({ active, className }: Props) {
  const layerRef = useRef<SVGGElement>(null);

  useGSAP(
    () => {
      const layer = layerRef.current;
      if (!layer) return;

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
        for (let i = dotCount; i < MAX_DOTS; i++) {
          dots[i].style.display = "none";
        }

        lastColumns = columns;
      }

      // Populated static frame: midpoint column count.
      drawLattice(STATIC_COLUMNS);

      const reduceMotion = window.matchMedia(
        "(prefers-reduced-motion: reduce)",
      ).matches;

      if (!active || reduceMotion) {
        return () => {
          paths.forEach((p) => p.remove());
          dots.forEach((r) => r.remove());
        };
      }

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
    { dependencies: [active], revertOnUpdate: true, scope: layerRef },
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
        <g ref={layerRef} />
      </svg>
    </div>
  );
}
