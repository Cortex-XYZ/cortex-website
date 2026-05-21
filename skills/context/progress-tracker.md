# Progress Tracker

## Current Phase

Foundation setup: brand guidance, design-system source, and agent context are being organized before the production website build starts.

## Completed

- Created active brand guidance in `skills/BRAND.md`.
- Created active design-system guidance in `skills/DESIGN.md`.
- Defined primary, secondary, neutral, extended, gradient, typography, spacing, radius, button, and shader guidance in the active design system.
- Created Figma button component variants for `Primary`, `Outline`, `Secondary`, and `Ghost`, with `Default` and `lg` sizes plus `Default`, `Hover`, and `Disabled` states.
- Clarified that shader recipes lock colors only; motion uniforms are tuned in code.
- Created this `skills/context/` folder for agent implementation context.
- Added root `AGENTS.md` to point agents to the required read order.
- Clarified documentation ownership so `BRAND.md` owns brand guidance, `DESIGN.md` owns design-system contracts, and `skills/context/` owns website implementation context.
- Mapped Cortex design tokens into `src/app/globals.css` with CSS custom properties and Tailwind 4 `@theme inline`.
- Converted reusable gradient CSS variables to stop-list tokens so horizontal and vertical usage can set direction locally.
- Set the default section container contract to Tailwind default breakpoints through a named `.site-container` class.
- Added a separate `CortexButton` wrapper in `src/components/` that extends the shadcn `Button` with Cortex token variants and placed primary/outline CTA examples on the homepage.
- Preserved `CortexButton` typography through `tailwind-merge` by using token-backed arbitrary size and line-height utilities.
- Set Service Cards as the canonical reusable card terminology across design, brand, and implementation context docs.
- Set a GSAP-first scroll and motion runtime: `gsap`, `@gsap/react`, ScrollTrigger, and optional ScrollSmoother.
- Cleaned self-animated SVG pattern rules into runnable starter-kit examples under `skills/examples/`.
- Added five algorithmic Pattern Studio animated SVG starters and temporary homepage demos: Pulse Field, Dot Orbits, Radiating Segments, Stepped Lattice, and Node Mesh. The examples now generate geometry in code and include targeted performance refinements where needed.
- Condensed `skills/context/ui-context.md` animation guidance so detailed per-pattern contracts live in `skills/examples/`.
- Clarified that production Mission animated SVGs live inside `MissionCard` and only run while their card is active.

## Decisions

- `skills/DESIGN.md` defines the design system.
- `skills/BRAND.md` defines brand voice, naming, logo rules, and non-UI asset behavior.
- `skills/context/` defines implementation context: product, architecture, UI mapping, code standards, workflow, and progress.
- Tailwind 4 and shadcn/ui should be used for the production website.
- Bun is the default package manager and script runner for the production website.
- GSAP, `@gsap/react`, ScrollTrigger, and optional ScrollSmoother should be used for coordinated website UI animation and scroll-linked motion.
- Do not add a separate smooth-scroll dependency by default; use ScrollSmoother only if the website needs a global polished scroll layer.
- All five Pattern Studio starters (Pulse Field, Dot Orbits, Radiating Segments, Stepped Lattice, Node Mesh) use algorithmic SVG generation with no static SVG file dependencies. This is the standard approach: generate geometry in code and animate with GSAP.
- `skills/examples/` can be imported by temporary demo pages as a starter kit; production sections should adapt examples into `src/components/`.
- React Three Fiber, @react-three/drei, and Three.js should be used for shader or 3D moments when real runtime rendering is needed.
- Files and folders should use kebab-case; React component exports can stay PascalCase.
- Design tokens should map through `app/globals.css` and Tailwind 4 `@theme inline`, then components should use semantic Tailwind utilities directly or compose reusable named classes in `@layer components` with `@apply`, like `.site-container`, rather than raw hex values or a default `lib/design-tokens.ts` file.
- shadcn is used as a component API/accessibility base, not as a visual source to copy blindly.
- Layout should be responsive and token-driven, not hardcoded from a 1440px mockup.
- Reusable gradient CSS variables should store color stops, while `linear-gradient()` direction should be composed at the usage site unless direction is itself a design-system contract.
- Standard page sections should use `.site-container` before introducing custom layout tokens or breakpoints.
- `.site-container` uses Tailwind `@apply mx-auto w-full max-w-7xl px-5 sm:px-8 lg:px-12`.
- The app root loads Mona Sans and Open Sans once with `next/font/google`; Tailwind font utilities expose `font-mona` and `font-open`.
- `src/components/ui/` is reserved for generated shadcn/ui components; custom Cortex components and wrappers live in `src/components/` outside `ui/`.
- Service Cards are the canonical name for shader-backed service surfaces; future section code should use `services-section.tsx`.

## Open Questions

## Next Steps

1. Build website sections in parallel using shared tokens and components.
2. Adapt approved `skills/examples/` patterns into `src/components/` when the Mission section is implemented.
3. Keep this tracker updated after meaningful implementation changes.

## Latest Handoff

- Changed: fixed Dot Orbits extra-dot reveal order so stagger interleaves one dot per ring at a time (column-major) instead of exhausting a ring before moving on (ring-major); corrected `node-mesh.md` topology from the incorrect 49-node/120-connection figure to the geometrically accurate 46-node/111-connection figure, with an explicit note explaining why 7 nodes per odd row cannot fit inside the 40–560 canvas at `colWidth = 520/6`.
- Files touched: `skills/examples/animated-dot-orbits.tsx`, `skills/examples/node-mesh.md`.
- Verification run: `tsc --noEmit`; `bun run lint`; full Codex review pass — clean.
- Open questions: none.
- Next step: build website sections (Hero, Mission, Services, etc.) in parallel using the shared starter-kit contracts.
