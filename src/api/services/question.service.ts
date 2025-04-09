import { AxiosError } from 'axios'
import axiosInstance from '../axios.config'

export interface QuestionResponse {
  question: string
  numberofQuestions: number
}

export interface AnswerResponse {
  corrections: string[]
  alternative: string
  correct: 'yes' | 'no'
  score: string
}

export class QuestionService {
  static async getQuestion(): Promise<QuestionResponse> {
    try {
      const response = await axiosInstance.get<QuestionResponse>('lesson/question')
      return response.data
    } catch (error) {
      if (error instanceof AxiosError) {
        throw new Error(error.response?.data?.message || 'Failed to fetch question')
      }
      throw error
    }
  }

  static async submitAnswer(answer: string): Promise<AnswerResponse> {
    try {
      const response = await axiosInstance.post<AnswerResponse>('lesson/answer', { answer })
      return response.data
    } catch (error) {
      if (error instanceof AxiosError) {
        throw new Error(error.response?.data?.message || 'Failed to submit answer')
      }
      throw error
    }
  }
}
