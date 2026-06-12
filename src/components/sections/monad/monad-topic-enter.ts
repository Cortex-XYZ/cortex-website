import {
  MONAD_ITEM_DURATION,
  MONAD_REVEAL_EASE,
  MONAD_REVEAL_Y_REM,
  MONAD_TOPIC_CHAIN_OVERLAP,
  MONAD_TOPIC_ROW_ENTER_START,
} from "@/components/sections/monad/monad-scroll";
import { DESKTOP_MQL } from "@/hooks/use-is-desktop";
import { gsap, ScrollTrigger } from "@/lib/gsap-setup";
import {
  createScrollTriggerConfig,
  playIfAlreadyInView,
  scheduleScrollTriggerRefresh,
} from "@/lib/scroll-trigger";

export const MONAD_TOPICS_ROW1_ENTER_ID = "monad-topics-row-1";
export const MONAD_TOPICS_ROW2_ENTER_ID = "monad-topics-row-2";

const MONAD_TOPIC_SELECTOR = "[data-monad-topic]";
const MONAD_TOPIC_MOBILE_MQL = "(max-width: 1279px)";

type MonadTopicRowEnter = {
  trigger: HTMLElement;
  items: HTMLElement[];
  id: string;
};

function createRowEnterTimeline(row: MonadTopicRowEnter): gsap.core.Timeline {
  const timeline = gsap.timeline({
    defaults: { ease: MONAD_REVEAL_EASE },
    scrollTrigger: createScrollTriggerConfig(
      row.trigger,
      MONAD_TOPIC_ROW_ENTER_START,
      row.id,
    ),
  });

  for (const [index, topic] of row.items.entries()) {
    timeline.to(
      topic,
      { autoAlpha: 1, y: 0, duration: MONAD_ITEM_DURATION },
      index === 0 ? 0 : `-=${MONAD_TOPIC_CHAIN_OVERLAP}`,
    );
  }

  playIfAlreadyInView(timeline);
  return timeline;
}

function buildDesktopRows(topics: HTMLElement[]): MonadTopicRowEnter[] {
  const rows: MonadTopicRowEnter[] = [];

  if (topics[0]) {
    rows.push({
      trigger: topics[0],
      items: topics.slice(0, 2),
      id: MONAD_TOPICS_ROW1_ENTER_ID,
    });
  }

  if (topics[2]) {
    rows.push({
      trigger: topics[2],
      items: topics.slice(2, 4),
      id: MONAD_TOPICS_ROW2_ENTER_ID,
    });
  }

  return rows;
}

function buildStackedRows(topics: HTMLElement[]): MonadTopicRowEnter[] {
  return topics.map((topic, index) => ({
    trigger: topic,
    items: [topic],
    id: `monad-topics-row-${index + 1}`,
  }));
}

function setupTopicRowEnters(topics: HTMLElement[]): () => void {
  const timelines: gsap.core.Timeline[] = [];
  const matchMedia = gsap.matchMedia();

  matchMedia.add(DESKTOP_MQL, () => {
    for (const row of buildDesktopRows(topics)) {
      timelines.push(createRowEnterTimeline(row));
    }
  });

  matchMedia.add(MONAD_TOPIC_MOBILE_MQL, () => {
    for (const row of buildStackedRows(topics)) {
      timelines.push(createRowEnterTimeline(row));
    }
  });

  scheduleScrollTriggerRefresh();

  return () => {
    for (const timeline of timelines) {
      timeline.scrollTrigger?.kill();
      timeline.kill();
    }
    matchMedia.revert();
    ScrollTrigger.getById(MONAD_TOPICS_ROW1_ENTER_ID)?.kill();
    ScrollTrigger.getById(MONAD_TOPICS_ROW2_ENTER_ID)?.kill();
  };
}

export function setupMonadTopicEnter(
  listRoot: HTMLElement,
  _section: HTMLElement,
): () => void {
  const topics = Array.from(
    listRoot.querySelectorAll<HTMLElement>(MONAD_TOPIC_SELECTOR),
  );

  if (topics.length === 0) {
    return () => {};
  }

  gsap.set(topics, { autoAlpha: 0, y: `${MONAD_REVEAL_Y_REM}rem` });

  return setupTopicRowEnters(topics);
}

export function setMonadTopicRestingState(listRoot: HTMLElement): void {
  const topics = listRoot.querySelectorAll<HTMLElement>(MONAD_TOPIC_SELECTOR);
  gsap.set(topics, { autoAlpha: 1, y: 0, clearProps: "transform" });
}
