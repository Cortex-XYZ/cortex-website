"use client";

import { useLayoutEffect } from "react";
import { Canvas, useThree } from "@react-three/fiber";
import { PerformanceMonitor } from "@react-three/drei";
import {
  LAYOUT_CAM_Y,
  LAYOUT_CAM_Z,
  LAYOUT_FOV,
} from "./globe-layout";
import { syncGlobeRendererViewport } from "./globe-renderer-sync";
import { GlobeScene } from "./globe-scene";

const MAX_DPR = 1.5;

/** Runs after R3F resize / setDpr — no Canvas onResize in @react-three/fiber 9.x. */
function GlobeRendererViewportSync() {
  const gl = useThree((state) => state.gl);
  const size = useThree((state) => state.size);
  const dpr = useThree((state) => state.viewport.dpr);

  useLayoutEffect(() => {
    syncGlobeRendererViewport(gl);
  }, [gl, size.width, size.height, dpr]);

  return null;
}

function resolveGlobeDpr(): number {
  if (typeof window === "undefined") return 1;
  return Math.max(1, Math.min(MAX_DPR, Math.round(window.devicePixelRatio)));
}

function GlobeSizedScene({
  reducedMotion,
  rotationY,
  onReady,
}: {
  reducedMotion: boolean;
  rotationY: number;
  onReady?: () => void;
}) {
  const width = useThree((state) => state.size.width);
  const height = useThree((state) => state.size.height);

  if (width < 1 || height < 1) return null;

  return (
    <GlobePerformanceMonitor
      reducedMotion={reducedMotion}
      rotationY={rotationY}
      onReady={onReady}
    />
  );
}

function GlobePerformanceMonitor({
  reducedMotion,
  rotationY,
  onReady,
}: {
  reducedMotion: boolean;
  rotationY: number;
  onReady?: () => void;
}) {
  const setDpr = useThree((state) => state.setDpr);

  return (
    <PerformanceMonitor
      onDecline={() => setDpr(1)}
      onIncline={() => setDpr(resolveGlobeDpr())}
    >
      <GlobeScene
        reducedMotion={reducedMotion}
        rotationY={rotationY}
        onReady={onReady}
      />
    </PerformanceMonitor>
  );
}

export function GlobeCanvas({
  reducedMotion,
  rotationY,
  onReady,
  active = true,
}: {
  reducedMotion: boolean;
  rotationY: number;
  onReady?: () => void;
  /** When false (hero off-screen), the frameloop idles to save CPU/GPU. */
  active?: boolean;
}) {
  return (
    <Canvas
      dpr={resolveGlobeDpr()}
      resize={{ scroll: false }}
      frameloop={reducedMotion || !active ? "demand" : "always"}
      gl={{
        antialias: true,
        alpha: true,
        powerPreference: "high-performance",
      }}
      camera={{
        position: [0, LAYOUT_CAM_Y, LAYOUT_CAM_Z],
        fov: LAYOUT_FOV,
        near: 0.1,
        far: 50,
      }}
      style={{
        position: "absolute",
        inset: 0,
        background: "transparent",
      }}
    >
      <GlobeRendererViewportSync />
      <GlobeSizedScene
        reducedMotion={reducedMotion}
        rotationY={rotationY}
        onReady={onReady}
      />
    </Canvas>
  );
}
