/**
 * Shared motion tokens for section entrance choreography.
 *
 * Sections consume these through their local `*-scroll.ts` tunables file.
 * A section file that needs to depart from the shared motion language keeps
 * that value as a literal with a comment, so deviations stay visible instead
 * of drifting silently.
 */

/** GSAP eases. */
export const MOTION_EASE = {
  /** Content fade/lift reveals. */
  reveal: "power2.out",
  /** Rule and divider draw/grow. */
  draw: "power2.inOut",
} as const;

/** ScrollTrigger start positions. */
export const MOTION_START = {
  /** Section header/intro entrance. */
  section: "top 82%",
  /** Card/row entrance near the lower viewport edge. */
  row: "top 92%",
  /** Batch reveals (history milestones, shared reveal helpers). */
  batch: "top 88%",
} as const;

/** Tween durations (seconds). */
export const MOTION_DURATION = {
  /** Section title/description fade. */
  header: 0.32,
  /** Standard item fade (members, topic cards, follow-up copy). */
  item: 0.35,
  /** Large card surface fade (event card, service cards). */
  card: 0.38,
  /** Short rule/divider draw-in. */
  ruleDraw: 0.28,
  /** Full-width rule left-to-right grow. */
  ruleGrow: 0.55,
  /** Large entrance reveal (mission stack, shared reveal baseline). */
  entrance: 0.65,
} as const;

/** Lift distances applied before a reveal. */
export const MOTION_LIFT = {
  /** Header/text lift (px). */
  textPx: 14,
  /** Card lift (rem). */
  cardRem: 1,
} as const;

/** Timeline overlaps (seconds, applied as negative position offsets). */
export const MOTION_OVERLAP = {
  /** Title to description / kicker to copy chaining. */
  text: 0.14,
  /** Card/member chain overlap. */
  chain: 0.18,
  /** Rule draw overlapping adjacent content. */
  draw: 0.22,
} as const;

/** GSAP stagger `each` values (seconds). */
export const MOTION_STAGGER = {
  /** Tight per-item stagger (social links, mobile member rows). */
  tight: 0.04,
} as const;
