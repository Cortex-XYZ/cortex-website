import {
  TEAM_DIVIDER_DRAW_OVERLAP,
  TEAM_ENTER_START,
  TEAM_HEADER_OVERLAP_DELAY,
  TEAM_HEADER_REVEAL_DURATION,
  TEAM_HEADER_REVEAL_Y,
  TEAM_LINE_DRAW_DURATION,
  TEAM_MEMBER_CHAIN_OVERLAP,
  TEAM_MEMBER_FIRST_OVERLAP,
  TEAM_MEMBER_LINE_DRAW_DURATION,
  TEAM_MEMBER_REVEAL_DURATION,
  TEAM_MOBILE_MEMBER_STAGGER_EACH,
  TEAM_REVEAL_EASE,
  TEAM_REVEAL_Y_REM,
  TEAM_VERTICAL_LINE_OVERLAP,
} from "@/components/sections/team/team-scroll";
import { gsap, ScrollTrigger } from "@/lib/gsap-setup";
import {
  createScrollTriggerConfig,
  playIfAlreadyInView,
  setScrollRevealRestingState,
} from "@/lib/scroll-trigger";

export const TEAM_ENTER_ID = "team-enter";
export const TEAM_MOBILE_ENTER_ID = "team-mobile-enter";

const TEAM_LABEL_GRID = "grid";
const TEAM_LABEL_TITLE = "title";
const TEAM_LABEL_MEMBERS = "members";
const TEAM_LABEL_CLOSE = "close";

const TEAM_HEADER_SELECTOR = "[data-team-header]";
const TEAM_MEMBER_SELECTOR = "[data-team-member]";
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

export function setStrokeRestingState(stroke: SVGPathElement): void {
  gsap.set(stroke, { drawSVG: "100%", clearProps: "visibility,opacity" });
}

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

/**
 * Desktop entrance — GSAP timeline + ScrollTrigger pattern.
 * @see https://gsap.com/docs/v3/GSAP/gsap.timeline/
 * @see https://gsap.com/docs/v3/GSAP/gsap.from/
 */
export function setupTeamDesktopEnter(scope: HTMLElement): () => void {
  const header = scope.querySelector<HTMLElement>(TEAM_HEADER_SELECTOR);
  const members = Array.from(
    scope.querySelectorAll<HTMLElement>(TEAM_MEMBER_SELECTOR),
  );
  const lines = collectDesktopStrokeLines(scope);

  const timeline = gsap.timeline({
    defaults: { ease: TEAM_REVEAL_EASE },
    scrollTrigger: createScrollTriggerConfig(scope, TEAM_ENTER_START, TEAM_ENTER_ID),
  });

  timeline.addLabel(TEAM_LABEL_GRID);

  if (lines.top) {
    timeline.from(lines.top, {
      drawSVG: "0%",
      duration: TEAM_LINE_DRAW_DURATION,
      ease: "none",
    });
  }

  if (lines.vertical) {
    timeline.from(
      lines.vertical,
      {
        drawSVG: "0%",
        duration: TEAM_LINE_DRAW_DURATION,
        ease: "none",
      },
      lines.top ? `-=${TEAM_VERTICAL_LINE_OVERLAP}` : undefined,
    );
  }

  timeline.addLabel(TEAM_LABEL_TITLE);

  if (header) {
    timeline.from(
      header,
      {
        autoAlpha: 0,
        y: TEAM_HEADER_REVEAL_Y,
        duration: TEAM_HEADER_REVEAL_DURATION,
      },
      `>-${TEAM_HEADER_OVERLAP_DELAY}`,
    );
  }

  timeline.addLabel(TEAM_LABEL_MEMBERS);

  for (const [index, member] of members.entries()) {
    timeline.from(
      member,
      {
        autoAlpha: 0,
        y: `${TEAM_REVEAL_Y_REM}rem`,
        duration: TEAM_MEMBER_REVEAL_DURATION,
      },
      index === 0
        ? `>-${TEAM_MEMBER_FIRST_OVERLAP}`
        : `-=${TEAM_MEMBER_CHAIN_OVERLAP}`,
    );

    const divider = lines.memberDividers[index];
    if (divider) {
      timeline.from(
        divider,
        {
          drawSVG: "0%",
          duration: TEAM_MEMBER_LINE_DRAW_DURATION,
          ease: "none",
        },
        `-=${TEAM_DIVIDER_DRAW_OVERLAP}`,
      );
    }
  }

  timeline.addLabel(TEAM_LABEL_CLOSE);

  if (lines.bottom) {
    timeline.from(lines.bottom, {
      drawSVG: "0%",
      duration: TEAM_LINE_DRAW_DURATION,
      ease: "none",
    });
  }

  playIfAlreadyInView(timeline);

  return () => {
    timeline.scrollTrigger?.kill();
    timeline.kill();
    ScrollTrigger.getById(TEAM_ENTER_ID)?.kill();
  };
}

