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
const STROKE_WIDTH = 1;
const COLUMNS = 6;
const COL_WIDTH = CANVAS / COLUMNS;
const HALF_COL = COL_WIDTH / 2;
const ROWS = COLUMNS + 1;
const MIN_NODE_R = 1;
const PEAK_NODE_R = 8;
const STATIC_NODE_R = 5; // visible populated static (never empty)
const MIN_TWINKLE_R = 2.4;
const TWINKLE_IN_MIN = 0.28;
const TWINKLE_IN_MAX = 0.72;
const TWINKLE_HOLD_MIN = 0.12;
const TWINKLE_HOLD_MAX = 0.52;
const TWINKLE_OUT_MIN = 0.36;
const TWINKLE_OUT_MAX = 0.92;
const TWINKLE_GAP_MIN = 0.28;
const TWINKLE_GAP_MAX = 2;
const INITIAL_SCATTER = 1.6;
const RHYTHM_SEED = 37;
const EASE_IN = "sine.out";
const EASE_OUT = "sine.inOut";

type NodePoint = { cx: number; cy: number };
type MeshNode = NodePoint & { circle: SVGCircleElement };

function createSeededRandom(seed: number) {
  let value = seed | 0;
  return function seededRandom() {
    value = (value + 0x6d2b79f5) | 0;
    let t = value;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function randomBetween(random: () => number, min: number, max: number) {
  return min + (max - min) * random();
}

type Props = {
  active: boolean;
  className?: string;
};

export function NodeMesh({ active, className }: Props) {
  const layerRef = useRef<SVGGElement>(null);

  useGSAP(
    () => {
      const layerElement = layerRef.current;
      if (!layerElement) return;

      const random = createSeededRandom(RHYTHM_SEED);
      const grid: NodePoint[][] = [];
      const nodes: MeshNode[] = [];

      for (let row = 0; row < ROWS; row++) {
        const cy = PADDING + row * COL_WIDTH;
        const isOdd = row % 2 === 1;
        const startX = isOdd ? PADDING + HALF_COL : PADDING;
        const colCount = isOdd ? COLUMNS - 1 : COLUMNS;
        const rowNodes: NodePoint[] = [];

        for (let col = 0; col <= colCount; col++) {
          const cx = startX + col * COL_WIDTH;
          rowNodes.push({ cx, cy });

          const circle = document.createElementNS(SVG_NS, "circle");
          circle.setAttribute("cx", String(cx));
          circle.setAttribute("cy", String(cy));
          circle.setAttribute("r", String(STATIC_NODE_R));
          circle.setAttribute("fill", STROKE_COLOR);
          layerElement.appendChild(circle);
          nodes.push({ cx, cy, circle });
        }

        grid.push(rowNodes);
      }

      function addLine(layer: SVGGElement, a: NodePoint, b: NodePoint) {
        const line = document.createElementNS(SVG_NS, "line");
        line.setAttribute("x1", String(a.cx));
        line.setAttribute("y1", String(a.cy));
        line.setAttribute("x2", String(b.cx));
        line.setAttribute("y2", String(b.cy));
        line.setAttribute("stroke", STROKE_COLOR);
        line.setAttribute("stroke-width", String(STROKE_WIDTH));
        layer.insertBefore(line, layer.firstChild);
      }

      for (let row = 0; row < ROWS; row++) {
        const rowNodes = grid[row];
        for (let col = 0; col < rowNodes.length - 1; col++) {
          addLine(layerElement, rowNodes[col], rowNodes[col + 1]);
        }
      }

      for (let row = 0; row < ROWS - 1; row++) {
        const currentRow = grid[row];
        const nextRow = grid[row + 1];
        const isCurrentEven = row % 2 === 0;

        if (isCurrentEven) {
          for (let col = 0; col < nextRow.length; col++) {
            const below = nextRow[col];
            if (currentRow[col]) addLine(layerElement, currentRow[col], below);
            if (currentRow[col + 1]) {
              addLine(layerElement, currentRow[col + 1], below);
            }
          }
        } else {
          for (let col = 0; col < currentRow.length; col++) {
            const above = currentRow[col];
            if (nextRow[col]) addLine(layerElement, above, nextRow[col]);
            if (nextRow[col + 1]) {
              addLine(layerElement, above, nextRow[col + 1]);
            }
          }
        }
      }

      const reduceMotion = window.matchMedia(
        "(prefers-reduced-motion: reduce)",
      ).matches;

      if (!active || reduceMotion) {
        return () => {
          while (layerElement.firstChild) {
            layerElement.removeChild(layerElement.firstChild);
          }
        };
      }

      // Reset to baseline before twinkling so each loop start is consistent.
      nodes.forEach(({ circle }) => {
        circle.setAttribute("r", String(MIN_NODE_R));
      });

      const nodeTimelines: gsap.core.Timeline[] = [];

      nodes.forEach(({ circle }) => {
        const timeline = gsap.timeline({
          repeat: -1,
          repeatRefresh: true,
          delay: randomBetween(random, 0, INITIAL_SCATTER),
        });

        timeline.to(circle, {
          attr: { r: () => randomBetween(random, MIN_TWINKLE_R, PEAK_NODE_R) },
          duration: () => randomBetween(random, TWINKLE_IN_MIN, TWINKLE_IN_MAX),
          ease: EASE_IN,
        });

        timeline.to(circle, {
          attr: { r: MIN_NODE_R },
          delay: () =>
            randomBetween(random, TWINKLE_HOLD_MIN, TWINKLE_HOLD_MAX),
          duration: () =>
            randomBetween(random, TWINKLE_OUT_MIN, TWINKLE_OUT_MAX),
          ease: EASE_OUT,
        });

        timeline.to(
          {},
          {
            duration: () =>
              randomBetween(random, TWINKLE_GAP_MIN, TWINKLE_GAP_MAX),
            ease: "none",
          },
        );

        nodeTimelines.push(timeline);
      });

      return () => {
        nodeTimelines.forEach((timeline) => timeline.kill());
        while (layerElement.firstChild) {
          layerElement.removeChild(layerElement.firstChild);
        }
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
