# Pulse Field Animated SVG

Pulse Field is the first approved self-animated SVG starter for Pattern Studio output.

## Source

- Generator: `Pulse Field`
- Source algorithm: 22×22 grid with distance-based radii using `r = baseDot * (1 - (dist / cornerDist) ^ 1.4)`
- SVG asset: none (fully algorithmic, no static export needed)
- Current base max dot value: `4`
- Animation peak radius: `12.5`

The grid runs from (40, 40) to (560, 560) in a 600×600 viewBox. Dots at the 4 corners where `dist = cornerDist` produce `r = 0` and are omitted, giving 480 dots from a 484-cell grid.

## Animation Contract

Animate only:

- `r`
- `opacity`

Do not animate in the first Pulse Field version:

- `cx`
- `cy`
- `fill`
- layout
- transform

The animation captures each circle's baseline radius and distance from the SVG center. Radius pulses outward by delaying each circle based on its distance from center.

## Suggested Parameters

```ts
const pulseFieldMotion = {
  center: 300,
  gridSize: 22,
  gridStart: 40,
  gridEnd: 560,
  baseDot: 4,
  radiusExponent: 1.4,
  peakRadius: 12.5,
  durationIn: 0.52,
  durationOut: 0.95,
  waveSpread: 1.15,
  repeatDelay: 0.15,
  easeIn: "sine.out",
  easeOut: "sine.inOut",
};
```

## Runnable Example

Use `skills/examples/animated-pulse-field.tsx` as the starter-kit component.

Temporary demo pages may import it directly. Production pages should copy or adapt it into `src/components/` before shipping.
