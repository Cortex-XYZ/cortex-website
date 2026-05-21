# Architecture Context

## Target Website Stack

Use this stack when the production website is scaffolded or consolidated:

- Bun as the package manager and script runner
- Next.js App Router
- React 19
- TypeScript
- Tailwind CSS 4
- shadcn/ui as the component API layer
- Lucide React for icons
- GSAP from the `gsap` package, `@gsap/react`, ScrollTrigger, and ScrollSmoother for UI animation, scroll-linked reveals, and optional smooth scrolling
- React Three Fiber, @react-three/drei, and Three.js only for shader or 3D moments that need real runtime rendering

If the selected app uses a newer Next.js version, read the relevant docs in `node_modules/next/dist/docs/` before implementation. Do not rely only on older Next.js memory.

Use `bun.lock` as the lockfile for the production website. Do not introduce `package-lock.json`, `pnpm-lock.yaml`, or `yarn.lock` in the production app unless the team explicitly changes package managers.

## Scroll And Motion Runtime

Default to one GSAP-based motion runtime. Use `gsap` for timelines, `@gsap/react` for React cleanup and scoping, ScrollTrigger for scroll-linked reveals and pinned sequences, and ScrollSmoother only when the site needs a global polished scroll layer.

Do not add a separate smooth-scroll dependency by default. ScrollSmoother keeps smooth scrolling and ScrollTrigger in the same system, avoids dual scroll loops, and reduces coordination code. If ScrollSmoother is used, keep it isolated in a small client-only provider or wrapper near the app root so normal sections can remain Server Components.

Always preserve accessibility and browser expectations: respect reduced-motion preferences, keep keyboard/focus navigation functional, and avoid smooth-scroll behavior that blocks native scroll restoration or anchor links.

## System Boundaries

Design-system decisions belong in `skills/DESIGN.md`.

Brand voice, naming, logos, and general asset rules belong in `skills/BRAND.md`.

Website implementation rules, folder structure, routes, dependencies, and delivery workflow belong in `skills/context/`.

Page-level layout details belong in page or section code. Do not promote exact desktop mockup widths, screen margins, or section heights into global tokens unless they are reusable component contracts.

## Expected Website Structure

When the production app exists, use a structure close to:

```txt
app/
  layout.tsx
  page.tsx
  globals.css
components/
  cortex-button.tsx
  ui/
  layout/
  sections/
  shaders/
lib/
  content/
public/
  images/
  logos/
```

Design tokens should be mapped in `app/globals.css` with CSS custom properties and Tailwind 4 `@theme inline`. Components should consume those mapped tokens with semantic Tailwind utilities such as `bg-action-primary`, `text-text-primary`, `font-mona`, and `rounded-full`. When a reusable component contract is clearer as a named CSS class, define it in `app/globals.css` under `@layer components` and compose the same semantic utilities with Tailwind `@apply`, like the existing `.site-container` class. Use `tailwind.config.*` only for configuration that cannot live cleanly in CSS. Do not create a separate `lib/design-tokens.ts` unless the team later needs runtime token access in TypeScript.

`components/ui/` is reserved for generated shadcn/ui components. Custom Cortex components and wrappers should live in `components/` or a domain subfolder such as `components/sections/`, and should wrap shadcn primitives instead of modifying generated files for product-specific styling.

Keep section ownership clear so teammates can work in parallel:

- `components/sections/hero-section.tsx`
- `components/sections/mission-section.tsx`
- `components/sections/services-section.tsx`
- `components/sections/team-section.tsx`
- `components/sections/events-section.tsx`
- `components/sections/history-section.tsx`
- `components/sections/footer-section.tsx`

## Data And Content

For the first website build, hardcode content in local typed files. This keeps the team moving while the site structure, sections, and message are still settling.

Recommended pattern:

- content arrays in TypeScript for the first build
- typed schemas for services, people, events, and milestones
- no CMS or external content source yet
- revisit content source later based on team workflow and editing needs

## Invariants

- The site is dark-first.
- Cortex Orange is the primary action color.
- Buttons use Cortex variants, not default shadcn visuals.
- Shaders use approved design-system color recipes.
- Layout is responsive and token-driven, not hardcoded to a 1440px canvas.
- Accessibility and mobile behavior are implementation requirements, not cleanup tasks.
