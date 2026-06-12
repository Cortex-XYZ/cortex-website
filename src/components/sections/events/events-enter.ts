import {
  EVENTS_CARD_REVEAL_Y_REM,
  EVENTS_ENTER_START,
  EVENTS_FOLLOW_UP_DESC_OVERLAP,
  EVENTS_FOLLOW_UP_DURATION,
  EVENTS_FOLLOW_UP_TITLE_OVERLAP,
  EVENTS_HEADER_DURATION,
  EVENTS_ITEM_DURATION,
  EVENTS_REVEAL_EASE,
  EVENTS_REVEAL_Y,
  EVENTS_ROW_ENTER_START,
  EVENTS_TOP_RULE_DURATION,
  EVENTS_TOP_RULE_EASE,
  EVENTS_TOP_RULE_ENTER_START,
} from "@/components/sections/events/events-scroll";
import { BELOW_DESKTOP_MQL, DESKTOP_MQL } from "@/hooks/use-is-desktop";
import { gsap, ScrollTrigger } from "@/lib/gsap-setup";
import {
  createScrollTriggerConfig,
  playIfAlreadyInView,
  scheduleScrollTriggerRefresh,
  setScrollRevealRestingState,
} from "@/lib/scroll-trigger";

export const EVENTS_TOP_RULE_ENTER_ID = "events-top-rule-enter";
export const EVENTS_HEADER_ENTER_ID = "events-header-enter";
export const EVENTS_CARD_ENTER_ID_PREFIX = "events-card-enter";
export const EVENTS_FOLLOW_UP_ENTER_ID = "events-follow-up-enter";
export const EVENTS_ENTER_PENDING_ATTR = "data-events-enter-pending";

const EVENTS_TOP_RULE_SELECTOR = "[data-events-top-rule]";
const EVENTS_TITLE_SELECTOR = "[data-events-title]";
const EVENTS_CARD_SELECTOR = "[data-events-card]";
const EVENTS_FOLLOW_UP_SELECTOR = "[data-events-follow-up]";
const EVENTS_FOLLOW_UP_KICKER_SELECTOR = "[data-events-follow-up-kicker]";
const EVENTS_FOLLOW_UP_TITLE_SELECTOR = "[data-events-follow-up-title]";
const EVENTS_FOLLOW_UP_DESCRIPTION_SELECTOR =
  "[data-events-follow-up-description]";

function clearEnterPending(scope: HTMLElement): void {
  scope.removeAttribute(EVENTS_ENTER_PENDING_ATTR);
}

function setTopRuleHidden(rule: HTMLElement): void {
  gsap.set(rule, { width: "0%" });
}

function setTopRuleResting(rule: HTMLElement): void {
  gsap.set(rule, { width: "100%", clearProps: "width" });
}

function setupTopRuleEnter(rule: HTMLElement): () => void {
  const timeline = gsap.timeline({
    scrollTrigger: createScrollTriggerConfig(
      rule,
      EVENTS_TOP_RULE_ENTER_START,
      EVENTS_TOP_RULE_ENTER_ID,
    ),
  });

  timeline.to(rule, {
    width: "100%",
    duration: EVENTS_TOP_RULE_DURATION,
    ease: EVENTS_TOP_RULE_EASE,
  });

  playIfAlreadyInView(timeline);

  return () => {
    timeline.scrollTrigger?.kill();
    timeline.kill();
    ScrollTrigger.getById(EVENTS_TOP_RULE_ENTER_ID)?.kill();
  };
}

function setupHeaderEnter(
  section: HTMLElement,
  title: HTMLElement,
): () => void {
  const timeline = gsap.timeline({
    defaults: { ease: EVENTS_REVEAL_EASE },
    scrollTrigger: createScrollTriggerConfig(
      section,
      EVENTS_ENTER_START,
      EVENTS_HEADER_ENTER_ID,
    ),
  });

  timeline.to(title, {
    autoAlpha: 1,
    y: 0,
    duration: EVENTS_HEADER_DURATION,
  });

  playIfAlreadyInView(timeline);

  return () => {
    timeline.scrollTrigger?.kill();
    timeline.kill();
    ScrollTrigger.getById(EVENTS_HEADER_ENTER_ID)?.kill();
  };
}

function setupCardEnter(card: HTMLElement, index: number): () => void {
  const timeline = gsap.timeline({
    defaults: { ease: EVENTS_REVEAL_EASE },
    scrollTrigger: createScrollTriggerConfig(
      card,
      EVENTS_ROW_ENTER_START,
      `${EVENTS_CARD_ENTER_ID_PREFIX}-${index + 1}`,
    ),
  });

  timeline.to(card, {
    autoAlpha: 1,
    y: 0,
    duration: EVENTS_ITEM_DURATION,
  });

  playIfAlreadyInView(timeline);

  return () => {
    timeline.scrollTrigger?.kill();
    timeline.kill();
  };
}

