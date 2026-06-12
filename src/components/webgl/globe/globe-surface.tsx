"use client";

import { useMemo, useEffect, useState, useRef } from "react";
import { useOnMount } from "@/hooks/use-on-mount";
import {
  AdditiveBlending,
  BufferAttribute,
  BufferGeometry,
  ClampToEdgeWrapping,
  RepeatWrapping,
  ShaderMaterial,
  SRGBColorSpace,
  TextureLoader,
} from "three";
import type { BufferGeometry as BufferGeometryType, Texture } from "three";
import {
  loadWorldMapMask,
  loadBlackMarbleData,
  generateCityMeshPoints,
  generateCitySparkles,
} from "./globe-data";
import { GLOBE_RADIUS } from "./globe-layout";
import { GLOBE_COLOR, globeThreeColor } from "./globe-colors";
import {
  createCirclePointMaterial,
  GLOBE_SURFACE_VERT,
  LAND_GLOW_FRAG,
  NIGHT_GLOW_FRAG,
  SPARKLE_VERTEX,
  SPARKLE_FRAGMENT,
} from "./globe-shaders";

function useLatestRef<T>(value: T) {
  const ref = useRef(value);
  useEffect(() => {
    ref.current = value;
  }, [value]);
  return ref;
}

function GlobeLandGlow({ onTextureReady }: { onTextureReady?: () => void }) {
  const [texture, setTexture] = useState<Texture | null>(null);
  const textureRef = useRef<Texture | null>(null);
  const onTextureReadyRef = useLatestRef(onTextureReady);

  const uniforms = useMemo(
    () => ({
      uMap: { value: null as Texture | null },
      uLandColor: { value: globeThreeColor(GLOBE_COLOR.landGlow) },
    }),
    [],
  );

  useOnMount(() => {
    let cancelled = false;

    const disposeLoadedTexture = () => {
      textureRef.current?.dispose();
      textureRef.current = null;
      uniforms.uMap.value = null;
    };

    const loader = new TextureLoader();
    loader.load(
      "/textures/world-map-mask.png",
      (tex) => {
        textureRef.current = tex;
        if (cancelled) {
          disposeLoadedTexture();
          return;
        }
        tex.colorSpace = SRGBColorSpace;
        tex.wrapS = RepeatWrapping;
        tex.wrapT = ClampToEdgeWrapping;
        uniforms.uMap.value = tex;
        setTexture(tex);
      },
      undefined,
      () => {
        onTextureReadyRef.current?.();
      },
    );

    return () => {
      cancelled = true;
      disposeLoadedTexture();
    };
  });

  useEffect(() => {
    if (texture) onTextureReadyRef.current?.();
  }, [texture, onTextureReadyRef]);

  if (!texture) return null;

  return (
    <mesh>
      <sphereGeometry args={[GLOBE_RADIUS * 0.9995, 96, 96]} />
      <shaderMaterial
        uniforms={uniforms}
        vertexShader={GLOBE_SURFACE_VERT}
        fragmentShader={LAND_GLOW_FRAG}
        transparent
        depthWrite={false}
        blending={AdditiveBlending}
        toneMapped={false}
      />
    </mesh>
  );
}

function GlobeNightGlow({ onTextureReady }: { onTextureReady?: () => void }) {
  const [texture, setTexture] = useState<Texture | null>(null);
  const textureRef = useRef<Texture | null>(null);
  const onTextureReadyRef = useLatestRef(onTextureReady);

  const uniforms = useMemo(
    () => ({
      uMap: { value: null as Texture | null },
      uNightDim: { value: globeThreeColor(GLOBE_COLOR.nightDim) },
      uNightBright: { value: globeThreeColor(GLOBE_COLOR.nightBright) },
    }),
    [],
  );

  useOnMount(() => {
    let cancelled = false;

    const disposeLoadedTexture = () => {
      textureRef.current?.dispose();
      textureRef.current = null;
      uniforms.uMap.value = null;
    };

    const loader = new TextureLoader();
    loader.load(
      "/textures/earth-black-marble.jpg",
      (tex) => {
        textureRef.current = tex;
        if (cancelled) {
          disposeLoadedTexture();
          return;
        }
        tex.colorSpace = SRGBColorSpace;
        tex.wrapS = RepeatWrapping;
        tex.wrapT = ClampToEdgeWrapping;
        uniforms.uMap.value = tex;
        setTexture(tex);
      },
      undefined,
      () => {
        onTextureReadyRef.current?.();
      },
    );

    return () => {
      cancelled = true;
      disposeLoadedTexture();
    };
  });

  useEffect(() => {
    if (texture) onTextureReadyRef.current?.();
  }, [texture, onTextureReadyRef]);

  if (!texture) return null;

  return (
    <mesh>
      <sphereGeometry args={[GLOBE_RADIUS * 1.0005, 96, 96]} />
      <shaderMaterial
        uniforms={uniforms}
        vertexShader={GLOBE_SURFACE_VERT}
        fragmentShader={NIGHT_GLOW_FRAG}
        transparent
        depthWrite={false}
        blending={AdditiveBlending}
        toneMapped={false}
      />
    </mesh>
  );
}

