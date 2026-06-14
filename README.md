# cortex-website

Figma File: [cortex-web](https://www.figma.com/design/LmIBDGjK2TIR46y9zt92Zr/cortex-web?node-id=0-1&t=0VnmQRA5D2mNVbsS-1)

## Getting Started

Install dependencies:

```bash
bun install
```

Run the development server:

```bash
bun dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Motion And Animation

Motion in this app has three layers:

1. **CSS UI motion**
   Use CSS for cheap local state changes: hover, focus, color fades, opacity, transforms, borders, and simple open-close transitions. These live in component classes, usually in `src/app/globals.css`.

2. **GSAP section motion**
   Use GSAP, `@gsap/react`, and ScrollTrigger for section entrances, pinned sequences, coordinated reveals, and scroll-linked choreography. Each section owns its effect order in its own `*-enter.ts`, `*-entrance.ts`, or equivalent trigger file.

3. **Visual runtime motion**
   Shader/WebGL and self-animated SVG patterns are separate visual systems. Keep them isolated in `src/components/webgl/` or `src/components/illustrations/`, with static fallbacks for mobile/tablet and reduced-motion users. Homepage Service Card visuals stay static CSS gradients/blobs for now; future service pages may add approved desktop-only WebGL.

Motion tokens only support layer 2. `src/lib/motion/tokens.ts` stores shared GSAP/ScrollTrigger entrance constants: starts, eases, durations, lifts, overlaps, and staggers. Sections map those tokens through local tunables files (`*-scroll.ts`, or `mission-layout.ts`) before timelines consume them.

```ts
// services-scroll.ts
import { MOTION_DURATION } from "@/lib/motion/tokens";

export const SERVICES_HEADER_DURATION = MOTION_DURATION.header;

// Section-specific: wider than the shared chain overlap (0.18).
export const SERVICES_CARD_CHAIN_OVERLAP = 0.22;
```

Do not use motion tokens for layer 1 or layer 3. Also keep dialog motion, hash scrolling, and one-off interactions outside these tokens unless they become shared section entrance choreography.

Full ownership rules live in `skills/context/ui-context.md` (Animation section).
