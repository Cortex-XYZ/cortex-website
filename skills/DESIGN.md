---
version: alpha
name: Cortex Design System
description: "Practical design-system source for Cortex website and LLM-assisted UI work. Follows the DESIGN.md format: machine-readable tokens in YAML, then human-readable guidance."

colors:
  brand-cortex-orange: "#FF5E00"
  brand-cortex-carbon: "#111111"
  brand-monad-purple: "#6E54FF"
  brand-cortex-amber: "#FBB143"

  vibrant-haze-purple: "#B7AAFF"
  vibrant-electric-yellow: "#FFE100"
  vibrant-active-cyan: "#54FFF9"
  vibrant-signal-magenta: "#FF0051"

  neutral-white: "#FFFFFF"
  neutral-silver-gray: "#D9D9D9"
  neutral-neural-gray: "#7C7C7C"
  neutral-neural-dark: "#282828"
  neutral-black: "#000000"

  extended-volt-dark: "#993800"
  extended-deep-blue: "#000899"
  extended-blue: "#2B00FF"

  bg-canvas: "#111111"
  bg-section: "#111111"
  bg-elevated: "#282828"
  bg-inverse: "#FFFFFF"

  text-primary: "#FFFFFF"
  text-secondary: "#D9D9D9"
  text-muted: "#7C7C7C"
  text-inverse: "#111111"

  border-default: "#282828"
  border-strong: "#D9D9D9"

  action-primary: "#FF5E00"
  action-primary-hover: "#FF6A14"
  action-secondary: "#6E54FF"
  action-secondary-hover: "#7860FF"

colorGroups:
  primary:
    figmaReference: "9cAnnXb9u72VPKRq2SfJEK/1:2"
    tokens:
      - brand-cortex-orange
      - brand-cortex-carbon
      - brand-monad-purple
      - brand-cortex-amber
  secondary:
    figmaReference: "9cAnnXb9u72VPKRq2SfJEK/1:1524"
    vibrant:
      - vibrant-haze-purple
      - vibrant-electric-yellow
      - vibrant-active-cyan
      - vibrant-signal-magenta
    neutrals:
      - neutral-white
      - neutral-silver-gray
      - neutral-neural-gray
      - neutral-neural-dark
      - neutral-black
    extended:
      - extended-volt-dark
      - extended-deep-blue
      - extended-blue
      - neutral-black
  primary-gradient:
    figmaReference: "9cAnnXb9u72VPKRq2SfJEK/1:1582"
    stops:
      - brand-cortex-carbon
      - neutral-neural-gray
      - brand-cortex-orange

typography:
  display:
    fontFamily: Mona Sans
    fontSize: 66px
    fontWeight: 600
    lineHeight: 1
    letterSpacing: 0
  hero:
    fontFamily: Mona Sans
    fontSize: 56px
    fontWeight: 600
    lineHeight: 1
    letterSpacing: 0
  section-heading:
    fontFamily: Mona Sans
    fontSize: 58px
    fontWeight: 800
    lineHeight: 1
    letterSpacing: 0
  card-heading:
    fontFamily: Mona Sans
    fontSize: 60px
    fontWeight: 400
    lineHeight: 1
    letterSpacing: 0
  event-heading:
    fontFamily: Open Sans
    fontSize: 32px
    fontWeight: 700
    lineHeight: 1
    letterSpacing: 0
  team-name:
    fontFamily: Mona Sans
    fontSize: 28px
    fontWeight: 600
    lineHeight: 1
    letterSpacing: 0
  body-lg:
    fontFamily: Mona Sans
    fontSize: 20px
    fontWeight: 400
    lineHeight: 1.36
    letterSpacing: 0
  body:
    fontFamily: Open Sans
    fontSize: 18px
    fontWeight: 400
    lineHeight: 1.3
    letterSpacing: 0
  body-sm:
    fontFamily: Open Sans
    fontSize: 16px
    fontWeight: 400
    lineHeight: 1.3
    letterSpacing: 0
  nav:
    fontFamily: Mona Sans
    fontSize: 14px
    fontWeight: 600
    lineHeight: 1
    letterSpacing: 0
  label:
    fontFamily: Mona Sans
    fontSize: 13px
    fontWeight: 800
    lineHeight: 1
    letterSpacing: 0.41em
  tag:
    fontFamily: Mona Sans
    fontSize: 12px
    fontWeight: 500
    lineHeight: 1
    letterSpacing: 0
  caption:
    fontFamily: Mona Sans
    fontSize: 12px
    fontWeight: 400
    lineHeight: 1
    letterSpacing: 0

