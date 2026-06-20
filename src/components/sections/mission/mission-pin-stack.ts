import { ScrollTrigger } from "@/lib/gsap-setup";
import { SCROLL_TRIGGER_MARKERS } from "@/lib/scroll-trigger";
import { getSiteHeaderHeightPx } from "@/lib/layout/site-header-scroll";
import {
  MISSION_PIN_SCROLL_PER_CARD,
  MISSION_STACK_PIN_START_OFFSET_REM,
} from "@/components/sections/mission/mission-layout";

export const MISSION_STACK_SCROLL_ID = "mission-stack-scroll";

export type MissionClickScroll = {
  fromIndex: number;
  targetIndex: number;
  /** Long jumps lock the target card — skip stepping through intermediates. */
  lockIndex: boolean;
};

type MissionStackScrollOptions = {
  /** Card row — start/end are measured from here (with offset). */
  trigger: HTMLElement;
  /** Intro + cards — the element that gets pinned. */
  pin: HTMLElement;
  cardCount: number;
  onActiveIndexChange: (index: number) => void;
  /** Stack card transitions stay idle until the entrance sequence finishes. */
  isStackInteractionEnabled: () => boolean;
  /** Hold snap at the current progress while a click scroll tween runs. */
  getClickScroll: () => MissionClickScroll | null;
};

export type MissionStackScrollHandle = {
  scrollTrigger: ScrollTrigger;
  syncActiveIndex: (index: number) => void;
};

export function getMissionStackStart(): string {
  return `top-=${MISSION_STACK_PIN_START_OFFSET_REM}rem top+=${getSiteHeaderHeightPx()}`;
}

export function getMissionStackProgress(
  cardCount: number,
  index: number,
): number {
  if (cardCount <= 1) return 0;
  return index / (cardCount - 1);
}

export function getMissionStackIndex(
  cardCount: number,
  progress: number,
): number {
  if (cardCount <= 1) return 0;
  return Math.min(cardCount - 1, Math.round(progress * (cardCount - 1)));
}

/** Monotonic index while a click scroll runs — avoids round() flipping on short hops. */
export function getMissionStackIndexToward(
  cardCount: number,
  progress: number,
  fromIndex: number,
  targetIndex: number,
): number {
  if (cardCount <= 1) return 0;
  if (fromIndex === targetIndex) return fromIndex;

  const scaled = progress * (cardCount - 1);
  if (targetIndex > fromIndex) {
    return Math.min(targetIndex, Math.floor(scaled + 1e-4));
  }
  return Math.max(targetIndex, Math.ceil(scaled - 1e-4));
}

export function getMissionStackScrollTop(
  scrollTrigger: ScrollTrigger,
  cardCount: number,
  index: number,
): number | null {
  const { start, end } = scrollTrigger;

  if (!Number.isFinite(start) || !Number.isFinite(end)) {
    return null;
  }

  const progress = getMissionStackProgress(cardCount, index);
  return start + progress * (end - start);
}

export function createMissionStackScrollTrigger({
  trigger,
  pin,
  cardCount,
  onActiveIndexChange,
  isStackInteractionEnabled,
  getClickScroll,
}: MissionStackScrollOptions): MissionStackScrollHandle {
  let activeIndex = 0;

  const scrollTriggerVars: ScrollTrigger.Vars = {
    id: MISSION_STACK_SCROLL_ID,
    trigger,
    pin,
    start: getMissionStackStart,
    end: () =>
      `+=${Math.max(1, cardCount - 1) * MISSION_PIN_SCROLL_PER_CARD * window.innerHeight}`,
    anticipatePin: 1,
    invalidateOnRefresh: true,
    markers: SCROLL_TRIGGER_MARKERS,
    onUpdate: (self) => {
      if (!isStackInteractionEnabled()) return;

      const clickScroll = getClickScroll();
      if (clickScroll?.lockIndex) return;

      const nextIndex = clickScroll
        ? getMissionStackIndexToward(
            cardCount,
            self.progress,
            clickScroll.fromIndex,
            clickScroll.targetIndex,
          )
        : getMissionStackIndex(cardCount, self.progress);

      if (nextIndex === activeIndex) return;
      activeIndex = nextIndex;
      onActiveIndexChange(nextIndex);
    },
  };

  if (cardCount > 1) {
    scrollTriggerVars.snap = {
      snapTo: (progress) => {
        if (getClickScroll()) return progress;
        return getMissionStackProgress(
          cardCount,
          getMissionStackIndex(cardCount, progress),
        );
      },
      duration: { min: 0.15, max: 0.35 },
      delay: 0.05,
      ease: "power1.inOut",
    };
  }

  const scrollTrigger = ScrollTrigger.create(scrollTriggerVars);

  return {
    scrollTrigger,
    syncActiveIndex: (index: number) => {
      activeIndex = index;
    },
  };
}
