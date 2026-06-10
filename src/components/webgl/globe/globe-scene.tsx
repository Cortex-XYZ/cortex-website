"use client";

import { useRef, useMemo, useCallback } from "react";
import { generateHubs, generateArcPaths } from "./globe-data";
import { GLOBE_RADIUS } from "./globe-layout";
import { ResponsiveGlobeCamera, ResponsiveGlobeFrame } from "./globe-camera";
import { GlobeEarthSurface, CitySparkles } from "./globe-surface";
import { HubMarkers } from "./globe-hubs";
import { ArcConnections, ArcPulses } from "./globe-arcs";
import { AtmosphereRim } from "./globe-atmosphere";
import { Starfield } from "./globe-starfield";

export function GlobeScene({
  reducedMotion,
  rotationY,
  onReady,
}: {
  reducedMotion: boolean;
  rotationY: number;
  onReady?: () => void;
}) {
  const hubs = useMemo(() => generateHubs(GLOBE_RADIUS), []);
  const arcs = useMemo(() => generateArcPaths(GLOBE_RADIUS, 80, hubs), [hubs]);
  const primaryTexturesReady = useRef({ mask: false, marble: false });
  const readyNotified = useRef(false);

  const markPrimaryTextureReady = useCallback(
    (kind: "mask" | "marble") => {
      if (readyNotified.current) return;
      primaryTexturesReady.current[kind] = true;
      if (
        onReady &&
        primaryTexturesReady.current.mask &&
        primaryTexturesReady.current.marble
      ) {
        readyNotified.current = true;
        onReady();
      }
    },
    [onReady],
  );

  const onMaskReady = useCallback(
    () => markPrimaryTextureReady("mask"),
    [markPrimaryTextureReady],
  );
  const onMarbleReady = useCallback(
    () => markPrimaryTextureReady("marble"),
    [markPrimaryTextureReady],
  );

  return (
    <>
      <ResponsiveGlobeCamera />
      <ResponsiveGlobeFrame reducedMotion={reducedMotion} rotationY={rotationY}>
        <GlobeEarthSurface
          onMaskReady={onReady ? onMaskReady : undefined}
          onMarbleReady={onReady ? onMarbleReady : undefined}
        />
        <CitySparkles />
        <HubMarkers hubs={hubs} reducedMotion={reducedMotion} />
        <ArcConnections arcs={arcs} />
        <ArcPulses arcs={arcs} reducedMotion={reducedMotion} />
        <AtmosphereRim />
      </ResponsiveGlobeFrame>
      <Starfield />
    </>
  );
}