spacing:
  "0": 0px
  px: 1px
  "0-5": 2px
  "1": 4px
  "1-5": 6px
  "2": 8px
  "2-5": 10px
  "3": 12px
  "3-5": 14px
  "4": 16px
  "5": 20px
  "6": 24px
  "7": 28px
  "8": 32px
  "9": 36px
  "10": 40px
  "11": 44px
  "12": 48px
  "14": 56px
  "16": 64px
  "20": 80px
  "24": 96px
  "28": 112px
  "32": 128px
  "36": 144px
  "40": 160px
  "44": 176px
  "48": 192px
  "52": 208px
  "56": 224px
  "60": 240px
  "64": 256px
  "72": 288px
  "80": 320px
  "96": 384px

rounded:
  none: 0px
  xs: 2px
  sm: 4px
  md: 6px
  lg: 8px
  xl: 12px
  2xl: 16px
  3xl: 24px
  4xl: 32px
  full: 9999px

gradientStops:
  primary-surface: "transparent 0%, color-mix(in srgb, {colors.neutral-neural-gray} 70%, transparent) 50%, {colors.brand-cortex-orange} 100%"
  primary-overlay: "transparent 0%, color-mix(in srgb, {colors.neutral-neural-gray} 50%, transparent) 50%, {colors.brand-cortex-orange} 100%"
  orange-depth: "transparent 0%, {colors.brand-cortex-orange} 45%, {colors.extended-volt-dark} 100%"
  extended-blue-volt: "transparent 0%, {colors.extended-blue} 45%, {colors.extended-volt-dark} 100%"
  cortex-extend-gradient: "{colors.extended-blue} 0%, {colors.extended-volt-dark} 100%"
  cortex-gray-gradient: "color-mix(in srgb, {colors.neutral-white} 8%, {colors.brand-cortex-carbon}) 0%, color-mix(in srgb, {colors.neutral-white} 18%, {colors.brand-cortex-carbon}) 50%, color-mix(in srgb, {colors.neutral-white} 8%, {colors.brand-cortex-carbon}) 100%"
  cortex-orange-gradient: "transparent 0%, {colors.neutral-neural-gray} 50%, {colors.brand-cortex-orange} 100%"

components:
  button-primary:
    backgroundColor: "{colors.action-primary}"
    textColor: "{colors.neutral-white}"
    typography: "{typography.nav}"
    rounded: "{rounded.full}"
    height: 34px
    paddingInline: 30px
  button-primary-hover:
    backgroundColor: "{colors.action-primary-hover}"
    textColor: "{colors.neutral-white}"
  button-outline:
    backgroundColor: transparent
    borderColor: "{colors.action-primary}"
    textColor: "{colors.neutral-white}"
    typography: "{typography.nav}"
    rounded: "{rounded.full}"
    height: 34px
    paddingInline: 30px
  button-outline-hover:
    backgroundColor: transparent
    borderColor: "{colors.action-primary-hover}"
  button-secondary:
    backgroundColor: "{colors.action-secondary}"
    textColor: "{colors.neutral-white}"
    typography: "{typography.nav}"
    rounded: "{rounded.full}"
    height: 34px
    paddingInline: 30px
  button-secondary-hover:
    backgroundColor: "{colors.action-secondary-hover}"
    textColor: "{colors.neutral-white}"
  button-ghost:
    backgroundColor: transparent
    textColor: "{colors.neutral-white}"
    typography: "{typography.nav}"
    rounded: "{rounded.full}"
    height: 34px
    paddingInline: 30px
  button-ghost-hover:
    backgroundColor: "{colors.bg-elevated}"
  button-lg:
    height: 42px
    paddingInline: 30px
  button-disabled:
    opacity: 0.5

shaders:
  figmaSource: "cortex-web file listed in skills/context/project-overview.md"
  orange-amber:
    colorA: "{colors.brand-cortex-orange}"
    colorB: "{colors.brand-cortex-amber}"
    background: "{colors.brand-cortex-carbon}"
  orange-purple:
    colorA: "{colors.brand-cortex-orange}"
    colorB: "{colors.brand-monad-purple}"
    background: "{colors.brand-cortex-carbon}"
  orange-magenta:
    colorA: "{colors.brand-cortex-orange}"
    colorB: "{colors.vibrant-signal-magenta}"
    background: "{colors.brand-cortex-carbon}"
  orange-yellow:
    colorA: "{colors.brand-cortex-orange}"
    colorB: "{colors.vibrant-electric-yellow}"
    background: "{colors.brand-cortex-carbon}"
  cyan-amber:
    colorA: "{colors.vibrant-active-cyan}"
    colorB: "{colors.brand-cortex-amber}"
    background: "{colors.brand-cortex-carbon}"
  implementation-controls:
    tuneInCode: true
    controls:
      - speed
      - glowTop
      - motion
      - spread
    note: "These are shader uniforms, not fixed design tokens. Designers provide colorA, colorB, and background; engineers tune motion values in code and commit approved values after visual review."
---

# Cortex Design System

