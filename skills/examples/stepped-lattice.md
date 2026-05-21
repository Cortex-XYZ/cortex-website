# Stepped Lattice Animated SVG

Stepped Lattice is the fourth approved self-animated SVG starter for Pattern Studio output.

## Source

- Generator: `Stepped Lattice` (variant: Stairstep Diagonal Weave)
- Source algorithm: diagonal staircase lines at offsets stepping by 2, with dot markers at `(col + row) % 4 === 0`
- SVG asset: none (fully algorithmic, no static export needed)

The `Columns` slider changes the step size and number of staircase lines. Each line is a right-then-down stairstep running diagonally from the top/left edges to the bottom/right edges. The grid spans from (40, 40) to (560, 560) in a 600×600 viewBox with step size `520 / columns`.

## Animation Contract

Generate all geometry each frame via pre-allocated DOM pools:

- Path `d` attributes (repositioned per column count)
- Rect `x`, `y` attributes (repositioned per column count)
- Element `display` (hide unused pool elements)

Do not animate in the first Stepped Lattice version:

- `stroke` color
- `stroke-width`
- `fill`
- transform
- individual path segment transitions

The animation should read like the Pattern Studio `Columns` slider moving through values `8, 9, 10, …, 15`, not like a morph or crossfade.

## Suggested Parameters

```ts
const steppedLatticeMotion = {
  viewBox: 600,
  padding: 40,
  canvas: 520,
  strokeWidth: 2.5,
  dotSize: 6,
  dotModulo: 4,
  minColumns: 8,
  maxColumns: 15,
  cycleDuration: 5,
  easing: "continuous sine wave (no seams)",
};
```

## Runnable Example

Use `skills/examples/animated-stepped-lattice.tsx` as the starter-kit component.

Temporary demo pages may import it directly. Production pages should copy or adapt it into `src/components/` before shipping.
