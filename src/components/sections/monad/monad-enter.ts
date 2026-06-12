import {
  MONAD_BAND_OVERLAP,
  MONAD_DESC_OVERLAP,
  MONAD_DIVIDER_DURATION,
  MONAD_ENTER_START,
  MONAD_HEADER_DURATION,
  MONAD_ITEM_DURATION,
  MONAD_REVEAL_EASE,
  MONAD_REVEAL_Y,
  MONAD_SOCIAL_OVERLAP,
  MONAD_SOCIAL_STAGGER_EACH,
} from "@/components/sections/monad/monad-scroll";
import { gsap, ScrollTrigger } from "@/lib/gsap-setup";
import {
  createScrollTriggerConfig,
  playIfAlreadyInView,
  setScrollRevealRestingState,
} from "@/lib/scroll-trigger";

export const MONAD_ENTER_ID = "monad-enter";
export const MONAD_ENTER_PENDING_ATTR = "data-monad-enter-pending";

const MONAD_DIVIDER_SELECTOR = "[data-monad-divider] .section-divider";
const MONAD_TITLE_SELECTOR = "[data-monad-title]";
const MONAD_DESCRIPTION_SELECTOR = "[data-monad-description]";
const MONAD_EYEBROW_SELECTOR = "[data-monad-eyebrow]";
const MONAD_SOCIAL_LINK_SELECTOR = "[data-monad-social-link]";

function clearEnterPending(scope: HTMLElement): void {
  scope.removeAttribute(MONAD_ENTER_PENDING_ATTR);
}

function setDividerHidden(divider: HTMLElement): void {
  gsap.set(divider, {
    scaleX: 0,
    transformOrigin: "left center",
  });
}

function setDividerResting(divider: HTMLElement): void {
  gsap.set(divider, { scaleX: 1, clearProps: "transform" });
}

function setContentHidden(
  title: HTMLElement | null,
  description: HTMLElement | null,
  eyebrow: HTMLElement | null,
  socialLinks: HTMLElement[],
): void {
  if (title) gsap.set(title, { autoAlpha: 0, y: MONAD_REVEAL_Y });
  if (description) gsap.set(description, { autoAlpha: 0, y: MONAD_REVEAL_Y });
  if (eyebrow) gsap.set(eyebrow, { autoAlpha: 0, y: MONAD_REVEAL_Y });
  if (socialLinks.length > 0) {
    gsap.set(socialLinks, { autoAlpha: 0, y: MONAD_REVEAL_Y });
  }
}

/** Intro + band meta entrance. Topic cards animate in `monad-topic-enter.ts`. */
export function setupMonadEnter(scope: HTMLElement): () => void {
  const divider = scope.querySelector<HTMLElement>(MONAD_DIVIDER_SELECTOR);
  const title = scope.querySelector<HTMLElement>(MONAD_TITLE_SELECTOR);
  const description = scope.querySelector<HTMLElement>(MONAD_DESCRIPTION_SELECTOR);
  const eyebrow = scope.querySelector<HTMLElement>(MONAD_EYEBROW_SELECTOR);
  const socialLinks = Array.from(
    scope.querySelectorAll<HTMLElement>(MONAD_SOCIAL_LINK_SELECTOR),
  );

  if (divider) setDividerHidden(divider);
  setContentHidden(title, description, eyebrow, socialLinks);
  clearEnterPending(scope);

  const timeline = gsap.timeline({
    defaults: { ease: MONAD_REVEAL_EASE },
    scrollTrigger: createScrollTriggerConfig(scope, MONAD_ENTER_START, MONAD_ENTER_ID),
  });

  if (divider) {
    timeline.to(divider, {
      scaleX: 1,
      duration: MONAD_DIVIDER_DURATION,
      ease: "power2.inOut",
    });
  }

  if (title) {
    timeline.to(
      title,
      { autoAlpha: 1, y: 0, duration: MONAD_HEADER_DURATION },
      divider ? ">" : undefined,
    );
  }

  if (description) {
    timeline.to(
      description,
      { autoAlpha: 1, y: 0, duration: MONAD_HEADER_DURATION },
      title ? `-=${MONAD_DESC_OVERLAP}` : ">",
    );
  }

  if (eyebrow) {
    timeline.to(
      eyebrow,
      { autoAlpha: 1, y: 0, duration: MONAD_HEADER_DURATION },
      description || title ? `>-${MONAD_BAND_OVERLAP}` : ">",
    );
  }

  if (socialLinks.length > 0) {
    timeline.to(
      socialLinks,
      {
        autoAlpha: 1,
        y: 0,
        duration: MONAD_ITEM_DURATION,
        stagger: {
          each: MONAD_SOCIAL_STAGGER_EACH,
          from: "start",
        },
      },
      eyebrow ? `>-${MONAD_SOCIAL_OVERLAP}` : ">",
    );
  }

  playIfAlreadyInView(timeline);

  return () => {
    timeline.scrollTrigger?.kill();
    timeline.kill();
    ScrollTrigger.getById(MONAD_ENTER_ID)?.kill();
  };
}

export function setMonadEnterRestingState(scope: HTMLElement): void {
  const section =
    scope.closest<HTMLElement>("[data-monad-section]") ?? scope;
  clearEnterPending(section);

  const divider = section.querySelector<HTMLElement>(MONAD_DIVIDER_SELECTOR);
  const targets = [
    section.querySelector<HTMLElement>(MONAD_TITLE_SELECTOR),
    section.querySelector<HTMLElement>(MONAD_DESCRIPTION_SELECTOR),
    section.querySelector<HTMLElement>(MONAD_EYEBROW_SELECTOR),
    ...section.querySelectorAll<HTMLElement>(MONAD_SOCIAL_LINK_SELECTOR),
  ].filter((target): target is HTMLElement => target !== null);

  if (divider) setDividerResting(divider);
  if (targets.length > 0) setScrollRevealRestingState(targets);
}
