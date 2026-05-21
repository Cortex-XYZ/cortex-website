# Code Standards

## General

- Prefer the existing repo pattern before adding new abstractions.
- Keep changes scoped to the section, component, or system being edited.
- Use Bun for dependency installation, script execution, and production website lockfiles.
- Use TypeScript for production website code.
- Use clear names over clever abstractions.
- Use kebab-case for file and folder names, such as `hero-section.tsx`, not `HeroSection.tsx`.
- Keep React component exports in PascalCase, such as `HeroSection`.
- Keep content data typed.
- Avoid unrelated refactors while implementing a section.

## React And Next.js

- Use Server Components by default.
- Add `"use client"` only for interactivity, browser APIs, animation, shaders, or stateful UI.
- Use GSAP and `@gsap/react` for UI animation sequences.
- Keep shader and canvas work isolated from normal content components.
- Read local Next.js docs before using APIs that may have changed in the installed version.
- Do not put heavy runtime animation logic in server components.
- Keep animation setup inside client components and clean up timelines/listeners on unmount.

## Styling

- Use Tailwind 4 and CSS custom properties.
- Use semantic tokens mapped from `skills/DESIGN.md`.
- Do not hardcode hex values in components.
- Do not use raw Tailwind palette classes for product UI.
- Do not encode desktop mockup measurements as permanent layout constants.
- Prefer responsive CSS grid/flex over fixed widths.
- Use Tailwind default breakpoints and the `.site-container` class before adding custom breakpoint tokens.
- Preserve readable contrast on dark surfaces.

## Components

- Use shadcn/ui as the API and accessibility base.
- Keep `components/ui/` for generated shadcn/ui components only.
- Put custom Cortex components and wrappers in `components/`, outside `components/ui/`.
- Extend shadcn components through custom wrappers instead of directly altering generated component files for Cortex-specific visuals.
- Put composed website sections in `components/sections/`.
- Keep section-specific helpers close to the section until reuse is proven.

## Assets

- Use existing logos from `logos/` unless the task is to create new logo assets.
- Use approved brand pattern and shader recipes.
- Do not create random abstract graphics that do not follow Cortex visual language.
- Prefer static fallbacks for animated shader/canvas surfaces.

## Motion

- Use CSS for simple hover/focus transitions.
- Use GSAP, `@gsap/react`, ScrollTrigger, and ScrollSmoother when needed for coordinated timelines, scroll-linked reveals, smooth scrolling, and brand pattern motion.
- Keep motion ambient and structured, not flashy.
- Respect reduced-motion preferences.
- Avoid animating layout properties when transform/opacity can do the job.

## Testing And Verification

For meaningful UI changes:

- run the relevant Bun-backed build or typecheck command, such as `bun run build` or `bun run typecheck`
- start the dev server with `bun run dev` when needed
- inspect desktop and mobile viewports
- verify text does not overflow buttons, cards, nav, or sections
- verify shader/canvas surfaces render nonblank and have fallbacks

If verification cannot run, record the reason in the final handoff and in `skills/context/progress-tracker.md` when relevant.
