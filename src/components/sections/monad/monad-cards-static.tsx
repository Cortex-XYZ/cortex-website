import { ArrowRight } from "lucide-react";
import type { MonadInteractiveCard } from "@/lib/content/monad";

type MonadCardsStaticProps = {
  cards: readonly MonadInteractiveCard[];
};

export function MonadCardsStatic({ cards }: MonadCardsStaticProps) {
  return (
    <ul className="monad-topic-list" aria-label="Monad topics">
      {cards.map((card) => (
        <li key={card.id} className="monad-topic-item">
          <div className="monad-topic-button" aria-hidden="true">
            <span className="monad-topic-bg" aria-hidden="true" />
            <span className="monad-topic-label">{card.title}</span>
            <ArrowRight className="monad-topic-arrow" aria-hidden="true" />
          </div>
        </li>
      ))}
    </ul>
  );
}
