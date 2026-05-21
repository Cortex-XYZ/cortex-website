# Radiating Segments Animated SVG

Radiating Segments is the third approved self-animated SVG starter for Pattern Studio output.

## Source

- Generator: `Radiating Segments`
- Source algorithm: Pattern Studio line generation with evenly-spaced angles
- SVG asset: none (fully algorithmic, no static export needed)

`Rays` changes how many lines radiate from the center and redistributes their angles. A pool of MAX_RAYS line elements is created once; on each frame the visible lines are repositioned to be evenly spaced for the current count. The count is always forced even so the horizontal axis (0° and 180°) never shifts.

## Animation Contract

Generate and reposition SVG line state via a pre-allocated DOM pool:

- line `x1`, `y1`, `x2`, `y2` attributes
- element `display` for unused pool lines

Do not animate in the first Radiating Segments version:

- `stroke` color
- layout
- transform

The animation should read like the Pattern Studio `Rays` slider moving through values `8, 10, 12, …, 84`, not like a hard visibility swap.

Timing should be continuous, not two-state. Use a GSAP proxy with a sine wave to drive ray count from minimum to maximum and back without a visible loop seam.

## Suggested Parameters

```ts
const radiatingSegmentsMotion = {
  innerRadius: 30,
  outerRadius: 270,
  strokeWidth: 1.5,
  minRays: 8,
  maxRays: 84,
  cycleDuration: 3,
  easing: "continuous sine wave (no seams)",
};
```

## Runnable Example

Use `skills/examples/animated-radiating-segments.tsx` as the starter-kit component.

Temporary demo pages may import it directly. Production pages should copy or adapt it into `src/components/` before shipping.
