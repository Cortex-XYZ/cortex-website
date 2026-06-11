import {
  SERVICES_CARD_CHAIN_OVERLAP,
  SERVICES_CARD_REVEAL_Y_REM,
  SERVICES_CTA_OVERLAP,
  SERVICES_DESC_OVERLAP,
  SERVICES_DIVIDER_DURATION,
  SERVICES_DIVIDER_EASE,
  SERVICES_DIVIDER_ENTER_START,
  SERVICES_ENTER_START,
  SERVICES_HEADER_DURATION,
  SERVICES_ITEM_DURATION,
  SERVICES_REVEAL_EASE,
  SERVICES_REVEAL_Y,
  SERVICES_ROW_ENTER_START,
} from "@/components/sections/services/services-scroll";
import { DESKTOP_MQL } from "@/hooks/use-is-desktop";
import { gsap, ScrollTrigger } from "@/lib/gsap-setup";
import {
  createScrollTriggerConfig,
  playIfAlreadyInView,
  scheduleScrollTriggerRefresh,
  setScrollRevealRestingState,
} from "@/lib/scroll-trigger";

export const SERVICES_HEADER_ENTER_ID = "services-header-enter";
export const SERVICES_CARDS_ROW1_ENTER_ID = "services-cards-row-1";
export const SERVICES_CARDS_ROW2_ENTER_ID = "services-cards-row-2";
export const SERVICES_CARDS_ROW3_ENTER_ID = "services-cards-row-3";
export const SERVICES_DIVIDER_ENTER_ID = "services-divider-enter";
export const SERVICES_ENTER_PENDING_ATTR = "data-services-enter-pending";

const SERVICES_TABLET_MQL = "(min-width: 768px) and (max-width: 1279px)";
const SERVICES_MOBILE_MQL = "(max-width: 767px)";

const SERVICES_TITLE_SELECTOR = "[data-services-title]";
const SERVICES_DESCRIPTION_SELECTOR = "[data-services-description]";
const SERVICES_CARD_SELECTOR = "[data-services-card]";
const SERVICES_CTA_SELECTOR = "[data-services-cta]";
const SERVICES_DIVIDER_LINE_SELECTOR = "[data-services-divider-line]";

type ServicesRowEnter = {
  trigger: HTMLElement;
  items: HTMLElement[];
  id: string;
};

function clearEnterPending(scope: HTMLElement): void {
  scope.removeAttribute(SERVICES_ENTER_PENDING_ATTR);
}

function setDividerHidden(line: HTMLElement): void {
  gsap.set(line, { width: "0%" });
}

function setDividerResting(line: HTMLElement): void {
  gsap.set(line, { width: "100%", clearProps: "width" });
}

function createRowEnterTimeline(row: ServicesRowEnter): gsap.core.Timeline {
  const timeline = gsap.timeline({
    defaults: { ease: SERVICES_REVEAL_EASE },
    scrollTrigger: createScrollTriggerConfig(
      row.trigger,
      SERVICES_ROW_ENTER_START,
      row.id,
    ),
  });

  for (const [index, item] of row.items.entries()) {
    const overlap =
      index === 0
        ? 0
        : item.matches(SERVICES_CTA_SELECTOR)
          ? SERVICES_CTA_OVERLAP
          : SERVICES_CARD_CHAIN_OVERLAP;

    timeline.to(
      item,
      { autoAlpha: 1, y: 0, duration: SERVICES_ITEM_DURATION },
      index === 0 ? 0 : `-=${overlap}`,
    );
  }

  playIfAlreadyInView(timeline);
  return timeline;
}

function setupDividerEnter(line: HTMLElement): () => void {
  const timeline = gsap.timeline({
    scrollTrigger: createScrollTriggerConfig(
      line,
      SERVICES_DIVIDER_ENTER_START,
      SERVICES_DIVIDER_ENTER_ID,
    ),
  });

  timeline.to(line, {
    width: "100%",
    duration: SERVICES_DIVIDER_DURATION,
    ease: SERVICES_DIVIDER_EASE,
  });

  playIfAlreadyInView(timeline);

  return () => {
    timeline.scrollTrigger?.kill();
    timeline.kill();
    ScrollTrigger.getById(SERVICES_DIVIDER_ENTER_ID)?.kill();
  };
}

function buildDesktopRows(
  cards: HTMLElement[],
  cta: HTMLElement | null,
): ServicesRowEnter[] {
  const rows: ServicesRowEnter[] = [];

  if (cards[0]) {
    rows.push({
      trigger: cards[0],
      items: cards.slice(0, 3),
      id: SERVICES_CARDS_ROW1_ENTER_ID,
    });
  }

  if (cards[3]) {
    const row2Items = cards.slice(3, 5);
    if (cta) row2Items.push(cta);

    rows.push({
      trigger: cards[3],
      items: row2Items,
      id: SERVICES_CARDS_ROW2_ENTER_ID,
    });
  }

  return rows;
}

