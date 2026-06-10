import {
  EVENT_POSTER_ASPECT_HEIGHT,
  EVENT_POSTER_ASPECT_WIDTH,
} from "./event-poster-aspect";

export type EventCursorPreviewDimensions = {
  width: number;
  height: number;
};

const PREVIEW_WIDTH_FALLBACK_PX = 150;

function parseCssPx(value: string, fallback: number): number {
  const parsed = Number.parseFloat(value);
  return Number.isFinite(parsed) ? parsed : fallback;
}

function readAspectRatio(
  styles: CSSStyleDeclaration | null,
): { width: number; height: number } {
  if (!styles) {
    return {
      width: EVENT_POSTER_ASPECT_WIDTH,
      height: EVENT_POSTER_ASPECT_HEIGHT,
    };
  }

  return {
    width: parseCssPx(
      styles.getPropertyValue("--event-cursor-preview-aspect-width"),
      EVENT_POSTER_ASPECT_WIDTH,
    ),
    height: parseCssPx(
      styles.getPropertyValue("--event-cursor-preview-aspect-height"),
      EVENT_POSTER_ASPECT_HEIGHT,
    ),
  };
}

function getPreviewHeightFromWidth(
  width: number,
  aspect: { width: number; height: number },
): number {
  return Math.round(width * (aspect.height / aspect.width));
}

/** Reads preview size from `--event-cursor-preview-*` tokens defined in globals.css. */
export function readEventCursorPreviewDimensions(): EventCursorPreviewDimensions {
  if (typeof window === "undefined") {
    const aspect = readAspectRatio(null);
    const width = PREVIEW_WIDTH_FALLBACK_PX;
    return { width, height: getPreviewHeightFromWidth(width, aspect) };
  }

  const styles = getComputedStyle(document.documentElement);
  const aspect = readAspectRatio(styles);
  const width = parseCssPx(
    styles.getPropertyValue("--event-cursor-preview-width"),
    PREVIEW_WIDTH_FALLBACK_PX,
  );
  const height = parseCssPx(
    styles.getPropertyValue("--event-cursor-preview-height"),
    getPreviewHeightFromWidth(width, aspect),
  );

  return { width, height };
}
