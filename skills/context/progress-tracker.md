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
- Hero title client island using GSAP SplitText (`type: "words"`, `mask: "words"`, `onSplit`) so the homepage H1 animates as masked word reveals on desktop (`xl` / 1280px+) while mobile and tablet show the title at rest; reduced-motion behavior and server-rendered hero markup are preserved. `HeroTitleMotion` is a thin client shell that conditionally mounts a loader (desktop + motion allowed) which dynamically imports `hero-title-enter.ts`; SplitText is registered inside that module (not `gsap-setup`) so it ships only in the desktop-only async chunk.
- ScrollTrigger-triggered automatic line drawing for History and Team: History draws the desktop timeline line and mobile stems after their triggers enter; Team draws the desktop SVG rules and mobile divider separately from the content reveal. Both respect reduced-motion by setting lines directly to their resting drawn state.
- Slightly slowed the Hero SplitText word reveal and Team line-draw timing after visual tuning feedback.
- Aligned the History timeline line with milestone reveal timing: desktop line advances one segment per milestone trigger; mobile stems use the same trigger start/duration as milestone reveals.

### Layout

- `SiteHeader` refactored from monolithic client component into server component + client islands (`SiteHeaderShell`, `HeaderMegaNav`, `SiteHeaderMobileMenu`). Reduces client JS bundle.
- Header upcoming-event promo: `HeaderUpcomingEvent` / `HeaderUpcomingEventLink` render the next event (from `src/lib/events/upcoming.ts`, shared with the Events section; hourly ISR via `EVENTS_DATE_REVALIDATE_SECONDS`) in the desktop header and mobile hero. Header scroll state lives in `src/lib/layout/site-header-scroll.ts`.
- Same-page hash navigation: `HashLink` + `HashScrollSync` (`src/lib/hash-navigation.ts`) fix `/#section` links when already on `/`; wired through hero CTAs, header, mobile nav, footer, and services CTA. Root layout wraps `{children}` in `Suspense` with `RouteLoadingShell`.
- `SiteFooter` server component: CTA quote block, newsletter input (UI only), contact mailto, About/Programs/Legal columns, social glyphs (X/Instagram/TikTok/LinkedIn/YouTube), copyright. Module-scope hoisted constants (`QUOTE_LINES`, `TAGLINE_LINES`, `SOCIAL_LINKS`).
- `(site)` route group: `page.tsx` and site-specific layout (with `SiteFooter` + `flex-1` wrapper) live under `src/app/(site)/`. Root `layout.tsx` has header only — `not-found.tsx` stays at root so the 404 page renders without footer.
- `/privacy` and `/terms` ship as Server Component routes in the `(site)` group with copy in `src/lib/content/legal.ts`; footer legal links point to the live routes.
- `SectionDivider` shared component replaces per-section divider markup in team, monad, and services sections.
- Footer and mission presentation classes extracted to `@layer components` in `globals.css`.
- Stake CTA interim: header and mobile nav show Coming Soon (no `/stake` link) until the staking page ships; marked `TEMP(staking-page)` in CSS/components for removal.

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
- Service Cards are the canonical name for Services visual surfaces; homepage cards use static CSS gradient/blob visuals in `services-section.tsx`, while future runtime shader surfaces must follow approved design-system recipes and fallback rules.
- Shared entrance-motion values live in `src/lib/motion/tokens.ts`; section `*-scroll.ts` tunables files consume tokens and keep intentional deviations as commented literals (see `README.md` and `skills/context/ui-context.md`).
- Current motion scope intentionally excludes a full Hero entrance timeline for tagline/CTAs, custom Mission keyboard switching beyond native controls, true scrubbed History line drawing, and a Footer/global reveal wrapper. The accepted direction is Hero title motion only, Mission click/scroll/mobile interaction, History line draw that automatically advances with milestone reveals, and section-owned reveal helpers where already useful.
- `(site)` route group separates site pages from error pages — `SiteFooter` renders only for site routes, not `not-found.tsx`.
- Header split into server component + client islands to minimize client JS (only scroll detection, mega nav, and mobile menu are client components).
- Legal copy lives in `src/lib/content/legal.ts`; no shared legal-page component until a third legal route is needed.

## Open Questions

- Final CONNEX copy and Luma event URL before launch.

