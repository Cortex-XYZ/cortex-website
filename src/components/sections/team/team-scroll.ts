import {
  MOTION_DURATION,
  MOTION_EASE,
  MOTION_LIFT,
  MOTION_OVERLAP,
  MOTION_STAGGER,
  MOTION_START,
} from "@/lib/motion/tokens";

/** ScrollTrigger start — matches Mission stack entrance. */
export const TEAM_ENTER_START = MOTION_START.section;

/** ScrollTrigger start for Team rule drawing. */
export const TEAM_LINE_DRAW_START = "top 84%";

/** Team rule drawing ease. */
export const TEAM_LINE_DRAW_EASE = MOTION_EASE.draw;

/**
 * DrawSVG duration for top, vertical, and bottom rules.
 * Section-specific: slightly slower than `MOTION_DURATION.ruleDraw` (0.28).
 */
export const TEAM_LINE_DRAW_DURATION = 0.34;

/**
 * DrawSVG duration for member row dividers.
 * Section-specific: shorter than full Team rules, but a little slower than the
 * shared `MOTION_DURATION.ruleDraw` baseline.
 */
export const TEAM_MEMBER_LINE_DRAW_DURATION = 0.24;

/** Header fade duration. */
export const TEAM_HEADER_REVEAL_DURATION = MOTION_DURATION.header;

/** Header lift on enter (px). */
export const TEAM_HEADER_REVEAL_Y = MOTION_LIFT.textPx;

/** Member card fade duration. */
export const TEAM_MEMBER_REVEAL_DURATION = MOTION_DURATION.item;

/** Member lift on enter (rem). */
export const TEAM_REVEAL_Y_REM = MOTION_LIFT.cardRem;

/** Member + header fade ease. */
export const TEAM_REVEAL_EASE = MOTION_EASE.reveal;

/**
 * First member overlaps the tail of the header fade (seconds).
 * Section-specific: slightly tighter than the shared chain overlap (0.18).
 */
export const TEAM_MEMBER_FIRST_OVERLAP = 0.16;

/** Each subsequent member overlaps the previous (seconds). */
export const TEAM_MEMBER_CHAIN_OVERLAP = MOTION_OVERLAP.chain;

/** Mobile/tablet member stagger — GSAP stagger object `each` value. */
export const TEAM_MOBILE_MEMBER_STAGGER_EACH = MOTION_STAGGER.tight;
