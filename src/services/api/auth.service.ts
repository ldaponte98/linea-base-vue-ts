import { BaseService } from './base.service'
import type { LoginCredentials, LoginResponse, RegisterData, UserResponse } from '@/types/api'

class AuthService extends BaseService {
  async login(credentials: LoginCredentials): Promise<LoginResponse> {
    try {
      const response = await this.post<LoginResponse>('/auth/login', credentials)
      
      if (response.success && response.data?.token) {
        localStorage.setItem('auth_token', response.data.token)
        if (response.data.user) {
          localStorage.setItem('user_data', JSON.stringify(response.data.user))
        }
      }
      
      return response.data || response
    } catch (error: any) {
      return {
        success: false,
        error: error.message
      }
    }
  }

  async register(data: RegisterData): Promise<LoginResponse> {
    try {
      const response = await this.post<LoginResponse>('/auth/register', data)
      
      if (response.success && response.data?.token) {
        localStorage.setItem('auth_token', response.data.token)
        if (response.data.user) {
          localStorage.setItem('user_data', JSON.stringify(response.data.user))
        }
      }
      
      return response.data || response
    } catch (error: any) {
      return {
        success: false,
        error: error.message
      }
    }
  }

  async logout(): Promise<void> {
    try {
      await this.post('/auth/logout')
    } finally {
      localStorage.removeItem('auth_token')
      localStorage.removeItem('user_data')
    }
  }

  async getCurrentUser(): Promise<UserResponse | null> {
    try {
      const response = await this.get<UserResponse>('/auth/user')
      return response.data || null
    } catch {
      return null
    }
  }
}

export const authService = new AuthService()