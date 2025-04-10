export const AUTH_ENDPOINTS = {
  LOGIN: '/auth/login',
  REGISTER: '/auth/register',
  LOGOUT: '/auth/logout',
  REFRESH_TOKEN: '/auth/refresh-token',
}

// Add other endpoint groups as needed
export const USER_ENDPOINTS = {
  PROFILE: '/users/profile',
  UPDATE_PROFILE: '/users/profile',
}

export const WORD_ENDPOINTS = {
  BASE: '/word',
  CANDIDATE: '/word/candidate',
  TRANSLATION: (uniqueId: string) => `/word/translation/${uniqueId}`,
  ACKNOWLEDGE: (uniqueId: string) => `/word/acknowledge/${uniqueId}`,
}

export const GRAMMAR_ENDPOINTS = {
  LIST: '/grammar/list',
  DEFINITION: (id: string) => `/grammar/definition/${id}`,
  EXAMPLES: (id: string) => `/grammar/examples/${id}`,
}

export const LESSON_ENDPOINTS = {
  BASE: '/lesson',
  FINISH: '/lesson/finish-lesson',
  QUESTION: '/lesson/question',
  ANSWER: '/lesson/answer',
  READING_CORRECTION: '/lesson/reading-correction',
}
