import { create } from 'zustand'

export const useAppStore = create((set) => ({
  // Core Assessment State
  astrologyData: null,
  mbtiData: null,
  activeTab: 'astrology', // 'astrology' | 'psychology'
  
  // Platform & Telemetry State
  isBackendReady: false,
  backendStatus: { state: 'checking', retries: 0 },
  
  // Global Site Configuration (Banners & Announcements)
  siteConfig: {
    banner_message: '',
    show_banner: false,
    maintenance_mode: false,
  },

  // Admin Session State
  adminToken: typeof window !== 'undefined' ? localStorage.getItem('astrologica_admin_token') || '' : '',

  // Actions
  setAstrologyData: (data) => set({ astrologyData: data }),
  setMbtiData: (data) => set({ mbtiData: data }),
  setActiveTab: (tab) => set({ activeTab: tab }),
  setBackendReady: (status) => set({ isBackendReady: status }),
  setBackendStatus: (status) => set({ backendStatus: status }),
  
  setSiteConfig: (config) =>
    set((state) => ({
      siteConfig: { ...state.siteConfig, ...config },
    })),

  setAdminToken: (token) => {
    if (typeof window !== 'undefined') {
      if (token) {
        localStorage.setItem('astrologica_admin_token', token)
      } else {
        localStorage.removeItem('astrologica_admin_token')
      }
    }
    set({ adminToken: token || '' })
  },

  logoutAdmin: () => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('astrologica_admin_token')
    }
    set({ adminToken: '' })
  },

  resetAssessment: () =>
    set({
      astrologyData: null,
      mbtiData: null,
      activeTab: 'astrology',
    }),
}))
