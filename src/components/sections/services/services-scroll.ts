import {
  MOTION_DURATION,
  MOTION_EASE,
  MOTION_LIFT,
  MOTION_OVERLAP,
  MOTION_START,
} from "@/lib/motion/tokens";

/** ScrollTrigger start for title and description. */
export const SERVICES_ENTER_START = MOTION_START.section;

/** ScrollTrigger start — row top reaches lower viewport edge. */
export const SERVICES_ROW_ENTER_START = MOTION_START.row;

/** Title and description fade duration. */
export const SERVICES_HEADER_DURATION = MOTION_DURATION.header;

/** Service card and CTA fade duration. */
export const SERVICES_ITEM_DURATION = MOTION_DURATION.card;

/** Bottom divider left-to-right grow duration. */
export const SERVICES_DIVIDER_DURATION = MOTION_DURATION.ruleGrow;

/** Divider grow ease. */
export const SERVICES_DIVIDER_EASE = MOTION_EASE.draw;

/** ScrollTrigger start — divider top reaches lower viewport edge. */
export const SERVICES_DIVIDER_ENTER_START = MOTION_START.row;

/** Header text lift on enter (px). */
export const SERVICES_REVEAL_Y = MOTION_LIFT.textPx;

/** Card lift on enter (rem). */
export const SERVICES_CARD_REVEAL_Y_REM = MOTION_LIFT.cardRem;

/** Content fade ease. */
export const SERVICES_REVEAL_EASE = MOTION_EASE.reveal;

/** Description overlaps the title fade (seconds). */
export const SERVICES_DESC_OVERLAP = MOTION_OVERLAP.text;

/**
 * Each subsequent card overlap (seconds).
 * Section-specific: wider than the shared `MOTION_OVERLAP.chain` (0.18).
 */
export const SERVICES_CARD_CHAIN_OVERLAP = 0.22;

/** CTA overlaps the last card (seconds). */
export const SERVICES_CTA_OVERLAP = MOTION_OVERLAP.text;
