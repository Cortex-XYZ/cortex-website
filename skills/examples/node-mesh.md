# Node Mesh Animated SVG

Node Mesh is the fifth approved self-animated SVG starter for Pattern Studio output.

## Source

- Generator: `Node Mesh` (variant: Branching · Connected Diamond Mesh)
- Source algorithm: diamond mesh grid with 6 columns, 7 alternating rows, diagonal + horizontal line connections
- SVG asset: none (fully algorithmic, no static export needed)

The `Node` slider controls the radius of circle nodes at each mesh vertex. The mesh lines stay static. The grid uses a 600×600 viewBox with padding 40, column width ~86.667.

## Grid Structure

- Even rows (0, 2, 4, 6): nodes at x = PADDING + col × colWidth, 7 nodes each (col 0..6)
- Odd rows (1, 3, 5): nodes at x = PADDING + halfCol + col × colWidth, 6 nodes each (col 0..5)
- Last even-row node lands at x = 560; last odd-row node at x ≈ 516.67 — both within the 40–560 canvas
- 7 nodes on odd rows is not possible with colWidth = 520/6: the 7th would land at x ≈ 603, outside the viewBox
- Total: 46 nodes, 111 line connections
- Lines: horizontal within rows + diagonals between adjacent rows

## Animation Contract

Animate only node circle `r` attribute:

- Keep a low baseline radius so nodes are always faintly visible
- Let each node twinkle independently so dots brighten/dim randomly, like stars
- Use seeded random timing ranges so the rhythm is organic but stable
- Grow each node from baseline radius up to a random twinkle radius, then return to baseline

Do not animate in the first Node Mesh version:

- Line positions, stroke, or visibility
- Node `cx`, `cy`, or fill
- Any transform or layout

## Suggested Parameters

```ts
const nodeMeshMotion = {
  viewBox: 600,
  padding: 40,
  columns: 6,
  rows: 7,
  colWidth: 520 / 6,
  strokeWidth: 1,
  minNodeR: 1,
  peakNodeR: 8,
  minTwinkleR: 2.4,
  twinkleInMin: 0.28,
  twinkleInMax: 0.72,
  twinkleHoldMin: 0.12,
  twinkleHoldMax: 0.52,
  twinkleOutMin: 0.36,
  twinkleOutMax: 0.92,
  twinkleGapMin: 0.28,
  twinkleGapMax: 2,
  initialScatter: 1.6,
  rhythmSeed: 37,
  easeIn: "sine.out",
  easeOut: "sine.inOut",
};
```

## Runnable Example

Use `skills/examples/animated-node-mesh.tsx` as the starter-kit component.

Temporary demo pages may import it directly. Production pages should copy or adapt it into `src/components/` before shipping.
