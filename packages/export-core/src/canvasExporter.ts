/**
 * Native Canvas Exporter
 * Renders directly to offscreen memory canvas using Canvas 2D API.
 * 100% independent of DOM rasterization.
 */

export interface ExportSection {
  heading: string;
  body: string;
  badge?: string;
}

export interface ExportTheme {
  backgroundColor?: string;
  cardBackgroundColor?: string;
  textColor?: string;
  subtextColor?: string;
  accentColor?: string;
  glowColor?: string;
}

export interface ExportCardConfig {
  title: string;
  subtitle?: string;
  sections?: ExportSection[];
  footer?: string;
  theme?: ExportTheme;
  dimensions?: {
    width?: number;  // Base width in CSS px
    height?: number; // Base height in CSS px
  };
  pixelRatio?: number;
  filename?: string;
}

// Safety Constraints (Enforce device-safe scaling)
export const MAX_EXPORT_WIDTH = 2000;
export const MAX_EXPORT_HEIGHT = 3000;
export const MAX_PIXEL_RATIO = 2.0;
export const DEFAULT_BASE_WIDTH = 800;
export const DEFAULT_BASE_HEIGHT = 1200;

export interface ExportResult {
  blob: Blob;
  filename: string;
  width: number;
  height: number;
  scale: number;
  download: () => void;
}

/**
 * Validates and clamps dimensions to device-safe bounds.
 */
export function resolveSafeDimensions(config: ExportCardConfig) {
  const rawWidth = config.dimensions?.width ?? DEFAULT_BASE_WIDTH;
  const rawHeight = config.dimensions?.height ?? DEFAULT_BASE_HEIGHT;
  const rawScale = config.pixelRatio ?? (typeof window !== 'undefined' ? window.devicePixelRatio || 1 : 1);

  const width = Math.min(Math.max(320, rawWidth), MAX_EXPORT_WIDTH);
  const height = Math.min(Math.max(400, rawHeight), MAX_EXPORT_HEIGHT);
  const scale = Math.min(Math.max(1, rawScale), MAX_PIXEL_RATIO);

  return { width, height, scale };
}

/**
 * Renders text with automatic line-wrapping onto Canvas 2D context.
 */
function wrapText(
  ctx: CanvasRenderingContext2D,
  text: string,
  x: number,
  y: number,
  maxWidth: number,
  lineHeight: number
): number {
  const words = text.split(' ');
  let line = '';
  let currentY = y;

  for (let n = 0; n < words.length; n++) {
    const testLine = line + words[n] + ' ';
    const metrics = ctx.measureText(testLine);
    const testWidth = metrics.width;

    if (testWidth > maxWidth && n > 0) {
      ctx.fillText(line, x, currentY);
      line = words[n] + ' ';
      currentY += lineHeight;
    } else {
      line = testLine;
    }
  }
  ctx.fillText(line, x, currentY);
  return currentY + lineHeight;
}

/**
 * Renders card layout directly into an in-memory HTMLCanvasElement.
 */
