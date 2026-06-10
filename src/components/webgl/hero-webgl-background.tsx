// Placeholder layer for the hero's WebGL canvas. The W1 PR (separate ticket)
// replaces the inner gradient div with the real shader; this scaffold ensures
// the hero reads as a complete, branded surface in dev preview.
export function HeroWebglBackground() {
  return (
    <div
      aria-hidden="true"
      className="absolute inset-0 -z-10 bg-bg-canvas"
      data-hero-webgl-background
    >
      <div
        className="absolute inset-0 opacity-35"
        style={{
          background:
            "radial-gradient(ellipse 60% 80% at 80% 20%, var(--brand-cortex-orange) 0%, transparent 60%), radial-gradient(ellipse 55% 75% at 15% 85%, var(--brand-monad-purple) 0%, transparent 55%)",
        }}
      />
    </div>
  );
}