function GlobeCityMesh() {
  const [geometry, setGeometry] = useState<BufferGeometryType | null>(null);

  const material = useMemo(
    () => createCirclePointMaterial(0.15, 1.0, undefined, 1.5),
    [],
  );

  useOnMount(() => {
    let cancelled = false;
    const base = globeThreeColor(GLOBE_COLOR.brandOrange);
    const baseColor: [number, number, number] = [base.r, base.g, base.b];

    Promise.all([
      loadBlackMarbleData("/textures/earth-black-marble.jpg"),
      loadWorldMapMask("/textures/world-map-mask.png"),
    ])
      .then(([marble, mask]) => {
        if (cancelled) return;

        const { positions, colors } = generateCityMeshPoints(
          GLOBE_RADIUS * 1.002,
          32000,
          marble,
          mask,
          baseColor,
        );

        const geo = new BufferGeometry();
        geo.setAttribute("position", new BufferAttribute(positions, 3));
        geo.setAttribute("color", new BufferAttribute(colors, 3));
        geo.computeBoundingSphere();
        setGeometry(geo);
      })
      .catch(() => {
        /* skip city mesh if texture fails */
      });

    return () => {
      cancelled = true;
      setGeometry((prev) => {
        prev?.dispose();
        return null;
      });
    };
  });

  useOnMount(() => () => {
    material.dispose();
  });

  if (!geometry) return null;

  return <points geometry={geometry} material={material} />;
}

export function GlobeEarthSurface({
  onMaskReady,
  onMarbleReady,
}: {
  onMaskReady?: () => void;
  onMarbleReady?: () => void;
}) {
  return (
    <>
      <GlobeLandGlow onTextureReady={onMaskReady} />
      <GlobeNightGlow onTextureReady={onMarbleReady} />
      <GlobeCityMesh />
    </>
  );
}

export function CitySparkles() {
  const [geometry, setGeometry] = useState<BufferGeometryType | null>(null);

  const material = useMemo(
    () =>
      new ShaderMaterial({
        uniforms: {
          uSize: { value: 0.26 },
          uColor: { value: globeThreeColor(GLOBE_COLOR.brandOrange) },
        },
        vertexShader: SPARKLE_VERTEX,
        fragmentShader: SPARKLE_FRAGMENT,
        transparent: true,
        depthWrite: false,
        blending: AdditiveBlending,
      }),
    [],
  );

  useOnMount(() => {
    let cancelled = false;

    loadBlackMarbleData("/textures/earth-black-marble.jpg")
      .then((marble) => {
        if (cancelled) return;
        const sparkles = generateCitySparkles(
          GLOBE_RADIUS * 1.003,
          4500,
          marble,
        );
        const geo = new BufferGeometry();
        geo.setAttribute(
          "position",
          new BufferAttribute(sparkles.positions, 3),
        );
        geo.setAttribute(
          "aBrightness",
          new BufferAttribute(sparkles.brightnesses, 1),
        );
        geo.computeBoundingSphere();
        setGeometry(geo);
      })
      .catch(() => {
        /* skip sparkles if mask fails */
      });

    return () => {
      cancelled = true;
      setGeometry((current) => {
        current?.dispose();
        return null;
      });
    };
  });

  useOnMount(() => () => {
    material.dispose();
  });

  if (!geometry) return null;
  return <points geometry={geometry} material={material} />;
}
