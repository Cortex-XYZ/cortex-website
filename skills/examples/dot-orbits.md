# Dot Orbits Animated SVG

Dot Orbits is the second approved self-animated SVG starter for Pattern Studio output.

## Source

- Generator: `Dot Orbits`
- Source algorithm: Pattern Studio `lib/patterns/radial.ts`
- PRNG: Pattern Studio `mulberry32` helper from `lib/rand.ts`
- SVG asset: none (fully algorithmic, no static export needed)

`Max dots` changes dot count and angular positions, not just visibility. For Dot Orbits, do not animate a downloaded SVG as the source of truth. Generate the SVG circles from the same seeded Pattern Studio algorithm, use the peak `Max dots` layout as the stable topology, then reveal the extra dots one by one.

When `Max dots` is `0`, the generated state is intentionally empty. Still consume the seeded count and offset values for each ring before returning an empty ring so future state comparisons keep the same deterministic random sequence.

## Animation Contract

Generate and animate SVG dot state only:

- dot `r`
- `opacity`
- `visibility`

Do not animate in the first Dot Orbits version:

- orbit guide ring radius
- orbit guide ring stroke
- `fill`
- layout
- transform
- generated orbit positions

The animation should leave guide rings static. It should read like the Pattern Studio `Max dots` slider moving through values `0, 1, 2, …, 12`, not like a hard visibility swap.

Timing should be dot-by-dot, not two-state. Do not reveal all extra dots in one batch. Do not stagger by ring index or animate from the center outward; that makes Dot Orbits read like a spiral/ripple instead of a parameter change.

## Suggested Parameters

```ts
const dotOrbitsMotion = {
  rings: 6,
  minDots: 1,
  seed: 7,
  baseMaxDots: 0,
  peakMaxDots: 12,
  dotRadius: 6,
  dotRevealDuration: 0.18,
  dotRevealStagger: 0.07,
  dotHideDuration: 0.22,
  repeatDelay: 0.16,
  easeReveal: "sine.out",
};
```

## Runnable Example

Use `skills/examples/animated-dot-orbits.tsx` as the starter-kit component.

Temporary demo pages may import it directly. Production pages should copy or adapt it into `src/components/` before shipping.
