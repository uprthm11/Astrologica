import { StateCreator } from 'zustand';

export interface UIState {
  theme: 'dark' | 'light';
  isNavOpen: boolean;
  activeModal: string | null;
  bannerMessage: string | null;
  showBanner: boolean;
  isBackendReady: boolean;
  maintenanceMode: boolean;
}

export interface UIActions {
  setTheme: (theme: 'dark' | 'light') => void;
  setNavOpen: (isOpen: boolean) => void;
  toggleNav: () => void;
  openModal: (modalId: string) => void;
  closeModal: () => void;
  setBannerMessage: (message: string | null, show?: boolean) => void;
  setBackendReady: (isReady: boolean) => void;
  setMaintenanceMode: (inMaintenance: boolean) => void;
}

export type UISlice = UIState & UIActions;

export const createUISlice: StateCreator<UISlice, [], [], UISlice> = (set) => ({
  theme: 'dark',
  isNavOpen: false,
  activeModal: null,
  bannerMessage: null,
  showBanner: false,
  isBackendReady: false,
  maintenanceMode: false,

  setTheme: (theme: 'dark' | 'light') => set({ theme }),
  setNavOpen: (isNavOpen: boolean) => set({ isNavOpen }),
  toggleNav: () => set((state) => ({ isNavOpen: !state.isNavOpen })),
  openModal: (activeModal: string) => set({ activeModal }),
  closeModal: () => set({ activeModal: null }),
  setBannerMessage: (bannerMessage: string | null, show: boolean = true) =>
    set({ bannerMessage, showBanner: show && Boolean(bannerMessage) }),
  setBackendReady: (isBackendReady: boolean) => set({ isBackendReady }),
  setMaintenanceMode: (maintenanceMode: boolean) => set({ maintenanceMode }),
});
