# Progress Tracker

## Current Phase

All seven homepage sections are built, wired, and animated (scroll-driven entrances, hash navigation, hero WebGL globe). Homepage order: Hero, Mission, History, Team, Monad, Services, Events. Global footer and header ship in layout. Focus shifts to og/SEO.

## Completed

### Foundations

- Brand guidance (`skills/BRAND.md`), design system (`skills/DESIGN.md`), agent context (`skills/context/`).
- Design tokens mapped to CSS custom properties + Tailwind 4 `@theme inline` in `globals.css`.
- `CortexButton` wrapper with Cortex token variants (Primary, Subtle Outline, Secondary, Ghost).
- GSAP + ScrollTrigger motion runtime; `gsap-setup.ts` shared module, reveal helpers in `scroll-trigger.ts`, post-mount setup via `gsap-defer-setup.ts`. ScrollSmoother deferred post-launch.
- Shared hooks: `use-reduced-motion`, `use-is-desktop`, `use-on-mount`.
- Five Pattern Studio animated SVG starters in `skills/examples/` (algorithmic generation, no static SVG deps).
- CI workflow: Bun setup, frozen lockfile, lint, typecheck, build.
- Typed content modules in `src/lib/content/` for all sections + `nav.ts`.

### Sections

- **Hero** -- full-bleed with isolated `HeroWebglBackground` layer, responsive typography, inner `.site-container`. Interactive WebGL globe (R3F/Three.js) in `src/components/webgl/globe/` (surface, hubs, arcs, atmosphere, starfield, shaders, layout, colors modules); baked static WebP/PNG fallback for mobile (`<1024px`), no-WebGL, and reduced motion via `hero-globe-static.ts` + `GlobeCanvasErrorBoundary`. Hero copy uses `.hero-*` component classes in `globals.css`; CTAs use `HashLink`.
- **Mission** -- desktop accordion cards with scroll pin-stack, mobile snap carousel with pagination dots, per-card illustrations, reduced-motion support. Card height capped via `min(px, dvh)` for viewport fit. Illustration placements use dvh-based responsive sizing.
- **History** -- timeline section.
- **Team** -- team member cards. Member names link to X profile (tappable on mobile/tablet).
- **Monad** -- GSAP hover/dialog animations, `MonadCardsClient` with Radix dialog (desktop) + Sheet (mobile), `TooltipProvider` in layout.
- **Services** -- blob-based static gradient cards with conic-gradient hover animation on CTA tile, responsive layout. Shared `section-title` / `section-intro` classes. Old `--gradient-service-*` CSS vars removed.
- **Events** -- static `CortexEvent` content (CONNEX Tech Fest), responsive cards, poster, countdown, RSVP, desktop cursor preview (`xl+`), hourly ISR date filtering.

### Motion

- Scroll entrances for History, Events, Services, Team, Monad: per-section `*-enter.ts` + `*-scroll-motion.tsx` client islands, tunables in `*-scroll.ts`; SSR-safe pending states (`[data-*-enter-pending]`) in `globals.css`.
- Mission desktop: entrance sequence + ScrollTrigger pin-stack with discrete scroll steps; click-to-expand and reduced-motion behavior preserved.
- Hash scroll spy keeps `/#section` in sync while scrolling (`history.replaceState`); smooth scroll for short hops, instant beyond ~1.25 viewports; resilient to interrupted tweens and deep links into client-only islands (MutationObserver retry).
- Global scroll-to-top FAB; hero scroll cue routes through `HashLink`; `html` uses `scroll-auto` (CSS smooth scroll conflicts with ScrollTrigger).

### Layout

- `SiteHeader` refactored from monolithic client component into server component + client islands (`SiteHeaderShell`, `HeaderMegaNav`, `SiteHeaderMobileMenu`). Reduces client JS bundle.
- Header upcoming-event promo: `HeaderUpcomingEvent` / `HeaderUpcomingEventLink` render the next event (from `src/lib/events/upcoming.ts`, shared with the Events section; hourly ISR via `EVENTS_DATE_REVALIDATE_SECONDS`) in the desktop header and mobile hero. Header scroll state lives in `src/lib/layout/site-header-scroll.ts`.
- Same-page hash navigation: `HashLink` + `HashScrollSync` (`src/lib/hash-navigation.ts`) fix `/#section` links when already on `/`; wired through hero CTAs, header, mobile nav, footer, and services CTA. Root layout wraps `{children}` in `Suspense` with `RouteLoadingShell`.
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

## Next Steps

1. og image and description.
2. SEO, tracking, analytics.
3. Terms of use and privacy policy pages.
4. Staking page.

## Latest Handoff

Shipped scroll-driven section animations (ported from stage-2). `ScrollTrigger` registered in `gsap-setup.ts`; shared reveal helpers in `scroll-trigger.ts` (`createBatchReveal`, `createScrollReveal`, reduced-motion resting state). Each section gets a code-split client island — `*-enter.ts` + `*-scroll-motion.tsx` with tunables in `*-scroll.ts` — for History, Events, Services, Team, and Monad. Mission desktop adds an entrance sequence plus a ScrollTrigger pin-stack (`mission-entrance.ts`, `mission-pin-stack.ts`) that advances cards on discrete scroll steps while preserving click-to-expand; reduced motion keeps click-only. Monad topic cards render client-only via `monad-topic-cards.tsx` (`ssr: false`) to avoid hydrating GSAP inline styles (orphaned `monad-cards-static.tsx` removed). Global scroll-to-top FAB (`scroll-to-top-button.tsx`) fades in past the header scroll threshold.

Hash navigation (`hash-navigation.ts`): scroll spy updates `/#section` via `history.replaceState` while scrolling and pauses during programmatic scroll; hash links use GSAP smooth scroll for short hops, instant jump beyond ~1.25 viewport heights; `html` uses `scroll-auto` since CSS smooth scroll fights ScrollTrigger. Hardening on top of the port: the spy resumes when a tween is interrupted (`onAutoKill`/`onComplete` → shared settle), deep links into not-yet-mounted client islands retry via MutationObserver (3s cap), and the hero scroll cue routes through `HashLink` for header-offset-aware scrolling. Behavior verified with Playwright checks; `bun run typecheck` and `bun run lint` pass.

Previously: hero WebGL globe with static fallbacks, header upcoming-event promo with hourly ISR, and `globals.css` token dedup. Deps added then: `three`, `@react-three/fiber`, `@react-three/drei`, `@types/three`.
