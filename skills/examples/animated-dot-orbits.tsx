"use client";

import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";

gsap.registerPlugin(useGSAP);

const SVG_NS = "http://www.w3.org/2000/svg";
const CENTER = 300;
const DOT_RADIUS = 6;
const RING_COUNT = 6;
const MIN_DOTS = 1;
const SEED = 7;
const BASE_MAX_DOTS = 0;
const PEAK_MAX_DOTS = 12;
const DOT_REVEAL_DURATION = 0.18;
const DOT_REVEAL_STAGGER = 0.07;
const DOT_HIDE_DURATION = 0.22;
const RING_RADII = Array.from({ length: RING_COUNT }, (_, index) => {
  const radiusMin = 50;
  const radiusMax = 270;

  return radiusMin + (radiusMax - radiusMin) * (index / (RING_COUNT - 1));
});

type DotPosition = {
  cx: number;
  cy: number;
};

type DotState = DotPosition[][];

type OrbitDot = {
  circle: SVGCircleElement;
  ringIndex: number;
  dotIndex: number;
};

function rand(seed: number) {
  let s = seed | 0;

  return function seededRandom() {
    s = (s + 0x6d2b79f5) | 0;
    let t = s;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);

    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function buildDotState(maxDots: number): DotState {
  const random = rand(SEED);

  return RING_RADII.map((radius) => {
    const countSeed = random();
    const offset = random() * Math.PI * 2;

    if (maxDots <= 0) {
      return [];
    }

    const count = Math.round(MIN_DOTS + countSeed * (maxDots - MIN_DOTS));

    return Array.from({ length: count }, (_, dotIndex) => {
      const angle = offset + (dotIndex / count) * Math.PI * 2;

      return {
        cx: CENTER + Math.cos(angle) * radius,
        cy: CENTER + Math.sin(angle) * radius,
      };
    });
  });
}

function createOrbitDots(layer: SVGGElement, peakState: DotState) {
  return peakState.flatMap((ring, ringIndex) =>
    ring.map((_, dotIndex) => {
      const circle = document.createElementNS(SVG_NS, "circle");

      circle.setAttribute("fill", "currentColor");
      circle.setAttribute("r", "0");
      layer.appendChild(circle);

      return { circle, dotIndex, ringIndex };
    }),
  );
}

function applyInitialState(
  dots: OrbitDot[],
  peakState: DotState,
  baseState: DotState,
) {
  dots.forEach(({ circle, dotIndex, ringIndex }) => {
    const target = peakState[ringIndex]?.[dotIndex];
    const isBaseDot = dotIndex < (baseState[ringIndex]?.length ?? 0);

    if (!target) return;
    gsap.set(circle, {
      attr: { cx: target.cx, cy: target.cy, r: isBaseDot ? DOT_RADIUS : 0 },
      autoAlpha: isBaseDot ? 1 : 0,
    });
  });
}

/**
 * Dot Orbits starter-kit example.
 *
 * Contract:
 * - Mirror Pattern Studio's Dot Orbits algorithm in SVG.
 * - Use the peak `Max dots` layout as the stable topology.
 * - Reveal the extra dots one by one, then loop.
 * - Keep orbit guide rings static.
 * - Animate generated dot `r` and `autoAlpha`.
 * - Do not update React state during the animation loop.
 *
 * See `skills/examples/dot-orbits.md` for the parameter contract.
 */
export function AnimatedDotOrbitsExample() {
  const dotLayerRef = useRef<SVGGElement>(null);

  useGSAP(
    () => {
      const dotLayer = dotLayerRef.current;
      if (!dotLayer) return;

      const baseState = buildDotState(BASE_MAX_DOTS);
      const peakState = buildDotState(PEAK_MAX_DOTS);
      const dots = createOrbitDots(dotLayer, peakState);
      const extraDots = dots.filter(
        ({ dotIndex, ringIndex }) =>
          dotIndex >= (baseState[ringIndex]?.length ?? 0),
      );

      applyInitialState(dots, peakState, baseState);

      const reduceMotion = window.matchMedia(
        "(prefers-reduced-motion: reduce)",
      ).matches;

      if (reduceMotion) {
        return () => {
          dots.forEach(({ circle }) => circle.remove());
        };
      }

      const timeline = gsap.timeline({ repeat: -1, repeatDelay: 0.16 });

      // Interleave by position-within-ring so each reveal slot picks one dot
      // from each ring in turn rather than exhausting a ring before moving on.
      const byRing = new Map<number, typeof extraDots>();
      extraDots.forEach((dot) => {
        const list = byRing.get(dot.ringIndex) ?? [];
        list.push(dot);
        byRing.set(dot.ringIndex, list);
      });
      const rings = Array.from(byRing.values());
      const maxPerRing = Math.max(...rings.map((r) => r.length));
      const interleaved: typeof extraDots = [];
      for (let i = 0; i < maxPerRing; i++) {
        rings.forEach((ring) => {
          if (i < ring.length) interleaved.push(ring[i]);
        });
      }

      interleaved.forEach(({ circle }, index) => {
        timeline.to(
          circle,
          {
            attr: { r: DOT_RADIUS },
            autoAlpha: 1,
            duration: DOT_REVEAL_DURATION,
            ease: "sine.out",
          },
          index * DOT_REVEAL_STAGGER,
        );
      });

      timeline.to(
        interleaved.map(({ circle }) => circle).reverse(),
        {
          attr: { r: 0 },
          autoAlpha: 0,
          duration: DOT_HIDE_DURATION,
          ease: "sine.inOut",
          stagger: 0.035,
        },
        interleaved.length * DOT_REVEAL_STAGGER + 0.7,
      );

      return () => {
        timeline.kill();
        dots.forEach(({ circle }) => circle.remove());
      };
    },
    { dependencies: [], scope: dotLayerRef },
  );

  return (
    <div className="relative aspect-square w-full overflow-hidden rounded-lg border border-border-default bg-bg-inverse p-6 text-bg-canvas">
      <svg
        aria-hidden="true"
        className="block h-full w-full"
        viewBox="0 0 600 600"
        xmlns="http://www.w3.org/2000/svg"
      >
        <g>
          {RING_RADII.map((radius) => (
            <circle
              cx={CENTER}
              cy={CENTER}
              fill="none"
              key={radius}
              r={radius}
              stroke="currentColor"
              strokeDasharray="2 4"
              strokeOpacity="0.55"
              strokeWidth="0.6"
            />
          ))}
        </g>
        <g ref={dotLayerRef} />
      </svg>
    </div>
  );
}
