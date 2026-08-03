"use client";

import Image from "next/image";
import {
  useCallback,
  useRef,
  useState,
  type MouseEvent,
  type ReactNode,
} from "react";
import { createPortal } from "react-dom";
import { useIsDesktop } from "@/hooks/use-is-desktop";
import { useReducedMotion } from "@/hooks/use-reduced-motion";
import type { CortexEvent } from "@/lib/content/events";
import {
  readEventCursorPreviewDimensions,
  type EventCursorPreviewDimensions,
} from "@/lib/events/cursor-preview";

const CURSOR_OFFSET = 24;
const VIEWPORT_PADDING = 12;
const FOLLOW_EASE = 0.16;
const POSITION_EPSILON = 0.5;

type CursorPoint = {
  x: number;
  y: number;
};

function getPreviewPosition(
  clientX: number,
  clientY: number,
  dimensions: EventCursorPreviewDimensions,
): CursorPoint {
  let x = clientX + CURSOR_OFFSET;
  let y = clientY + CURSOR_OFFSET;

  if (x + dimensions.width + VIEWPORT_PADDING > window.innerWidth) {
    x = clientX - dimensions.width - CURSOR_OFFSET;
  }

  if (y + dimensions.height + VIEWPORT_PADDING > window.innerHeight) {
    y = clientY - dimensions.height - CURSOR_OFFSET;
  }

  return {
    x: Math.min(
      Math.max(VIEWPORT_PADDING, x),
      window.innerWidth - dimensions.width - VIEWPORT_PADDING,
    ),
    y: Math.min(
      Math.max(VIEWPORT_PADDING, y),
      window.innerHeight - dimensions.height - VIEWPORT_PADDING,
    ),
  };
}

function applyPreviewTransform(
  node: HTMLDivElement | null,
  point: CursorPoint,
): void {
  if (!node) return;
  node.style.transform = `translate3d(${point.x}px, ${point.y}px, 0)`;
}

function useCursorPreview(enabled: boolean) {
  const reducedMotion = useReducedMotion();
  const targetRef = useRef<CursorPoint>({ x: 0, y: 0 });
  const currentRef = useRef<CursorPoint>({ x: 0, y: 0 });
  const frameRef = useRef<number | null>(null);
  const previewRef = useRef<HTMLDivElement | null>(null);
  const dimensionsRef = useRef<EventCursorPreviewDimensions | null>(null);
  const [visible, setVisible] = useState(false);

  const getDimensions = useCallback(() => {
    if (!dimensionsRef.current) {
      dimensionsRef.current = readEventCursorPreviewDimensions();
    }

    return dimensionsRef.current;
  }, []);

  const stopLoop = useCallback(() => {
    if (frameRef.current !== null) {
      cancelAnimationFrame(frameRef.current);
      frameRef.current = null;
    }
  }, []);

  const startLoop = useCallback(() => {
    if (frameRef.current !== null) return;

    function tick() {
      const target = targetRef.current;
      const current = currentRef.current;
      const ease = reducedMotion ? 1 : FOLLOW_EASE;

      const nextX = current.x + (target.x - current.x) * ease;
      const nextY = current.y + (target.y - current.y) * ease;
      const deltaX = Math.abs(nextX - current.x);
      const deltaY = Math.abs(nextY - current.y);

      if (
        deltaX < POSITION_EPSILON &&
        deltaY < POSITION_EPSILON &&
        Math.abs(target.x - nextX) < POSITION_EPSILON &&
        Math.abs(target.y - nextY) < POSITION_EPSILON
      ) {
        current.x = target.x;
        current.y = target.y;
        applyPreviewTransform(previewRef.current, current);
        frameRef.current = null;
        return;
      }

      current.x = nextX;
      current.y = nextY;
      applyPreviewTransform(previewRef.current, current);
      frameRef.current = requestAnimationFrame(tick);
    }

    frameRef.current = requestAnimationFrame(tick);
  }, [reducedMotion]);

  const setPreviewRef = useCallback((node: HTMLDivElement | null) => {
    previewRef.current = node;
    if (node) {
      applyPreviewTransform(node, currentRef.current);
    }
  }, []);

  const showAt = useCallback(
    (clientX: number, clientY: number) => {
      if (!enabled) return;

      const next = getPreviewPosition(clientX, clientY, getDimensions());
      targetRef.current = next;

      if (!visible) {
        currentRef.current = next;
        setVisible(true);
        startLoop();
        return;
      }

      if (reducedMotion) {
        currentRef.current = next;
        applyPreviewTransform(previewRef.current, next);
      } else {
        startLoop();
      }
    },
    [enabled, getDimensions, reducedMotion, startLoop, visible],
  );

  const moveTo = useCallback(
    (clientX: number, clientY: number) => {
      if (!enabled || !visible) return;
      targetRef.current = getPreviewPosition(clientX, clientY, getDimensions());

      if (reducedMotion) {
        currentRef.current = targetRef.current;
        applyPreviewTransform(previewRef.current, targetRef.current);
        return;
      }

      startLoop();
    },
    [enabled, getDimensions, reducedMotion, startLoop, visible],
  );

  const hide = useCallback(() => {
    stopLoop();
    setVisible(false);
  }, [stopLoop]);

  return {
    visible: enabled && visible,
    previewRef: setPreviewRef,
    showAt,
    moveTo,
    hide,
  };
}

