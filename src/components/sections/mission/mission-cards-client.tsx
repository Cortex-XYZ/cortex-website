"use client";

import { memo, useCallback, useRef, useState, type ReactNode } from "react";
import {
  MissionIllustration,
  MissionIllustrationFallback,
} from "@/components/illustrations/mission-illustration";
import { DESKTOP_MQL, useIsDesktop } from "@/hooks/use-is-desktop";
import { useInView } from "@/hooks/use-in-view";
import { useReducedMotion } from "@/hooks/use-reduced-motion";
import { gsap, ScrollTrigger, useGSAP } from "@/lib/gsap-setup";
import { cn } from "@/lib/utils";
import {
  MISSION_CARD_COLLAPSED_WIDTH_STYLE,
  MISSION_CARD_EXPANDED_WIDTH_STYLE,
  MISSION_CARD_HEIGHT_STYLE,
  MISSION_STACK_INTRO_WIDTH_STYLE,
} from "@/components/sections/mission/mission-layout";
import {
  setMissionEntranceRestingState,
  setupMissionEntrance,
} from "@/components/sections/mission/mission-entrance";
import {
  createMissionStackScrollTrigger,
  getMissionStackIndex,
  getMissionStackScrollTop,
  type MissionClickScroll,
  type MissionStackScrollHandle,
} from "@/components/sections/mission/mission-pin-stack";
import type { MissionCard, MissionCardId } from "@/lib/content/mission";

type MissionIllustrationPlacement = {
  topClass: string;
  sizeClass: string;
};

type MissionCardsProps = {
  cards: readonly MissionCard[];
};

type MissionDesktopStackProps = MissionCardsProps & {
  intro: ReactNode;
};

const MISSION_COLLAPSED_EYEBROW_CLASS =
  "mission-eyebrow mission-collapsed-card-eyebrow";

const MISSION_ILLUSTRATION_PLACEMENTS = {
  pulse: {
    topClass: "top-[12.5rem] md:top-[14.5rem] xl:top-[60%] xl:-translate-y-1/2",
    sizeClass: "size-[13.5rem] md:size-[22rem] xl:size-[clamp(18rem,42dvh,28rem)]",
  },
  disciplines: {
    topClass: "top-[12rem] md:top-[14rem] xl:top-[calc(50%+3rem)] xl:-translate-y-1/2",
    sizeClass: "size-[13rem] md:size-[22rem] xl:size-[clamp(18rem,42dvh,28rem)]",
  },
  collections: {
    topClass: "top-[13.5rem] md:top-[14.5rem] xl:top-[calc(50%+3rem)] xl:-translate-y-1/2",
    sizeClass: "size-[11.5rem] md:size-[20rem] xl:size-[clamp(16rem,36dvh,24rem)]",
  },
  ideas: {
    topClass: "top-[12.8rem] md:top-[14.5rem] xl:top-[calc(50%+3rem)] xl:-translate-y-1/2",
    sizeClass: "size-[14rem] md:size-[22rem] xl:size-[clamp(18rem,42dvh,28rem)]",
  },
  culture: {
    topClass: "top-[14.5rem] md:top-[15.5rem] xl:top-[60%] xl:-translate-y-1/2",
    sizeClass: "size-[11.5rem] md:size-[18rem] xl:size-[clamp(16rem,36dvh,24rem)]",
  },
} satisfies Record<MissionCardId, MissionIllustrationPlacement>;

const MissionExpandedCard = memo(function MissionExpandedCard({
  card,
  illustrationActive,
  className,
}: {
  card: MissionCard;
  /** When false, illustration renders a static frame (no GSAP loop). */
  illustrationActive: boolean;
  className?: string;
}) {
  const { topClass, sizeClass } = MISSION_ILLUSTRATION_PLACEMENTS[card.id];
  const illustrationClassName = cn("text-text-secondary", sizeClass);

  return (
    <div className={cn("mission-card-shell", className)}>
      <div className={cn("mission-card-illustration", topClass)}>
        {illustrationActive ? (
          <MissionIllustration
            key={card.id}
            pattern={card.pattern}
            active
            className={illustrationClassName}
          />
        ) : (
          <MissionIllustrationFallback className={illustrationClassName} />
        )}
      </div>

      <div className="mission-card-content">
        <div>
          <p className="mission-eyebrow">{card.eyebrow}</p>
          <h2 className="mission-card-title mission-card-title-spaced">
            {card.title}
          </h2>
        </div>
        <div aria-hidden />
        <p className="mission-card-body self-end">{card.body}</p>
      </div>
    </div>
  );
});

