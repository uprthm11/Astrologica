AG PROMPT 12 — SHARED UI COMPONENT KIT
CONTEXT: Cinematic, borderless Interstellar aesthetic must be a standardized design system.
OBJECTIVE: Build packages/ui-kit workspace package.
ACTIONS:
1. Setup package build exporting via index.ts as @ui-kit/*.
2. Generalize design tokens (colors, typography, motion) in packages/ui-kit/src/tokens.ts and tailwind base config.
3. Build primitives: CinematicScrollArea, CinematicHeading, CinematicBody, CinematicButton, CinematicCard, GlowIcon.
4. Setup Storybook/demo harness.
5. Migrate Hub screen to use new primitives.
6. Write docs/adr/0004-shared-ui-kit.md banning boxy bordered UI containers.
ACCEPTANCE CRITERIA: UI kit builds independently, Storybook runs, Hub screen matches borderless visual target.
