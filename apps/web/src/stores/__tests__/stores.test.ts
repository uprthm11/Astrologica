import { describe, it, expect, beforeEach } from 'vitest';
import { useAppStore, DEFAULT_CAMERA_Z } from '../index';

describe('Frontend State Management Rebuild', () => {
  beforeEach(() => {
    // Reset store state
    useAppStore.getState().clearSession();
    useAppStore.getState().resetCameraTargetZ();
    useAppStore.getState().closeModal();
    useAppStore.getState().setNavOpen(false);
  });

  describe('Strict Zero Feature Coupling Enforcement', () => {
    it('guarantees that root store has zero domain-specific feature fields', () => {
      const state = useAppStore.getState() as any;

      // Ensure legacy domain state is completely eliminated
      expect(state.astrologyData).toBeUndefined();
      expect(state.mbtiData).toBeUndefined();
      expect(state.birthData).toBeUndefined();
      expect(state.preferredSystem).toBeUndefined();
      expect(state.cinematicStep).toBeUndefined();
      expect(state.revealSlide).toBeUndefined();
      expect(state.journeyLog).toBeUndefined();
    });
  });

  describe('Session Store Slice', () => {
    it('initializes with a valid UUID session identifier', () => {
      const { sessionId, userName, isAuthenticated } = useAppStore.getState();
      expect(sessionId).toBeDefined();
      expect(sessionId.length).toBeGreaterThan(5);
      expect(userName).toBe('');
      expect(isAuthenticated).toBe(false);
    });

    it('updates userName and userId correctly', () => {
      useAppStore.getState().setUserName('Seraphina');
      useAppStore.getState().setUserId('user-456');

      expect(useAppStore.getState().userName).toBe('Seraphina');
      expect(useAppStore.getState().userId).toBe('user-456');
    });

    it('manages admin authentication tokens', () => {
      useAppStore.getState().setAdminToken('secret-jwt-token');
      expect(useAppStore.getState().adminToken).toBe('secret-jwt-token');
      expect(useAppStore.getState().isAuthenticated).toBe(true);

      useAppStore.getState().setAdminToken(null);
      expect(useAppStore.getState().adminToken).toBeNull();
      expect(useAppStore.getState().isAuthenticated).toBe(false);
    });

    it('clears session on demand', () => {
      useAppStore.getState().setUserName('Orion');
      useAppStore.getState().clearSession();

      expect(useAppStore.getState().userName).toBe('');
      expect(useAppStore.getState().userId).toBeNull();
      expect(useAppStore.getState().isAuthenticated).toBe(false);
    });
  });

  describe('UI Store Slice', () => {
    it('manages theme and drawer state', () => {
      expect(useAppStore.getState().theme).toBe('dark');
      useAppStore.getState().setTheme('light');
      expect(useAppStore.getState().theme).toBe('light');

      expect(useAppStore.getState().isNavOpen).toBe(false);
      useAppStore.getState().toggleNav();
      expect(useAppStore.getState().isNavOpen).toBe(true);
      useAppStore.getState().setNavOpen(false);
      expect(useAppStore.getState().isNavOpen).toBe(false);
    });

    it('controls active modals', () => {
      expect(useAppStore.getState().activeModal).toBeNull();
      useAppStore.getState().openModal('about-dialog');
      expect(useAppStore.getState().activeModal).toBe('about-dialog');
      useAppStore.getState().closeModal();
      expect(useAppStore.getState().activeModal).toBeNull();
    });

    it('updates backend readiness and banner messages', () => {
      useAppStore.getState().setBackendReady(true);
      expect(useAppStore.getState().isBackendReady).toBe(true);

      useAppStore.getState().setBannerMessage('System Maintenance Scheduled', true);
      expect(useAppStore.getState().bannerMessage).toBe('System Maintenance Scheduled');
      expect(useAppStore.getState().showBanner).toBe(true);
    });
  });

  describe('WebGL Store Slice & CameraTargetZ Hover Interaction', () => {
    it('initializes cameraTargetZ to DEFAULT_CAMERA_Z', () => {
      expect(useAppStore.getState().cameraTargetZ).toBe(DEFAULT_CAMERA_Z);
      expect(DEFAULT_CAMERA_Z).toBe(120);
    });

    it('updates cameraTargetZ on hover interaction and resets cleanly', () => {
      // Simulate hovering over module card (e.g. from Hub.tsx onMouseEnter)
      useAppStore.getState().setCameraTargetZ(85);
      expect(useAppStore.getState().cameraTargetZ).toBe(85);

      // Simulate mouse leave (resetCameraTargetZ)
      useAppStore.getState().resetCameraTargetZ();
      expect(useAppStore.getState().cameraTargetZ).toBe(DEFAULT_CAMERA_Z);
    });
  });
});
