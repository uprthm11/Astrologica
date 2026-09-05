import { StateCreator } from 'zustand';

export const DEFAULT_CAMERA_Z = 120;

export interface WebGLState {
  cameraTargetZ: number;
}

export interface WebGLActions {
  setCameraTargetZ: (targetZ: number) => void;
  resetCameraTargetZ: () => void;
}

export type WebGLSlice = WebGLState & WebGLActions;

export const createWebGLSlice: StateCreator<WebGLSlice, [], [], WebGLSlice> = (set) => ({
  cameraTargetZ: DEFAULT_CAMERA_Z,

  setCameraTargetZ: (cameraTargetZ: number) => set({ cameraTargetZ }),
  resetCameraTargetZ: () => set({ cameraTargetZ: DEFAULT_CAMERA_Z }),
});
