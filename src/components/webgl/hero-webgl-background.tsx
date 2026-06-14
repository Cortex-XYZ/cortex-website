"use client";

import {
  memo,
  useState,
  Component,
  type ErrorInfo,
  type ReactNode,
} from "react";
import dynamic from "next/dynamic";
import { useIsLargeScreen } from "@/hooks/use-is-desktop";
import { useReducedMotion } from "@/hooks/use-reduced-motion";
import { useWebGLSupport } from "@/hooks/use-webgl-support";
import { DEFAULT_GLOBE_ROTATION_Y } from "@/components/webgl/globe/globe-rotation";
import {
  HERO_GLOBE_MOBILE_HEIGHT,
  HERO_GLOBE_MOBILE_PNG,
  HERO_GLOBE_MOBILE_PNG_2X,
  HERO_GLOBE_MOBILE_PNG_4X,
  HERO_GLOBE_MOBILE_WEBP,
  HERO_GLOBE_MOBILE_WEBP_2X,
  HERO_GLOBE_MOBILE_WEBP_4X,
  HERO_GLOBE_MOBILE_WIDTH,
} from "@/components/webgl/hero-globe-static";

// ---------------------------------------------------------------------------
// Dynamic import — keeps R3F + Three.js out of the initial bundle for mobile
// ---------------------------------------------------------------------------

const GlobeCanvas = dynamic(
  () =>
    import("./globe/globe-canvas").then((m) => ({ default: m.GlobeCanvas })),
  { ssr: false },
);

// ---------------------------------------------------------------------------
// WebGL loading placeholder — desktop only, hidden once the canvas paints
// ---------------------------------------------------------------------------

/** Masked gradients + sparse dot field shaped like the globe — not a full-screen grid. */
function GlobeLoadingPlaceholder() {
  return (
    <div className="absolute inset-0" data-hero-static-fallback>
      <div
        className="absolute inset-0"
        style={{
          background: [
            "radial-gradient(ellipse 88% 42% at 50% 108%, color-mix(in srgb, var(--neutral-white) 3%, transparent) 0%, color-mix(in srgb, var(--neutral-white) 0.8%, transparent) 52%, transparent 73%)",
            "radial-gradient(ellipse 55% 28% at 50% 102%, color-mix(in srgb, var(--action-primary) 5%, transparent) 0%, transparent 66%)",
            "radial-gradient(circle at 50% 95%, color-mix(in srgb, var(--action-primary) 42%, transparent) 0 1px, transparent 1.6px)",
          ].join(", "),
          backgroundSize: "100% 100%, 100% 100%, 23px 23px",
          WebkitMaskImage:
            "radial-gradient(ellipse 90% 45% at 50% 108%, black 0%, black 47%, transparent 74%)",
          maskImage:
            "radial-gradient(ellipse 90% 45% at 50% 108%, black 0%, black 47%, transparent 74%)",
        }}
      />
    </div>
  );
}

// ---------------------------------------------------------------------------
// Baked globe frame (mobile, no WebGL)
// ---------------------------------------------------------------------------

function markGlobeLoaded(
  img: HTMLImageElement | null,
  setLoaded: (loaded: boolean) => void,
) {
  if (img?.complete && img.naturalWidth > 0) {
    setLoaded(true);
  }
}

class GlobeCanvasErrorBoundary extends Component<
  { children: ReactNode; fallback: ReactNode },
  { hasError: boolean }
> {
  state = { hasError: false };

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    if (process.env.NODE_ENV !== "production") {
      console.error("[GlobeCanvas]", error, info.componentStack);
    }
  }

  render() {
    if (this.state.hasError) {
      return this.props.fallback;
    }
    return this.props.children;
  }
}

