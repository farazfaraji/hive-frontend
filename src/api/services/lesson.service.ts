import { AxiosError } from 'axios'
import axiosInstance from '@/api/axios.config'
import { LESSON_ENDPOINTS } from '../endpoints'

export interface LessonGrammar {
  isDeleted: boolean
  createdAt: string
  _id: string
  item: string
  subs: string[]
  language: string
  definition?: string
}

export interface LessonNews {
  news: string
  explanation: string
}

export interface DialogueLine {
  firstPerson?: string
  secondPerson?: string
  sentence: string
}

export interface LessonDialogue {
  dialogue: DialogueLine[]
}

export interface LessonWord {
  word: string
  examples: string[]
  context: string[]
}

export interface ExamChoice {
  question: string
  choices: string[]
  answer: string
}

export interface ExamSimple {
  question: string
  answer: 'true' | 'false'
}

export interface LessonExam {
  text: string
  choices: ExamChoice[]
  simple: ExamSimple[]
  plan: string
}

export interface LessonResponse {
  grammar: LessonGrammar
  news: LessonNews
  dialogue: LessonDialogue
  words: LessonWord[]
  exam: LessonExam
}

export interface ReadingCorrectionResponse {
  advices: string[]
  score: number
}

class LessonService {
  async getLesson(): Promise<LessonResponse> {
    try {
      console.log('Fetching lesson from:', LESSON_ENDPOINTS.BASE)
      const response = await axiosInstance.get<LessonResponse>(LESSON_ENDPOINTS.BASE)
      console.log('Raw API response:', response)
      if (!response.data) {
        throw new Error('No data received from the lesson API')
      }
      return response.data
    } catch (error) {
      if (error instanceof AxiosError) {
        console.error('API Error details:', {
          status: error.response?.status,
          data: error.response?.data,
          headers: error.response?.headers,
        })
        throw new Error(error.response?.data?.message || `Failed to fetch lesson: ${error.message}`)
      }
      throw error
    }
  }

  async finishLesson(): Promise<{ status: string }> {
    try {
      const response = await axiosInstance.post<{ status: string }>(LESSON_ENDPOINTS.FINISH)
      return response.data
    } catch (error) {
      if (error instanceof AxiosError) {
        throw new Error(error.response?.data?.message || 'Failed to finish lesson')
      }
      throw error
    }
  }

  async submitReadingCorrection(answer: string): Promise<ReadingCorrectionResponse> {
    try {
      const response = await axiosInstance.post<ReadingCorrectionResponse>(
        LESSON_ENDPOINTS.READING_CORRECTION,
        {
          answer,
        },
      )
      return response.data
    } catch (error) {
      if (error instanceof AxiosError) {
        throw new Error(error.response?.data?.message || 'Failed to submit reading correction')
      }
      throw error
    }
  }
}

export default new LessonService()
