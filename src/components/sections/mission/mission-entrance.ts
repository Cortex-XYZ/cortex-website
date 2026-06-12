import { gsap, ScrollTrigger } from "@/lib/gsap-setup";
import {
  playIfAlreadyInView,
  SCROLL_TRIGGER_MARKERS,
} from "@/lib/scroll-trigger";
import {
  MISSION_ENTRANCE_INTRO_DELAY,
  MISSION_ENTRANCE_INTRO_DURATION,
  MISSION_ENTRANCE_STACK_DURATION,
  MISSION_ENTRANCE_STACK_STAGGER,
  MISSION_ENTRANCE_STACK_Y_REM,
  MISSION_ENTRANCE_START,
} from "@/components/sections/mission/mission-layout";

export const MISSION_ENTRANCE_ID = "mission-entrance";

const MISSION_CARD_SELECTOR = "[data-mission-card]";
const MISSION_INTRO_SELECTOR = "[data-mission-intro]";

type MissionEntranceOptions = {
  trigger: HTMLElement;
  onComplete: () => void;
};

export function setMissionEntranceRestingState(scope: HTMLElement): void {
  const cards = scope.querySelectorAll<HTMLElement>(MISSION_CARD_SELECTOR);
  const intro = scope.querySelector<HTMLElement>(MISSION_INTRO_SELECTOR);

  gsap.set(cards, { autoAlpha: 1, y: 0, clearProps: "transform" });
  if (intro) {
    gsap.set(intro, { autoAlpha: 1, clearProps: "transform" });
  }
}

export function setupMissionEntrance({
  trigger,
  onComplete,
}: MissionEntranceOptions): () => void {
  const cards = trigger.querySelectorAll<HTMLElement>(MISSION_CARD_SELECTOR);
  const intro = trigger.querySelector<HTMLElement>(MISSION_INTRO_SELECTOR);

  gsap.set(cards, { autoAlpha: 0, y: `${MISSION_ENTRANCE_STACK_Y_REM}rem` });
  if (intro) {
    gsap.set(intro, { autoAlpha: 0 });
  }

  const timeline = gsap.timeline({
    onComplete,
    scrollTrigger: {
      id: MISSION_ENTRANCE_ID,
      trigger,
      start: MISSION_ENTRANCE_START,
      once: true,
      fastScrollEnd: true,
      invalidateOnRefresh: true,
      markers: SCROLL_TRIGGER_MARKERS,
      toggleActions: "play none none none",
    },
  });

  timeline.to(cards, {
    autoAlpha: 1,
    y: 0,
    duration: MISSION_ENTRANCE_STACK_DURATION,
    stagger: MISSION_ENTRANCE_STACK_STAGGER,
    ease: "power2.out",
  });

  if (intro) {
    timeline.to(
      intro,
      {
        autoAlpha: 1,
        duration: MISSION_ENTRANCE_INTRO_DURATION,
        ease: "power2.out",
      },
      `>-${MISSION_ENTRANCE_INTRO_DELAY}`,
    );
  }

  playIfAlreadyInView(timeline);

  return () => {
    timeline.scrollTrigger?.kill();
    timeline.kill();
    ScrollTrigger.getById(MISSION_ENTRANCE_ID)?.kill();
  };
}
