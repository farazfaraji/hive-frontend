import { API_CONFIG } from '@/config/api.config'

export const AUTH_ENDPOINTS = {
  LOGIN: `${API_CONFIG.BASE_URL}/auth/login`,
  REGISTER: `${API_CONFIG.BASE_URL}/auth/register`,
  LOGOUT: `${API_CONFIG.BASE_URL}/auth/logout`,
  REFRESH_TOKEN: `${API_CONFIG.BASE_URL}/auth/refresh-token`,
}

// Add other endpoint groups as needed
export const USER_ENDPOINTS = {
  PROFILE: `${API_CONFIG.BASE_URL}/users/profile`,
  UPDATE_PROFILE: `${API_CONFIG.BASE_URL}/users/profile`,
}

export const WORD_ENDPOINTS = {
  BASE: 'http://localhost:3000/v1/word',
  CANDIDATE: 'http://localhost:3000/v1/word/candidate',
  TRANSLATION: (uniqueId: string) => `http://localhost:3000/v1/word/translation/${uniqueId}`,
  ACKNOWLEDGE: (uniqueId: string) => `http://localhost:3000/v1/word/acknowledge/${uniqueId}`,
}
