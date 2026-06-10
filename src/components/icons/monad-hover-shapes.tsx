const SEVEN_SIDED_COOKIE_LOBES = [
  [50, 27],
  [68, 36],
  [72, 55],
  [60, 71],
  [40, 71],
  [28, 55],
  [32, 36],
] as const;

const PUFFY_LOBES = [
  [60, 29],
  [77, 33],
  [87, 44],
  [87, 56],
  [77, 67],
  [60, 71],
  [43, 67],
  [33, 56],
  [33, 44],
  [43, 33],
] as const;

function CloverShape() {
  return (
    <svg viewBox="0 0 100 100" fill="none" aria-hidden="true">
      <circle cx="39" cy="39" r="23" fill="currentColor" />
      <circle cx="61" cy="39" r="23" fill="currentColor" />
      <circle cx="39" cy="61" r="23" fill="currentColor" />
      <circle cx="61" cy="61" r="23" fill="currentColor" />
    </svg>
  );
}

function SevenSidedCookieShape() {
  return (
    <svg viewBox="0 0 100 100" fill="none" aria-hidden="true">
      <circle cx="50" cy="50" r="29" fill="currentColor" />
      {SEVEN_SIDED_COOKIE_LOBES.map(([cx, cy]) => (
        <circle
          key={`${cx}-${cy}`}
          cx={cx}
          cy={cy}
          r="15"
          fill="currentColor"
        />
      ))}
    </svg>
  );
}

function StackShape() {
  return (
    <svg viewBox="0 0 100 100" fill="none" aria-hidden="true">
      <rect x="12" y="18" width="76" height="36" rx="18" fill="currentColor" />
      <rect x="12" y="46" width="76" height="36" rx="18" fill="currentColor" />
    </svg>
  );
}

function PuffyShape() {
  return (
    <svg viewBox="0 0 120 100" fill="none" aria-hidden="true">
      <circle cx="60" cy="50" r="22" fill="currentColor" />
      {PUFFY_LOBES.map(([cx, cy]) => (
        <circle
          key={`${cx}-${cy}`}
          cx={cx}
          cy={cy}
          r="14"
          fill="currentColor"
        />
      ))}
    </svg>
  );
}

export function MonadHoverShape({ cardId }: { cardId: string }) {
  switch (cardId) {
    case "what-is-monad":
      return <CloverShape />;
    case "monad-history":
      return <SevenSidedCookieShape />;
    case "monad-team":
      return <StackShape />;
    case "nitro-and-programs":
      return <PuffyShape />;
    default:
      return null;
  }
}
