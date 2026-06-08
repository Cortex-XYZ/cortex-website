# Progress Tracker

## Current Phase

Foundation work and parallel section implementation are underway. The homepage currently ships Hero, Mission, Events, and the global footer. Remaining v1 sections (`history`, `team`, `monad`, `services`) still need to be built and wired to their content modules.

## Completed

- Created active brand guidance in `skills/BRAND.md`.
- Created active design-system guidance in `skills/DESIGN.md`.
- Defined primary, secondary, neutral, extended, gradient, typography, spacing, radius, button, and shader guidance in the active design system.
- Created button variants for `Primary`, `Subtle Outline`, `Secondary`, and `Ghost`, with `Default` and `lg` sizes plus `Default`, `Hover`, and `Disabled` states.
- Clarified that shader recipes lock colors only; motion uniforms are tuned in code.
- Created this `skills/context/` folder for agent implementation context.
- Added root `AGENTS.md` to point agents to the required read order.
- Clarified documentation ownership so `BRAND.md` owns brand guidance, `DESIGN.md` owns design-system contracts, and `skills/context/` owns website implementation context.
- Mapped Cortex design tokens into `src/app/globals.css` with CSS custom properties and Tailwind 4 `@theme inline`.
- Converted reusable gradient CSS variables to stop-list tokens so horizontal and vertical usage can set direction locally.
- Set the default section container contract to Tailwind default breakpoints through a named `.site-container` class.
- Added a separate `CortexButton` wrapper in `src/components/` that extends the shadcn `Button` with Cortex token variants and placed primary/subtle-outline CTA examples on the homepage.
- Preserved `CortexButton` typography through `tailwind-merge` by using token-backed arbitrary size and line-height utilities.
- Set Service Cards as the canonical reusable card terminology across design, brand, and implementation context docs.
- Services section uses **five Service Cards**, not three. Any older notes referring to three should be ignored. The cards each compose `<ServiceVisualSurface variant="service-...">` from the F6 WebGL visual runtime; placement is owned by `services-section.tsx`.
- Set a GSAP-first scroll and motion runtime: `gsap`, `@gsap/react`, ScrollTrigger, and optional ScrollSmoother.
- ScrollSmoother is not part of v1; use normal browser scrolling for launch and revisit global smooth scrolling after launch if the site needs it.
- Cleaned self-animated SVG pattern rules into runnable starter-kit examples under `skills/examples/`.
- Added five algorithmic Pattern Studio animated SVG starters and temporary homepage demos: Pulse Field, Dot Orbits, Radiating Segments, Stepped Lattice, and Node Mesh. The examples now generate geometry in code and include targeted performance refinements where needed.
- Condensed `skills/context/ui-context.md` animation guidance so detailed per-pattern contracts live in `skills/examples/`.
- Clarified that production Mission animated SVGs live inside `MissionCard` and only run while their card is active.
- Created the v1 GitHub issue set for foundations, section features, polish, launch, post-launch, and remaining decisions.
- Updated GitHub CI workflow to use Bun setup, frozen lockfile install, lint, typecheck, and build commands.
- Reworked the hero as a full-bleed section with an isolated `HeroWebglBackground` layer and an inner `.site-container` for copy and CTAs, so the future WebGL canvas can fill the viewport without constraining content layout.
- Added a `hero-mobile` typography token and made hero heading/body/button spacing responsive across mobile and desktop breakpoints.
- Added typed content modules under `src/lib/content/` for hero, mission, history, team, Monad, services, events, and footer, with `nav.ts` consuming the central link registry.
- Implemented responsive Mission section: desktop accordion card stack with bottom-aligned intro copy; mobile stacked intro, horizontal snap carousel with pagination dots, and section-owned per-card illustration placement.
- Moved stable Mission section presentation classes into `src/app/globals.css` under `@layer components`, keeping interaction state and per-card geometry in `mission-section.tsx`.
- Kept `src/lib/content/mission.ts` content-focused by moving Mission illustration placement classes into a typed card-ID map in `mission-section.tsx`.
- Matched the Mission intro paragraph font-size progression to the Hero paragraph sizing: `text-body-sm` at base and `text-body` from `sm` upward, without an `xl` size jump.
- Enabled Mission mobile/tablet carousel illustration animation if user does not have reduced motion enabled; otherwise only for the active centered card, with neighboring peek cards remaining static.
- Built the global footer, then consolidated it (per the SiteFooter GitHub issue) into a single self-contained server component `src/components/layout/site-footer.tsx` exporting `SiteFooter`, alongside `site-header.tsx`. It contains the CTA quote block (accent-colored periods: orange / purple / amber), the newsletter (input UI only, no submit behavior — `type="button"`, no form), the contact mailto link, the About / Programs / Legal columns (single-column on mobile, 3-col row from `sm` up), inline Simple Icons social glyphs (X / Instagram / TikTok / LinkedIn / YouTube), and the copyright. Mounted globally in `src/app/layout.tsx`. The earlier split files (`sections/footer-section.tsx`, `sections/footer-newsletter.tsx`, `icons/social.tsx`) were removed in favor of this single file.
- Moved footer-specific Tailwind utility bundles from `SiteFooter` JSX into `.site-footer-*` component classes in `src/app/globals.css`, keeping the React component focused on content mapping, quote accent logic, and social glyph selection.
- Shipped Upcoming Events: static `CortexEvent` content (CONNEX Tech Fest seed), responsive cards, poster, countdown, RSVP, desktop cursor preview (`xl+`), and hourly ISR date filtering on the homepage.
- Added shared hooks (`use-reduced-motion`, `use-is-desktop`, `use-on-mount`) and reduced-motion static frames on all five Pattern Studio illustrations.

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
- Design tokens should map through `src/app/globals.css` and Tailwind 4 `@theme inline`, then components should use semantic Tailwind utilities directly or compose reusable named classes in `@layer components` with `@apply`, like `.site-container`, rather than raw hex values or a default `lib/design-tokens.ts` file.
- shadcn is used as a component API/accessibility base, not as a visual source to copy blindly.
- Layout should be responsive and token-driven, not hardcoded from a 1440px mockup.
- Reusable gradient CSS variables should store color stops, while `linear-gradient()` direction should be composed at the usage site unless direction is itself a design-system contract.
- Standard page sections should use `.site-container` before introducing custom layout tokens or breakpoints.
- `.site-container` uses Tailwind `@apply mx-auto w-full max-w-7xl px-5 sm:px-8 lg:px-12`.
- The app root loads Mona Sans and Open Sans once with `next/font/google`; Tailwind font utilities expose `font-mona` and `font-open`.
- `src/components/ui/` is reserved for generated shadcn/ui components; custom Cortex components and wrappers live in `src/components/` outside `ui/`.
- Service Cards are the canonical name for shader-backed service surfaces; future section code should use `services-section.tsx`.
- Events are static TypeScript in `events.ts` for v1; desktop interactivity gates at `xl` via `useIsDesktop`.

## Open Questions

- Final CONNEX copy and Luma event URL before launch.
- Events scroll-enter CSS exists but is not wired yet.

## Next Steps

1. Continue with the remaining content-wired sections: `history-section`, `team-section`, `monad-section`, `services-section`.
2. Add hero visual treatment.

## Latest Handoff

- Status: Hero, Mission, Events, and footer are on the homepage; content modules exist for history, team, Monad, and services.
- Files touched: `src/lib/content/events.ts`, `src/lib/content/links.ts`, `src/lib/events/*`, `src/lib/split-trailing-accent.ts`, `src/components/sections/events-section.tsx`, `src/components/sections/events/*`, `src/hooks/use-reduced-motion.ts`, `src/hooks/use-is-desktop.ts`, `src/hooks/use-on-mount.ts`, `src/components/illustrations/*.tsx`, `src/app/globals.css`, `src/app/page.tsx`, `public/images/events/627.png`.
- Next step: continue with the remaining content-wired sections (`history-section`, `team-section`, `monad-section`, `services-section`).
