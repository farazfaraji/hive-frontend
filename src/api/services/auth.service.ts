import { AxiosError } from 'axios'
import axiosInstance from '../axios.config'
import { AUTH_ENDPOINTS } from '../endpoints'

interface LoginCredentials {
  email: string
  password: string
}

interface LoginResponse {
  token: string
  // Add other response fields as needed
}

export class AuthService {
  static async login(credentials: LoginCredentials): Promise<LoginResponse> {
    try {
      const response = await axiosInstance.post<LoginResponse>(AUTH_ENDPOINTS.LOGIN, credentials)
      return response.data
    } catch (error) {
      if (error instanceof AxiosError) {
        throw new Error(error.response?.data?.message || 'Login failed')
      }
      throw error
    }
  }

  static logout(): void {
    localStorage.removeItem('token')
  }

  // Add other auth-related methods as needed
}
