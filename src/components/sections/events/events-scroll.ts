import {
  MOTION_DURATION,
  MOTION_EASE,
  MOTION_LIFT,
  MOTION_OVERLAP,
  MOTION_START,
} from "@/lib/motion/tokens";

/** ScrollTrigger start for section title. */
export const EVENTS_ENTER_START = MOTION_START.section;

/** ScrollTrigger start — card / follow-up top reaches lower viewport edge. */
export const EVENTS_ROW_ENTER_START = MOTION_START.row;

/** Top rule left-to-right grow duration. */
export const EVENTS_TOP_RULE_DURATION = MOTION_DURATION.ruleGrow;

/** Top rule grow ease. */
export const EVENTS_TOP_RULE_EASE = MOTION_EASE.draw;

/** ScrollTrigger start for the xl top rule. */
export const EVENTS_TOP_RULE_ENTER_START = MOTION_START.row;

/** Title fade duration. */
export const EVENTS_HEADER_DURATION = MOTION_DURATION.header;

/** Event card and follow-up copy fade duration. */
export const EVENTS_ITEM_DURATION = MOTION_DURATION.card;

/** Follow-up line fade duration. */
export const EVENTS_FOLLOW_UP_DURATION = MOTION_DURATION.item;

/** Header text lift on enter (px). */
export const EVENTS_REVEAL_Y = MOTION_LIFT.textPx;

/** Card lift on enter (rem). */
export const EVENTS_CARD_REVEAL_Y_REM = MOTION_LIFT.cardRem;

/** Content fade ease. */
export const EVENTS_REVEAL_EASE = MOTION_EASE.reveal;

/** Follow-up kicker → title overlap (seconds). */
export const EVENTS_FOLLOW_UP_TITLE_OVERLAP = MOTION_OVERLAP.text;

/** Follow-up title → description overlap (seconds). */
export const EVENTS_FOLLOW_UP_DESC_OVERLAP = MOTION_OVERLAP.text;
