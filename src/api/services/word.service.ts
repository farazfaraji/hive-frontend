import { AxiosError } from 'axios'
import axiosInstance from '../axios.config'
import { WORD_ENDPOINTS } from '../endpoints'

export interface Word {
  _id: string
  uniqueId: string
  word: string
  language: string
  isLearned: boolean
  isFavorite: boolean
  createdAt: string
  lastReminder: string
  numberOfReminders: number
  usedContexts: string[]
}

export interface WordCandidate {
  example: string
  meaning: string
  synonyms: string[]
  contexts: string[]
  translation: string
}

export interface Translation {
  example: string
  meaning: string
  translation: string
  synonyms: string[]
  contexts: string[]
}

export class WordService {
  static async getCandidate(): Promise<WordCandidate> {
    try {
      const response = await axiosInstance.get<WordCandidate>(WORD_ENDPOINTS.CANDIDATE)
      return response.data
    } catch (error) {
      if (error instanceof AxiosError) {
        throw new Error(error.response?.data?.message || 'Failed to fetch word')
      }
      throw error
    }
  }

  static async tryLater(wordId: string): Promise<void> {
    try {
      await axiosInstance.post(`/word/${wordId}/try-later`)
    } catch (error) {
      if (error instanceof AxiosError) {
        throw new Error(error.response?.data?.message || 'Failed to mark word for later')
      }
      throw error
    }
  }

  static async acknowledgeWord(wordId: string): Promise<void> {
    try {
      await axiosInstance.post(WORD_ENDPOINTS.ACKNOWLEDGE(wordId))
    } catch (error) {
      if (error instanceof AxiosError) {
        throw new Error(error.response?.data?.message || 'Failed to acknowledge word')
      }
      throw error
    }
  }

  static async getTranslation(uniqueId: string): Promise<Translation> {
    try {
      const response = await axiosInstance.get<Translation>(WORD_ENDPOINTS.TRANSLATION(uniqueId))
      return response.data
    } catch (error) {
      if (error instanceof AxiosError) {
        throw new Error(error.response?.data?.message || 'Failed to fetch translation')
      }
      throw error
    }
  }

  static async addWord(word: string): Promise<void> {
    try {
      await axiosInstance.post(WORD_ENDPOINTS.BASE, { word })
    } catch (error) {
      if (error instanceof AxiosError) {
        throw new Error(error.response?.data?.message || 'Failed to add word')
      }
      throw error
    }
  }
}
