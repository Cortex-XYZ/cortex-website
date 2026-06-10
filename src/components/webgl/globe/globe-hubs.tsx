"use client";

import { useRef, useMemo, useEffect } from "react";
import { useFrame } from "@react-three/fiber";
import { BufferAttribute, BufferGeometry } from "three";
import { generateHubClusters, type HubData } from "./globe-data";
import { GLOBE_RADIUS } from "./globe-layout";
import { GLOBE_COLOR, globeCssColor } from "./globe-colors";
import { createCirclePointMaterial } from "./globe-shaders";

export function HubMarkers({
  hubs,
  reducedMotion,
}: {
  hubs: HubData[];
  reducedMotion: boolean;
}) {
  const { hubGeo, clusterGeo, glowMat, hubMat, clusterMat } = useMemo(() => {
    const hubPos = new Float32Array(hubs.length * 3);
    hubs.forEach((h, i) => {
      hubPos[i * 3] = h.position.x;
      hubPos[i * 3 + 1] = h.position.y;
      hubPos[i * 3 + 2] = h.position.z;
    });
    const hg = new BufferGeometry();
    hg.setAttribute("position", new BufferAttribute(hubPos, 3));

    const clusters = generateHubClusters(GLOBE_RADIUS);
    const cg = new BufferGeometry();
    cg.setAttribute(
      "position",
      new BufferAttribute(clusters.positions, 3),
    );
    cg.setAttribute("color", new BufferAttribute(clusters.colors, 3));

    return {
      hubGeo: hg,
      clusterGeo: cg,
      glowMat: createCirclePointMaterial(
        0.52,
        0.14,
        globeCssColor(GLOBE_COLOR.voltDark),
      ),
      hubMat: createCirclePointMaterial(
        0.18,
        0.85,
        globeCssColor(GLOBE_COLOR.brandOrange),
      ),
      clusterMat: createCirclePointMaterial(0.12, 0.55),
    };
  }, [hubs]);

  const hubMatRef = useRef(hubMat);
  const clusterMatRef = useRef(clusterMat);
  useEffect(() => {
    hubMatRef.current = hubMat;
    clusterMatRef.current = clusterMat;
  }, [hubMat, clusterMat]);

  useEffect(
    () => () => {
      hubGeo.dispose();
      clusterGeo.dispose();
      glowMat.dispose();
      hubMat.dispose();
      clusterMat.dispose();
    },
    [hubGeo, clusterGeo, glowMat, hubMat, clusterMat],
  );

  useFrame((state) => {
    if (reducedMotion) return;
    const t = state.clock.elapsedTime;
    hubMatRef.current.uniforms.uOpacity.value = 0.85 + Math.sin(t * 1.15) * 0.1;
    clusterMatRef.current.uniforms.uOpacity.value =
      0.55 + Math.sin(t * 1.3 + 0.5) * 0.08;
  });

  return (
    <>
      <points geometry={hubGeo} material={glowMat} />
      <points geometry={hubGeo} material={hubMat} />
      <points geometry={clusterGeo} material={clusterMat} />
    </>
  );
}
