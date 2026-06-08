"use client";

import * as DialogPrimitive from "@radix-ui/react-dialog";
import { ArrowRight, X } from "lucide-react";
import { type MouseEvent, useCallback, useMemo, useRef, useState } from "react";
import { DESKTOP_MQL, useIsDesktop } from "@/hooks/use-is-desktop";
import { gsap, useGSAP } from "@/lib/gsap-setup";
import { MonadHoverShape } from "@/components/icons/monad-hover-shapes";
import { SOCIAL_GLYPHS } from "@/components/icons/social-glyphs";
import type {
  MonadInteractiveCard,
  MonadInteractiveLink,
} from "@/lib/content/monad";
import { Sheet, SheetContent } from "@/components/ui/sheet";

type MonadCardsClientProps = {
  cards: readonly MonadInteractiveCard[];
};

const REDUCE_MOTION_QUERY = "(prefers-reduced-motion: reduce)";

function MonadDialogLinks({
  links,
}: {
  links: readonly MonadInteractiveLink[];
}) {
  const XGlyph = SOCIAL_GLYPHS.x;

  return links.length > 0 ? (
    <ul className="monad-dialog-links">
      {links.map((link) => (
        <li key={`${link.href}-${link.text}`}>
          <a
            className="monad-dialog-link"
            data-channel={link.channel}
            href={link.href}
            target="_blank"
            rel="noopener noreferrer"
          >
            <span>{link.text}</span>
            {link.channel === "x" && XGlyph ? (
              <XGlyph className="monad-dialog-link-icon" />
            ) : null}
          </a>
        </li>
      ))}
    </ul>
  ) : null;
}

type MonadDetailCopyProps = {
  card: MonadInteractiveCard;
  Title: typeof DialogPrimitive.Title;
  Description: typeof DialogPrimitive.Description;
  animateCopy?: boolean;
};

function MonadDetailCopy({
  card,
  Title,
  Description,
  animateCopy = false,
}: MonadDetailCopyProps) {
  const copyProps = animateCopy ? { "data-monad-dialog-copy": true } : {};

  return (
    <div className="monad-dialog-content">
      <Title className="monad-dialog-title" {...copyProps}>
        {card.title}
      </Title>

      <Description asChild>
        <div className="monad-dialog-body" {...copyProps}>
          {card.paragraphs.map((paragraph) => (
            <p key={paragraph}>{paragraph}</p>
          ))}
        </div>
      </Description>

      <div {...copyProps}>
        <MonadDialogLinks links={card.links} />
      </div>
    </div>
  );
}

