/** Desktop live hero longitude (radians). */
export const DEFAULT_GLOBE_ROTATION_Y = -0.8;

const BASE_GLOBE_TILT_X = 0.1;
const BASE_GLOBE_ROLL_Z = 0.06;

export function buildGlobeRotation(
  rotationY: number,
): [number, number, number] {
  return [BASE_GLOBE_TILT_X, rotationY, BASE_GLOBE_ROLL_Z];
}
