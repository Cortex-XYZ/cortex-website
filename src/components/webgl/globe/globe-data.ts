import { Vector3 } from "three";

// ---------------------------------------------------------------------------
// World-map mask — loaded at runtime for texture-based particle placement
// ---------------------------------------------------------------------------

export interface MaskData {
  data: Uint8Array;
  width: number;
  height: number;
}

const worldMapMaskCache = new Map<string, Promise<MaskData>>();

/**
 * Load an equirectangular grayscale PNG mask.
 * Returns per-pixel brightness (0 = ocean, >0 = land, brighter = denser city).
 */
export function loadWorldMapMask(url: string): Promise<MaskData> {
  const cached = worldMapMaskCache.get(url);
  if (cached) return cached;

  const promise = new Promise<MaskData>((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = "anonymous";
    img.onload = () => {
      const canvas = document.createElement("canvas");
      canvas.width = img.width;
      canvas.height = img.height;
      const ctx = canvas.getContext("2d");
      if (!ctx) {
        reject(new Error("No 2d context"));
        return;
      }
      ctx.drawImage(img, 0, 0);
      const imageData = ctx.getImageData(0, 0, img.width, img.height);
      const mask = new Uint8Array(img.width * img.height);
      for (let i = 0; i < mask.length; i++) {
        mask[i] = imageData.data[i * 4]; // red channel
      }
      resolve({ data: mask, width: img.width, height: img.height });
    };
    img.onerror = () => reject(new Error("Failed to load world map mask"));
    img.src = url;
  });

  worldMapMaskCache.set(url, promise);
  promise.catch(() => {
    worldMapMaskCache.delete(url);
  });

  return promise;
}

/** Sample mask brightness at a lat/lon coordinate. Returns 0–255. */
export function sampleMask(mask: MaskData, lat: number, lon: number): number {
  const u = (lon + 180) / 360;
  const v = (90 - lat) / 180;
  const px = Math.min(mask.width - 1, Math.floor(u * mask.width));
  const py = Math.min(mask.height - 1, Math.floor(v * mask.height));
  return mask.data[py * mask.width + px];
}

// ---------------------------------------------------------------------------
// Black Marble luminance grid — drives city-light point mesh
// ---------------------------------------------------------------------------

export interface MarbleData {
  data: Uint8Array;
  width: number;
  height: number;
}

const blackMarbleCache = new Map<string, Promise<MarbleData>>();

/** Load NASA Black Marble JPG as a per-pixel luminance grid (0–255). */
export function loadBlackMarbleData(url: string): Promise<MarbleData> {
  const cached = blackMarbleCache.get(url);
  if (cached) return cached;

  const promise = new Promise<MarbleData>((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = "anonymous";
    img.onload = () => {
      const canvas = document.createElement("canvas");
      canvas.width = img.width;
      canvas.height = img.height;
      const ctx = canvas.getContext("2d");
      if (!ctx) {
        reject(new Error("No 2d context"));
        return;
      }
      ctx.drawImage(img, 0, 0);
      const imageData = ctx.getImageData(0, 0, img.width, img.height);
      const data = new Uint8Array(img.width * img.height);
      for (let i = 0; i < data.length; i++) {
        const o = i * 4;
        data[i] = Math.round(
          0.299 * imageData.data[o] +
            0.587 * imageData.data[o + 1] +
            0.114 * imageData.data[o + 2],
        );
      }
      resolve({ data, width: img.width, height: img.height });
    };
    img.onerror = () => reject(new Error("Failed to load black marble"));
    img.src = url;
  });

  blackMarbleCache.set(url, promise);
  promise.catch(() => {
    blackMarbleCache.delete(url);
  });

  return promise;
}

export type GlobeRgb = readonly [number, number, number];

function pushCityPoint(
  pts: number[],
  cols: number[],
  lat: number,
  lon: number,
  lum: number,
  radius: number,
  baseColor: GlobeRgb,
) {
  const b = lum / 255;
  const [x, y, z] = latLonTo3D(lat, lon, radius);
  pts.push(x, y, z);
  const t = 0.55 + b * 0.45;
  const [r, g, b0] = baseColor;
  // Luminance ramp on top of baseColor (brand orange at call site). Constants
  // preserve the original dim/bright mix when base is --brand-cortex-orange.
  cols.push(
    r * t,
    (g * (0.38 / 0.369) + b * 0.48) * t,
    (b0 + 0.05 + b * 0.16) * t,
  );
}

