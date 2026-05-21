# UI Context

## Source Of Truth

Use `skills/DESIGN.md` as the design-system source. This file explains how that system should be applied in the website code.

Do not duplicate every token here. If a token changes, update `skills/DESIGN.md` first, then update implementation mapping here if needed.

## Theme

Dark-first website. No light-mode work unless explicitly requested.

Use the semantic color tokens from `skills/DESIGN.md` for backgrounds, text, borders, actions, service identity, gradients, and shaders.

No raw hex values in components. Define CSS custom properties in `app/globals.css`, then expose them to Tailwind 4 with `@theme inline`.

Example mapping style:

```css
:root {
  --color-bg-canvas: #111111;
  --color-action-primary: #ff5e00;
  --color-text-primary: #ffffff;
}

@theme inline {
  --color-bg-canvas: var(--color-bg-canvas);
  --color-action-primary: var(--color-action-primary);
  --color-text-primary: var(--color-text-primary);
}
```

Use semantic utilities such as `bg-bg-canvas`, `text-text-primary`, and `bg-action-primary`. Avoid raw Tailwind color classes like `zinc-*`, `orange-*`, or arbitrary hex classes in product components.

## Typography

Use the font families and text styles defined in `skills/DESIGN.md`.

Implementation rules:

- load fonts once at the app root
- apply font variables on the root layout
- use tokenized text styles through component classes
- do not use viewport-scaled font sizes
- do not use novelty display fonts for CTAs, nav, or product UI

## Tailwind 4

Use Tailwind 4 token behavior. Prefer:

- `@theme inline` for design tokens
- CSS custom properties for semantic colors
- `@layer components` plus `@apply` in `src/app/globals.css` for reusable named component classes, such as `.site-container`
- Tailwind spacing and radius scale from `skills/DESIGN.md`
- responsive grid/flex utilities for layout

Do not create hardcoded layout tokens like card width, card height, or desktop canvas margin unless they are stable component contracts.

## shadcn/ui

Use shadcn/ui for component API and accessibility patterns.

Keep generated shadcn components in `src/components/ui/` and do not put custom Cortex components there. Cortex-specific visuals should be implemented in wrappers under `src/components/`, such as `src/components/cortex-button.tsx`, while reusing shadcn primitives underneath.

For Cortex Button variants, sizes, states, and visual contracts, follow `skills/DESIGN.md`. Do not edit the generated shadcn `Button` for Cortex-specific radius or typography; extend it through the Cortex wrapper. Keep any generated-button primary color fallback aligned to semantic action tokens.

Primary button hover should use `action-primary-hover` / `#FF6A14`, not opacity on `action-primary`. Secondary button hover should use `action-secondary-hover` / `#7860FF`, not opacity on `action-secondary`.

## Layout

Use responsive containers and grids. Convert Figma layouts into flexible section code, not fixed desktop canvas values.

Use Tailwind's default responsive variants by default. Standard website sections should use `.site-container`; reserve full-bleed layouts for shader, brand pattern, or media moments that intentionally reach the viewport edge.

`.site-container` is implemented in `src/app/globals.css` with Tailwind `@apply mx-auto w-full max-w-7xl px-5 sm:px-8 lg:px-12`. This keeps the container contract discoverable while still using Tailwind's built-in `max-w-7xl` and default breakpoints.

Keep page-level layout decisions in page or section components. Promote a layout value into `skills/DESIGN.md` only when it becomes a reusable component contract.

## Shaders And Gradients

Shader colors, gradients, and locked recipe values come from `skills/DESIGN.md`.

For gradients that can be horizontal or vertical, define reusable CSS custom properties as stop lists, such as `--gradient-cortex-orange-stops`, and compose the `linear-gradient(<angle>, var(--...-stops))` direction at the usage site. Only define a full gradient variable when the direction is itself a reusable design-system contract.

Tune runtime uniforms in code:

- `speed`
- `glowTop`
- `motion`
- `spread`

Do not write guessed shader uniform values into the design system. Tune them against Figma references and commit approved values only after visual review.

