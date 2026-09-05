/**
 * Centralized API Service for Astrologica
 * Handles all backend communication using dynamic API_BASE_URL.
 */
import axios from 'axios'
import API_BASE_URL from '../config/api'

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json'
  },
  timeout: 60000 // 60s timeout for cold starts
})

// Public & Ephemeris APIs
export const checkHealth = async (timeout = 60000) => {
  const response = await apiClient.get('/api/health', { timeout })
  return response.data
}

export const getPublicConfig = async () => {
  const response = await apiClient.get('/api/public/config', { timeout: 10000 })
  return response.data
}

export const submitContactMessage = async (payload) => {
  const response = await apiClient.post('/api/contact', payload)
  return response.data
}

export const calculateWestern = async (payload) => {
  const response = await apiClient.post('/api/calculate/western', payload)
  return response.data
}

export const calculateVedic = async (payload) => {
  const response = await apiClient.post('/api/calculate/vedic', payload)
  return response.data
}

export const calculateDual = async (payload) => {
  const response = await apiClient.post('/api/calculate/dual', payload)
  return response.data
}

export const calculateChart = async (payload) => {
  const response = await apiClient.post('/api/calculate-chart', payload)
  return response.data
}

export const interpretChart = async (payload) => {
  const response = await apiClient.post('/api/interpret-chart', payload)
  return response.data
}

export const getMbtiQuestions = async () => {
  const response = await apiClient.get('/api/mbti/questions', { timeout: 5000 })
  return response.data
}

export const evaluateMbti = async (responses) => {
  const response = await apiClient.post('/api/mbti/evaluate', { responses })
  return response.data
}

export const saveBlueprint = async (astrology, mbti, preferences = {}) => {
  const response = await apiClient.post('/api/save-blueprint', {
    astrology,
    mbti,
    preferences
  })
  return response.data
}

export const getBlueprint = async (id) => {
  const response = await apiClient.get(`/api/blueprint/${id}`)
  return response.data
}

// Admin APIs
export const adminLogin = async (credentials) => {
  const response = await apiClient.post('/api/admin/login', credentials)
  return response.data
}

export const getAdminConfig = async (token) => {
  const response = await apiClient.get('/api/admin/config', {
    headers: { Authorization: `Bearer ${token}` }
  })
  return response.data
}

export const updateAdminConfig = async (config, token) => {
  const response = await apiClient.post('/api/admin/config', config, {
    headers: { Authorization: `Bearer ${token}` }
  })
  return response.data
}

export const getAdminMessages = async (token) => {
  const response = await apiClient.get('/api/admin/messages', {
    headers: { Authorization: `Bearer ${token}` }
  })
  return response.data
}

export const deleteAdminMessage = async (messageId, token) => {
  const response = await apiClient.delete(`/api/admin/messages/${messageId}`, {
    headers: { Authorization: `Bearer ${token}` }
  })
  return response.data
}

export const getAdminVisitors = async (token) => {
  const response = await apiClient.get('/api/admin/visitors', {
    headers: { Authorization: `Bearer ${token}` }
  })
  return response.data
}


export { API_BASE_URL }
export default apiClient
