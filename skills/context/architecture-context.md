<!--markdownlint-disable-->

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
- GSAP from the `gsap` package, `@gsap/react`, ScrollTrigger, and ScrollSmoother for UI animation, scroll-linked reveals, and optional smooth scrolling. ScrollSmoother deferred to post-launch.
- React Three Fiber, `@react-three/drei`, and Three.js for WebGL moments such as hero particles, network fields, service-card shaders, or 3D details. Desktop only (mobile/tablet → gradient or static fallback).
- Zod for all input validation (form schemas, server action parsing, future env-var validation)
- Resend (`resend` package) for newsletter capture — create a Contact and assign to the newsletter Segment/Topic (Audiences API is being migrated; see https://resend.com/docs/dashboard/segments/migrating-from-audiences-to-segments). Sending deferred to post-launch.
- Cloudflare Turnstile for invisible bot prevention on public forms
- Upstash Redis (`@upstash/ratelimit`, `@upstash/redis`) for server-side rate limiting on public form endpoints (newsletter). Sliding window, 5 requests per minute per IP. Skipped in local dev when env vars are absent; required in production-like runtimes.

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

All app code lives under `src/`. Use a structure close to:

```txt
src/
  app/
    layout.tsx              # root layout: fonts, metadata, SiteHeader. No footer (so 404 has no footer)
    not-found.tsx           # 404 page (uses root layout only)
    globals.css             # CSS custom properties + @theme inline + @layer components
    (site)/
      layout.tsx            # site layout: flex-1 wrapper + SiteFooter
      page.tsx              # composes sections in order
  components/
    cortex-button.tsx       # Cortex-styled wrapper over shadcn Button
    ui/                     # generated shadcn primitives — DO NOT edit
    layout/                 # Section wrapper, SiteHeader, MobileNav, SiteFooter
    sections/               # one file per section + per-section subcomponents (cards, detail views)
    illustrations/          # animated SVG patterns (active-prop driven)
    webgl/                  # R3F canvas wrapper, hero WebGL background, service visual surfaces
  hooks/
    use-reduced-motion.ts   # SSR-safe, single source of truth for motion gating
  lib/
    utils.ts                # cn(), etc.
    content/                # typed TS content modules (hardcoded for v1)
    schemas/                # zod schemas
    integrations/           # external service wrappers (Resend, etc.)
    motion/                 # added during P1 polish, not v1 foundation
public/
  images/
    team/                   # person photos (next/image)
  logos/
```

Design tokens should be mapped in `src/app/globals.css` with CSS custom properties and Tailwind 4 `@theme inline`. Components should consume those mapped tokens with semantic Tailwind utilities such as `bg-action-primary`, `text-text-primary`, `font-mona`, and `rounded-full`. When a reusable component contract is clearer as a named CSS class, define it in `src/app/globals.css` under `@layer components` and compose the same semantic utilities with Tailwind `@apply`, like the existing `.site-container` class. Use `tailwind.config.*` only for configuration that cannot live cleanly in CSS. Do not create a separate `lib/design-tokens.ts` unless the team later needs runtime token access in TypeScript.

`src/components/ui/` is reserved for generated shadcn/ui components. Custom Cortex components and wrappers should live in `components/` or a domain subfolder such as `src/components/sections/`, and should wrap shadcn primitives instead of modifying generated files for product-specific styling.

Keep section ownership clear so teammates can work in parallel:

- `src/components/sections/hero-section.tsx`
- `src/components/sections/mission-section.tsx`
- `src/components/sections/services-section.tsx`
- `src/components/sections/team-section.tsx`
- `src/components/sections/events-section.tsx`
- `src/components/sections/history-section.tsx`

Global chrome lives in `src/components/layout/`:

- `src/components/layout/site-header.tsx` — server component composing client islands
- `src/components/layout/header/site-header-shell.tsx` — client: scroll detection (`data-scrolled`)
- `src/components/layout/header/header-mega-nav.tsx` — client: About dropdown with escape/click-outside
- `src/components/layout/header/site-header-mobile-menu.tsx` — client: lazy-loaded MobileNav via `next/dynamic`
- `src/components/layout/mobile-nav.tsx`
- `src/components/layout/site-footer.tsx`

For v1, `site-header.tsx` implements the desktop `About` mega nav from Figma, while `Services` and `Contact` stay direct top-level links. The nav reads from `src/lib/content/nav.ts` so later top-level mega nav groups can be added without rewriting the header structure. `mobile-nav.tsx` mirrors the same nav content with nested groups inside the hamburger sheet.

## Data And Content

For the first website build, hardcode content in local typed files. This keeps the team moving while the site structure, sections, and message are still settling.

Recommended pattern:

- content arrays in TypeScript for the first build
- typed schemas for services, people, events, and milestones
- no CMS or external content source yet
- revisit content source later based on team workflow and editing needs

The root layout and homepage route export `revalidate = EVENTS_DATE_REVALIDATE_SECONDS` (3600) from `src/lib/events/upcoming.ts` so date-aware event UI—`HeaderUpcomingEvent` in the site header and `EventsSection` on the homepage—can re-run filtering after event dates pass without a manual rebuild. Event content is still hardcoded TypeScript, so hourly revalidation only refreshes which events are shown—not content from an external source. Each event keeps two machine-readable instants sourced from Luma as UTC: `startsAt` and `endsAt`. Upcoming-event visibility filters by the exact `startsAt` timestamp (events disappear once their start instant passes). The client-side `EventCountdown` ticks every second and shows three states: a countdown clock before start, "Happening now" between `startsAt` and `endsAt`, and "Event ended" after `endsAt`. `dateLabel` remains display copy.

## Observability

Sentry is wired through `@sentry/nextjs` and the Next 16 instrumentation entrypoints. `src/app/(site)/error.tsx` captures route-segment render failures with `Sentry.captureException`, while `src/app/global-error.tsx` remains the root layout/template fallback. Sentry Logs are enabled in the browser, Node.js server, and edge runtime whenever the related DSN env var is present. Use `Sentry.logger.*` for intentional structured logs with `snake_case` custom attributes. The SDK captures `console.log`, `console.warn`, and `console.error` as structured logs in development and production when Sentry initializes. Session Replay is intentionally disabled for now.

## Invariants

- The site is dark-first.
- Cortex Orange is the primary action color.
- Buttons use Cortex variants, not default shadcn visuals.
- Service Card visual surfaces use approved design-system color recipes. Runtime WebGL shader versions, when introduced, need static mobile/tablet and reduced-motion fallbacks.
- Hero WebGL backgrounds use Cortex brand-pattern concepts such as nodes, edges, mesh, and approved palette fallbacks.
- Layout is responsive and token-driven, not hardcoded to a 1440px canvas.
- Accessibility and mobile behavior are implementation requirements, not cleanup tasks.
