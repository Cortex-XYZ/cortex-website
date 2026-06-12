"use client";

import { useState } from "react";
import { useOnMount } from "@/hooks/use-on-mount";
import { BufferAttribute, BufferGeometry } from "three";
import { generateStarfield } from "./globe-data";
import { GLOBE_COLOR, globeCssColor } from "./globe-colors";

export function Starfield() {
  const [geometry] = useState(() => {
    const positions = generateStarfield(350, 8, 25);
    const geo = new BufferGeometry();
    geo.setAttribute("position", new BufferAttribute(positions, 3));
    return geo;
  });

  const [color] = useState(() => globeCssColor(GLOBE_COLOR.star));

  useOnMount(() => () => {
    geometry.dispose();
  });

  return (
    <points geometry={geometry}>
      <pointsMaterial
        color={color}
        size={0.012}
        sizeAttenuation
        transparent
        opacity={0.3}
        depthWrite={false}
        toneMapped={false}
      />
    </points>
  );
}