This file is the practical design-system source for Cortex website work. It follows the Google `DESIGN.md` structure: tokens live in YAML frontmatter, while the markdown body explains how to use them.

Use this file for Figma, Tailwind 4, shadcn/ui, and LLM-assisted UI generation. Use `skills/BRAND.md` for broader brand voice, logo usage, and non-UI assets.

## Overview

Cortex UI should feel like a serious network interface for real people and real projects. It is dark, structured, direct, and high-signal. The default surface is Cortex Carbon, with Cortex Orange reserved for action and momentum.

The system should feel:

- precise, not cold
- active, not chaotic
- global, but grounded in local hubs
- technical, but readable for newcomers

The website should not feel like a generic SaaS landing page. Avoid decorative card-heavy composition, random gradients, and abstract shapes that do not connect to the Cortex pattern language.

## Colors

The primary palette is:

- **Cortex Orange** `#FF5E00`: primary action and active signal.
- **Cortex Carbon** `#111111`: default dark foundation.
- **Monad Purple** `#6E54FF`: digital depth and secondary action.
- **Cortex Amber** `#FBB143`: warmth and human energy.

The secondary palette extends the system without competing with the primary colors. It has three groups.

Vibrant colors mark services, data, and interactive moments:

- Haze Purple `#B7AAFF`
- Electric Yellow `#FFE100`
- Active Cyan `#54FFF9`
- Signal Magenta `#FF0051`

Neutrals create backgrounds, borders, and hierarchy:

- White `#FFFFFF`
- Silver Gray `#D9D9D9`
- Neural Gray `#7C7C7C`
- Neural Dark `#282828`
- Black `#000000`

Extended colors support gradients and deep surfaces:

- Volt Dark `#993800`
- Deep Blue `#000899`
- Blue `#2B00FF`
- Black `#000000`

Use semantic tokens in components. For example, buttons should use `action-primary`, not `brand-cortex-orange` directly, unless the component is explicitly a brand display.

Primary button hover uses the lighter action token `action-primary-hover` / `#FF6A14`. Secondary button hover uses `action-secondary-hover` / `#7860FF`.

## Typography

Mona Sans is the primary UI and brand typeface. Use it for:

- display headings
- hero headings
- section headings
- nav
- labels
- buttons
- tags
- service names

Open Sans is used for readable body copy and dense informational text.

Rules:

- Buttons use Mona Sans SemiBold, 14px.
- Letter spacing is normally `0`.
- Section labels are the exception: uppercase Mona Sans ExtraBold, 13px, with wide letter spacing.
- Do not use novelty display fonts in CTAs or navigation.
- Do not scale font size with viewport width. Use responsive layout, not viewport-based typography.

## Layout

The layout should be responsive and token-driven. Do not hardcode desktop canvas values as layout tokens.

Rules:

- Use max-width containers in code instead of fixed 1440px screen margins.
- Standard website sections should use the `.site-container` class unless a section has a clear reason to be full-bleed.
- `.site-container` is implemented with Tailwind `@apply mx-auto w-full max-w-7xl px-5 sm:px-8 lg:px-12`, so it keeps the `max-w-7xl` setup explicit without duplicating Tailwind's value in a custom CSS variable.
- Do not add custom Figma breakpoint tokens unless the implementation proves Tailwind's defaults are insufficient.
- Use Tailwind 4 spacing scale for spacing tokens.
- Use CSS grid/flex rules for columns, not hardcoded card widths.
- Desktop service card grids may use 3 columns.
- Mobile service card grids should collapse to 1 column.
- Component widths should hug content unless the layout requires full width.

Important distinction:

- Spacing tokens are design-system values.
- Page layout decisions belong in component/page code.
- Do not create tokens like `layout-card-width` or `layout-section-height` unless they represent a reusable component contract.

Tailwind mapping:

```css
--spacing: 0.25rem;
```

Figma spacing variable names use slash names such as `space/2-5` because Figma variable names cannot use Tailwind's dot syntax cleanly.

## Elevation & Depth

Cortex does not rely on heavy shadows. Depth comes from:

- dark tonal surfaces
- subtle borders
- animated shaders
- glowing network graphics
- controlled gradients

Use `bg-canvas` and `bg-section` for page backgrounds. Use `bg-elevated` for hover surfaces, popovers, menus, and ghost button hover states.

### Gradients

The brand primary gradient stop sequence is:

```txt
Cortex Carbon -> Neural Gray -> Cortex Orange
```

Cortex Carbon is `#111111`. Do not introduce a separate carbon value for gradients.

Code should expose reusable gradient colors as stop-list variables, such as `--gradient-cortex-orange-stops`, then compose direction at the usage site. To change the gradient direction, change only the angle in `linear-gradient(<angle>, var(--gradient-*-stops))`; do not rewrite the stop token.

