# ADR 0003: State Management Boundaries and Module Isolation

## Status
Accepted

## Context
In the legacy codebase, a single monolithic Zustand store (`useAppStore.js`) held:
- Step-machine navigation indices (`cinematicStep: 0..7`)
- Sub-slide progress indices (`revealSlide: 0..10`)
- User profile and location inputs
- Western astrology calculation payloads
- MBTI calculation results
- Platform telemetry and admin credentials

This tightly coupled the core application shell to individual domain features, created cascading re-renders across disparate UI trees, and made it impossible to add, remove, or independently test domain modules without modifying the central store.

## Decision

### 1. Separation of Core and Feature State
State is bifurcated into two strictly separated tiers:
- **Core Platform State (`apps/web/src/stores/`)**:
  - `sessionStore.ts`: Manages session identifiers (`sessionId`), user authentication, and admin bearer tokens. Strictly zero feature logic.
  - `uiStore.ts`: Manages global presentation chrome: theme, drawer/navigation toggles, modals, system banners, and service connectivity indicators.
  - `webglStore.ts`: Manages canvas camera targets (`cameraTargetZ`). Free of hardcoded slide steps, chapter indices, or domain knowledge.
- **Module-Isolated State (`modules/<name>/frontend/`)**:
  - Each domain feature module encapsulates its own local state, stores, calculation caches, and input buffers.
  - Core stores are forbidden from importing or declaring fields for Western astrology, Vedic astrology, Compatibility, or MBTI.

### 2. Typed Slice Composition
Core platform stores are authored as independent typed Zustand slices (`createSessionSlice`, `createUISlice`, `createWebGLSlice`) and composed into a typed root store (`useAppStore`) while also exposing dedicated granular selector hooks (`useSessionStore`, `useUIStore`, `useWebGLStore`).

### 3. Inter-Module Isolation
No module is permitted to read or mutate another module's local state. Data exchange between the core shell and modules occurs strictly through route parameters, URL search params, and explicit component props.

## Consequences
- **Positive**:
  - Core platform can boot with zero modules enabled.
  - Adding new calculation engines requires zero changes to core store schemas.
  - Clear architectural boundaries prevent state leaks and side-effects.
- **Negative**:
  - Requires modules to maintain their own state management if complex multi-step local flows are needed.
