/**
 * Astrologica Interstellar Design Tokens
 * Standardized design tokens for colors, typography, motion, and celestial lighting.
 */

export const colors = {
  void: '#000000',
  obsidian: '#050508',
  spaceGlass: 'rgba(9, 9, 11, 0.65)',
  starlight: '#ffffff',
  stardust: '#a1a1aa',
  nebulaMuted: '#71717a',
  hairlineBorder: 'rgba(255, 255, 255, 0.07)',
  hairlineHoverBorder: 'rgba(255, 255, 255, 0.18)',
  
  celestial: {
    sun: '#f59e0b',       // Amber / Solar core
    moon: '#e0e7ff',      // Lunar Silver
    mercury: '#10b981',   // Emerald / Intellectual
    venus: '#f43f5e',     // Rose / Relational
    mars: '#ef4444',      // Crimson / Will
    jupiter: '#3b82f6',   // Azure / Expansion
    saturn: '#d97706',    // Ochre / Structure
    uranus: '#06b6d4',    // Cyan / Awakening
    neptune: '#6366f1',   // Indigo / Transpersonal
    pluto: '#a855f7',     // Amethyst / Transformation
  },

  glows: {
    subtle: 'rgba(99, 102, 241, 0.15)',
    emerald: 'rgba(16, 185, 129, 0.25)',
    amber: 'rgba(245, 158, 11, 0.25)',
    rose: 'rgba(244, 63, 94, 0.25)',
    purple: 'rgba(168, 85, 247, 0.25)',
    cyan: 'rgba(6, 182, 212, 0.25)',
  }
} as const;

export const typography = {
  fonts: {
    sans: 'system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
    mono: 'ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace',
  },
  weights: {
    extralight: '200',
    light: '300',
    normal: '400',
    medium: '500',
  },
  tracking: {
    tight: '-0.02em',
    normal: '0em',
    wide: '0.05em',
    widest: '0.2em',
    ultra: '0.3em',
  }
} as const;

export const motion = {
  lerpFactor: 0.028,
  spring: {
    type: 'spring',
    stiffness: 120,
    damping: 18,
  },
  durations: {
    fast: 0.15,
    normal: 0.28,
    slow: 0.65,
  },
  easings: {
    cinematic: [0.22, 1, 0.36, 1] as [number, number, number, number],
    smooth: 'easeInOut',
  }
} as const;
