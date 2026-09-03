import { create } from 'zustand'
import axios from 'axios'
import API_BASE_URL from '../config/api'

const SESSION_ID = typeof crypto !== 'undefined'
  ? crypto.randomUUID()
  : Math.random().toString(36).slice(2)

async function fireJourneyEvent(name, sessionId, action, log, dob, location) {
  try {
    await axios.post(`${API_BASE_URL}/api/track/journey`, {
      session_id: sessionId,
      name: name || 'Anonymous',
      dob: dob || undefined,
      location: location || undefined,
      action,
      action_log: log,
    }, { timeout: 8000 })
  } catch (_) { /* silent */ }
}

export const useAppStore = create((set, get) => ({
  // ─── Cinematic Journey State ─────────────────────────────────────────────
  cinematicStep: 0,      // 0=Intro 1=Name 2=Crossroads 25=AdminLogin 3=About 4=DOB 5=Location 6=Processing 7=Reveal
  revealSlide:   0,      // 0-4 within step 7 (paginated cosmic reveal)
  userName: '',
  journeyLog: [],
  sessionId: SESSION_ID,

  // ─── Input Data (collected across cinematic steps) ───────────────────────
  birthData: null,       // { date, time, lat, lng, locationName, utcOffset, country, state, city }

  // ─── Core Assessment State ───────────────────────────────────────────────
  astrologyData: null,
  mbtiData: null,
  activeTab: 'astrology',

  // ─── Platform State ───────────────────────────────────────────────────────
  isBackendReady: false,
  backendStatus: { state: 'checking', retries: 0 },

  // ─── Global Site Configuration ────────────────────────────────────────────
  siteConfig: { banner_message: '', show_banner: false, maintenance_mode: false },

  // ─── Admin Session State ──────────────────────────────────────────────────
  adminToken: typeof window !== 'undefined'
    ? localStorage.getItem('astrologica_admin_token') || ''
    : '',

  // ─── Cinematic Actions ────────────────────────────────────────────────────
  setCinematicStep: (step) => set({ cinematicStep: step }),

  setRevealSlide: (slide) => set({ revealSlide: slide }),

  setUserName: (name) => set({ userName: name }),

  setBirthData: (data) => set({ birthData: data }),

  advanceStep: (step, action) => {
    const { userName, sessionId, journeyLog, birthData } = get()
    const newLog = [...journeyLog, action]
    set({ cinematicStep: step, journeyLog: newLog })
    fireJourneyEvent(userName, sessionId, action, newLog, birthData?.date, birthData?.locationName)
  },

  goBack: () => {
    const { cinematicStep, userName, sessionId, journeyLog, birthData } = get()
    let target = 0
    if (cinematicStep === 25 || cinematicStep === 3 || cinematicStep === 4) {
      target = 2
    } else if (cinematicStep === 5) {
      target = 4
    } else if (cinematicStep > 0) {
      target = cinematicStep - 1
    }
    const action = `Navigated back to step ${target}`
    const newLog = [...journeyLog, action]
    set({ cinematicStep: target, journeyLog: newLog })
    fireJourneyEvent(userName, sessionId, action, newLog, birthData?.date, birthData?.locationName)
  },

  trackEvent: (action) => {
    const { userName, sessionId, journeyLog, birthData } = get()
    const newLog = [...journeyLog, action]
    set({ journeyLog: newLog })
    fireJourneyEvent(userName, sessionId, action, newLog, birthData?.date, birthData?.locationName)
  },

  resetJourney: () => set({
    cinematicStep: 0,
    revealSlide: 0,
    userName: '',
    journeyLog: [],
    birthData: null,
    astrologyData: null,
    mbtiData: null,
    activeTab: 'astrology',
  }),


  // ─── Assessment Actions ───────────────────────────────────────────────────
  setAstrologyData: (data) => set({ astrologyData: data }),
  setMbtiData:      (data) => set({ mbtiData: data }),
  setActiveTab:     (tab)  => set({ activeTab: tab }),
  setBackendReady:  (s)    => set({ isBackendReady: s }),
  setBackendStatus: (s)    => set({ backendStatus: s }),

  setSiteConfig: (config) => set(state => ({
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
    if (typeof window !== 'undefined') localStorage.removeItem('astrologica_admin_token')
    set({ adminToken: '' })
  },

  resetAssessment: () => set({ astrologyData: null, mbtiData: null, activeTab: 'astrology' }),
}))
