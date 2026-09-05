import { StateCreator } from 'zustand';

export interface SessionState {
  sessionId: string;
  userId: string | null;
  userName: string;
  adminToken: string | null;
  isAuthenticated: boolean;
}

export interface SessionActions {
  setSessionId: (id: string) => void;
  setUserId: (id: string | null) => void;
  setUserName: (name: string) => void;
  setAdminToken: (token: string | null) => void;
  clearSession: () => void;
}

export type SessionSlice = SessionState & SessionActions;

const createInitialSessionId = (): string => {
  if (typeof crypto !== 'undefined' && crypto.randomUUID) {
    return crypto.randomUUID();
  }
  return 'sess_' + Math.random().toString(36).substring(2, 11);
};

export const createSessionSlice: StateCreator<SessionSlice, [], [], SessionSlice> = (set) => ({
  sessionId: createInitialSessionId(),
  userId: null,
  userName: '',
  adminToken: typeof window !== 'undefined' ? localStorage.getItem('astrologica_admin_token') : null,
  isAuthenticated: false,

  setSessionId: (sessionId: string) => set({ sessionId }),
  setUserId: (userId: string | null) => set({ userId }),
  setUserName: (userName: string) => set({ userName }),
  setAdminToken: (adminToken: string | null) => {
    if (typeof window !== 'undefined') {
      if (adminToken) {
        localStorage.setItem('astrologica_admin_token', adminToken);
      } else {
        localStorage.removeItem('astrologica_admin_token');
      }
    }
    set({ adminToken, isAuthenticated: Boolean(adminToken) });
  },
  clearSession: () => set({
    sessionId: createInitialSessionId(),
    userId: null,
    userName: '',
    adminToken: null,
    isAuthenticated: false,
  }),
});
