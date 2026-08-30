/**
 * Centralized API Configuration for Astrologica Frontend
 */

export const API_BASE_URL = (
  import.meta.env.VITE_API_URL || 'https://astrologica-api-725w.onrender.com'
).replace(/\/+$/, '')

export default API_BASE_URL
