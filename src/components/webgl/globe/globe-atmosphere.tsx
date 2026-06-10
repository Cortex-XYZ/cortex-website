"use client";

import { useMemo } from "react";
import { AdditiveBlending, BackSide, FrontSide } from "three";
import { GLOBE_RADIUS } from "./globe-layout";
import { GLOBE_COLOR, globeThreeColor } from "./globe-colors";
import { ATMO_VERTEX, ATMO_FRAGMENT } from "./globe-shaders";

const ATMO_OUTER_SCALE = 1.0;
const ATMO_INNER_SCALE = 1.025;

export function AtmosphereRim() {
  const uniforms = useMemo(
    () => ({
      glowColor: { value: globeThreeColor(GLOBE_COLOR.brandAmber) },
      warmColor: { value: globeThreeColor(GLOBE_COLOR.brandOrange) },
    }),
    [],
  );

  const innerUniforms = useMemo(
    () => ({
      glowColor: { value: globeThreeColor(GLOBE_COLOR.voltDark) },
      warmColor: { value: globeThreeColor(GLOBE_COLOR.atmoWarm) },
    }),
    [],
  );

  return (
    <>
      <mesh scale={ATMO_OUTER_SCALE}>
        <sphereGeometry args={[GLOBE_RADIUS, 64, 64]} />
        <shaderMaterial
          uniforms={uniforms}
          vertexShader={ATMO_VERTEX}
          fragmentShader={ATMO_FRAGMENT}
          transparent
          side={BackSide}
          depthWrite={false}
          blending={AdditiveBlending}
        />
      </mesh>
      <mesh scale={ATMO_INNER_SCALE}>
        <sphereGeometry args={[GLOBE_RADIUS, 48, 48]} />
        <shaderMaterial
          uniforms={innerUniforms}
          vertexShader={ATMO_VERTEX}
          fragmentShader={ATMO_FRAGMENT}
          transparent
          side={FrontSide}
          depthWrite={false}
          blending={AdditiveBlending}
        />
      </mesh>
    </>
  );
}
