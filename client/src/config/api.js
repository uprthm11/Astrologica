/**
 * Dynamic Centralized API Base URL Configuration
 * Prioritizes VITE_API_URL -> Production fallback -> Localhost in development
 */
const getApiBaseUrl = () => {
  if (import.meta.env.VITE_API_URL) {
    return import.meta.env.VITE_API_URL.replace(/\/+$/, '')
  }
  if (import.meta.env.DEV) {
    return 'http://localhost:8000'
  }
  // Production fallback if VITE_API_URL is omitted at build time
  return 'https://astrologica-api-725w.onrender.com'
}

export const API_BASE_URL = getApiBaseUrl()
export default API_BASE_URL