export function MonadCardsClient({ cards }: MonadCardsClientProps) {
  const isDesktop = useIsDesktop();
  const [selectedCardId, setSelectedCardId] = useState<string | null>(null);
  const panelRef = useRef<HTMLDivElement | null>(null);

  const cardById = useMemo(
    () => new Map(cards.map((card) => [card.id, card])),
    [cards],
  );

  const selectedCard =
    selectedCardId !== null ? (cardById.get(selectedCardId) ?? null) : null;

  const handleCardClick = useCallback(
    (event: MouseEvent<HTMLButtonElement>) => {
      const cardId = event.currentTarget.dataset.monadCardId;
      if (cardId) {
        setSelectedCardId(cardId);
      }
    },
    [],
  );

  const handleMouseEnter = useCallback(
    (event: MouseEvent<HTMLButtonElement>) => {
      if (!isDesktop || window.matchMedia(REDUCE_MOTION_QUERY).matches) return;
      const btn = event.currentTarget;
      const bg = btn.querySelector<HTMLElement>(".monad-topic-bg");
      const shape = btn.querySelector<HTMLElement>(".monad-topic-hover-shape");
      if (!shape) return;
      const children = shape.querySelectorAll("circle, rect");

      gsap.killTweensOf(shape);
      gsap.killTweensOf(children);
      if (bg) gsap.killTweensOf(bg);

      const tl = gsap.timeline();
      if (bg) {
        tl.to(bg, { "--bg-s": 0.01, duration: 0.25, ease: "power3.in" }, 0);
      }
      tl.fromTo(
        shape,
        { "--shape-s": 0.08, "--shape-o": 0 },
        {
          "--shape-s": 1.18,
          "--shape-o": 1,
          duration: 0.32,
          ease: "power3.out",
        },
        0,
      ).fromTo(
        children,
        { scale: 0, transformOrigin: "center center" },
        {
          scale: 1,
          duration: 0.2,
          stagger: 0.03,
          ease: "back.out(1.7)",
        },
        0.05,
      );
    },
    [isDesktop],
  );

  const handleMouseLeave = useCallback(
    (event: MouseEvent<HTMLButtonElement>) => {
      if (!isDesktop) return;
      if (event.currentTarget.dataset.active === "true") return;
      const btn = event.currentTarget;
      const bg = btn.querySelector<HTMLElement>(".monad-topic-bg");
      const shape = btn.querySelector<HTMLElement>(".monad-topic-hover-shape");
      if (!shape) return;
      const children = shape.querySelectorAll("circle, rect");

      gsap.killTweensOf(shape);
      gsap.killTweensOf(children);
      if (bg) gsap.killTweensOf(bg);

      const tl = gsap.timeline();
      tl.to(shape, {
        "--shape-s": 0.08,
        "--shape-o": 0,
        duration: 0.28,
        ease: "power2.in",
        clearProps: "--shape-s,--shape-o",
      });
      tl.to(
        children,
        {
          scale: 0,
          duration: 0.15,
          stagger: 0.02,
          ease: "power2.in",
          clearProps: "transform",
        },
        0,
      );
      if (bg) {
        tl.to(
          bg,
          {
            "--bg-s": 1,
            duration: 0.35,
            ease: "power2.out",
            clearProps: "--bg-s",
          },
          0,
        );
      }
    },
    [isDesktop],
  );

  const handleOpenChange = useCallback((nextOpen: boolean) => {
    if (!nextOpen) {
      const activeBtn = document.querySelector<HTMLElement>(
        '.monad-topic-button[data-active="true"]',
      );
      if (activeBtn) {
        const bg = activeBtn.querySelector<HTMLElement>(".monad-topic-bg");
        const shape = activeBtn.querySelector<HTMLElement>(
          ".monad-topic-hover-shape",
        );
        if (shape) {
          const children = shape.querySelectorAll("circle, rect");
          gsap.killTweensOf(shape);
          gsap.killTweensOf(children);
          gsap.to(shape, {
            "--shape-s": 0.08,
            "--shape-o": 0,
            duration: 0.28,
            ease: "power2.in",
            clearProps: "--shape-s,--shape-o",
          });
          gsap.to(children, {
            scale: 0,
            duration: 0.15,
            ease: "power2.in",
            clearProps: "transform",
          });
        }
        if (bg) {
          gsap.killTweensOf(bg);
          gsap.to(bg, {
            "--bg-s": 1,
            duration: 0.35,
            ease: "power2.out",
            clearProps: "--bg-s",
          });
        }
      }
      setSelectedCardId(null);
    }
  }, []);

  useGSAP(
    () => {
      const panel = panelRef.current;
      if (selectedCard === null || panel === null) return;

      const reduceMotion = window.matchMedia(REDUCE_MOTION_QUERY).matches;
      if (reduceMotion) {
        gsap.set(panel, { autoAlpha: 1, clearProps: "transform" });
        return;
      }

      const matchMedia = gsap.matchMedia();

      matchMedia.add(DESKTOP_MQL, () => {
        const timeline = gsap.timeline();

        timeline
          .fromTo(
            panel,
            {
              autoAlpha: 0,
              scale: 0.92,
              y: 26,
            },
            {
              autoAlpha: 1,
              duration: 0.58,
              ease: "power3.out",
              scale: 1,
              y: 0,
            },
          )
          .fromTo(
            "[data-monad-dialog-surface]",
            { autoAlpha: 0, scale: 0.94 },
            {
              autoAlpha: 1,
              duration: 0.5,
              ease: "power3.out",
              scale: 1,
            },
            "-=0.52",
          )
          .fromTo(
            "[data-monad-dialog-copy]",
            { autoAlpha: 0, y: 18 },
            {
              autoAlpha: 1,
              duration: 0.36,
              ease: "power2.out",
              stagger: 0.05,
              y: 0,
            },
            "-=0.24",
          );

        return () => timeline.kill();
      });

      return () => matchMedia.revert();
    },
    { dependencies: [selectedCard], scope: panelRef },
  );

  return (
    <>
      <svg width="0" height="0" aria-hidden="true" className="absolute">
        <defs>
          <clipPath id="monad-card-squircle" clipPathUnits="objectBoundingBox">
            <path d="M 0.19 0 L 0.81 0 C 0.94 0 1 0.08 1 0.34 Q 1.005 0.5 1 0.66 C 1 0.92 0.94 1 0.81 1 L 0.19 1 C 0.06 1 0 0.92 0 0.66 Q -0.005 0.5 0 0.34 C 0 0.08 0.06 0 0.19 0 Z" />
          </clipPath>
          <clipPath id="monad-dialog-shape" clipPathUnits="objectBoundingBox">
            <path d="M 0.24 0 L 0.76 0 C 0.93 0 1 0.12 1 0.38 L 1 0.62 C 1 0.88 0.93 1 0.76 1 L 0.24 1 C 0.07 1 0 0.88 0 0.62 L 0 0.38 C 0 0.12 0.07 0 0.24 0 Z" />
          </clipPath>
        </defs>
      </svg>
      <ul className="monad-topic-list" aria-label="Monad topics">
        {cards.map((card) => (
          <li key={card.id} className="monad-topic-item">
            <button
              id={card.anchorId}
              type="button"
              className="monad-topic-button"
              data-monad-card-id={card.id}
              data-active={selectedCardId === card.id ? "true" : undefined}
              onClick={handleCardClick}
              onMouseEnter={handleMouseEnter}
              onMouseLeave={handleMouseLeave}
              aria-label={`Open ${card.title}`}
            >
              <span className="monad-topic-bg" aria-hidden="true" />
              <span className="monad-topic-hover-shape">
                <MonadHoverShape cardId={card.id} />
              </span>
              <span className="monad-topic-label">{card.title}</span>
              <ArrowRight className="monad-topic-arrow" aria-hidden="true" />
            </button>
          </li>
        ))}
      </ul>

      {!isDesktop && selectedCard !== null ? (
        <Sheet open onOpenChange={handleOpenChange} data-monad-detail-sheet>
          <SheetContent
            side="bottom"
            showCloseButton={false}
            className="monad-sheet-panel"
          >
            <span className="monad-dialog-handle" aria-hidden="true" />
            <MonadDetailCopy
              card={selectedCard}
              Title={DialogPrimitive.Title}
              Description={DialogPrimitive.Description}
            />
          </SheetContent>
        </Sheet>
      ) : null}

      {isDesktop ? (
        <DialogPrimitive.Root
          open={selectedCard !== null}
          onOpenChange={handleOpenChange}
        >
          <DialogPrimitive.Portal>
            {selectedCard !== null ? (
              <>
                <DialogPrimitive.Overlay className="monad-dialog-overlay" />
                <DialogPrimitive.Content
                  ref={panelRef}
                  className="monad-dialog-panel"
                >
                  <span
                    className="monad-dialog-surface"
                    data-monad-dialog-surface
                    aria-hidden="true"
                  />
                  <DialogPrimitive.Close asChild>
                    <button
                      type="button"
                      className="monad-dialog-close"
                      aria-label="Close Monad detail"
                    >
                      <X aria-hidden="true" />
                    </button>
                  </DialogPrimitive.Close>

                  <MonadDetailCopy
                    card={selectedCard}
                    Title={DialogPrimitive.Title}
                    Description={DialogPrimitive.Description}
                    animateCopy
                  />
                </DialogPrimitive.Content>
              </>
            ) : null}
          </DialogPrimitive.Portal>
        </DialogPrimitive.Root>
      ) : null}
    </>
  );
}
