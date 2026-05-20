<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.

<!-- END:nextjs-agent-rules -->

Before implementing or making architectural decisions, read these files in order:

1. `skills/context/project-overview.md` - product definition, goals, features, and scope
2. `skills/context/architecture-context.md` - system structure, stack, boundaries, storage model, and invariants
3. `skills/context/ui-context.md` - implementation mapping for theme, tokens, typography, components, and layout
4. `skills/context/code-standards.md` - implementation rules and conventions
5. `skills/context/ai-workflow-rules.md` - development workflow, scoping rules, and delivery approach
6. `skills/context/progress-tracker.md` - current phase, completed work, open questions, and next steps

Use `skills/BRAND.md` for brand voice, naming, logo rules, and non-UI asset generation.

Use `skills/DESIGN.md` as the source of truth for design-system tokens, component contracts, gradients, and shader recipes.

Keep these ownership boundaries:

- `skills/BRAND.md` owns Cortex brand behavior and asset-generation direction.
- `skills/DESIGN.md` owns reusable UI tokens, components, gradients, and shader contracts.
- `skills/context/` owns website implementation scope, architecture, workflow, and current progress.

When a rule fits more than one file, put the canonical rule in the owner file and reference it from the others.

Update `skills/context/progress-tracker.md` after each meaningful implementation change.

If implementation changes the architecture, scope, UI system, or standards documented in the context files, update the relevant context file before continuing.
