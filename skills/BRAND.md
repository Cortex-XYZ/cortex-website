# Cortex Brand Skill

Use this file when generating Cortex-related assets with an LLM: pitch decks, one-pagers, social posts, event graphics, website copy, proposals, internal docs, or visual prompts.

This file owns brand voice, naming, logo usage, visual language, and non-UI asset direction. It does not define UI tokens, component variants, Tailwind mapping, exact type scales, or production shader recipes. For those, use `skills/DESIGN.md`.

## Brand Core

Cortex is a global network for education, collaboration, events, and real projects around emerging technology. The brand should feel structured, active, high-signal, and practical. It is not generic crypto hype, luxury tech, or abstract futurism.

Core idea:

- Members are nodes.
- Cities are clusters.
- Events are synapses.
- Shared language turns community into culture.
- The network turns local effort into global momentum.

Preferred tone:

- Clear, direct, and grounded.
- Ambitious without sounding inflated.
- Technical enough for builders, but not closed to newcomers.
- Local and human, not only global and abstract.

Avoid:

- Empty Web3 slogans.
- "Revolutionary", "game-changing", or vague hype.
- Random AI or blockchain buzzwords.
- Overly cute, playful, or meme-heavy language.
- Dense jargon when explaining beginner-facing services.

## Naming

Use `Cortex Global` as the default brand name in external contexts.

Use `Cortex` alone only when the parent brand is already clear or the asset is an internal/system reference.

Regional lockups use:

```txt
CORTEX
[3-letter region code]
```

Examples:

- `CORTEX / NGA`
- `CORTEX / NYC`
- `CORTEX / LON`
- `CORTEX / SFO`

Do not invent region codes without approval.

## Logo Rules

The Cortex mark is built from three elements:

- bracket
- cross
- node

Together they form a CX monogram representing connection, structure, and momentum.

Use order:

1. Global lockup
2. Master brand lockup
3. Standalone mark
4. Wordmark
5. CX monogram

Clear space:

- Keep at least `2S` around all sides, where `S` is the mark stroke weight.
- Measure clear space from the full artwork bounds.
- Do not rebuild, redraw, distort, recolor, outline, rotate, compress, or lower opacity on the logo.

Logo color:

- Use black logo on light surfaces.
- Use white logo on dark surfaces.
- On solid brand-color surfaces, use approved high-contrast pairings.
- If a correction stroke is needed, it must match the background color. It should optically open the logo edge, not read as a visible outline.

Minimum sizes:

- Global lockup, digital: `180px` wide.
- Standalone mark, digital: `32px` wide.
- Below `32px`, use the CX monogram.

## Color Personality

Use the approved Cortex palette from `skills/DESIGN.md`. At the brand level, the primary colors carry these meanings:

- Cortex Orange: active signal, urgency, optimism.
- Cortex Carbon: authority, depth, structure.
- Monad Purple: digital depth and ecosystem connection.
- Cortex Amber: warmth and human energy.

Secondary colors support the primary palette:

- Vibrant colors identify service areas, data, and interactive moments.
- Neutrals create structure, background hierarchy, borders, and readable surfaces.
- Extended colors support gradients and deeper surfaces.

Do not let secondary colors compete with Cortex Orange, Carbon, Purple, and Amber.

## Typography

Use Mona Sans as the primary brand face for:

- headlines
- nav
- buttons
- labels
- service names
- high-impact statements

Use Open Sans for:

- readable body copy
- long-form explanations
- dense informational text

The brand should feel muscular, not decorative. Do not use novelty display fonts for core UI or CTAs.

For exact sizes, weights, line heights, and website implementation, use `skills/DESIGN.md`.

## Visual Language

### Brand Pattern

The Cortex brand pattern is built from:

- Dot Grid: a stippled world or regional map.
- Network: glowing nodes and edges connecting cities, hubs, people, or ideas.
- Mesh: linked field showing shared infrastructure.

Layer order:

```txt
dot matrix -> mesh -> network nodes
```

Rules:

- Use on dark bases.
- Keep text in low-density areas.
- Preserve the layer order.
- Regional patterns should start from real geographic boundaries, then become dot fields and network meshes.
- Avoid random particles or generic abstract backgrounds.

### Shaders

Shaders are animated color fields built from the Cortex palette. Treat them as living service surfaces, not simple decorative gradients.

Use shaders for:

- service cards
- event headers
- section transitions
- selected brand moments

Rules:

- Use only approved Cortex palette colors from `skills/DESIGN.md`.
- Keep the base dark and structured.
- Use one or two color lights.
- Motion should be ambient.
- Always ship a static fallback.

Production shader recipes, service color pairings, and motion constraints live in `skills/DESIGN.md`.

Avoid:

- new unapproved colors
- hard rainbow blends
- fast flashes
- spins
- dense copy over motion

## Copy Patterns

Good Cortex copy is specific and useful.

Use:

- "Local Service. Global Impact."
- "Everything for Everyone. Everywhere."
- "An open innovation hub for emerging technology."
- "A structured path from onboarding to incubation."
- "Real projects that can become real businesses."

Prefer concrete nouns:

- hub
- path
- builder
- service
- network
- local chapter
- workshop
- onboarding
- collaboration
- staking
- research

Avoid vague nouns:

- revolution
- movement, unless clearly contextualized
- ecosystem, unless referring to Monad or partner infrastructure
- community, when a more specific word would be stronger

## Asset Generation Rules

When generating any Cortex asset:

1. Start from the real brand palette.
2. Use Mona Sans for high-impact text.
3. Keep Cortex Orange as the main action signal.
4. Keep backgrounds structured and dark when using patterns or shaders.
5. Do not invent logo variations.
6. Do not create random neon or rainbow effects.
7. Use network, node, edge, mesh, geography, and local hub concepts when visualizing the brand.
8. Keep layouts clear enough for a newcomer to understand.

For UI work, always switch to `skills/DESIGN.md` after applying this brand layer.
