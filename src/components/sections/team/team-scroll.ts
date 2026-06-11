/** ScrollTrigger start — matches Mission stack entrance. */
export const TEAM_ENTER_START = "top 82%";

/** DrawSVG duration for top, vertical, and bottom rules. */
export const TEAM_LINE_DRAW_DURATION = 0.28;

/** DrawSVG duration for member row dividers. */
export const TEAM_MEMBER_LINE_DRAW_DURATION = 0.2;

/** Vertical line overlaps the tail of the top line draw (seconds). */
export const TEAM_VERTICAL_LINE_OVERLAP = 0.22;

/** Header fade duration. */
export const TEAM_HEADER_REVEAL_DURATION = 0.32;

/** Header lift on enter (px). */
export const TEAM_HEADER_REVEAL_Y = 14;

/** Overlap header onto the tail of the vertical line draw (seconds). */
export const TEAM_HEADER_OVERLAP_DELAY = 0.18;

/** Member card fade duration. */
export const TEAM_MEMBER_REVEAL_DURATION = 0.35;

/** Member lift on enter (rem). */
export const TEAM_REVEAL_Y_REM = 1;

/** Member + header fade ease. */
export const TEAM_REVEAL_EASE = "power2.out";

/** First member overlaps the tail of the header fade (seconds). */
export const TEAM_MEMBER_FIRST_OVERLAP = 0.16;

/** Each subsequent member overlaps the previous (seconds). */
export const TEAM_MEMBER_CHAIN_OVERLAP = 0.18;

/** Row divider draws during the member fade (seconds). */
export const TEAM_DIVIDER_DRAW_OVERLAP = 0.22;

/** Mobile/tablet member stagger — GSAP stagger object `each` value. */
export const TEAM_MOBILE_MEMBER_STAGGER_EACH = 0.04;
