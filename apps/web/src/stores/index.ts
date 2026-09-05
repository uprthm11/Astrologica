import { create } from 'zustand';
import { SessionSlice, createSessionSlice } from './sessionStore';
import { UISlice, createUISlice } from './uiStore';
import { WebGLSlice, createWebGLSlice, DEFAULT_CAMERA_Z } from './webglStore';

export * from './sessionStore';
export * from './uiStore';
export * from './webglStore';

export type RootStore = SessionSlice & UISlice & WebGLSlice;

/**
 * Combined Root Store utilizing typed Zustand slice pattern.
 * Core stores strictly maintain zero domain-specific feature fields.
 */
export const useAppStore = create<RootStore>()((...a) => ({
  ...createSessionSlice(...a),
  ...createUISlice(...a),
  ...createWebGLSlice(...a),
}));

/**
 * Granular Selector Hooks for performance-optimized re-renders.
 */
export const useSessionStore = <T>(selector: (state: SessionSlice) => T): T =>
  useAppStore(selector);

export const useUIStore = <T>(selector: (state: UISlice) => T): T =>
  useAppStore(selector);

export const useWebGLStore = <T>(selector: (state: WebGLSlice) => T): T =>
  useAppStore(selector);
