"use client";

import dynamic from "next/dynamic";
import { memo, useCallback, useRef, useState } from "react";
import { useIsDesktop } from "@/hooks/use-is-desktop";
import { cn } from "@/lib/utils";
import { MISSION_CARD_HEIGHT_STYLE } from "@/components/sections/mission/mission-layout";
import type {
  MissionCard,
  MissionCardId,
  MissionPattern,
} from "@/lib/content/mission";
import type { ComponentType } from "react";

type IllustrationProps = {
  active: boolean;
  className?: string;
};

type IllustrationComponent = ComponentType<IllustrationProps>;

type MissionIllustrationPlacement = {
  topClass: string;
  sizeClass: string;
};

type MissionCardsProps = {
  cards: readonly MissionCard[];
};

const MISSION_COLLAPSED_EYEBROW_CLASS =
  "mission-eyebrow mission-collapsed-card-eyebrow";

const PulseField = dynamic<IllustrationProps>(
  () =>
    import("@/components/illustrations/pulse-field").then((m) => ({
      default: m.PulseField,
    })),
  { ssr: false },
);
const DotOrbits = dynamic<IllustrationProps>(
  () =>
    import("@/components/illustrations/dot-orbits").then((m) => ({
      default: m.DotOrbits,
    })),
  { ssr: false },
);
const SteppedLattice = dynamic<IllustrationProps>(
  () =>
    import("@/components/illustrations/stepped-lattice").then((m) => ({
      default: m.SteppedLattice,
    })),
  { ssr: false },
);
const RadiatingSegments = dynamic<IllustrationProps>(
  () =>
    import("@/components/illustrations/radiating-segments").then((m) => ({
      default: m.RadiatingSegments,
    })),
  { ssr: false },
);
const NodeMesh = dynamic<IllustrationProps>(
  () =>
    import("@/components/illustrations/node-mesh").then((m) => ({
      default: m.NodeMesh,
    })),
  { ssr: false },
);

const ILLUSTRATIONS = {
  "pulse-field": PulseField,
  "dot-orbits": DotOrbits,
  "stepped-lattice": SteppedLattice,
  "radiating-segments": RadiatingSegments,
  "node-mesh": NodeMesh,
} satisfies Record<MissionPattern, IllustrationComponent>;

const MISSION_ILLUSTRATION_PLACEMENTS = {
  pulse: {
    topClass: "top-[12.5rem] md:top-[14.5rem] xl:top-[20rem]",
    sizeClass: "size-[13.5rem] md:size-[22rem] xl:size-[24rem]",
  },
  disciplines: {
    topClass: "top-[12rem] md:top-[14rem] xl:top-[17.5rem]",
    sizeClass: "size-[13rem] md:size-[22rem] xl:size-[24rem]",
  },
  collections: {
    topClass: "top-[13.5rem] md:top-[14.5rem] xl:top-[21.1rem]",
    sizeClass: "size-[11.5rem] md:size-[20rem] xl:size-[21.25rem]",
  },
  ideas: {
    topClass: "top-[12.8rem] md:top-[14.5rem] xl:top-[18rem]",
    sizeClass: "size-[14rem] md:size-[22rem] xl:size-[24rem]",
  },
  culture: {
    topClass: "top-[14.5rem] md:top-[15.5rem] xl:top-[22.5rem]",
    sizeClass: "size-[11.5rem] md:size-[18rem] xl:size-[20rem]",
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
  const Illustration = ILLUSTRATIONS[card.pattern];
  const { topClass, sizeClass } = MISSION_ILLUSTRATION_PLACEMENTS[card.id];

  return (
    <div className={cn("mission-card-shell", className)}>
      <div className={cn("mission-card-illustration", topClass)}>
        <Illustration
          key={card.id}
          active={illustrationActive}
          className={cn("text-text-secondary", sizeClass)}
        />
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

export function MissionDesktopCards({ cards }: MissionCardsProps) {
  const [activeIndex, setActiveIndex] = useState(0);
  const isDesktop = useIsDesktop();

  return (
    <div className="hidden gap-2.5 xl:flex">
      {cards.map((card, i) => {
        const isActive = activeIndex === i;

        return (
          <article
            key={card.id}
            className={cn(
              "mission-desktop-card-trigger",
              isActive ? "w-[556px]" : "w-[46px]",
            )}
            style={MISSION_CARD_HEIGHT_STYLE}
            aria-current={isActive ? "true" : undefined}
          >
            {isActive ? (
              <MissionExpandedCard
                card={card}
                illustrationActive={isDesktop}
                className="h-full border-0"
              />
            ) : (
              <button
                type="button"
                onClick={() => setActiveIndex(i)}
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
  );
}

export function MissionMobileCards({ cards }: MissionCardsProps) {
  const [activeIndex, setActiveIndex] = useState(0);
  const carouselRef = useRef<HTMLDivElement | null>(null);
  const scrollRafRef = useRef<number | null>(null);
  const isDesktop = useIsDesktop();

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
    <div className="mt-6 md:mt-8 xl:hidden">
      <div
        ref={setCarouselRef}
        onScroll={handleCarouselScroll}
        className="mission-carousel-track"
      >
        {cards.map((card, i) => (
          <MissionExpandedCard
            key={card.id}
            card={card}
            illustrationActive={!isDesktop && activeIndex === i}
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
