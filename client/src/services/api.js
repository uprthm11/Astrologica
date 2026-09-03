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

export const checkHealth = async (timeout = 60000) => {
  const response = await apiClient.get('/api/health', { timeout })
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

export { API_BASE_URL }
export default apiClient
