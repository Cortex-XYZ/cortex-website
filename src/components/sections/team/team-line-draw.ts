import {
  TEAM_LINE_DRAW_DURATION,
  TEAM_LINE_DRAW_EASE,
  TEAM_LINE_DRAW_START,
  TEAM_MEMBER_LINE_DRAW_DURATION,
} from "@/components/sections/team/team-scroll";
import { gsap, ScrollTrigger } from "@/lib/gsap-setup";
import {
  createScrollTriggerConfig,
  playIfAlreadyInView,
} from "@/lib/scroll-trigger";

export const TEAM_LINE_DRAW_ID = "team-line-draw";
export const TEAM_MOBILE_LINE_DRAW_ID = "team-mobile-line-draw";

const TEAM_MEMBER_DIVIDER_STROKE_SELECTOR =
  "[data-team-member-divider] .team-line-stroke";
const TEAM_TOP_STROKE_SELECTOR = "[data-team-top-line] .team-line-stroke";
const TEAM_VERTICAL_STROKE_SELECTOR = "[data-team-vertical-line] .team-line-stroke";
const TEAM_BOTTOM_STROKE_SELECTOR = "[data-team-bottom-line] .team-line-stroke";
const TEAM_MOBILE_STROKE_SELECTOR = "[data-team-divider] .team-line-stroke";

type TeamStrokeLines = {
  top?: SVGPathElement | null;
  vertical?: SVGPathElement | null;
  memberDividers: SVGPathElement[];
  bottom?: SVGPathElement | null;
};

function collectDesktopStrokeLines(scope: HTMLElement): TeamStrokeLines {
  return {
    top: scope.querySelector<SVGPathElement>(TEAM_TOP_STROKE_SELECTOR),
    vertical: scope.querySelector<SVGPathElement>(TEAM_VERTICAL_STROKE_SELECTOR),
    bottom: scope.querySelector<SVGPathElement>(TEAM_BOTTOM_STROKE_SELECTOR),
    memberDividers: Array.from(
      scope.querySelectorAll<SVGPathElement>(TEAM_MEMBER_DIVIDER_STROKE_SELECTOR),
    ),
  };
}

function collectDesktopStrokes(lines: TeamStrokeLines): SVGPathElement[] {
  return [lines.top, lines.vertical, ...lines.memberDividers, lines.bottom].filter(
    (stroke): stroke is SVGPathElement => stroke !== null && stroke !== undefined,
  );
}

function setStrokesDrawn(strokes: SVGPathElement[]): void {
  if (strokes.length === 0) return;
  gsap.set(strokes, { drawSVG: "100%" });
}

function addStrokeDraw(
  timeline: gsap.core.Timeline,
  stroke: SVGPathElement | null | undefined,
  duration: number,
): void {
  if (!stroke) return;

  timeline.to(stroke, {
    drawSVG: "100%",
    duration,
    ease: TEAM_LINE_DRAW_EASE,
  });
}

export function setupTeamDesktopLineDraw(scope: HTMLElement): () => void {
  const lines = collectDesktopStrokeLines(scope);
  const strokes = collectDesktopStrokes(lines);

  if (strokes.length === 0) return () => {};

  gsap.set(strokes, { drawSVG: "0%" });

  const timeline = gsap.timeline({
    scrollTrigger: createScrollTriggerConfig(
      scope,
      TEAM_LINE_DRAW_START,
      TEAM_LINE_DRAW_ID,
    ),
  });

  addStrokeDraw(timeline, lines.top, TEAM_LINE_DRAW_DURATION);
  addStrokeDraw(timeline, lines.vertical, TEAM_LINE_DRAW_DURATION * 2);

  for (const divider of lines.memberDividers) {
    addStrokeDraw(timeline, divider, TEAM_MEMBER_LINE_DRAW_DURATION);
  }

  addStrokeDraw(timeline, lines.bottom, TEAM_LINE_DRAW_DURATION);
  playIfAlreadyInView(timeline);

  return () => {
    timeline.scrollTrigger?.kill();
    timeline.kill();
    ScrollTrigger.getById(TEAM_LINE_DRAW_ID)?.kill();
    setStrokesDrawn(strokes);
  };
}

export function setupTeamMobileLineDraw(scope: HTMLElement): () => void {
  const stroke = scope.querySelector<SVGPathElement>(TEAM_MOBILE_STROKE_SELECTOR);

  if (!stroke) return () => {};

  gsap.set(stroke, { drawSVG: "0%" });

  const timeline = gsap.timeline({
    scrollTrigger: createScrollTriggerConfig(
      scope,
      TEAM_LINE_DRAW_START,
      TEAM_MOBILE_LINE_DRAW_ID,
    ),
  });

  addStrokeDraw(timeline, stroke, TEAM_LINE_DRAW_DURATION);
  playIfAlreadyInView(timeline);

  return () => {
    timeline.scrollTrigger?.kill();
    timeline.kill();
    ScrollTrigger.getById(TEAM_MOBILE_LINE_DRAW_ID)?.kill();
    setStrokesDrawn([stroke]);
  };
}