type EventCardLinkProps = {
  event: CortexEvent;
  children: ReactNode;
};

function EventCursorPreview({
  event,
  previewRef,
}: {
  event: CortexEvent;
  previewRef: (node: HTMLDivElement | null) => void;
}) {
  if (!event.image || typeof document === "undefined") {
    return null;
  }

  const dimensions = readEventCursorPreviewDimensions();

  return createPortal(
    <div
      ref={previewRef}
      className="event-card-cursor-preview"
      aria-hidden="true"
    >
      <div
        className="event-card-cursor-preview-frame"
        data-border={event.cursorPreviewBorder}
      >
        <Image
          src={event.image.src}
          alt=""
          width={dimensions.width}
          height={dimensions.height}
          className="event-card-cursor-preview-image"
          draggable={false}
          priority={false}
        />
      </div>
    </div>,
    document.body,
  );
}

export function EventCardLink({ event, children }: EventCardLinkProps) {
  const isDesktop = useIsDesktop();
  const hasPreview = Boolean(event.image && event.url);
  const previewEnabled = hasPreview && isDesktop;
  const linkEnabled = Boolean(event.url && isDesktop);
  const { visible, previewRef, showAt, moveTo, hide } =
    useCursorPreview(previewEnabled);

  const handleMouseEnter = useCallback(
    (e: MouseEvent<HTMLAnchorElement>) => {
      if (!previewEnabled) return;
      showAt(e.clientX, e.clientY);
    },
    [previewEnabled, showAt],
  );

  const handleMouseMove = useCallback(
    (e: MouseEvent<HTMLAnchorElement>) => {
      if (!previewEnabled) return;
      moveTo(e.clientX, e.clientY);
    },
    [previewEnabled, moveTo],
  );

  const handleMouseLeave = useCallback(() => {
    if (!previewEnabled) return;
    hide();
  }, [previewEnabled, hide]);

  if (!linkEnabled) {
    return <>{children}</>;
  }

  return (
    <>
      <a
        className="event-card-link"
        href={event.url}
        target="_blank"
        rel="noopener noreferrer"
        aria-label={`Open the ${event.title} event page`}
        onMouseEnter={previewEnabled ? handleMouseEnter : undefined}
        onMouseMove={previewEnabled ? handleMouseMove : undefined}
        onMouseLeave={previewEnabled ? handleMouseLeave : undefined}
      >
        {children}
      </a>
      {previewEnabled && visible ? (
        <EventCursorPreview event={event} previewRef={previewRef} />
      ) : null}
    </>
  );
}