/** Mobile/tablet entrance — same GSAP patterns, simplified grid. */
export function setupTeamMobileEnter(scope: HTMLElement): () => void {
  const header = scope.querySelector<HTMLElement>(TEAM_HEADER_SELECTOR);
  const members = Array.from(
    scope.querySelectorAll<HTMLElement>(TEAM_MEMBER_SELECTOR),
  );
  const mobileStroke = scope.querySelector<SVGPathElement>(
    TEAM_MOBILE_STROKE_SELECTOR,
  );

  const timeline = gsap.timeline({
    defaults: { ease: TEAM_REVEAL_EASE },
    scrollTrigger: createScrollTriggerConfig(
      scope,
      TEAM_ENTER_START,
      TEAM_MOBILE_ENTER_ID,
    ),
  });

  if (mobileStroke) {
    timeline.from(mobileStroke, {
      drawSVG: "0%",
      duration: TEAM_LINE_DRAW_DURATION,
      ease: "none",
    });
  }

  if (header) {
    timeline.from(
      header,
      {
        autoAlpha: 0,
        y: TEAM_HEADER_REVEAL_Y,
        duration: TEAM_HEADER_REVEAL_DURATION,
      },
      mobileStroke ? `>-${TEAM_HEADER_OVERLAP_DELAY}` : undefined,
    );
  }

  if (members.length > 0) {
    timeline.from(
      members,
      {
        autoAlpha: 0,
        y: `${TEAM_REVEAL_Y_REM}rem`,
        duration: TEAM_MEMBER_REVEAL_DURATION,
        stagger: {
          each: TEAM_MOBILE_MEMBER_STAGGER_EACH,
          from: "start",
        },
      },
      header ? `>-${TEAM_MEMBER_FIRST_OVERLAP}` : ">",
    );
  }

  playIfAlreadyInView(timeline);

  return () => {
    timeline.scrollTrigger?.kill();
    timeline.kill();
    ScrollTrigger.getById(TEAM_MOBILE_ENTER_ID)?.kill();
  };
}

export function setTeamEnterRestingState(scope: HTMLElement): void {
  const header = scope.querySelector<HTMLElement>(TEAM_HEADER_SELECTOR);
  const members = scope.querySelectorAll<HTMLElement>(TEAM_MEMBER_SELECTOR);
  const lines = collectDesktopStrokeLines(scope);
  const mobileStroke = scope.querySelector<SVGPathElement>(
    TEAM_MOBILE_STROKE_SELECTOR,
  );

  if (header) {
    setScrollRevealRestingState(header);
  }
  if (members.length > 0) {
    setScrollRevealRestingState(Array.from(members));
  }

  if (lines.top) setStrokeRestingState(lines.top);
  if (lines.vertical) setStrokeRestingState(lines.vertical);
  if (lines.bottom) setStrokeRestingState(lines.bottom);
  lines.memberDividers.forEach(setStrokeRestingState);
  if (mobileStroke) setStrokeRestingState(mobileStroke);
}
