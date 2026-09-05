/**
 * Camera math utilities for dynamic progress-based camera movement.
 * Replaces hardcoded fixed-length slide camera arrays.
 */

export interface CameraSlideOptions {
  baseZ?: number; // Starting camera distance (slide 0)
  range?: number; // Total travel distance across slides
  minZ?: number;  // Safety clamping minimum
  maxZ?: number;  // Safety clamping maximum
}

export const DEFAULT_BASE_Z = 22;
export const DEFAULT_RANGE = 14;
export const DEFAULT_LERP_FACTOR = 0.028;

/**
 * Calculates camera target Z position dynamically based on progress through N slides.
 * Formula: targetZ = BASE_Z - (currentSlide / (totalSlides - 1)) * RANGE
 *
 * @param currentSlide - Zero-indexed slide index (0 to totalSlides - 1)
 * @param totalSlides - Total number of slides (supports any positive integer)
 * @param options - Custom baseZ, range, and bounds
 * @returns Smoothly interpolated targetZ position
 */
export function calculateSlideCameraZ(
  currentSlide: number,
  totalSlides: number,
  options: CameraSlideOptions = {}
): number {
  const {
    baseZ = DEFAULT_BASE_Z,
    range = DEFAULT_RANGE,
    minZ = 5,
    maxZ = 150,
  } = options;

  if (totalSlides <= 1) {
    return baseZ;
  }

  // Clamped progress between 0.0 and 1.0
  const progress = Math.max(0, Math.min(1, currentSlide / (totalSlides - 1)));
  const calculatedZ = baseZ - progress * range;

  return Math.max(minZ, Math.min(maxZ, Number(calculatedZ.toFixed(3))));
}