function setupFollowUpEnter(followUp: HTMLElement): () => void {
  const kicker = followUp.querySelector<HTMLElement>(
    EVENTS_FOLLOW_UP_KICKER_SELECTOR,
  );
  const title = followUp.querySelector<HTMLElement>(
    EVENTS_FOLLOW_UP_TITLE_SELECTOR,
  );
  const description = followUp.querySelector<HTMLElement>(
    EVENTS_FOLLOW_UP_DESCRIPTION_SELECTOR,
  );

  const timeline = gsap.timeline({
    defaults: { ease: EVENTS_REVEAL_EASE },
    scrollTrigger: createScrollTriggerConfig(
      followUp,
      EVENTS_ROW_ENTER_START,
      EVENTS_FOLLOW_UP_ENTER_ID,
    ),
  });

  if (kicker) {
    timeline.to(kicker, {
      autoAlpha: 1,
      y: 0,
      duration: EVENTS_FOLLOW_UP_DURATION,
    });
  }

  if (title) {
    timeline.to(
      title,
      { autoAlpha: 1, y: 0, duration: EVENTS_FOLLOW_UP_DURATION },
      kicker ? `-=${EVENTS_FOLLOW_UP_TITLE_OVERLAP}` : 0,
    );
  }

  if (description) {
    timeline.to(
      description,
      { autoAlpha: 1, y: 0, duration: EVENTS_FOLLOW_UP_DURATION },
      title || kicker ? `-=${EVENTS_FOLLOW_UP_DESC_OVERLAP}` : 0,
    );
  }

  playIfAlreadyInView(timeline);

  return () => {
    timeline.scrollTrigger?.kill();
    timeline.kill();
    ScrollTrigger.getById(EVENTS_FOLLOW_UP_ENTER_ID)?.kill();
  };
}

export function setupEventsEnter(scope: HTMLElement): () => void {
  const topRule = scope.querySelector<HTMLElement>(EVENTS_TOP_RULE_SELECTOR);
  const title = scope.querySelector<HTMLElement>(EVENTS_TITLE_SELECTOR);
  const cards = Array.from(
    scope.querySelectorAll<HTMLElement>(EVENTS_CARD_SELECTOR),
  );
  const followUp = scope.querySelector<HTMLElement>(EVENTS_FOLLOW_UP_SELECTOR);
  const followUpCopy = [
    scope.querySelector<HTMLElement>(EVENTS_FOLLOW_UP_KICKER_SELECTOR),
    scope.querySelector<HTMLElement>(EVENTS_FOLLOW_UP_TITLE_SELECTOR),
    scope.querySelector<HTMLElement>(EVENTS_FOLLOW_UP_DESCRIPTION_SELECTOR),
  ].filter((target): target is HTMLElement => target !== null);

  if (topRule) setTopRuleHidden(topRule);
  if (title) gsap.set(title, { autoAlpha: 0, y: EVENTS_REVEAL_Y });
  if (cards.length > 0) {
    gsap.set(cards, {
      autoAlpha: 0,
      y: `${EVENTS_CARD_REVEAL_Y_REM}rem`,
    });
  }
  if (followUpCopy.length > 0) {
    gsap.set(followUpCopy, { autoAlpha: 0, y: EVENTS_REVEAL_Y });
  }
  clearEnterPending(scope);

  const cleanups: Array<() => void> = [];
  const matchMedia = gsap.matchMedia();

  matchMedia.add(DESKTOP_MQL, () => {
    if (topRule) cleanups.push(setupTopRuleEnter(topRule));
  });

  matchMedia.add(BELOW_DESKTOP_MQL, () => {
    if (topRule) setTopRuleResting(topRule);
  });

  if (title) cleanups.push(setupHeaderEnter(scope, title));

  for (const [index, card] of cards.entries()) {
    cleanups.push(setupCardEnter(card, index));
  }

  if (followUp) cleanups.push(setupFollowUpEnter(followUp));

  scheduleScrollTriggerRefresh();

  return () => {
    for (const cleanup of cleanups) cleanup();
    matchMedia.revert();
    ScrollTrigger.getById(EVENTS_TOP_RULE_ENTER_ID)?.kill();
    ScrollTrigger.getById(EVENTS_HEADER_ENTER_ID)?.kill();
    ScrollTrigger.getById(EVENTS_FOLLOW_UP_ENTER_ID)?.kill();
  };
}

export function setEventsEnterRestingState(scope: HTMLElement): void {
  clearEnterPending(scope);

  const topRule = scope.querySelector<HTMLElement>(EVENTS_TOP_RULE_SELECTOR);
  const targets = [
    scope.querySelector<HTMLElement>(EVENTS_TITLE_SELECTOR),
    ...scope.querySelectorAll<HTMLElement>(EVENTS_CARD_SELECTOR),
    scope.querySelector<HTMLElement>(EVENTS_FOLLOW_UP_KICKER_SELECTOR),
    scope.querySelector<HTMLElement>(EVENTS_FOLLOW_UP_TITLE_SELECTOR),
    scope.querySelector<HTMLElement>(EVENTS_FOLLOW_UP_DESCRIPTION_SELECTOR),
  ].filter((target): target is HTMLElement => target !== null);

  if (topRule) setTopRuleResting(topRule);
  if (targets.length > 0) setScrollRevealRestingState(targets);
}