## Next Steps

1. Preformance review and optimization.
2. og image and description.
3. SEO, tracking, analytics.
4. Staking page (remove `TEMP(staking-page)` comments when shipping).

## Latest Handoff

Fixed stake CTA breakpoint: desktop header disabled Stake pill shows from `lg` upward only (hidden on tablet where the mobile menu is active); upcoming-event promo still appears from `sm`. Desktop Coming Soon tooltip shimmer is disabled under `prefers-reduced-motion: reduce` alongside the mobile nav shimmer.

Shipped `/privacy` and `/terms` with typed copy in `src/lib/content/legal.ts`, live footer legal links, plain page titles (no duplicated site name in the root layout template), mobile hero subtitle copy in `hero.ts` / `hero-section.tsx`, and the CONNEX Tech Fest description update in `events.ts`. Verification pending. Open: CONNEX event URL still temporary. Next: navigation fixes and launch polish.

Added hero, history, and team motion polish: hero title GSAP SplitText masked word reveal (`hero-title-enter.ts` + `hero-title-motion.tsx`), and ScrollTrigger-driven automatic line drawing for History (desktop timeline advancing one segment per milestone reveal, mobile stems sharing milestone trigger timing) and Team (`team-line-draw.ts`: desktop SVG rules and mobile dividers drawn separately from the content reveal), all with reduced-motion resting states. Also recorded the motion scope clarification: full Hero tagline/CTA timeline, custom Mission keyboard switching, true scrubbed History line drawing, and a Footer/global reveal wrapper are not required for the current pass. Verified `bun run typecheck`, `bun run lint`, `bun run build`, and Browser checks at 1280x720 and 390x844: no horizontal overflow, hero title split into 4 word masks, History/Team animation targets present, console clean.

Disabled `/stake` navigation until the staking page ships: desktop header CTA is a muted pill with "Coming Soon" tooltip (`header-stake-cta.tsx`); mobile nav bottom row uses silver text, Clock icon, and a shimmer pill with `aria-disabled="true"`. Removed `siteLinks.stake` href. Branch: `fix/stake-coming-soon` off `dev`.

Extracted shared entrance-motion values into `src/lib/motion/tokens.ts` (`MOTION_EASE`, `MOTION_START`, `MOTION_DURATION`, `MOTION_LIFT`, `MOTION_OVERLAP`, `MOTION_STAGGER`). Section tunables files (`events-scroll.ts`, `services-scroll.ts`, `monad-scroll.ts`, `team-scroll.ts`, `history-scroll.ts`, `mission-layout.ts`) and `scroll-trigger.ts` baselines now reference tokens; intentional per-section deviations stay as commented literals (services 0.22 card chain, monad 0.16 band overlap, team 0.2 member line draw and 0.16 first-member overlap, mission 1.5rem stack lift and 0.55 intro fade). Also moved previously inline eases into the tunables pattern: `MONAD_DIVIDER_EASE` (monad-enter.ts) and `MISSION_ENTRANCE_EASE` (mission-entrance.ts). No runtime values changed (verified by resolving all constants against the prior literals). Interaction motion (dialog open, hover, scrollTo, hash navigation) intentionally left out of entrance tokens. Documented usage in `skills/context/ui-context.md`; README remains out of scope for this pass. Verified `bun run typecheck` and `bun run lint`.

Shipped scroll-driven section animations (ported from stage-2). `ScrollTrigger` registered in `gsap-setup.ts`; shared reveal helpers in `scroll-trigger.ts` (`createBatchReveal`, `createScrollReveal`, reduced-motion resting state). Each section gets a code-split client island — `*-enter.ts` + `*-scroll-motion.tsx` with tunables in `*-scroll.ts` — for History, Events, Services, Team, and Monad. Mission desktop adds an entrance sequence plus a ScrollTrigger pin-stack (`mission-entrance.ts`, `mission-pin-stack.ts`) that advances cards on discrete scroll steps while preserving click-to-expand; reduced motion keeps click-only. Monad topic cards render client-only via `monad-topic-cards.tsx` (`ssr: false`) to avoid hydrating GSAP inline styles (orphaned `monad-cards-static.tsx` removed). Global scroll-to-top FAB (`scroll-to-top-button.tsx`) fades in past the header scroll threshold.
