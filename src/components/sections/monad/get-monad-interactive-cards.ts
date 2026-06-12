import { externalLinks } from "@/lib/content/links";
import { monadSection, type MonadInteractiveCard } from "@/lib/content/monad";

export const MONAD_INTERACTIVE_CARDS: readonly MonadInteractiveCard[] =
  monadSection.cards.map((card) => ({
    id: card.id,
    title: card.title,
    anchorId: card.anchorId === monadSection.id ? undefined : card.anchorId,
    paragraphs: card.paragraphs,
    links: (card.detailLinks ?? []).map((link) => ({
      text: link.text,
      href: externalLinks[link.linkKey].href,
      channel: externalLinks[link.linkKey].channel === "x" ? "x" : undefined,
    })),
  }));
