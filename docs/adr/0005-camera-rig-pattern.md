# ADR 0005: Progress-Based Dynamic CameraRig Pattern and Zero-Store Presentation Architecture

## Status
Accepted

## Context
In Fracture 6 of the legacy architecture, the camera controller used hardcoded, fixed-length arrays to govern the 3D camera depth during storyboard chapter reveals:
```javascript
// Legacy Fracture 6:
const REVEAL_Z = [22, 18, 15, 12, 8];
```
When storyboards scaled beyond 5 chapters (such as 6, 8, or 12 dynamic chapter structures in Psychological Depth analysis), the camera indexing broke, clamped prematurely, or failed to advance. Additionally, the camera rig was directly coupled to global domain store indices (`cinematicStep`, `revealSlide`), preventing reuse in other modules or standalone visual harnesses.

## Decision

### 1. Progress-Based Continuous Camera Formula
Fixed-length arrays are abolished. The 3D camera target Z is calculated continuously as a function of slide progression:
$$\text{targetZ} = \text{BASE\_Z} - \left(\frac{\text{currentSlide}}{\text{totalSlides} - 1}\right) \times \text{RANGE}$$

Where:
- $\text{BASE\_Z} = 22$: The initial focal distance for Slide 0.
- $\text{RANGE} = 14$: The total travel distance towards the galactic core.
- $\text{Final Z} = 22 - 14 = 8$: The intimate close-up perspective on the concluding slide.

This formula continuously scales to arbitrary slide counts ($N = 1, 2, 5, 8, 12, 24, \dots$) while preserving identical start and end camera aesthetics.

### 2. Zero-Store Dependency Presentation Architecture
All components in `@astrologica/webgl-core` (`CameraRig`, `StarField`, `NebulaDust`) are strictly prop-driven presentation components with **zero external store dependencies**:
- `CameraRig` accepts `targetZ`, `lerpFactor` (default $0.028$), and an optional `onArrive` callback.
- The hosting application shell (`apps/web/src/shell/UniverseCanvas.tsx`) bridges the camera rig to `webglStore`, passing `targetZ` cleanly via props.
- No WebGL code imports Zustand, React Router, or application-specific state.

### 3. Smooth Exponential Decay Lerping
Camera positioning applies a constant exponential decay factor:
$$\Delta Z = (\text{targetZ} - Z_{\text{current}}) \times 0.028$$
Providing cinematic dampening across all frame rates and screen refresh intervals.

## Consequences
- **Positive**:
  - Storyboards can scale to any number of slides without camera breakage.
  - `@astrologica/webgl-core` can be built and tested independently with 0 application dependencies.
  - Smooth, seamless transitions regardless of chapter length.
- **Negative**:
  - Requires chapter components to supply their current slide index and total slide count to the camera math utility.
