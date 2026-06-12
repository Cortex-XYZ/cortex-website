"use client";

import { useRef, useMemo, useEffect, type ReactNode } from "react";
import { useFrame, useThree, useStore } from "@react-three/fiber";
import { Group, PerspectiveCamera } from "three";
import { computeGlobeLayout } from "./globe-layout";
import { buildGlobeRotation } from "./globe-rotation";

const ROTATION_SPEED = -0.01;

function RotatingGroup({
  reducedMotion,
  rotationY,
  children,
}: {
  reducedMotion: boolean;
  rotationY: number;
  children: ReactNode;
}) {
  const ref = useRef<Group>(null);
  const baseRotation = useMemo(
    () => buildGlobeRotation(rotationY),
    [rotationY],
  );

  useFrame((_, delta) => {
    if (reducedMotion || !ref.current) return;
    ref.current.rotation.y += ROTATION_SPEED * delta;
  });

  return (
    <group ref={ref} rotation={baseRotation}>
      {children}
    </group>
  );
}

function useGlobeLayout() {
  const width = useThree((state) => state.size.width);
  const height = useThree((state) => state.size.height);
  return useMemo(() => computeGlobeLayout(width, height), [width, height]);
}

export function ResponsiveGlobeCamera() {
  const layout = useGlobeLayout();
  const width = useThree((state) => state.size.width);
  const height = useThree((state) => state.size.height);
  const store = useStore();

  useEffect(() => {
    const camera = store.getState().camera;
    if (!(camera instanceof PerspectiveCamera)) return;
    camera.fov = layout.fov;
    camera.position.set(...layout.cameraPosition);
    camera.aspect = width / height;
    camera.updateProjectionMatrix();
    store.getState().invalidate();
  }, [layout, width, height, store]);

  return null;
}

export function ResponsiveGlobeFrame({
  reducedMotion,
  rotationY,
  children,
}: {
  reducedMotion: boolean;
  rotationY: number;
  children: ReactNode;
}) {
  const layout = useGlobeLayout();

  return (
    <group position={layout.globePosition} scale={layout.globeScale}>
      <RotatingGroup reducedMotion={reducedMotion} rotationY={rotationY}>
        {children}
      </RotatingGroup>
    </group>
  );
}
