"use client";

import { useRef, useMemo, useEffect } from "react";
import { useFrame } from "@react-three/fiber";
import {
  AdditiveBlending,
  BufferAttribute,
  BufferGeometry,
  Color,
  ShaderMaterial,
} from "three";
import { generateArcLineGeometries, type ArcPath } from "./globe-data";
import { GLOBE_COLOR, globeCssColor } from "./globe-colors";
import { PULSE_VERTEX, PULSE_FRAGMENT } from "./globe-shaders";

const TRAIL_LENGTH = 16;
const PULSES_PER_ARC = 3;

const ARC_PRIMARY_OPACITY = 0.68;
const ARC_SECONDARY_OPACITY = 0.52;
const ARC_AMBER_OPACITY = 0.72;
const PULSE_SPEED = 0.55;
const PULSE_HEAD_SIZE = 0.5;

export function ArcConnections({ arcs }: { arcs: ArcPath[] }) {
  const colors = useMemo(
    () => ({
      primary: globeCssColor(GLOBE_COLOR.voltDark),
      secondary: globeCssColor(GLOBE_COLOR.arcSecondary),
      amber: globeCssColor(GLOBE_COLOR.brandAmber),
    }),
    [],
  );

  const { primaryGeo, secondaryGeo, amberGeo } = useMemo(() => {
    const lines = generateArcLineGeometries(arcs);

    const pg = new BufferGeometry();
    pg.setAttribute(
      "position",
      new BufferAttribute(lines.primaryPositions, 3),
    );

    const sg = new BufferGeometry();
    sg.setAttribute(
      "position",
      new BufferAttribute(lines.secondaryPositions, 3),
    );

    const ag = new BufferGeometry();
    ag.setAttribute(
      "position",
      new BufferAttribute(lines.amberPositions, 3),
    );

    return { primaryGeo: pg, secondaryGeo: sg, amberGeo: ag };
  }, [arcs]);

  useEffect(
    () => () => {
      primaryGeo.dispose();
      secondaryGeo.dispose();
      amberGeo.dispose();
    },
    [primaryGeo, secondaryGeo, amberGeo],
  );

  return (
    <>
      <lineSegments geometry={primaryGeo}>
        <lineBasicMaterial
          color={colors.primary}
          transparent
          opacity={ARC_PRIMARY_OPACITY}
          depthWrite={false}
          blending={AdditiveBlending}
          toneMapped={false}
        />
      </lineSegments>
      <lineSegments geometry={secondaryGeo}>
        <lineBasicMaterial
          color={colors.secondary}
          transparent
          opacity={ARC_SECONDARY_OPACITY}
          depthWrite={false}
          blending={AdditiveBlending}
          toneMapped={false}
        />
      </lineSegments>
      <lineSegments geometry={amberGeo}>
        <lineBasicMaterial
          color={colors.amber}
          transparent
          opacity={ARC_AMBER_OPACITY}
          depthWrite={false}
          blending={AdditiveBlending}
          toneMapped={false}
        />
      </lineSegments>
    </>
  );
}

type ArcPulseState = {
  geometry: BufferGeometry;
  material: ShaderMaterial;
  positions: Float32Array;
  alphas: Float32Array;
  sizes: Float32Array;
};

function createArcPulseState(
  totalPoints: number,
  color: string,
): ArcPulseState {
  const pos = new Float32Array(totalPoints * 3);
  const alp = new Float32Array(totalPoints);
  const siz = new Float32Array(totalPoints);

  const geo = new BufferGeometry();
  geo.setAttribute("position", new BufferAttribute(pos, 3));
  geo.setAttribute("aAlpha", new BufferAttribute(alp, 1));
  geo.setAttribute("aSize", new BufferAttribute(siz, 1));

  const mat = new ShaderMaterial({
    uniforms: { uColor: { value: new Color(color) } },
    vertexShader: PULSE_VERTEX,
    fragmentShader: PULSE_FRAGMENT,
    transparent: true,
    depthWrite: false,
    blending: AdditiveBlending,
  });

  return {
    geometry: geo,
    material: mat,
    positions: pos,
    alphas: alp,
    sizes: siz,
  };
}

