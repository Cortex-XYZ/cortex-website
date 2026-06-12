/**
 * Run GSAP setup after paint so React hydration finishes first.
 *
 * Uses two nested rAFs so ScrollTrigger registration runs after the first paint.
 * Safari caveat (low risk): the inner rAF can fire before layout is fully settled.
 * Fully mitigated by section `data-*-enter-pending` CSS in `globals.css` — targets
 * stay hidden until enter setup clears the attribute (e.g. `data-services-enter-pending`).
 * Heavier deferrals (triple rAF, `requestIdleCallback`, etc.) are not worth the cost.
 */
export function deferGsapSetup(setup: () => (() => void) | void): () => void {
  let cancelled = false;
  let cleanup: (() => void) | undefined;

  const frame = requestAnimationFrame(() => {
    requestAnimationFrame(() => {
      if (cancelled) return;
      cleanup = setup() ?? undefined;
    });
  });

  return () => {
    cancelled = true;
    cancelAnimationFrame(frame);
    cleanup?.();
  };
}
