import { describe, it, expect, vi, beforeAll } from 'vitest';
import fs from 'fs';
import path from 'path';
import {
  resolveSafeDimensions,
  renderCardToCanvas,
  exportCardAsPNG,
  MAX_EXPORT_WIDTH,
  MAX_EXPORT_HEIGHT,
  MAX_PIXEL_RATIO,
} from '@export-core';

describe('Canvas-Native Export Pipeline (@astrologica/export-core)', () => {
  describe('Eradication of html2canvas Invariant', () => {
    it('verifies zero imports of html2canvas exist across web and package sources', () => {
      const scanRoots = [
        path.resolve(__dirname, '..'), // apps/web/src
        path.resolve(__dirname, '../../../../packages/ui-kit/src'),
        path.resolve(__dirname, '../../../../packages/webgl-core/src'),
        path.resolve(__dirname, '../../../../packages/export-core/src'),
      ];

      const html2canvasImportPattern = /from\s+['"]html2canvas['"]/i;

      function scan(dir: string) {
        if (!fs.existsSync(dir)) return;
        const files = fs.readdirSync(dir);
        for (const file of files) {
          const fullPath = path.join(dir, file);
          const stat = fs.statSync(fullPath);
          if (stat.isDirectory()) {
            scan(fullPath);
          } else if (/\.(js|jsx|ts|tsx)$/.test(file)) {
            const content = fs.readFileSync(fullPath, 'utf-8');
            expect(
              html2canvasImportPattern.test(content),
              `File ${fullPath} must not import html2canvas`
            ).toBe(false);
          }
        }
      }

      for (const root of scanRoots) {
        scan(root);
      }
    });
  });

  describe('Device-Safe Scaling and Max Resolution Clamping', () => {
    it('enforces maximum dimensions of 2000x3000 for mobile memory safety', () => {
      const clamped = resolveSafeDimensions({
        title: 'Super Resolution Test',
        dimensions: {
          width: 5000,
          height: 8000,
        },
      });

      expect(clamped.width).toBe(MAX_EXPORT_WIDTH);
      expect(clamped.height).toBe(MAX_EXPORT_HEIGHT);
      expect(MAX_EXPORT_WIDTH).toBe(2000);
      expect(MAX_EXPORT_HEIGHT).toBe(3000);
    });

    it('enforces maximum pixel ratio of 2.0 to prevent mobile browser canvas crashes', () => {
      const clamped = resolveSafeDimensions({
        title: 'Pixel Ratio Test',
        pixelRatio: 4.5,
      });

      expect(clamped.scale).toBe(MAX_PIXEL_RATIO);
      expect(MAX_PIXEL_RATIO).toBe(2.0);
    });

    it('clamps below-minimum dimensions to safe base bounds', () => {
      const clamped = resolveSafeDimensions({
        title: 'Tiny Card',
        dimensions: {
          width: 50,
          height: 100,
        },
        pixelRatio: 0.2,
      });

      expect(clamped.width).toBe(320);
      expect(clamped.height).toBe(400);
      expect(clamped.scale).toBe(1.0);
    });
  });

  describe('Demo Export & Memory Canvas Generation', () => {
    beforeAll(() => {
      HTMLCanvasElement.prototype.getContext = vi.fn((contextId: string) => {
        if (contextId === '2d') {
          return {
            scale: vi.fn(),
            createRadialGradient: vi.fn(() => ({ addColorStop: vi.fn() })),
            fillRect: vi.fn(),
            beginPath: vi.fn(),
            arc: vi.fn(),
            fill: vi.fn(),
            save: vi.fn(),
            restore: vi.fn(),
            roundRect: vi.fn(),
            stroke: vi.fn(),
            moveTo: vi.fn(),
            lineTo: vi.fn(),
            measureText: vi.fn((t: string) => ({ width: (t || '').length * 8 })),
            fillText: vi.fn(),
            fillStyle: '',
            strokeStyle: '',
            lineWidth: 1,
            globalAlpha: 1.0,
            font: '',
            letterSpacing: '',
            textAlign: 'left',
          } as unknown as CanvasRenderingContext2D;
        }
        return null;
      });
    });

    it('renders a card directly to an HTMLCanvasElement with correct scaled width and height', () => {
      const canvas = renderCardToCanvas({
        title: 'Psychological Depth Dossier',
        subtitle: 'Natal Sun in Taurus • Moon in Scorpio',
        sections: [
          {
            heading: 'Core Drive',
            body: 'Practical foundation anchoring identity through tangible craftsmanship.',
            badge: 'Taurus Sun',
          },
          {
            heading: 'Subconscious Reset',
            body: 'Intense emotional decompression requiring absolute privacy.',
            badge: 'Scorpio Moon',
          },
        ],
        dimensions: {
          width: 800,
          height: 1200,
        },
        pixelRatio: 1.5,
      });

      expect(canvas).toBeInstanceOf(HTMLCanvasElement);
      // Canvas internal buffer must match width * scale
      expect(canvas.width).toBe(800 * 1.5);
      expect(canvas.height).toBe(1200 * 1.5);
    });

    it('successfully executes exportCardAsPNG returning valid blob and download callback', async () => {
      // Mock canvas.toBlob in jsdom
      const originalToBlob = HTMLCanvasElement.prototype.toBlob;
      HTMLCanvasElement.prototype.toBlob = vi.fn((callback: (b: Blob | null) => void) => {
        const dummyBlob = new Blob(['mock-png-bytes'], { type: 'image/png' });
        callback(dummyBlob);
      });

      try {
        const exportResult = await exportCardAsPNG({
          title: 'Astro Archetype Blueprint',
          sections: [
            { heading: 'Section A', body: 'Description text.' },
          ],
          filename: 'test-export-card.png',
        });

        expect(exportResult.blob).toBeDefined();
        expect(exportResult.blob.type).toBe('image/png');
        expect(exportResult.filename).toBe('test-export-card.png');
        expect(typeof exportResult.download).toBe('function');
      } finally {
        HTMLCanvasElement.prototype.toBlob = originalToBlob;
      }
    });
  });
});
