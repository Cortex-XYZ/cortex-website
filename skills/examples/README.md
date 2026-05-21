# Examples

Runnable starter-kit examples for team members and AI agents. Demo pages can import these directly to preview each effect before adapting it for production.

Use examples to clarify implementation patterns that are too detailed for the context docs, such as animated SVG behavior. The per-pattern `.md` files own source algorithms, animation contracts, approved parameters, and exceptions. `skills/context/ui-context.md` should only summarize how the website uses these examples.

When moving an example into production, copy or adapt it into `src/components/illustrations/` and make the section import the production component instead of importing from `skills/examples/`.

## Animated SVG Examples

- `pulse-field.md`: Pulse Field animation contract and approved parameters.
- `animated-pulse-field.tsx`: runnable Pulse Field starter component.
- `dot-orbits.md`: Dot Orbits animation contract and approved parameters.
- `animated-dot-orbits.tsx`: runnable Dot Orbits starter component.
- `radiating-segments.md`: Radiating Segments animation contract and approved parameters.
- `animated-radiating-segments.tsx`: runnable Radiating Segments starter component.
- `stepped-lattice.md`: Stepped Lattice animation contract and approved parameters.
- `animated-stepped-lattice.tsx`: runnable Stepped Lattice starter component.
- `node-mesh.md`: Node Mesh animation contract and approved parameters.
- `animated-node-mesh.tsx`: runnable Node Mesh starter component.
