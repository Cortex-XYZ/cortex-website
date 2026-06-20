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
- Vercel Web Analytics wired through `@vercel/analytics` in the root app layout.
- Sentry wired through `@sentry/nextjs` using Next 16 instrumentation entrypoints.

### Sections

- **Hero** -- full-bleed with isolated `HeroWebglBackground` layer, responsive typography, inner `.site-container`. Interactive WebGL globe (R3F/Three.js) in `src/components/webgl/globe/` (surface, hubs, arcs, atmosphere, starfield, shaders, layout, colors modules); baked static WebP/PNG fallback for mobile (`<1024px`), no-WebGL, and reduced motion via `hero-globe-static.ts` + `GlobeCanvasErrorBoundary`. Hero copy uses `.hero-*` component classes in `globals.css`; CTAs use `HashLink`.
- **Mission** -- desktop accordion cards with scroll pin-stack, mobile snap carousel with pagination dots, per-card illustrations, reduced-motion support. Card height capped via `min(px, dvh)` for viewport fit. Expanded card content and illustrations use card-container-aware scaling, with illustrations centered in the available space between the title and body for short desktop viewports.
- **History** -- timeline section.
- **Team** -- team member cards. Member names link to X profile (tappable on mobile/tablet).
- **Monad** -- GSAP hover/dialog animations, `MonadCardsClient` with Radix dialog (desktop) + Sheet (mobile), `TooltipProvider` in layout.
- **Services** -- blob-based static gradient cards with conic-gradient hover animation on CTA tile, responsive layout. Shared `section-title` / `section-intro` classes. Old `--gradient-service-*` CSS vars removed.
- **Events** -- static `CortexEvent` content (CONNEX Tech Fest), responsive cards, poster, countdown, RSVP, desktop cursor preview (`xl+`), hourly ISR date filtering.

### Motion

- Scroll entrances for History, Events, Services, Team, Monad: per-section `*-enter.ts` + `*-scroll-motion.tsx` client islands, tunables in `*-scroll.ts`; SSR-safe pending states (`[data-*-enter-pending]`) in `globals.css`.
- Mission desktop: entrance sequence + ScrollTrigger pin-stack with discrete scroll steps; click-to-expand and reduced-motion behavior preserved.
- Hash scroll spy keeps `/#section` in sync while scrolling (`history.replaceState`), preserves an explicit `#footer` hash while the footer remains visible, lets cross-route hash links from non-home routes land on the requested homepage target before scroll spy resumes, uses smooth scroll for short hops and instant jumps beyond ~1.25 viewports, and is resilient to interrupted tweens and deep links into client-only islands (MutationObserver retry).
- Global scroll-to-top FAB routes to the current route top and clears stale hashes instead of forcing the homepage `#hero` anchor; hero scroll cue routes through `HashLink`; `html` uses `scroll-auto` (CSS smooth scroll conflicts with ScrollTrigger).
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
- Root `not-found.tsx` keeps the compact no-footer 404 treatment with a Back home CTA.

### Observability

- Sentry (`@sentry/nextjs` 10.x): `src/instrumentation.ts` (Node + edge register, `onRequestError`), `src/instrumentation-client.ts` (browser init + `onRouterTransitionStart`), `src/app/(site)/error.tsx` for route-segment render failures, and `src/app/global-error.tsx` with self-contained inline fallback styles and matching inline primary retry button for root layout/template failures. Sentry Logs are enabled across browser, Node.js, and edge runtimes when DSNs are configured; `console.log`, `console.warn`, and `console.error` are captured as structured logs in development and production, while intentional app logs should use `Sentry.logger.*` with `snake_case` attributes. Session Replay is intentionally disabled for now. `next.config.ts` is wrapped with `withSentryConfig` for source-map upload and per-deploy release tracking via `VERCEL_GIT_COMMIT_SHA`.

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
- Error tracking -> Sentry. Source maps and per-deploy releases are gated on `SENTRY_AUTH_TOKEN` so local/preview builds stay quiet by default.

## Open Questions

- Final CONNEX copy before launch.

## Next Steps

1. Integrate Resend for newsletter form. Cloudflare Turnstile for prevent spam.
2. Preformance review and optimization.
3. og image and description.
4. SEO, tracking validation, and launch metadata.
5. Staking page (remove `TEMP(staking-page)` comments when shipping).

## Latest Handoff

- Mission graph placement tuning: moved expanded-card illustrations into the Mission card content grid so each graph centers in the remaining space between the wrapped title and body instead of relying on fixed vertical offsets. Added equal vertical inset and max sizing for the illustration row to preserve breathing room at short desktop heights such as 1440x670. Touched `src/components/sections/mission/mission-cards-client.tsx` and `src/app/globals.css`. Verification: `bun run typecheck`, `bun run lint` (passes with existing warnings in `site-footer.tsx` and `monad-topic-enter.ts`), `bun run build`, browser geometry check at 1440x670 showing equal title/graph and graph/body gaps. Open: existing unrelated lint warnings remain. Next: continue Mission card-by-card visual tuning if requested.