```css
background-image: linear-gradient(-90deg, var(--gradient-cortex-orange-stops));
background-image: linear-gradient(90deg, var(--gradient-cortex-orange-stops));
background-image: linear-gradient(180deg, var(--gradient-cortex-gray-stops));
```

Use a full `linear-gradient(...)` custom property only when the direction is an approved reusable contract, not when the same color recipe needs both horizontal and vertical applications.

Use `primary-surface` when the gradient is a self-contained surface.

Use `primary-overlay` when the gradient sits over an existing dark background. In code, the start should usually be transparent, not Carbon, so the overlay can compose correctly over `bg-canvas`.

Figma may use Carbon in preview styles so designers can see the gradient on the canvas. Code should use transparent edges for overlays unless the gradient is the whole background.

### Shaders

Shaders are animated service-card backgrounds. They are not simple gradients and should not be represented as one Figma variable.

Figma role:

- static preview
- color pairing
- composition reference
- fallback keyframe

Code role:

- real GLSL shader
- animation
- uniforms
- reduced-motion fallback

Figma source: use the `cortex-web` file listed in `skills/context/project-overview.md` as the visual reference. Do not depend on specific shader node IDs because they may change.

The recipes below define reusable shader color pairings. Service assignment, such as which recipe is used for Education or Staking, should follow the latest Figma label or code implementation. Do not infer service mapping from position alone.

Only `colorA`, `colorB`, and `background` are locked by the design system. Shader controls such as `speed`, `glowTop`, `motion`, and `spread` are implementation parameters. Engineers should tune them in code with visual controls, compare against the Figma static reference, and only write final approved values back here after review.

Shader implementation rules:

- Base is Cortex Carbon or black.
- Use two large soft color lights.
- Clip the shader to the card or section.
- Motion should be ambient.
- Default loop: 10s to 18s.
- Move lights 8% to 16% on x/y.
- Soft scale from 1.0 to 1.08.
- Always ship a static fallback.

Do not make new color palettes for shaders. Shader recipes reference existing color tokens.

## Shapes

The system is mostly sharp with selective softness.

- General page sections: no decorative radius.
- Cards: small or no radius unless the component needs containment.
- Buttons: always `rounded-full`.
- Pills/tags: `rounded-full` or large radius when they represent chips.
- Do not mix many radius values in the same component family.

Radius tokens follow Tailwind 4 values.

## Components

### Button

Figma component:

```txt
Cortex/Button
```

Properties:

```txt
Variant: Primary, Outline, Secondary, Ghost
Size: Default, lg
State: Default, Hover, Disabled
```

Rules:

- Use shadcn/ui Button API in code.
- Do not blindly copy shadcn's default visuals.
- Cortex buttons are full pill buttons.
- Width hugs content by default.
- Do not set a fixed width unless a layout explicitly requires it.
- Default height: `34px`.
- `lg` height: `42px`.
- Horizontal padding: `30px`.
- Primary hover background: `action-primary-hover` / `#FF6A14`.
- Secondary hover background: `action-secondary-hover` / `#7860FF`.
- Disabled state uses `opacity: 0.5`.

Code mapping:

```ts
variant: "primary" | "outline" | "secondary" | "ghost";
size: "default" | "lg";
```

Recommended Tailwind classes:

```ts
default: "h-[34px] rounded-full px-[30px]"
lg: "h-[42px] rounded-full px-[30px]"
```

### Service Cards

Service cards use shader surfaces. The shader identifies the service area while the content grid stays grounded on Cortex Carbon.

Do not encode fixed service card width and height as global layout tokens. Use responsive grid behavior in code.

### Brand Pattern

The brand-pattern concept and asset-generation rules live in `skills/BRAND.md`. In UI, use the approved brand pattern as a dark background texture.

Use for:

- hero backgrounds
- chapter moments
- regional cards
- event page headers

Avoid:

- rebuilding the pattern from scratch when approved assets exist
- random particles
- stock wave graphics
- rainbow colors
- fast flicker
- pattern over light surfaces

## Do's and Don'ts

Do:

- Use Cortex Orange for primary action.
- Use Carbon as the default serious surface.
- Use Mona Sans for UI controls and headings.
- Use Open Sans for longer body copy.
- Use Tailwind 4 spacing/radius values.
- Use shadcn as the component API layer.
- Use the tokens and component contracts in this file as the design-system source.
- Keep shader color recipes tied to existing tokens.
- Use transparent gradient edges in code when a gradient overlays an existing background.

Don't:

- Do not hardcode page layout values as global design tokens.
- Do not create exact card width/height tokens unless they are true component contracts.
- Do not use shadcn default radius if it conflicts with Cortex buttons.
- Do not create a whole alpha palette for one-off opacity needs.
- Do not use random colors in shaders.
- Do not place dense copy over active shader motion.
- Do not use decorative gradients where a real brand pattern or shader is needed.