function buildTabletRows(cards: HTMLElement[]): ServicesRowEnter[] {
  const rows: ServicesRowEnter[] = [];

  if (cards[0]) {
    rows.push({
      trigger: cards[0],
      items: cards.slice(0, 2),
      id: SERVICES_CARDS_ROW1_ENTER_ID,
    });
  }

  if (cards[2]) {
    rows.push({
      trigger: cards[2],
      items: cards.slice(2, 4),
      id: SERVICES_CARDS_ROW2_ENTER_ID,
    });
  }

  if (cards[4]) {
    rows.push({
      trigger: cards[4],
      items: [cards[4]],
      id: SERVICES_CARDS_ROW3_ENTER_ID,
    });
  }

  return rows;
}

function buildMobileRows(cards: HTMLElement[]): ServicesRowEnter[] {
  return cards.map((card, index) => ({
    trigger: card,
    items: [card],
    id: `services-cards-row-${index + 1}`,
  }));
}

function setupCardRowEnters(cards: HTMLElement[], cta: HTMLElement | null): () => void {
  const timelines: gsap.core.Timeline[] = [];
  const matchMedia = gsap.matchMedia();

  matchMedia.add(DESKTOP_MQL, () => {
    for (const row of buildDesktopRows(cards, cta)) {
      timelines.push(createRowEnterTimeline(row));
    }
  });

  matchMedia.add(SERVICES_TABLET_MQL, () => {
    for (const row of buildTabletRows(cards)) {
      timelines.push(createRowEnterTimeline(row));
    }
  });

  matchMedia.add(SERVICES_MOBILE_MQL, () => {
    for (const row of buildMobileRows(cards)) {
      timelines.push(createRowEnterTimeline(row));
    }
  });

  return () => {
    for (const timeline of timelines) {
      timeline.scrollTrigger?.kill();
      timeline.kill();
    }
    matchMedia.revert();
    ScrollTrigger.getById(SERVICES_CARDS_ROW1_ENTER_ID)?.kill();
    ScrollTrigger.getById(SERVICES_CARDS_ROW2_ENTER_ID)?.kill();
    ScrollTrigger.getById(SERVICES_CARDS_ROW3_ENTER_ID)?.kill();
  };
}

export function setupServicesEnter(scope: HTMLElement): () => void {
  const title = scope.querySelector<HTMLElement>(SERVICES_TITLE_SELECTOR);
  const description = scope.querySelector<HTMLElement>(
    SERVICES_DESCRIPTION_SELECTOR,
  );
  const cards = Array.from(
    scope.querySelectorAll<HTMLElement>(SERVICES_CARD_SELECTOR),
  );
  const cta = scope.querySelector<HTMLElement>(SERVICES_CTA_SELECTOR);
  const divider = scope.querySelector<HTMLElement>(SERVICES_DIVIDER_LINE_SELECTOR);

  if (title) gsap.set(title, { autoAlpha: 0, y: SERVICES_REVEAL_Y });
  if (description) {
    gsap.set(description, { autoAlpha: 0, y: SERVICES_REVEAL_Y });
  }
  if (cards.length > 0) {
    gsap.set(cards, {
      autoAlpha: 0,
      y: `${SERVICES_CARD_REVEAL_Y_REM}rem`,
    });
  }
  if (cta) {
    gsap.set(cta, {
      autoAlpha: 0,
      y: `${SERVICES_CARD_REVEAL_Y_REM}rem`,
    });
  }
  if (divider) setDividerHidden(divider);
  clearEnterPending(scope);

  const headerTimeline = gsap.timeline({
    defaults: { ease: SERVICES_REVEAL_EASE },
    scrollTrigger: createScrollTriggerConfig(
      scope,
      SERVICES_ENTER_START,
      SERVICES_HEADER_ENTER_ID,
    ),
  });

  if (title) {
    headerTimeline.to(title, {
      autoAlpha: 1,
      y: 0,
      duration: SERVICES_HEADER_DURATION,
    });
  }

  if (description) {
    headerTimeline.to(
      description,
      { autoAlpha: 1, y: 0, duration: SERVICES_HEADER_DURATION },
      title ? `-=${SERVICES_DESC_OVERLAP}` : undefined,
    );
  }

  playIfAlreadyInView(headerTimeline);

  const cleanupRows = setupCardRowEnters(cards, cta);
  const cleanupDivider = divider ? setupDividerEnter(divider) : () => {};

  scheduleScrollTriggerRefresh();

  return () => {
    headerTimeline.scrollTrigger?.kill();
    headerTimeline.kill();
    ScrollTrigger.getById(SERVICES_HEADER_ENTER_ID)?.kill();
    cleanupRows();
    cleanupDivider();
  };
}

export function setServicesEnterRestingState(scope: HTMLElement): void {
  const section =
    scope.closest<HTMLElement>("[data-services-section]") ?? scope;
  clearEnterPending(section);

  const divider = section.querySelector<HTMLElement>(SERVICES_DIVIDER_LINE_SELECTOR);
  const targets = [
    section.querySelector<HTMLElement>(SERVICES_TITLE_SELECTOR),
    section.querySelector<HTMLElement>(SERVICES_DESCRIPTION_SELECTOR),
    ...section.querySelectorAll<HTMLElement>(SERVICES_CARD_SELECTOR),
    section.querySelector<HTMLElement>(SERVICES_CTA_SELECTOR),
  ].filter((target): target is HTMLElement => target !== null);

  if (divider) setDividerResting(divider);
  if (targets.length > 0) setScrollRevealRestingState(targets);
}
