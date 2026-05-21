# AI Workflow Rules

## Required Read Order

Before implementation or architectural decisions, read:

1. `skills/context/project-overview.md`
2. `skills/context/architecture-context.md`
3. `skills/context/ui-context.md`
4. `skills/context/code-standards.md`
5. `skills/context/ai-workflow-rules.md`
6. `skills/context/progress-tracker.md`

Then read only the source files needed for the task.

## Source Priority

Use source priority in this order:

1. user request in the current conversation
2. active files in `skills/context/`
3. `skills/DESIGN.md` for design-system rules
4. `skills/BRAND.md` for brand rules
5. current implementation code

If sources conflict, call out the conflict and follow the newer explicit user request.

## Implementation Flow

1. Identify the section, component, or system being changed.
2. Check whether the change affects product scope, architecture, UI rules, or standards.
3. Update the relevant context file first if the rule changes.
4. Implement the smallest useful version.
5. Verify with build, typecheck, or browser inspection when applicable.
6. Update `skills/context/progress-tracker.md` after each meaningful implementation change.

Use Bun for package and script commands by default:

- install packages with `bun add`
- run scripts with `bun run`
- preserve `bun.lock` for the production website

Only use npm, pnpm, or yarn when working inside an existing prototype that already requires that tool, and record that exception in the handoff.

## Parallel Work

Teammates can work in parallel by section if they share the same tokens and component contracts.

Recommended ownership slices:

- Hero
- Mission
- Services
- Team
- Events
- History
- Footer
- Shared shaders / brand pattern
- Shared UI primitives

Each section should use shared tokens and components instead of creating local one-off styles.

## Handoff Format

For each meaningful change, record:

- what changed
- files touched
- verification run
- open questions
- next step

Keep handoffs short and concrete.
