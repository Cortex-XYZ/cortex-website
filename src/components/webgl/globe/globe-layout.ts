export const GLOBE_RADIUS = 2.65;

export const LAYOUT_FOV = 42;
export const LAYOUT_CAM_Z = 5.8;
export const LAYOUT_CAM_Y = 0.35;
export const HORIZONTAL_FILL = 0.94;
export const VISIBLE_GLOBE_FRACTION = 2 / 3;
export const GLOBE_Y_DROP = 1.5;
export const REFERENCE_VIEWPORT_WIDTH = 1440;

const ATMO_OUTER_SCALE = 1.0;

export type GlobeLayout = {
  globePosition: [number, number, number];
  globeScale: number;
  cameraPosition: [number, number, number];
  fov: number;
};

export function computeGlobeLayout(width: number, height: number): GlobeLayout {
  const fovRad = (LAYOUT_FOV * Math.PI) / 180;
  const isPortrait = height > width;

  const scaleWidth = isPortrait
    ? width
    : Math.max(width, REFERENCE_VIEWPORT_WIDTH);
  const scaleHeight = height;
  const scaleAspect = scaleWidth / scaleHeight;
  const hFov = 2 * Math.atan(Math.tan(fovRad / 2) * scaleAspect);

  const camZ = LAYOUT_CAM_Z;
  const camY = LAYOUT_CAM_Y;
  const camX = 0;

  const angularHalf = (hFov / 2) * HORIZONTAL_FILL;
  const globeScale =
    (camZ * Math.tan(angularHalf)) / (GLOBE_RADIUS * ATMO_OUTER_SCALE);

  const effectiveR = GLOBE_RADIUS * ATMO_OUTER_SCALE * globeScale;
  const viewBottomY = camY - camZ * Math.tan(fovRad / 2);
  const clipY = effectiveR * (1 - VISIBLE_GLOBE_FRACTION);
  const globeY = viewBottomY + clipY - GLOBE_Y_DROP;
  const globeX = 0;

  return {
    globePosition: [globeX, globeY, 0],
    globeScale,
    cameraPosition: [camX, camY, camZ],
    fov: LAYOUT_FOV,
  };
}
