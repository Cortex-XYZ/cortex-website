"use client";

import { useCallback, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useOnMount } from "@/hooks/use-on-mount";
import { useReducedMotion } from "@/hooks/use-reduced-motion";

type EventCarouselControlsProps = {
  listId: string;
};

function getScrollState(list: HTMLElement) {
  const maxScrollLeft = list.scrollWidth - list.clientWidth;
  const scrollLeft = Math.max(0, list.scrollLeft);

  return {
    canScrollPrev: scrollLeft > 1,
    canScrollNext: scrollLeft < maxScrollLeft - 1,
  };
}

export function EventCarouselControls({
  listId,
}: EventCarouselControlsProps) {
  const reducedMotion = useReducedMotion();
  const [scrollState, setScrollState] = useState({
    canScrollPrev: true,
    canScrollNext: true,
  });

  const getList = useCallback(
    () => document.getElementById(listId),
    [listId],
  );

  const updateScrollState = useCallback(() => {
    const list = getList();
    if (!list) return;
    setScrollState((prev) => {
      const next = getScrollState(list);
      if (
        prev.canScrollPrev === next.canScrollPrev &&
        prev.canScrollNext === next.canScrollNext
      ) {
        return prev;
      }
      return next;
    });
  }, [getList]);

  useOnMount(() => {
    const list = getList();
    if (!list) return;

    updateScrollState();
    list.addEventListener("scroll", updateScrollState, { passive: true });

    const ro = new ResizeObserver(updateScrollState);
    ro.observe(list);

    return () => {
      list.removeEventListener("scroll", updateScrollState);
      ro.disconnect();
    };
  });

  const scrollByPage = useCallback(
    (direction: -1 | 1) => {
      const list = getList();
      if (!list) return;

      list.scrollBy({
        left: direction * list.clientWidth,
        behavior: reducedMotion ? "auto" : "smooth",
      });
    },
    [getList, reducedMotion],
  );

  return (
    <div className="events-carousel-controls" aria-label="Event carousel">
      <button
        type="button"
        className="events-carousel-control"
        aria-label="Previous event"
        aria-controls={listId}
        disabled={!scrollState.canScrollPrev}
        onClick={() => scrollByPage(-1)}
      >
        <ChevronLeft className="events-carousel-control-icon" aria-hidden />
      </button>
      <button
        type="button"
        className="events-carousel-control"
        aria-label="Next event"
        aria-controls={listId}
        disabled={!scrollState.canScrollNext}
        onClick={() => scrollByPage(1)}
      >
        <ChevronRight className="events-carousel-control-icon" aria-hidden />
      </button>
    </div>
  );
}