function ArcPulseLayer({
  arcs,
  color,
  reducedMotion,
}: {
  arcs: ArcPath[];
  color: string;
  reducedMotion: boolean;
}) {
  const totalPoints = arcs.length * PULSES_PER_ARC * TRAIL_LENGTH;

  const pulseState = useMemo(
    () => createArcPulseState(totalPoints, color),
    [totalPoints, color],
  );
  const { geometry, material } = pulseState;

  const pulseRef = useRef(pulseState);
  useEffect(() => {
    pulseRef.current = pulseState;
  }, [pulseState]);

  useEffect(
    () => () => {
      geometry.dispose();
      material.dispose();
    },
    [geometry, material],
  );

  useFrame((state) => {
    const pulse = pulseRef.current;
    if (!pulse || reducedMotion) return;

    const { positions, alphas, sizes, geometry: geo } = pulse;
    const t = state.clock.elapsedTime;
    let idx = 0;

    for (let a = 0; a < arcs.length; a++) {
      const arc = arcs[a];
      const n = arc.samples.length;
      const speed = PULSE_SPEED + a * 0.008;
      const brightnessScale = arc.isPrimary ? 1 : 0.6;

      for (let p = 0; p < PULSES_PER_ARC; p++) {
        const offset = p / PULSES_PER_ARC;
        const progress = (t * speed + offset) % 1;

        for (let trail = 0; trail < TRAIL_LENGTH; trail++) {
          const trailT = progress - trail * 0.012;

          if (trailT < 0 || trailT > 1) {
            positions[idx * 3] = 0;
            positions[idx * 3 + 1] = 0;
            positions[idx * 3 + 2] = 0;
            alphas[idx] = 0;
            sizes[idx] = 0;
          } else {
            const sampleIdx = trailT * (n - 1);
            const si = Math.floor(sampleIdx);
            const sf = sampleIdx - si;
            const s0 = arc.samples[Math.min(si, n - 1)];
            const s1 = arc.samples[Math.min(si + 1, n - 1)];

            positions[idx * 3] = s0.x + (s1.x - s0.x) * sf;
            positions[idx * 3 + 1] = s0.y + (s1.y - s0.y) * sf;
            positions[idx * 3 + 2] = s0.z + (s1.z - s0.z) * sf;

            const trailFade =
              trail === 0 ? 1.0 : Math.max(0, 1 - trail / TRAIL_LENGTH) * 0.6;
            alphas[idx] = trailFade * brightnessScale;
            sizes[idx] =
              trail === 0
                ? PULSE_HEAD_SIZE * brightnessScale
                : Math.max(0.3, 1.8 - trail * 0.1) * brightnessScale;
          }

          idx++;
        }
      }
    }

    geo.attributes.position.needsUpdate = true;
    (geo.attributes.aAlpha as BufferAttribute).needsUpdate = true;
    (geo.attributes.aSize as BufferAttribute).needsUpdate = true;
  });

  return <points geometry={geometry} material={material} />;
}

export function ArcPulses({
  arcs,
  reducedMotion,
}: {
  arcs: ArcPath[];
  reducedMotion: boolean;
}) {
  const orangeArcs = useMemo(
    () => arcs.filter((arc) => arc.tone === "orange"),
    [arcs],
  );
  const amberArcs = useMemo(
    () => arcs.filter((arc) => arc.tone === "amber"),
    [arcs],
  );
  const colors = useMemo(
    () => ({
      orange: globeCssColor(GLOBE_COLOR.voltDark),
      amber: globeCssColor(GLOBE_COLOR.brandAmber),
    }),
    [],
  );

  return (
    <>
      <ArcPulseLayer
        arcs={orangeArcs}
        color={colors.orange}
        reducedMotion={reducedMotion}
      />
      <ArcPulseLayer
        arcs={amberArcs}
        color={colors.amber}
        reducedMotion={reducedMotion}
      />
    </>
  );
}
