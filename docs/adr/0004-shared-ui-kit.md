# ADR 0004: Shared UI Kit and Prohibition of Boxy Bordered UI Containers

## Status
Accepted

## Context
Traditional enterprise and template-driven web applications rely on opaque, solid-background, thick-bordered rectangular boxes and heavy card containers. In the context of "Astrologica", a cinematic interstellar application featuring real-time WebGL celestial particles and deep space visuals, thick opaque containers occlude the universe, destroy immersion, and create jarring visual seams.

## Decision

### 1. Prohibition of Boxy Bordered UI Containers
All UI components across all domains and platform surfaces are strictly forbidden from using:
- Opaque, solid background card containers (`bg-gray-800`, `bg-zinc-900`, `bg-white`).
- Thick, high-contrast borders (`border-2`, `border-gray-500`, solid colored borders).
- Generic rectangular layout blocks with sharp, non-radiused corners.

### 2. Standardized Interstellar Aesthetic
All UI elements must utilize the `@astrologica/ui-kit` primitives and adhere to:
- **Obsidian Translucency**: `bg-zinc-950/60` with hardware-accelerated background blur (`backdrop-blur-xl`).
- **Hairline Ambient Rims**: Subtle hairline boundaries using `border-white/[0.07]` (hover `border-white/[0.18]`) that catch ambient starlight without creating harsh outlines.
- **Dynamic Radial Glows**: Soft, expansive color glows (`blur-3xl`) responding dynamically to cursor movement or celestial attributes.
- **Cinematic Typography**: High-tracking uppercase monospaced subheadings, extralight font weights, and delicate vertical gradients.

### 3. Core Primitives
All applications and modules must consume the shared primitives exported from `packages/ui-kit`:
- `CinematicHeading`: Scaled typography with gradient text clipping and custom tracking.
- `CinematicBody`: Typographic body text hierarchy.
- `CinematicButton`: Pill-shaped, borderless or hairline-rim action controls.
- `CinematicCard`: Translucent obsidian card container with hover ambient glow.
- `GlowIcon`: Radial celestial icon highlight.
- `CinematicScrollArea`: Friction-dampened scrolling with invisible scrollbars.

## Consequences
- **Positive**:
  - Consistent, luxurious, immersive visual experience across all 4 domain modules.
  - WebGL starfields and nebula dust remain visible through UI layers.
  - Fast rendering without heavy DOM shadow cascades.
- **Negative**:
  - Requires developers to use predefined tokens and primitives rather than ad-hoc Tailwind utility classes.
