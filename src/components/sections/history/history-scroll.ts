import { MOTION_DURATION, MOTION_EASE, MOTION_START } from "@/lib/motion/tokens";

/** Pause after the last milestone enters before the summary callout fades in (seconds). */
export const HISTORY_SUMMARY_DELAY = 0.5;

export const HISTORY_REVEAL_START = MOTION_START.batch;

/** ScrollTrigger start for line drawing — matches milestone reveal timing. */
export const HISTORY_LINE_DRAW_START = HISTORY_REVEAL_START;

/** Line segment duration — matches the milestone reveal duration. */
export const HISTORY_LINE_SEGMENT_DRAW_DURATION = MOTION_DURATION.entrance;

/** History rule drawing ease. */
export const HISTORY_LINE_DRAW_EASE = MOTION_EASE.draw;
