AG PROMPT 15 — EXPORT/POSTER PIPELINE REBUILD
CONTEXT: Fracture 7: html2canvas DOM rasterization crashed mobile browsers.
OBJECTIVE: Canvas-native, mobile-safe image exporter.
ACTIONS:
1. Implement packages/export-core/src/canvasExporter.ts rendering directly to memory canvas.
2. Expose exportCardAsPNG(config) accepting generic text/color layout data.
3. Enforce device-safe scaling (max pixel ratio 2, max dimensions 2000x3000).
4. Export via canvas.toBlob() directly without DOM dependencies.
5. Add unit test asserting no html2canvas import and verified max resolution.
ACCEPTANCE CRITERIA: html2canvas completely eradicated, unit tests pass, demo export works.