export function renderCardToCanvas(config: ExportCardConfig): HTMLCanvasElement {
  if (typeof document === 'undefined') {
    throw new Error('Canvas rendering requires a document environment.');
  }

  const { width, height, scale } = resolveSafeDimensions(config);

  const canvas = document.createElement('canvas');
  canvas.width = Math.round(width * scale);
  canvas.height = Math.round(height * scale);

  const ctx = canvas.getContext('2d');
  if (!ctx) {
    throw new Error('Failed to acquire 2D canvas rendering context.');
  }

  ctx.scale(scale, scale);

  const bg = config.theme?.backgroundColor || '#040614';
  const cardBg = config.theme?.cardBackgroundColor || '#080c20';
  const textCol = config.theme?.textColor || '#ffffff';
  const subCol = config.theme?.subtextColor || '#94a3b8';
  const accentCol = config.theme?.accentColor || '#6366f1';
  const glowCol = config.theme?.glowColor || 'rgba(99, 102, 241, 0.25)';

  // 1. Deep Space Radial Backdrop
  const bgGrad = ctx.createRadialGradient(width / 2, height * 0.35, 20, width / 2, height / 2, width * 0.85);
  bgGrad.addColorStop(0, '#0a1033');
  bgGrad.addColorStop(0.5, bg);
  bgGrad.addColorStop(1, '#010206');
  ctx.fillStyle = bgGrad;
  ctx.fillRect(0, 0, width, height);

  // 2. Ambient Starlight Particles
  ctx.fillStyle = '#ffffff';
  for (let i = 0; i < 90; i++) {
    const sx = (Math.sin(i * 99.1) * 0.5 + 0.5) * width;
    const sy = (Math.cos(i * 33.7) * 0.5 + 0.5) * height;
    const rad = (Math.sin(i * 12.3) * 0.5 + 0.5) * 1.5 + 0.5;
    ctx.globalAlpha = (Math.cos(i * 7.1) * 0.5 + 0.5) * 0.7 + 0.2;
    ctx.beginPath();
    ctx.arc(sx, sy, rad, 0, Math.PI * 2);
    ctx.fill();
  }
  ctx.globalAlpha = 1.0;

  // 3. Card Frame (Obsidian Glass Rim)
  const margin = 36;
  const cardW = width - margin * 2;
  const cardH = height - margin * 2;
  const cardRadius = 24;

  ctx.save();
  ctx.beginPath();
  ctx.roundRect(margin, margin, cardW, cardH, cardRadius);
  ctx.fillStyle = cardBg;
  ctx.globalAlpha = 0.85;
  ctx.fill();
  ctx.globalAlpha = 1.0;

  // Hairline Border
  ctx.strokeStyle = 'rgba(255, 255, 255, 0.12)';
  ctx.lineWidth = 1;
  ctx.stroke();

  // Corner Ambient Radial Glow
  const glowGrad = ctx.createRadialGradient(width - margin, margin, 10, width - margin, margin, 180);
  glowGrad.addColorStop(0, glowCol);
  glowGrad.addColorStop(1, 'transparent');
  ctx.fillStyle = glowGrad;
  ctx.fill();
  ctx.restore();

  // 4. Content Typography
  let cursorY = margin + 60;
  const contentX = margin + 40;
  const contentW = cardW - 80;

  // Header Badge / Logo
  ctx.font = '500 11px ui-monospace, SFMono-Regular, monospace';
  ctx.fillStyle = accentCol;
  ctx.letterSpacing = '2px';
  ctx.fillText('ASTROLOGICA ENGINE • DOSSIER EXPORT', contentX, cursorY);
  cursorY += 34;

  // Main Title
  ctx.font = '200 36px system-ui, sans-serif';
  ctx.fillStyle = textCol;
  ctx.letterSpacing = '1px';
  cursorY = wrapText(ctx, config.title.toUpperCase(), contentX, cursorY, contentW, 44);

  // Subtitle
  if (config.subtitle) {
    cursorY += 6;
    ctx.font = '300 15px system-ui, sans-serif';
    ctx.fillStyle = subCol;
    cursorY = wrapText(ctx, config.subtitle, contentX, cursorY, contentW, 22);
  }

  // Divider Line
  cursorY += 16;
  ctx.strokeStyle = 'rgba(255, 255, 255, 0.08)';
  ctx.beginPath();
  ctx.moveTo(contentX, cursorY);
  ctx.lineTo(contentX + contentW, cursorY);
  ctx.stroke();
  cursorY += 36;

  // Sections
  const sections = config.sections || [];
  for (const sec of sections) {
    if (cursorY > height - margin - 80) break;

    // Section Badge
    if (sec.badge) {
      ctx.font = '500 10px ui-monospace, SFMono-Regular, monospace';
      ctx.fillStyle = accentCol;
      ctx.fillText(sec.badge.toUpperCase(), contentX, cursorY);
      cursorY += 18;
    }

    // Section Heading
    ctx.font = '400 18px system-ui, sans-serif';
    ctx.fillStyle = textCol;
    cursorY = wrapText(ctx, sec.heading, contentX, cursorY, contentW, 24);

    // Section Body
    cursorY += 4;
    ctx.font = '300 13px system-ui, sans-serif';
    ctx.fillStyle = subCol;
    cursorY = wrapText(ctx, sec.body, contentX, cursorY, contentW, 19);

    cursorY += 24;
  }

  // Footer
  const footerText = config.footer || 'Generated with Astrologica • Mathematical Ephemeris Engine';
  ctx.font = '400 11px ui-monospace, SFMono-Regular, monospace';
  ctx.fillStyle = 'rgba(255, 255, 255, 0.35)';
  ctx.textAlign = 'center';
  ctx.fillText(footerText.toUpperCase(), width / 2, height - margin - 24);
  ctx.textAlign = 'left';

  return canvas;
}

/**
 * High-performance, canvas-native poster capture.
 * Renders directly to canvas memory and exports to Blob.
 */
export async function exportCardAsPNG(config: ExportCardConfig): Promise<ExportResult> {
  const canvas = renderCardToCanvas(config);
  const { width, height, scale } = resolveSafeDimensions(config);
  const filename = config.filename || `astrologica-card-${Date.now()}.png`;

  return new Promise((resolve, reject) => {
    canvas.toBlob((blob) => {
      if (!blob) {
        reject(new Error('Canvas toBlob serialization failed.'));
        return;
      }

      const download = () => {
        if (typeof window === 'undefined') return;
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = filename;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        setTimeout(() => URL.revokeObjectURL(url), 1000);
      };

      resolve({
        blob,
        filename,
        width,
        height,
        scale,
        download,
      });
    }, 'image/png');
  });
}