For gradients over an existing dark background, prefer transparent edges in code. Figma may use Cortex Carbon in gradient previews so the designer can see the effect on canvas.

## Animation

Use one GSAP-based motion runtime for website UI animation.

Use it for:

- section entrance timing
- nav/menu transitions
- brand pattern motion
- scroll-linked visual reveals
- coordinated multi-element sequences
- optional ScrollSmoother page-level smooth scrolling when the implementation needs it

Use CSS for simple hover and focus states.

Shader animation remains separate: shader uniforms are tuned in the shader component, while GSAP can control surrounding layout, reveal, and scroll timing.

Do not add a separate smooth-scroll library by default. Use ScrollSmoother only when the design needs global smooth scrolling and verify that native focus, anchors, scroll restoration, and reduced-motion behavior remain acceptable.

### Self-Animated SVG Patterns

Detailed Pattern Studio animation contracts live in `skills/examples/`. Keep this file focused on website usage and integration rules.

Starter-kit examples are not production source. Temporary demo pages may import them directly so teammates can review the effect. Production sections should copy or adapt the example into `src/components/illustrations/` before shipping.

Approved examples:

- `Pulse Field`: `skills/examples/pulse-field.md`, `skills/examples/animated-pulse-field.tsx`
- `Dot Orbits`: `skills/examples/dot-orbits.md`, `skills/examples/animated-dot-orbits.tsx`
- `Radiating Segments`: `skills/examples/radiating-segments.md`, `skills/examples/animated-radiating-segments.tsx`
- `Stepped Lattice`: `skills/examples/stepped-lattice.md`, `skills/examples/animated-stepped-lattice.tsx`
- `Node Mesh`: `skills/examples/node-mesh.md`, `skills/examples/animated-node-mesh.tsx`

Shared integration rules:

- Keep pattern wrappers client-only.
- Use `@gsap/react` for timeline cleanup and scoped selectors.
- Let GSAP own frame-by-frame animation; do not use React state for animation loops.
- Do not create or destroy DOM during a running loop.
- Generate approved geometry algorithmically unless the example contract explicitly calls for a trusted static SVG source.
- Animate only the SVG attributes allowed by the relevant example doc.
- Respect reduced-motion preferences by leaving the pattern on a readable static frame.

### Mission Statement Card Patterns

The Mission section uses a scroll-triggered card stack. Each card carries one self-animated SVG pattern as its visual.

Implementation rules:

- Mission Statement cards may use production adaptations of the self-animated SVG starters in `skills/examples/`.
- Service Cards are a separate surface for the Services section and use shader-backed visuals per `skills/DESIGN.md`. Do not apply Mission Statement pattern rules to Service Cards.
- Only the expanded Mission Statement card should animate. Collapsed cards stay on the resting SVG frame.
- In production, the animated SVG lives inside the `MissionCard` component.
- `mission-section.tsx` owns ScrollTrigger expand/collapse motion and passes an `active` prop or equivalent playback signal into each `MissionCard`.
- `MissionCard` passes that activation state to its pattern component. Pattern components own loop playback. Do not scrub pattern geometry with scroll.
- At most one Mission Statement pattern loop should run at a time in the pinned stack.
- Do not import from `skills/examples/` in shipping section code; adapt the example into `src/components/illustrations/` first.

Performance note: inactive or collapsed Mission cards must not keep GSAP loops running. Pause, kill, or avoid initializing the pattern timeline until the card becomes active, then return the card to a static resting frame when it deactivates.

Avoid:

- Random colors outside Cortex tokens.
- Animating every element in a dense SVG differently unless performance is verified.
- Querying broad tags such as every `circle` or every `rect` in production when the SVG can expose `data-animate` targets.
- Mutating untrusted user-provided SVG strings.
- Placing dense copy over active SVG pattern motion.

Always account for reduced-motion behavior.

## Icons

Use Lucide React for interface icons.

Use icon-only buttons for familiar tool actions where possible, with accessible labels. Use text buttons for CTAs and content actions.
