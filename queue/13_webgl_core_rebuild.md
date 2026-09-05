AG PROMPT 13 — WEBGL CORE REBUILD
CONTEXT: Fracture 6: hardcoded 5-position REVEAL_Z broke on 6-8 chapter storyboards.
OBJECTIVE: Rebuild CameraRig as dynamic, progress-based system.
ACTIONS:
1. Formalize StarField and NebulaDust as prop-driven components in packages/webgl-core/.
2. Implement CameraRig.tsx consuming targetZ via props with smooth lerp factor (0.028) and onArrive callback.
3. Wire CameraRig in shell/ to webglStore.
4. Document dynamic slide formula: targetZ = BASE_Z - (currentSlide / (totalSlides - 1)) * RANGE in docs/adr/0005-camera-rig-pattern.md.
5. Add unit test simulating 12 slides confirming smooth targetZ changes.
ACCEPTANCE CRITERIA: No fixed-length camera arrays, webgl-core has 0 store dependencies, test passes.
