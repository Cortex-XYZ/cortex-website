"use client";

import { useState } from "react";
import { Canvas } from "@react-three/fiber";
import { PerformanceMonitor } from "@react-three/drei";
import {
  LAYOUT_CAM_Y,
  LAYOUT_CAM_Z,
  LAYOUT_FOV,
} from "./globe-layout";
import { GlobeScene } from "./globe-scene";

export function GlobeCanvas({
  reducedMotion,
  rotationY,
  onReady,
}: {
  reducedMotion: boolean;
  rotationY: number;
  onReady?: () => void;
}) {
  const [dpr, setDpr] = useState(1.5);

  return (
    <Canvas
      dpr={dpr}
      frameloop={reducedMotion ? "demand" : "always"}
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
      <PerformanceMonitor
        onDecline={() => setDpr(1)}
        onIncline={() =>
          setDpr(
            Math.min(
              1.5,
              typeof window !== "undefined" ? window.devicePixelRatio : 1,
            ),
          )
        }
      >
        <GlobeScene
          reducedMotion={reducedMotion}
          rotationY={rotationY}
          onReady={onReady}
        />
      </PerformanceMonitor>
    </Canvas>
  );
}
