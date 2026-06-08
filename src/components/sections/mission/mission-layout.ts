import type { CSSProperties } from "react";

export const MISSION_CARD_HEIGHT_DESKTOP = 829;

export const MISSION_CARD_HEIGHT_STYLE = {
  height: `min(${MISSION_CARD_HEIGHT_DESKTOP}px, calc(100dvh - var(--site-header-height) - 3rem))`,
} satisfies CSSProperties;