/** Place glowing points on the sphere from real Black Marble city-light data. */
export function generateCityMeshPoints(
  radius: number,
  targetCount: number,
  marble: MarbleData,
  mask: MaskData | undefined,
  baseColor: GlobeRgb,
): { positions: Float32Array; colors: Float32Array } {
  const pts: number[] = [];
  const cols: number[] = [];
  const { width, height, data } = marble;

  // Pass 1: grid scan — preserves real coastlines and metro clusters
  const gridTarget = Math.floor(targetCount * 0.65);
  const step = Math.max(
    3,
    Math.floor(Math.sqrt((width * height) / Math.max(gridTarget, 1))),
  );

  for (let py = 0; py < height; py += step) {
    for (let px = 0; px < width; px += step) {
      const lum = data[py * width + px];
      if (lum < 12) continue;

      const b = lum / 255;
      const emission = Math.max(b - 0.035, 0);
      if (emission < 0.006) continue;

      const lon = (px / width) * 360 - 180;
      const lat = 90 - (py / height) * 180;
      if (Math.abs(lat) > 78) continue;

      if (mask) {
        const land = sampleMask(mask, lat, lon);
        if (land < 18 && lum < 38) continue;
      }

      if (lum < 28 && Math.random() > 0.42) continue;
      if (lum < 40 && Math.random() > 0.68) continue;

      pushCityPoint(pts, cols, lat, lon, lum, radius, baseColor);
    }
  }

  // Pass 2: random bright-pixel fill to target density
  let attempts = 0;
  const maxAttempts = targetCount * 5;
  while (pts.length / 3 < targetCount && attempts < maxAttempts) {
    attempts++;
    const px = Math.floor(Math.random() * width);
    const py = Math.floor(Math.random() * height);
    const lum = data[py * width + px];
    if (lum < 15) continue;

    const b = lum / 255;
    const emission = Math.max(b - 0.038, 0);
    if (emission < 0.012) continue;

    const lon = (px / width) * 360 - 180;
    const lat = 90 - (py / height) * 180;
    if (Math.abs(lat) > 78) continue;

    if (mask) {
      const land = sampleMask(mask, lat, lon);
      if (land < 18 && lum < 38) continue;
    }

    const acceptance = Math.min(1, 0.06 + Math.pow(emission / 0.38, 0.62));
    if (Math.random() > acceptance) continue;

    pushCityPoint(pts, cols, lat, lon, lum, radius, baseColor);
  }

  return {
    positions: new Float32Array(pts),
    colors: new Float32Array(cols),
  };
}

// ---------------------------------------------------------------------------
// Coordinate utils
// ---------------------------------------------------------------------------

function latLonTo3D(
  lat: number,
  lon: number,
  r: number,
): [number, number, number] {
  const phi = (90 - lat) * (Math.PI / 180);
  const theta = (lon + 180) * (Math.PI / 180);
  return [
    -r * Math.sin(phi) * Math.cos(theta),
    r * Math.cos(phi),
    r * Math.sin(phi) * Math.sin(theta),
  ];
}

// ---------------------------------------------------------------------------
// Hub cities — expanded to 26 for denser network
// ---------------------------------------------------------------------------

export interface HubData {
  position: Vector3;
  intensity: number;
}

const HUB_CITIES: readonly (readonly [number, number, number])[] = [
  [40.7, -74.0, 1.0], //  0  New York
  [51.5, -0.1, 0.95], //  1  London
  [35.7, 139.7, 0.9], //  2  Tokyo
  [1.3, 103.8, 0.85], //  3  Singapore
  [22.3, 114.2, 0.8], //  4  Hong Kong
  [-33.9, 18.4, 0.5], //  5  Cape Town
  [-23.6, -46.6, 0.65], //  6  Sao Paulo
  [25.2, 55.3, 0.75], //  7  Dubai
  [37.6, 127.0, 0.75], //  8  Seoul
  [48.9, 2.3, 0.7], //  9  Paris
  [55.8, 37.6, 0.55], // 10  Moscow
  [19.4, -99.1, 0.55], // 11  Mexico City
  [-37.8, 145.0, 0.6], // 12  Melbourne
  [28.6, 77.2, 0.7], // 13  Delhi
  [39.9, 116.4, 0.85], // 14  Beijing
  [-33.9, 151.2, 0.65], // 15  Sydney
  [31.2, 121.5, 0.85], // 16  Shanghai
  [50.1, 8.7, 0.6], // 17  Frankfurt
  [41.9, -87.6, 0.65], // 18  Chicago
  [34.0, -118.2, 0.7], // 19  Los Angeles
  [25.0, 121.5, 0.55], // 20  Taipei
  [13.8, 100.5, 0.55], // 21  Bangkok
  [41.0, 29.0, 0.55], // 22  Istanbul
  [-6.2, 106.8, 0.5], // 23  Jakarta
  [25.8, -80.2, 0.5], // 24  Miami
  [19.1, 72.9, 0.72], // 25  Mumbai
];