function getClosestCarouselIndex(container: HTMLDivElement): number {
  const center = container.scrollLeft + container.clientWidth / 2;
  const cards = Array.from(container.children) as HTMLElement[];

  let closestIndex = 0;
  let closestDistance = Number.POSITIVE_INFINITY;

  for (let index = 0; index < cards.length; index++) {
    const card = cards[index];
    const cardCenter = card.offsetLeft + card.offsetWidth / 2;
    const distance = Math.abs(center - cardCenter);
    if (distance < closestDistance) {
      closestDistance = distance;
      closestIndex = index;
    }
  }

  return closestIndex;
}

export function MissionDesktopStack({
  cards,
  intro,
}: MissionDesktopStackProps) {
  const pinRef = useRef<HTMLDivElement>(null);
  const stackRef = useRef<HTMLDivElement>(null);
  const stackScrollRef = useRef<MissionStackScrollHandle | null>(null);
  const entranceCompleteRef = useRef(false);
  const clickScrollRef = useRef<MissionClickScroll | null>(null);
  const clickScrollGenerationRef = useRef(0);
  const [activeIndex, setActiveIndex] = useState(0);
  const [entranceComplete, setEntranceComplete] = useState(false);
  const reducedMotion = useReducedMotion();
  const { ref: inViewRef, inView } = useInView();

  const markEntranceComplete = useCallback(() => {
    entranceCompleteRef.current = true;
    setEntranceComplete(true);
  }, []);

  const setActiveIndexIfChanged = useCallback((index: number) => {
    setActiveIndex((previous) => (previous === index ? previous : index));
  }, []);

  useGSAP(
    () => {
      const pin = pinRef.current;
      const stack = stackRef.current;
      if (!pin || !stack) return;

      const matchMedia = gsap.matchMedia();

      matchMedia.add(DESKTOP_MQL, () => {
        entranceCompleteRef.current = reducedMotion;
        setEntranceComplete(reducedMotion);

        if (reducedMotion) {
          setMissionEntranceRestingState(pin);
          stackScrollRef.current = null;
          return;
        }

        const cleanupEntrance = setupMissionEntrance({
          trigger: pin,
          onComplete: markEntranceComplete,
        });

        const stackScroll = createMissionStackScrollTrigger({
          trigger: stack,
          pin,
          cardCount: cards.length,
          onActiveIndexChange: setActiveIndexIfChanged,
          isStackInteractionEnabled: () => entranceCompleteRef.current,
          getClickScroll: () => clickScrollRef.current,
        });

        stackScrollRef.current = stackScroll;

        return () => {
          cleanupEntrance();
          stackScroll.scrollTrigger.kill();
          stackScrollRef.current = null;
          entranceCompleteRef.current = false;
          clickScrollRef.current = null;
        };
      });

      return () => {
        matchMedia.revert();
      };
    },
    {
      scope: pinRef,
      dependencies: [
        reducedMotion,
        setActiveIndexIfChanged,
        markEntranceComplete,
        cards.length,
      ],
    },
  );

  const activateCard = useCallback(
    (index: number) => {
      if (reducedMotion) {
        setActiveIndex(index);
        return;
      }

      const stackScroll = stackScrollRef.current;
      if (!stackScroll) return;

      const { scrollTrigger, syncActiveIndex } = stackScroll;
      const fromIndex = getMissionStackIndex(cards.length, scrollTrigger.progress);
      if (fromIndex === index) return;

      gsap.killTweensOf(window);

      const cardDistance = Math.abs(index - fromIndex);
      const lockIndex = cardDistance > 1;

      if (lockIndex) {
        syncActiveIndex(index);
        setActiveIndex(index);
      }

      const generation = clickScrollGenerationRef.current + 1;
      clickScrollGenerationRef.current = generation;
      clickScrollRef.current = { fromIndex, targetIndex: index, lockIndex };
      const targetScrollTop = getMissionStackScrollTop(
        scrollTrigger,
        cards.length,
        index,
      );

      gsap.to(window, {
        scrollTo: { y: targetScrollTop, autoKill: true },
        duration: 0.28 + cardDistance * 0.16,
        ease: "power2.inOut",
        overwrite: true,
        onComplete: () => {
          if (clickScrollGenerationRef.current !== generation) return;
          clickScrollRef.current = null;
          syncActiveIndex(index);
          setActiveIndex(index);
          ScrollTrigger.update();
        },
      });
    },
    [cards.length, reducedMotion],
  );

  return (
    <div ref={pinRef} data-mission-pin className="hidden xl:block">
      <div
        ref={inViewRef}
        className="site-container flex flex-row items-start gap-11"
      >
        <div
          className="flex shrink-0 flex-col"
          style={{
            ...MISSION_CARD_HEIGHT_STYLE,
            ...MISSION_STACK_INTRO_WIDTH_STYLE,
          }}
        >
          <div className="flex-1" aria-hidden />
          <div data-mission-intro>{intro}</div>
        </div>

        <div
          ref={stackRef}
          data-mission-stack
          className="flex gap-2.5"
          aria-label="Mission statement cards"
        >
          {cards.map((card, index) => {
            const isActive = activeIndex === index;

            return (
              <article
                key={card.id}
                data-mission-card
                data-mission-card-id={card.id}
                data-mission-card-index={index}
                className="mission-desktop-card-trigger"
                style={{
                  ...MISSION_CARD_HEIGHT_STYLE,
                  ...(isActive
                    ? MISSION_CARD_EXPANDED_WIDTH_STYLE
                    : MISSION_CARD_COLLAPSED_WIDTH_STYLE),
                }}
                aria-current={isActive ? "true" : undefined}
              >
                {isActive ? (
                  <MissionExpandedCard
                    card={card}
                    illustrationActive={entranceComplete && inView}
                    className="h-full border-0"
                  />
                ) : (
                  <button
                    type="button"
                    onClick={() => activateCard(index)}
                    className="mission-collapsed-card-button"
                    aria-label={card.eyebrow}
                  >
                    <span className={MISSION_COLLAPSED_EYEBROW_CLASS}>
                      {card.eyebrow}
                    </span>
                  </button>
                )}
              </article>
            );
          })}
        </div>
      </div>
    </div>
  );
}

