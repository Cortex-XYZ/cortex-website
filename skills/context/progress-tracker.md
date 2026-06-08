# Progress Tracker

## Current Phase

All seven homepage sections are built and wired. Homepage order: Hero, Mission, History, Team, Monad, Services, Events. Global footer and header ship in layout. Focus shifts to visual polish and hero treatment.

## Completed

### Foundations

- Brand guidance (`skills/BRAND.md`), design system (`skills/DESIGN.md`), agent context (`skills/context/`).
- Design tokens mapped to CSS custom properties + Tailwind 4 `@theme inline` in `globals.css`.
- `CortexButton` wrapper with Cortex token variants (Primary, Subtle Outline, Secondary, Ghost).
- GSAP + ScrollTrigger motion runtime; `gsap-setup.ts` shared module. ScrollSmoother deferred post-launch.
- Shared hooks: `use-reduced-motion`, `use-is-desktop`, `use-on-mount`.
- Five Pattern Studio animated SVG starters in `skills/examples/` (algorithmic generation, no static SVG deps).
- CI workflow: Bun setup, frozen lockfile, lint, typecheck, build.
- Typed content modules in `src/lib/content/` for all sections + `nav.ts`.

### Sections

- **Hero** -- full-bleed with isolated `HeroWebglBackground` layer, responsive typography, inner `.site-container`.
- **Mission** -- desktop accordion cards, mobile snap carousel with pagination dots, per-card illustrations, reduced-motion support. Card height capped via `min(px, dvh)` for viewport fit. Illustration placements use dvh-based responsive sizing.
- **History** -- timeline section.
- **Team** -- team member cards. Member names link to X profile (tappable on mobile/tablet).
- **Monad** -- GSAP hover/dialog animations, `MonadCardsClient` with Radix dialog (desktop) + Sheet (mobile), `TooltipProvider` in layout.
- **Services** -- blob-based static gradient cards with conic-gradient hover animation on CTA tile, responsive layout. Shared `section-title` / `section-intro` classes. Old `--gradient-service-*` CSS vars removed.
- **Events** -- static `CortexEvent` content (CONNEX Tech Fest), responsive cards, poster, countdown, RSVP, desktop cursor preview (`xl+`), hourly ISR date filtering.

### Layout

- `SiteHeader` refactored from monolithic client component into server component + client islands (`SiteHeaderShell`, `HeaderMegaNav`, `SiteHeaderMobileMenu`). Reduces client JS bundle.
- `SiteFooter` server component: CTA quote block, newsletter input (UI only), contact mailto, About/Programs/Legal columns, social glyphs (X/Instagram/TikTok/LinkedIn/YouTube), copyright. Module-scope hoisted constants (`QUOTE_LINES`, `TAGLINE_LINES`, `SOCIAL_LINKS`).
- `(site)` route group: `page.tsx` and site-specific layout (with `SiteFooter` + `flex-1` wrapper) live under `src/app/(site)/`. Root `layout.tsx` has header only — `not-found.tsx` stays at root so the 404 page renders without footer.
- `SectionDivider` shared component replaces per-section divider markup in team, monad, and services sections.
- Footer and mission presentation classes extracted to `@layer components` in `globals.css`.

## Decisions

- Tailwind 4 + shadcn/ui (accessibility base, not visual source). Bun for package management.
- GSAP-first animation. R3F/Three.js for shader/3D moments.
- Tokens flow through `globals.css` + `@theme inline`; components use semantic Tailwind utilities or `@layer components` classes.
- `.site-container`: `mx-auto w-full max-w-7xl px-5 sm:px-8 lg:px-12`.
- Fonts: Mona Sans + Open Sans via `next/font/google` (`font-mona`, `font-open`).
- `src/components/ui/` reserved for shadcn; custom components live in `src/components/`.
- Gradient CSS vars store stop-lists; direction composed at usage site.
- kebab-case files/folders; PascalCase React exports.
- Events static in `events.ts` for v1; desktop interactivity gates at `xl`.
- Service Cards = canonical name for the five blob-gradient service surfaces.
- `(site)` route group separates site pages from error pages — `SiteFooter` renders only for site routes, not `not-found.tsx`.
- Header split into server component + client islands to minimize client JS (only scroll detection, mega nav, and mobile menu are client components).

## Open Questions

- Final CONNEX copy and Luma event URL before launch.
- Events scroll-enter animation wired but not triggered yet.
- Shader/WebGL fills (W1) and tag chips (issue #17) tracked in GitHub issues.

## Next Steps

1. Hero visual treatment (W1).
2. Scroll-triggered section entrance animations.
3. Visual polish pass across all sections.