export function generateHubs(radius: number): HubData[] {
  return HUB_CITIES.map(([lat, lon, intensity]) => {
    const [x, y, z] = latLonTo3D(lat, lon, radius);
    return { position: new Vector3(x, y, z), intensity };
  });
}

// ---------------------------------------------------------------------------
// Hub clusters — orange dot cloud around each hub
// Per-vertex RGB is baked at generation time (not CSS-driven). Values match
// --brand-cortex-orange (#ff5e00 → 1.0, 0.369, 0.0) scaled by random t.
// ---------------------------------------------------------------------------

export function generateHubClusters(
  radius: number,
  pointsPerHub = 12,
): { positions: Float32Array; colors: Float32Array } {
  const pts: number[] = [];
  const cols: number[] = [];

  for (const [lat, lon, intensity] of HUB_CITIES) {
    const spread = 1.0 + intensity * 1.5;
    for (let j = 0; j < pointsPerHub; j++) {
      const dLat = (Math.random() - 0.5) * spread;
      const dLon = (Math.random() - 0.5) * spread;
      const [x, y, z] = latLonTo3D(lat + dLat, lon + dLon, radius * 1.002);
      pts.push(x, y, z);
      const t = 0.7 + Math.random() * 0.3;
      cols.push(1.0 * t, 0.369 * t, 0.0);
    }
  }

  return {
    positions: new Float32Array(pts),
    colors: new Float32Array(cols),
  };
}

// ---------------------------------------------------------------------------
// Arc paths — dense network connecting hub cities
// ---------------------------------------------------------------------------

export type ArcTone = "orange" | "amber";

export interface ArcPath {
  samples: Vector3[];
  isPrimary: boolean;
  tone: ArcTone;
}

type ArcPairDef = readonly [number, number, boolean, ArcTone?];

const ARC_PAIRS: readonly ArcPairDef[] = [
  // ── Primary routes — bright orange, fast pulses ──
  [0, 1, true, "amber"], // NYC – London
  [1, 7, true], // London – Dubai
  [7, 3, true], // Dubai – Singapore
  [3, 4, true], // Singapore – Hong Kong
  [4, 2, true], // Hong Kong – Tokyo
  [3, 13, true], // Singapore – Delhi
  [0, 9, true], // NYC – Paris
  [1, 17, true], // London – Frankfurt
  [2, 8, true], // Tokyo – Seoul
  [14, 16, true], // Beijing – Shanghai
  [0, 19, true], // NYC – LA
  [19, 2, true], // LA – Tokyo (Pacific)
  [1, 13, true], // London – Delhi
  [7, 22, true], // Dubai – Istanbul
  [3, 15, true], // Singapore – Sydney

  // ── Long-haul routes — tall transoceanic arcs ──
  [0, 2, true, "amber"], // NYC – Tokyo
  [25, 7, true], // Mumbai – Dubai
  [25, 3, true], // Mumbai – Singapore
  [25, 1, true], // Mumbai – London
  [0, 3, true], // NYC – Singapore
  [0, 7, true], // NYC – Dubai
  [0, 14, true], // NYC – Beijing
  [0, 15, true], // NYC – Sydney
  [1, 2, true], // London – Tokyo
  [1, 3, true], // London – Singapore
  [1, 4, true], // London – Hong Kong
  [1, 15, true], // London – Sydney
  [2, 7, true], // Tokyo – Dubai
  [4, 15, true], // Hong Kong – Sydney
  [0, 13, true], // NYC – Delhi

  // ── Secondary routes — dimmer orange, favour long spans ──
  [0, 6, false], // NYC – Sao Paulo
  [1, 10, false], // London – Moscow
  [1, 22, false], // London – Istanbul
  [1, 5, false], // London – Cape Town
  [1, 14, false], // London – Beijing
  [7, 13, false], // Dubai – Delhi
  [3, 12, false], // Singapore – Melbourne
  [3, 22, false], // Singapore – Istanbul
  [6, 5, false], // Sao Paulo – Cape Town
  [9, 6, false], // Paris – Sao Paulo
  [15, 2, false], // Sydney – Tokyo
  [17, 22, false], // Frankfurt – Istanbul
  [22, 13, false], // Istanbul – Delhi
  [10, 14, false], // Moscow – Beijing
  [5, 7, false], // Cape Town – Dubai
  [0, 17, false], // NYC – Frankfurt
  [2, 13, false], // Tokyo – Delhi
  [4, 22, false], // Hong Kong – Istanbul
  [7, 14, false], // Dubai – Beijing
  [9, 14, false], // Paris – Beijing
  [12, 2, false], // Melbourne – Tokyo
  [6, 18, false], // Sao Paulo – Chicago
];