function StaticGlobeImage() {
  const [loaded, setLoaded] = useState(false);

  return (
    <picture
      className="absolute inset-0 block size-full transition-opacity duration-500 motion-reduce:transition-none"
      style={{ opacity: loaded ? 1 : 0 }}
    >
      <source
        srcSet={`${HERO_GLOBE_MOBILE_WEBP} ${HERO_GLOBE_MOBILE_WIDTH}w, ${HERO_GLOBE_MOBILE_WEBP_2X} ${HERO_GLOBE_MOBILE_WIDTH * 2}w, ${HERO_GLOBE_MOBILE_WEBP_4X} ${HERO_GLOBE_MOBILE_WIDTH * 4}w`}
        sizes="100vw"
        type="image/webp"
      />
      <img
        ref={(img) => markGlobeLoaded(img, setLoaded)}
        src={HERO_GLOBE_MOBILE_PNG}
        srcSet={`${HERO_GLOBE_MOBILE_PNG} ${HERO_GLOBE_MOBILE_WIDTH}w, ${HERO_GLOBE_MOBILE_PNG_2X} ${HERO_GLOBE_MOBILE_WIDTH * 2}w, ${HERO_GLOBE_MOBILE_PNG_4X} ${HERO_GLOBE_MOBILE_WIDTH * 4}w`}
        sizes="100vw"
        width={HERO_GLOBE_MOBILE_WIDTH}
        height={HERO_GLOBE_MOBILE_HEIGHT}
        alt=""
        className="size-full object-cover object-bottom"
        decoding="async"
        fetchPriority="high"
        onLoad={() => setLoaded(true)}
      />
    </picture>
  );
}

function WebglGlobe({ reducedMotion }: { reducedMotion: boolean }) {
  const [ready, setReady] = useState(false);

  return (
    <GlobeCanvasErrorBoundary fallback={<StaticGlobeImage />}>
      {!ready ? <GlobeLoadingPlaceholder /> : null}
      <GlobeCanvas
        reducedMotion={reducedMotion}
        rotationY={DEFAULT_GLOBE_ROTATION_Y}
        onReady={() => setReady(true)}
      />
    </GlobeCanvasErrorBoundary>
  );
}

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

export const HeroWebglBackground = memo(function HeroWebglBackground() {
  const reducedMotion = useReducedMotion();
  const isLargeScreen = useIsLargeScreen();
  const webgl = useWebGLSupport();

  const showLiveGlobe = isLargeScreen && webgl;
  const showStaticGlobe = !showLiveGlobe;

  return (
    <div
      aria-hidden="true"
      className="absolute inset-0 -z-10 bg-bg-canvas"
      style={{ pointerEvents: "none" }}
      data-hero-webgl-background
    >
      {showStaticGlobe ? <StaticGlobeImage /> : null}

      {showLiveGlobe ? <WebglGlobe reducedMotion={reducedMotion} /> : null}

      {/* Ambient spill — warm glow rising from the bottom-anchored globe */}
      <div
        className="absolute inset-0"
        style={{
          background: [
            "radial-gradient(ellipse 100% 55% at 50% 108%, color-mix(in srgb, var(--action-primary) 8%, transparent) 0%, transparent 62%)",
            "radial-gradient(ellipse 60% 35% at 50% 100%, color-mix(in srgb, var(--neutral-white) 3%, transparent) 0%, transparent 55%)",
          ].join(", "),
        }}
      />

      {/* Sparse dots on the left — same visual language as the globe */}
      <div
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(circle, color-mix(in srgb, var(--action-primary) 38%, transparent) 0 1px, transparent 1.6px)",
          backgroundSize: "26px 26px",
          opacity: 0.22,
          WebkitMaskImage:
            "linear-gradient(to right, black 0%, black 36%, transparent 58%)",
          maskImage:
            "linear-gradient(to right, black 0%, black 36%, transparent 58%)",
        }}
      />

      {/* Text scrim — left copy column; bottom stays open for the rising globe */}
      <div
        className="absolute inset-0"
        style={{
          background: [
            "linear-gradient(to right, color-mix(in srgb, var(--bg-canvas) 78%, transparent) 0%, color-mix(in srgb, var(--bg-canvas) 52%, transparent) 32%, transparent 58%)",
            "linear-gradient(to bottom, color-mix(in srgb, var(--bg-canvas) 55%, transparent) 0%, transparent 18%)",
          ].join(", "),
        }}
      />
    </div>
  );
});
