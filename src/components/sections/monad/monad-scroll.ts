import {
  MOTION_DURATION,
  MOTION_EASE,
  MOTION_LIFT,
  MOTION_OVERLAP,
  MOTION_STAGGER,
  MOTION_START,
} from "@/lib/motion/tokens";

/** ScrollTrigger start — matches Team / Mission entrance. */
export const MONAD_ENTER_START = MOTION_START.section;

/** Purple divider grow duration. */
export const MONAD_DIVIDER_DURATION = MOTION_DURATION.ruleDraw;

/** Divider grow ease. */
export const MONAD_DIVIDER_EASE = MOTION_EASE.draw;

/** Title, description, and eyebrow fade duration. */
export const MONAD_HEADER_DURATION = MOTION_DURATION.header;

/** Topic cards and social links fade duration. */
export const MONAD_ITEM_DURATION = MOTION_DURATION.item;

/** Text lift on enter (px). */
export const MONAD_REVEAL_Y = MOTION_LIFT.textPx;

/** Topic card lift on enter (rem). */
export const MONAD_REVEAL_Y_REM = MOTION_LIFT.cardRem;

/** Content fade ease. */
export const MONAD_REVEAL_EASE = MOTION_EASE.reveal;

/** Description overlaps the title fade (seconds). */
export const MONAD_DESC_OVERLAP = MOTION_OVERLAP.text;

/**
 * Band content overlaps the intro block (seconds).
 * Section-specific: sits between the shared text (0.14) and chain (0.18)
 * overlaps.
 */
export const MONAD_BAND_OVERLAP = 0.16;

/** Social links overlap the eyebrow (seconds). */
export const MONAD_SOCIAL_OVERLAP = MOTION_OVERLAP.text;

/** Social link stagger. */
export const MONAD_SOCIAL_STAGGER_EACH = MOTION_STAGGER.tight;

/** ScrollTrigger start — topic row top reaches lower viewport edge. */
export const MONAD_TOPIC_ROW_ENTER_START = MOTION_START.row;

/** Each subsequent topic card overlap within a row (seconds). */
export const MONAD_TOPIC_CHAIN_OVERLAP = MOTION_OVERLAP.chain;
