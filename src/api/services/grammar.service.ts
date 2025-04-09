import { AxiosError } from 'axios'
import axiosInstance from '@/api/axios.config'
import { GRAMMAR_ENDPOINTS } from '../endpoints'

export interface GrammarItem {
  isDeleted: boolean
  createdAt: string
  _id: string
  item: string
  subs: string[]
  language: string
  definition?: string
}

export interface GrammarExample {
  sentence: string
  explanation: string
}

export interface GrammarExamplesResponse {
  examples: GrammarExample[]
}

class GrammarService {
  async getGrammarList(): Promise<GrammarItem[]> {
    try {
      const response = await axiosInstance.get(GRAMMAR_ENDPOINTS.LIST)
      return response.data.data
    } catch (error) {
      if (error instanceof AxiosError) {
        throw new Error(error.response?.data?.message || 'Failed to fetch grammar list')
      }
      throw error
    }
  }

  async getGrammarDefinition(id: string): Promise<GrammarItem> {
    try {
      const response = await axiosInstance.get(GRAMMAR_ENDPOINTS.DEFINITION(id))
      return response.data
    } catch (error) {
      if (error instanceof AxiosError) {
        throw new Error(error.response?.data?.message || 'Failed to fetch grammar definition')
      }
      throw error
    }
  }

  async getGrammarExamples(id: string): Promise<GrammarExamplesResponse> {
    try {
      const response = await axiosInstance.get(GRAMMAR_ENDPOINTS.EXAMPLES(id))
      return response.data
    } catch (error) {
      if (error instanceof AxiosError) {
        throw new Error(error.response?.data?.message || 'Failed to fetch grammar examples')
      }
      throw error
    }
  }
}

export default new GrammarService()
