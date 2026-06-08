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
- **Mission** -- desktop accordion cards, mobile snap carousel with pagination dots, per-card illustrations, reduced-motion support.
- **History** -- timeline section.
- **Team** -- team member cards.
- **Monad** -- GSAP hover/dialog animations, `MonadCardsClient` with Radix dialog (desktop) + Sheet (mobile), `TooltipProvider` in layout.
- **Services** -- five gradient Service Cards + CTA tile, `--gradient-service-*` tokens, responsive layout (full gradient overlay desktop, header-block mobile). Square corners, divider gradient line.
- **Events** -- static `CortexEvent` content (CONNEX Tech Fest), responsive cards, poster, countdown, RSVP, desktop cursor preview (`xl+`), hourly ISR date filtering.

### Layout

- `SiteFooter` server component: CTA quote block, newsletter input (UI only), contact mailto, About/Programs/Legal columns, social glyphs (X/Instagram/TikTok/LinkedIn/YouTube), copyright.
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
- Service Cards = canonical name for the five shader-backed service surfaces.

## Open Questions

- Final CONNEX copy and Luma event URL before launch.
- Events scroll-enter animation wired but not triggered yet.
- Shader/WebGL fills (W1) and tag chips (issue #17) tracked in GitHub issues.

## Next Steps

1. Hero visual treatment (W1).
2. Scroll-triggered section entrance animations.
3. Visual polish pass across all sections.
