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
- Local unit tests use Bun's built-in runner via `bun run test`.
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
- History ScrollTrigger setup now uses one trigger per milestone; each trigger owns milestone reveal, desktop line advance, mobile stem draw, and the final summary reveal. This avoids the previous batch-plus-separate-summary-trigger mix that could leave GSAP refresh with an undefined internal trigger.

### Layout

- `SiteHeader` refactored from monolithic client component into server component + client islands (`SiteHeaderShell`, `HeaderMegaNav`, `SiteHeaderMobileMenu`). Reduces client JS bundle.
- Header upcoming-event promo: `HeaderUpcomingEvent` / `HeaderUpcomingEventLink` render the next event (from `src/lib/events/upcoming.ts`, shared with the Events section; hourly ISR via `EVENTS_DATE_REVALIDATE_SECONDS`) in the desktop header and mobile hero. Header scroll state lives in `src/lib/layout/site-header-scroll.ts`.
- Same-page hash navigation: `HashLink` + `HashScrollSync` (`src/lib/hash-navigation.ts`) fix `/#section` links when already on `/`; wired through hero CTAs, header, mobile nav, footer, and services CTA. Root layout wraps `{children}` in `Suspense` with `RouteLoadingShell`.
- `SiteFooter` server component: CTA quote block, newsletter form island, About/Programs/Legal columns, social glyphs (X/Instagram/TikTok/LinkedIn/YouTube), copyright. Module-scope hoisted constants (`QUOTE_LINES`, `TAGLINE_LINES`, `SOCIAL_LINKS`).
- Footer newsletter capture: `NewsletterForm` client island runs an invisible Cloudflare Turnstile challenge when `NEXT_PUBLIC_TURNSTILE_SITE_KEY` is present, loads `api.js` with the existing page script nonce when a CSP nonce is present, then calls a thin server action with Zod email validation, honeypot (checked before rate limiting/Turnstile so bot traffic stays silent and does not consume Upstash quota), Upstash Redis-backed per-IP rate limiting (`UPSTASH_REDIS_REST_URL` / `UPSTASH_REDIS_REST_TOKEN`; local dev skips if absent, production-like runtimes fail closed; unknown client IPs fail closed in production-like runtimes instead of sharing a global fallback bucket), server-side Turnstile Siteverify via `TURNSTILE_SECRET_KEY` after rate limiting, and Resend global Contact + Segment assignment via `RESEND_API_KEY` / `RESEND_SEGMENT_ID`; new contacts are created with the newsletter segment in one Resend call (`contacts.create` + `segments`), existing contacts are re-subscribed via update + segment list/add with one inline retry on transient failures. Submit decisions, missing/invalid Turnstile tokens, rate-limit behavior, and Resend subscribe logic are covered by Bun unit tests. A localhost Turnstile submit has been verified to create the test email in Resend.
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

1. Performance review and optimization.
2. og image and description.
3. SEO, tracking validation, and launch metadata.
4. Staking page (remove `TEMP(staking-page)` comments when shipping).

## Latest Handoff

- **Newsletter form refactor** — Turnstile logic extracted to `use-turnstile.ts`; `NewsletterForm` handles submit UX. Hidden client **submission id** echoed by `handleNewsletterSignup`; UI only shows feedback for the **active submission** (fixes stale success/error on resubmit). Email input **clears on success**; Turnstile **tokens reset after each response** (single-use).
- **Newsletter pipeline order** — honeypot (silent, before rate limit/Turnstile) → **Upstash** per-IP rate limit → **Cloudflare Siteverify** → **Resend** (`contacts.create` + segments; existing contacts re-subscribed via `contacts.update` when `unsubscribed: true`). Rate limiting runs **before Siteverify** to reduce forged-token abuse.
- **Turnstile config** — Client reads `NEXT_PUBLIC_TURNSTILE_SITE_KEY`; server Siteverify gated by `isNewsletterTurnstileEnabled()` (both keys required). Secret **trimmed** before Siteverify. **Hostname validation**: `TURNSTILE_ALLOWED_HOSTNAMES`, `*.vercel.app` wildcards, `VERCEL_URL` merged for previews; action must match `newsletter`. Script loader stores **loading/loaded/error** on shared script element, uses `turnstile.ready()`, handles remount/retry; copies page **CSP nonce** onto `api.js`.
- **Rate-limit IP hardening** — Parses `x-vercel-forwarded-for`, `Forwarded`, IPv4-with-port, bracketed IPv6; **skips loopback** in production-like runtimes. Unknown IP returns `null` identifier; **fail closed** in production (no shared `local` bucket).
- **Footer hash nav** — `hash-navigation.ts` keeps `#footer` while footer is visible and while focus is in the newsletter/contact region (prevents demotion to `#events` during footer interaction).
- **Resend re-subscribe** — Reactivates unsubscribed contacts only; reactivated members get success message, not already-submitted.
- **Tests** — `submit.test.ts`, `turnstile.test.ts`, `rate-limit.test.ts`, `resend.test.ts`.
- **Verified** — `bun run test`, `bun run typecheck`, `bun run build`. Localhost `#footer` Turnstile submit confirmed against Resend.