export function MissionMobileCards({ cards }: MissionCardsProps) {
  const [activeIndex, setActiveIndex] = useState(0);
  const carouselRef = useRef<HTMLDivElement | null>(null);
  const scrollRafRef = useRef<number | null>(null);
  const isDesktop = useIsDesktop();
  const { ref: inViewRef, inView } = useInView();

  const setCarouselRef = useCallback((node: HTMLDivElement | null) => {
    if (node === null && scrollRafRef.current !== null) {
      cancelAnimationFrame(scrollRafRef.current);
      scrollRafRef.current = null;
    }
    carouselRef.current = node;
  }, []);

  const scrollToCard = useCallback((index: number) => {
    const container = carouselRef.current;
    const cardEl = container?.children.item(index) as HTMLElement | null;
    cardEl?.scrollIntoView({
      behavior: "smooth",
      inline: "center",
      block: "nearest",
    });
    setActiveIndex(index);
  }, []);

  const handleCarouselScroll = useCallback(() => {
    if (scrollRafRef.current !== null) return;

    scrollRafRef.current = requestAnimationFrame(() => {
      scrollRafRef.current = null;

      const container = carouselRef.current;
      if (!container) return;

      const closestIndex = getClosestCarouselIndex(container);
      setActiveIndex((prev) => (prev === closestIndex ? prev : closestIndex));
    });
  }, []);

  return (
    <div ref={inViewRef} className="mt-6 md:mt-8 xl:hidden">
      <div
        ref={setCarouselRef}
        onScroll={handleCarouselScroll}
        className="mission-carousel-track"
      >
        {cards.map((card, i) => (
          <MissionExpandedCard
            key={card.id}
            card={card}
            illustrationActive={!isDesktop && inView && activeIndex === i}
            className="mission-carousel-card"
          />
        ))}
      </div>

      <nav className="mission-pagination" aria-label="Mission cards">
        {cards.map((card, i) => (
          <button
            key={card.id}
            type="button"
            aria-current={activeIndex === i ? "true" : undefined}
            aria-label={card.eyebrow}
            onClick={() => scrollToCard(i)}
            className={cn(
              "mission-pagination-dot",
              activeIndex === i
                ? "bg-action-primary"
                : "bg-neutral-silver-gray",
            )}
          />
        ))}
      </nav>
    </div>
  );
}
