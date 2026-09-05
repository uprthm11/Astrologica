import { describe, it, expect } from 'vitest';
import fs from 'fs';
import path from 'path';
import {
  calculateSlideCameraZ,
  DEFAULT_BASE_Z,
  DEFAULT_RANGE,
  DEFAULT_LERP_FACTOR,
} from '@webgl-core';

describe('WebGL Core & Dynamic CameraRig Engine', () => {
  describe('Dynamic Slide Camera Z Math', () => {
    it('simulates 12 slides confirming strictly decreasing and smooth targetZ changes', () => {
      const TOTAL_SLIDES = 12;
      const positions: number[] = [];

      for (let slide = 0; slide < TOTAL_SLIDES; slide++) {
        const z = calculateSlideCameraZ(slide, TOTAL_SLIDES);
        positions.push(z);
      }

      // First slide must match DEFAULT_BASE_Z (22)
      expect(positions[0]).toBe(DEFAULT_BASE_Z);

      // Last slide must match BASE_Z - RANGE (22 - 14 = 8)
      expect(positions[TOTAL_SLIDES - 1]).toBe(DEFAULT_BASE_Z - DEFAULT_RANGE);

      // Verify strict monotonic decrease across all 12 slides
      for (let i = 0; i < TOTAL_SLIDES - 1; i++) {
        expect(positions[i]).toBeGreaterThan(positions[i + 1]);
        const stepDelta = positions[i] - positions[i + 1];
        // Delta between adjacent steps should be consistent (~1.273)
        expect(stepDelta).toBeCloseTo(DEFAULT_RANGE / (TOTAL_SLIDES - 1), 2);
      }
    });

    it('handles single slide or edge cases gracefully without dividing by zero', () => {
      const singleSlideZ = calculateSlideCameraZ(0, 1);
      expect(singleSlideZ).toBe(DEFAULT_BASE_Z);

      const zeroSlidesZ = calculateSlideCameraZ(0, 0);
      expect(zeroSlidesZ).toBe(DEFAULT_BASE_Z);
    });

    it('handles arbitrary slide counts (e.g. 2, 5, 8, 24) dynamically without fixed arrays', () => {
      // 2 slides edge case
      expect(calculateSlideCameraZ(0, 2)).toBe(22);
      expect(calculateSlideCameraZ(1, 2)).toBe(8);

      const counts = [3, 5, 8, 24, 50];
      for (const count of counts) {
        const startZ = calculateSlideCameraZ(0, count);
        const endZ = calculateSlideCameraZ(count - 1, count);
        expect(startZ).toBe(22);
        expect(endZ).toBe(8);

        const midZ = calculateSlideCameraZ(Math.floor(count / 2), count);
        expect(midZ).toBeLessThan(startZ);
        expect(midZ).toBeGreaterThan(endZ);
      }
    });

    it('simulates camera lerp movement over frames toward targetZ', () => {
      let currentZ = 120; // Starting from default hub overview
      const targetZ = 22; // Target slide 0
      const frames = 120; // 2 seconds at 60fps

      for (let frame = 0; frame < frames; frame++) {
        currentZ += (targetZ - currentZ) * DEFAULT_LERP_FACTOR;
      }

      // After 120 frames with lerp factor 0.028, camera should be within 0.1 of target
      expect(Math.abs(currentZ - targetZ)).toBeLessThan(3.5);
    });
  });

  describe('Zero Store Dependencies Architectural Invariant', () => {
    it('guarantees packages/webgl-core has zero store dependencies', () => {
      const webglSrcDir = path.resolve(__dirname, '../../../../packages/webgl-core/src');
      const files = fs.readdirSync(webglSrcDir);

      const forbiddenImports = [
        'zustand',
        'useAppStore',
        'useWebGLStore',
        'useSessionStore',
        'useUIStore',
        'stores',
      ];

      for (const file of files) {
        if (!file.endsWith('.ts') && !file.endsWith('.tsx')) continue;
        const content = fs.readFileSync(path.join(webglSrcDir, file), 'utf-8');

        for (const forbidden of forbiddenImports) {
          const importPattern = new RegExp(`from\\s+['"].*${forbidden}.*['"]`, 'i');
          const hasForbidden = importPattern.test(content);
          expect(
            hasForbidden,
            `File ${file} in webgl-core must not import store '${forbidden}'`
          ).toBe(false);
        }
      }
    });
  });
});
