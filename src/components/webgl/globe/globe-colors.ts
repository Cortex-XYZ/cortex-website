import { Color } from "three";

/** CSS custom property names — values live in src/app/globals.css :root. */
export const GLOBE_COLOR = {
  brandOrange: "--brand-cortex-orange",
  brandAmber: "--brand-cortex-amber",
  brandPurple: "--brand-monad-purple",
  voltDark: "--extended-volt-dark",
  arcSecondary: "--globe-arc-secondary",
  atmoWarm: "--globe-atmo-warm",
  landGlow: "--globe-land-glow",
  nightDim: "--globe-night-dim",
  nightBright: "--globe-night-bright",
  star: "--neutral-white",
} as const;

/**
 * Globe WebGL colors are resolved once from :root CSS variables (single
 * getComputedStyle pass on first access). CSS strings and Color
 * instances are cached per variable. The site is dark-only with static
 * tokens in globals.css — these caches are not reactive to runtime theme
 * changes. Cached Color objects are shared; do not mutate them.
 */
let cssColorCache: Map<string, string> | null = null;
let threeColorCache: Map<string, Color> | null = null;

function ensureGlobeCssColors(): Map<string, string> {
  if (cssColorCache) return cssColorCache;

  const styles = getComputedStyle(document.documentElement);
  cssColorCache = new Map(
    Object.values(GLOBE_COLOR).map((varName) => [
      varName,
      styles.getPropertyValue(varName).trim(),
    ]),
  );
  return cssColorCache;
}

export function globeCssColor(varName: string): string {
  return ensureGlobeCssColors().get(varName) ?? "";
}

export function globeThreeColor(varName: string): Color {
  if (!threeColorCache) threeColorCache = new Map();

  let color = threeColorCache.get(varName);
  if (!color) {
    color = new Color(globeCssColor(varName));
    threeColorCache.set(varName, color);
  }
  return color;
}
