import { create } from 'zustand'
import axios from 'axios'
import API_BASE_URL from '../config/api'

// Unique session ID for telemetry
const SESSION_ID = typeof crypto !== 'undefined'
  ? crypto.randomUUID()
  : Math.random().toString(36).slice(2)

// Silently fire telemetry — never blocks the UI
async function fireJourneyEvent(name, sessionId, action, log) {
  try {
    await axios.post(`${API_BASE_URL}/api/track/journey`, {
      session_id: sessionId,
      name: name || 'Anonymous',
      action,
      action_log: log,
    }, { timeout: 8000 })
  } catch (_) { /* silent — telemetry never interrupts UX */ }
}

export const useAppStore = create((set, get) => ({
  // ─── Cinematic Journey State ─────────────────────────────────────────────
  cinematicStep: 0,          // 0=Intro 1=Name 2=Crossroads 3=About 4=Form 5=Chart
  userName: '',
  journeyLog: [],
  sessionId: SESSION_ID,

  // ─── Core Assessment State ───────────────────────────────────────────────
  astrologyData: null,
  mbtiData: null,
  activeTab: 'astrology',

  // ─── Platform & Telemetry State ──────────────────────────────────────────
  isBackendReady: false,
  backendStatus: { state: 'checking', retries: 0 },

  // ─── Global Site Configuration ───────────────────────────────────────────
  siteConfig: {
    banner_message: '',
    show_banner: false,
    maintenance_mode: false,
  },

  // ─── Admin Session State ─────────────────────────────────────────────────
  adminToken: typeof window !== 'undefined'
    ? localStorage.getItem('astrologica_admin_token') || ''
    : '',

  // ─── Cinematic Actions ───────────────────────────────────────────────────
  setCinematicStep: (step) => set({ cinematicStep: step }),

  setUserName: (name) => set({ userName: name }),

  advanceStep: (step, action) => {
    const { userName, sessionId, journeyLog } = get()
    const newLog = [...journeyLog, action]
    set({ cinematicStep: step, journeyLog: newLog })
    fireJourneyEvent(userName, sessionId, action, newLog)
  },

  trackEvent: (action) => {
    const { userName, sessionId, journeyLog } = get()
    const newLog = [...journeyLog, action]
    set({ journeyLog: newLog })
    fireJourneyEvent(userName, sessionId, action, newLog)
  },

  resetJourney: () => set({
    cinematicStep: 0,
    userName: '',
    journeyLog: [],
    astrologyData: null,
    mbtiData: null,
    activeTab: 'astrology',
  }),

  // ─── Assessment Actions ───────────────────────────────────────────────────
  setAstrologyData: (data) => set({ astrologyData: data }),
  setMbtiData: (data) => set({ mbtiData: data }),
  setActiveTab: (tab) => set({ activeTab: tab }),
  setBackendReady: (status) => set({ isBackendReady: status }),
  setBackendStatus: (status) => set({ backendStatus: status }),

  setSiteConfig: (config) => set((state) => ({
    siteConfig: { ...state.siteConfig, ...config },
  })),

  setAdminToken: (token) => {
    if (typeof window !== 'undefined') {
      token
        ? localStorage.setItem('astrologica_admin_token', token)
        : localStorage.removeItem('astrologica_admin_token')
    }
    set({ adminToken: token || '' })
  },

  logoutAdmin: () => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('astrologica_admin_token')
    }
    set({ adminToken: '' })
  },

  resetAssessment: () => set({
    astrologyData: null,
    mbtiData: null,
    activeTab: 'astrology',
  }),
}))