function clamp(value: number, min: number, max: number) {
  return Math.max(min, Math.min(max, value));
}

export function generateArcPaths(
  radius: number,
  segments = 80,
  hubs = generateHubs(radius),
): ArcPath[] {
  return ARC_PAIRS.map(([a, b, isPrimary, tone = "orange"]) => ({
    samples: buildArcSamples(
      hubs[a].position,
      hubs[b].position,
      radius,
      segments,
    ),
    isPrimary,
    tone,
  }));
}

function buildArcSamples(
  from: Vector3,
  to: Vector3,
  radius: number,
  segments: number,
): Vector3[] {
  const mid = new Vector3().addVectors(from, to).multiplyScalar(0.5);
  const dist = from.distanceTo(to);
  const distT = clamp(dist / (radius * 1.85), 0, 1);
  mid
    .normalize()
    .multiplyScalar(radius * (1 + 0.14 + dist * 0.07 + distT * distT * 0.12));

  const samples: Vector3[] = [];
  for (let i = 0; i <= segments; i++) {
    const t = i / segments;
    const omt = 1 - t;
    samples.push(
      new Vector3(
        omt * omt * from.x + 2 * omt * t * mid.x + t * t * to.x,
        omt * omt * from.y + 2 * omt * t * mid.y + t * t * to.y,
        omt * omt * from.z + 2 * omt * t * mid.z + t * t * to.z,
      ),
    );
  }
  return samples;
}

// ---------------------------------------------------------------------------
// Arc line geometry — all arcs in orange, split by brightness
// ---------------------------------------------------------------------------

export function generateArcLineGeometries(arcs: ArcPath[]): {
  primaryPositions: Float32Array;
  secondaryPositions: Float32Array;
  amberPositions: Float32Array;
} {
  const primaryPts: number[] = [];
  const secondaryPts: number[] = [];
  const amberPts: number[] = [];

  for (const arc of arcs) {
    const target =
      arc.tone === "amber"
        ? amberPts
        : arc.isPrimary
          ? primaryPts
          : secondaryPts;
    for (let i = 0; i < arc.samples.length - 1; i++) {
      const a = arc.samples[i];
      const b = arc.samples[i + 1];
      target.push(a.x, a.y, a.z, b.x, b.y, b.z);
    }
  }

  return {
    primaryPositions: new Float32Array(primaryPts),
    secondaryPositions: new Float32Array(secondaryPts),
    amberPositions: new Float32Array(amberPts),
  };
}

// ---------------------------------------------------------------------------
// City sparkles — sparse glowing particles at brightest city centres
// ---------------------------------------------------------------------------

export function generateCitySparkles(
  radius: number,
  targetCount: number,
  marble: MarbleData,
): { positions: Float32Array; brightnesses: Float32Array } {
  const pts: number[] = [];
  const brs: number[] = [];
  const { width, height, data } = marble;
  let found = 0;
  let attempts = 0;
  const maxAttempts = targetCount * 20;

  while (found < targetCount && attempts < maxAttempts) {
    attempts++;
    const px = Math.floor(Math.random() * width);
    const py = Math.floor(Math.random() * height);
    const lum = data[py * width + px];
    if (lum < 52) continue;

    const b = lum / 255;
    const acceptance = Math.min(1, Math.pow((b - 0.18) / 0.58, 0.75));
    if (Math.random() > acceptance) continue;

    const lon = (px / width) * 360 - 180;
    const lat = 90 - (py / height) * 180;
    if (Math.abs(lat) > 78) continue;
    const [x, y, z] = latLonTo3D(lat, lon, radius);
    pts.push(x, y, z);
    brs.push(b);
    found++;
  }

  return {
    positions: new Float32Array(pts),
    brightnesses: new Float32Array(brs),
  };
}

// ---------------------------------------------------------------------------
// Starfield
// ---------------------------------------------------------------------------

export function generateStarfield(
  count: number,
  minR: number,
  maxR: number,
): Float32Array {
  const p = new Float32Array(count * 3);
  for (let i = 0; i < count; i++) {
    const r = minR + Math.random() * (maxR - minR);
    const theta = Math.random() * Math.PI * 2;
    const phi = Math.acos(2 * Math.random() - 1);
    p[i * 3] = r * Math.sin(phi) * Math.cos(theta);
    p[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta);
    p[i * 3 + 2] = r * Math.cos(phi);
  }
  return p;
}
