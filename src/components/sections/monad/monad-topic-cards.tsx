"use client";

import dynamic from "next/dynamic";
import type { MonadInteractiveCard } from "@/lib/content/monad";

const MonadCardsClient = dynamic(
  () =>
    import("@/components/sections/monad/monad-cards-client").then(
      (mod) => mod.MonadCardsClient,
    ),
  { ssr: false },
);

type MonadTopicCardsProps = {
  cards: readonly MonadInteractiveCard[];
};

/** Client-only island — avoids hydrating GSAP-driven topic markup from SSR. */
export function MonadTopicCards({ cards }: MonadTopicCardsProps) {
  return <MonadCardsClient cards={cards} />;
}
