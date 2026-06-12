import {
  AdditiveBlending,
  Color,
  ShaderMaterial,
} from "three";
import type { ColorRepresentation, IUniform } from "three";

// ---------------------------------------------------------------------------
// Circular point sprites — WebGL points are square by default
// ---------------------------------------------------------------------------

export const CIRCLE_POINT_VERT = /* glsl */ `
  attribute vec3 color;
  uniform float uSize;
  varying vec3 vColor;
  varying float vFacing;

  void main() {
    vColor = color;
    vec3 surfNormal = normalize(position);
    vec3 viewNormal = normalize(normalMatrix * surfNormal);
    vFacing = smoothstep(-0.2, 0.6, viewNormal.z);
    vec4 mv = modelViewMatrix * vec4(position, 1.0);
    gl_PointSize = uSize * (100.0 / -mv.z);
    gl_Position = projectionMatrix * mv;
  }
`;

export const CIRCLE_POINT_VERT_SOLID = /* glsl */ `
  uniform float uSize;
  uniform vec3 uColor;
  varying vec3 vColor;
  varying float vFacing;

  void main() {
    vColor = uColor;
    vec3 surfNormal = normalize(position);
    vec3 viewNormal = normalize(normalMatrix * surfNormal);
    vFacing = smoothstep(-0.2, 0.6, viewNormal.z);
    vec4 mv = modelViewMatrix * vec4(position, 1.0);
    gl_PointSize = uSize * (100.0 / -mv.z);
    gl_Position = projectionMatrix * mv;
  }
`;

export const CIRCLE_POINT_FRAG = /* glsl */ `
  varying vec3 vColor;
  varying float vFacing;
  uniform float uOpacity;
  uniform float uBrightness;

  void main() {
    float d = length(gl_PointCoord - vec2(0.5));
    if (d > 0.5) discard;
    float soft = 1.0 - smoothstep(0.08, 0.5, d);
    float lit = 0.65 + 0.35 * vFacing;
    gl_FragColor = vec4(
      vColor * lit * uBrightness,
      uOpacity * soft * mix(0.65, 1.0, vFacing)
    );
  }
`;

export function createCirclePointMaterial(
  size: number,
  opacity: number,
  color?: ColorRepresentation,
  brightness = 1,
): ShaderMaterial {
  const uniforms: Record<string, IUniform<number | Color>> = {
    uSize: { value: size },
    uOpacity: { value: opacity },
    uBrightness: { value: brightness },
  };

  const vertexShader = color ? CIRCLE_POINT_VERT_SOLID : CIRCLE_POINT_VERT;

  if (color) {
    uniforms.uColor = { value: new Color(color) };
  }

  return new ShaderMaterial({
    uniforms,
    vertexShader,
    fragmentShader: CIRCLE_POINT_FRAG,
    transparent: true,
    depthWrite: false,
    blending: AdditiveBlending,
    toneMapped: false,
  });
}

// ---------------------------------------------------------------------------
// Globe surface — texture-driven land + city glow
// ---------------------------------------------------------------------------

export const GLOBE_SURFACE_VERT = /* glsl */ `
  varying vec2 vUv;
  varying float vFacing;

  void main() {
    vUv = uv;
    vec3 viewNormal = normalize(normalMatrix * normal);
    vFacing = smoothstep(-0.25, 0.55, viewNormal.z);
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;

export const LAND_GLOW_FRAG = /* glsl */ `
  uniform sampler2D uMap;
  uniform vec3 uLandColor;
  varying vec2 vUv;
  varying float vFacing;

  void main() {
    float land = texture2D(uMap, vUv).r;
    land = smoothstep(0.05, 0.22, land);
    if (land < 0.015) discard;
    float alpha = land * vFacing * 0.2;
    gl_FragColor = vec4(uLandColor, alpha);
  }
`;

export const NIGHT_GLOW_FRAG = /* glsl */ `
  uniform sampler2D uMap;
  uniform vec3 uNightDim;
  uniform vec3 uNightBright;
  varying vec2 vUv;
  varying float vFacing;

  void main() {
    vec3 tex = texture2D(uMap, vUv).rgb;
    float lum = dot(tex, vec3(0.299, 0.587, 0.114));
    float city = max(lum - 0.07, 0.0);
    city = pow(city, 1.25) * 2.8;
    vec3 color = mix(uNightDim, uNightBright, clamp(city, 0.0, 1.0));
    float alpha = city * vFacing * 0.72;
    if (alpha < 0.003) discard;
    gl_FragColor = vec4(color, alpha);
  }
`;

// ---------------------------------------------------------------------------
// City sparkles
// ---------------------------------------------------------------------------

export const SPARKLE_VERTEX = /* glsl */ `
  attribute float aBrightness;
  uniform float uSize;
  varying float vBrightness;
  varying float vFade;
  void main() {
    vBrightness = aBrightness;
    vec3 surfNormal = normalize(position);
    vec3 viewNormal = normalize(normalMatrix * surfNormal);
    vFade = smoothstep(-0.05, 0.5, viewNormal.z);
    vec4 mv = modelViewMatrix * vec4(position, 1.0);
    gl_PointSize = uSize * (0.5 + aBrightness * 0.5) * (100.0 / -mv.z);
    gl_Position = projectionMatrix * mv;
  }
`;

export const SPARKLE_FRAGMENT = /* glsl */ `
  uniform vec3 uColor;
  varying float vBrightness;
  varying float vFade;
  void main() {
    float d = length(gl_PointCoord - vec2(0.5));
    if (d > 0.5) discard;
    float soft = 1.0 - smoothstep(0.0, 0.5, d);
    gl_FragColor = vec4(uColor, vBrightness * soft * vFade * 0.9);
  }
`;

// ---------------------------------------------------------------------------
// Arc pulses
// ---------------------------------------------------------------------------

export const PULSE_VERTEX = /* glsl */ `
  attribute float aAlpha;
  attribute float aSize;
  varying float vAlpha;
  void main() {
    vAlpha = aAlpha;
    vec4 mvPos = modelViewMatrix * vec4(position, 1.0);
    gl_PointSize = aSize * (40.0 / -mvPos.z);
    gl_Position = projectionMatrix * mvPos;
  }
`;

export const PULSE_FRAGMENT = /* glsl */ `
  uniform vec3 uColor;
  varying float vAlpha;
  void main() {
    float d = length(gl_PointCoord - vec2(0.5));
    if (d > 0.5) discard;
    float soft = 1.0 - smoothstep(0.05, 0.5, d);
    gl_FragColor = vec4(uColor, vAlpha * soft);
  }
`;

// ---------------------------------------------------------------------------
// Atmosphere rim
// ---------------------------------------------------------------------------

export const ATMO_VERTEX = /* glsl */ `
  varying vec3 vNormal;
  varying vec3 vViewDir;
  void main() {
    vNormal = normalize(normalMatrix * normal);
    vViewDir = normalize((modelViewMatrix * vec4(position, 1.0)).xyz);
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;

export const ATMO_FRAGMENT = /* glsl */ `
  uniform vec3 glowColor;
  uniform vec3 warmColor;
  varying vec3 vNormal;
  varying vec3 vViewDir;
  void main() {
    float rim = pow(1.0 - abs(dot(vViewDir, vNormal)), 2.8);
    vec3 color = mix(warmColor, glowColor, rim);
    gl_FragColor = vec4(color, rim * 0.11);
  }
`;
