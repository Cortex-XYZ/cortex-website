import type { CSSProperties } from "react";

export const MISSION_CARD_HEIGHT_DESKTOP = 829;

export const MISSION_CARD_EXPANDED_WIDTH = 556;

export const MISSION_CARD_COLLAPSED_WIDTH = 46;

/** Fixed width of the intro column beside the desktop card stack. */
export const MISSION_STACK_INTRO_WIDTH = 334;

/** Viewport-height multiplier for each desktop card transition in the pin stack. */
export const MISSION_PIN_SCROLL_PER_CARD = 0.65;

/** Rem above the card-stack top used as the ScrollTrigger start edge. */
export const MISSION_STACK_PIN_START_OFFSET_REM = 22;

/** ScrollTrigger start for the desktop entrance sequence (before pin stack). */
export const MISSION_ENTRANCE_START = "top 82%";

export const MISSION_ENTRANCE_STACK_Y_REM = 1.5;

export const MISSION_ENTRANCE_STACK_DURATION = 0.65;

export const MISSION_ENTRANCE_STACK_STAGGER = 0.07;

export const MISSION_ENTRANCE_INTRO_DURATION = 0.55;

/** Overlap intro fade onto the tail of the stack reveal (seconds). */
export const MISSION_ENTRANCE_INTRO_DELAY = 0.25;

export const MISSION_CARD_HEIGHT_STYLE = {
  height: `min(${MISSION_CARD_HEIGHT_DESKTOP}px, calc(100dvh - var(--site-header-height) - 3rem))`,
} satisfies CSSProperties;

export const MISSION_CARD_EXPANDED_WIDTH_STYLE = {
  width: MISSION_CARD_EXPANDED_WIDTH,
} satisfies CSSProperties;

export const MISSION_CARD_COLLAPSED_WIDTH_STYLE = {
  width: MISSION_CARD_COLLAPSED_WIDTH,
} satisfies CSSProperties;

export const MISSION_STACK_INTRO_WIDTH_STYLE = {
  width: MISSION_STACK_INTRO_WIDTH,
} satisfies CSSProperties;
