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
- Service Cards are the canonical name for Services visual surfaces; homepage cards use static CSS gradient/blob visuals in `services-section.tsx`, while future runtime shader surfaces must follow approved design-system recipes and fallback rules.
- Shared entrance-motion values live in `src/lib/motion/tokens.ts`; section `*-scroll.ts` tunables files consume tokens and keep intentional deviations as commented literals (see `README.md` and `skills/context/ui-context.md`).
- Current motion scope intentionally excludes a full Hero entrance timeline for tagline/CTAs, custom Mission keyboard switching beyond native controls, true scrubbed History line drawing, and a Footer/global reveal wrapper. The accepted direction is Hero title motion only, Mission click/scroll/mobile interaction, History line draw that automatically advances with milestone reveals, and section-owned reveal helpers where already useful.
- `(site)` route group separates site pages from error pages — `SiteFooter` renders only for site routes, not `not-found.tsx`.
- Header split into server component + client islands to minimize client JS (only scroll detection, mega nav, and mobile menu are client components).

## Open Questions

- Final CONNEX copy and Luma event URL before launch.

## Next Steps

1. Terms of use and privacy policy pages, content review and update.
2. og image and description.
3. SEO, tracking, analytics.
4. Staking page.

## Latest Handoff

Added off-screen pausing for ambient animation loops (performance audit follow-up). New `src/hooks/use-in-view.ts` (IntersectionObserver via React 19 ref-callback cleanup, no useEffect). Hero globe: `GlobeCanvas` now takes an `active` prop and switches `frameloop` to `"demand"` when the hero background leaves the viewport (`hero-webgl-background.tsx` observes its container). Mission cards: `illustrationActive` is additionally gated on section visibility in both the desktop pinned stack and mobile carousel (`mission-cards-client.tsx`), so the infinite GSAP illustration timelines unmount off-screen and remount/restart on return. Verified in a production build with a WebGL draw-call counter (≈1810 calls/s in view → 0 off-screen → resumes) and an SVG MutationObserver (≈520 mutations/s in view → 0 off-screen → resumes). Typecheck, lint, and build pass. Also resized `public/textures/earth-black-marble.jpg` from 4096×2048 (698 KB, ~45 MB VRAM with mipmaps) to 2048×1024 (315 KB, ~11 MB) — same filename; the 4096 original lives in the stage-2 repo. Desktop hero globe visually verified at 1440×900 against a production build: no visible quality loss. Open Sans now uses `display: "optional"` (layout.tsx) to eliminate the post-load font-swap repaint on the hero subtitle (the LCP element) — devtools-throttled Lighthouse confirms LCP now equals FCP (1.7 s, score 99). The simulated/PSI lab score stays ~86 due to a confirmed upstream Lantern bug for text LCP painted in the first frame (Lighthouse issue #16539 / PR #16782, fix approved but unreleased as of Jun 2026); field CWV are unaffected. Font preloads must stay enabled — disabling them was tested and regressed FCP/CLS without moving simulated LCP. Upstream attribution proven experimentally (Jun 12): stock Lighthouse 13.4.0 simulated mobile scores 87 (LCP 4.1 s) while trace timestamps show FCP and LCP in the same frame (identical timestamps, observed LCP ≈ 90 ms); applying the PR #16782 diff to the same Lighthouse install and re-running yields score 100 (LCP 1.4 s = FCP). Devtools-throttled run: 99 (LCP = FCP = 1.7 s, CLS 0.009, TBT 10 ms). PR #16782 still unmerged; latest release v13.4.0 (Jun 9 2026) does not contain the fix — score will self-correct when it ships.
