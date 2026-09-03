/**
 * Dynamic API Base URL Router
 * - Production (Vercel, custom domain): Routes to Render backend
 * - Local Development: Routes to localhost:8000 only when running on localhost / 127.0.0.1
 */
const getApiBaseUrl = () => {
  // If explicitly specified in environment, prioritize it
  if (import.meta.env.VITE_API_URL) {
    return import.meta.env.VITE_API_URL.replace(/\/+$/, '')
  }

  // Runtime browser check: only point to localhost if accessed from localhost
  if (typeof window !== 'undefined') {
    const hostname = window.location.hostname
    if (hostname === 'localhost' || hostname === '127.0.0.1') {
      return 'http://localhost:8000'
    }
  }

  // Production fallback for Vercel deployments
  return 'https://astrologica-api-725w.onrender.com'
}

export const API_BASE_URL = getApiBaseUrl()
export default API_BASE_URL
