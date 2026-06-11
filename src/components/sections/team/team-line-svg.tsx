type TeamTopLineProps = {
  className?: string;
};

type TeamVerticalLineProps = {
  className?: string;
};

type TeamMobileDividerProps = {
  className?: string;
};

const TEAM_DIVIDER_GRADIENT_ID = "team-divider-gradient";
const TEAM_HORIZONTAL_VIEWBOX = "0 0 100 1";
const TEAM_VERTICAL_VIEWBOX = "0 0 1 100";

/** Desktop section top rule — matches `border-border-default` / 1px. */
export function TeamTopLineSvg({ className }: TeamTopLineProps) {
  return (
    <svg
      data-team-top-line
      className={className}
      aria-hidden="true"
      viewBox={TEAM_HORIZONTAL_VIEWBOX}
      preserveAspectRatio="none"
    >
      <path className="team-line-stroke" d="M0 0.5 H100" />
    </svg>
  );
}

/** Desktop section bottom rule — matches prior `xl:border-b`. */
export function TeamBottomLineSvg({ className }: TeamTopLineProps) {
  return (
    <svg
      data-team-bottom-line
      className={className}
      aria-hidden="true"
      viewBox={TEAM_HORIZONTAL_VIEWBOX}
      preserveAspectRatio="none"
    >
      <path className="team-line-stroke" d="M0 0.5 H100" />
    </svg>
  );
}

/** Desktop list column rule — matches prior `border-l border-border-default`. */
export function TeamVerticalLineSvg({ className }: TeamVerticalLineProps) {
  return (
    <svg
      data-team-vertical-line
      className={className}
      aria-hidden="true"
      viewBox={TEAM_VERTICAL_VIEWBOX}
      preserveAspectRatio="none"
    >
      <path className="team-line-stroke" d="M0.5 0 V100" />
    </svg>
  );
}

/** Desktop member row rule — matches prior `::after` divider under each card. */
export function TeamMemberDividerSvg({ className }: TeamMobileDividerProps) {
  return (
    <svg
      data-team-member-divider
      className={className}
      aria-hidden="true"
      viewBox={TEAM_HORIZONTAL_VIEWBOX}
      preserveAspectRatio="none"
    >
      <path className="team-line-stroke" d="M0 0.5 H100" />
    </svg>
  );
}

/** Mobile/tablet entry rule — matches `.section-divider--orange-reverse`. */
export function TeamMobileDividerSvg({ className }: TeamMobileDividerProps) {
  return (
    <svg
      data-team-divider
      className={className}
      aria-hidden="true"
      viewBox={TEAM_HORIZONTAL_VIEWBOX}
      preserveAspectRatio="none"
    >
      <defs>
        <linearGradient
          id={TEAM_DIVIDER_GRADIENT_ID}
          gradientUnits="userSpaceOnUse"
          x1="100"
          y1="0"
          x2="0"
          y2="0"
        >
          <stop offset="0%" stopColor="transparent" />
          <stop offset="50%" stopColor="var(--neutral-neural-gray)" />
          <stop offset="100%" stopColor="var(--brand-cortex-orange)" />
        </linearGradient>
      </defs>
      <path
        className="team-line-stroke team-line-stroke--orange-reverse"
        d="M0 0.5 H100"
      />
    </svg>
  );
}
