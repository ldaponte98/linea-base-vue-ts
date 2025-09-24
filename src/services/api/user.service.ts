import { BaseService } from './base.service'
import type { UserResponse } from '@/types/api'

class UserService extends BaseService {
  async getProfile(): Promise<UserResponse | null> {
    const response = await this.get<UserResponse>('/users/profile')
    return response.data || null
  }

  async updateProfile(data: Partial<UserResponse>): Promise<UserResponse | null> {
    const response = await this.put<UserResponse>('/users/profile', data)
    return response.data || null
  }

  async updatePassword(data: { current_password: string; password: string; password_confirmation: string }): Promise<boolean> {
    const response = await this.put('/users/password', data)
    return response.success
  }

  async uploadAvatar(file: File): Promise<{ url: string } | null> {
    const formData = new FormData()
    formData.append('avatar', file)

    const response = await this.post<{ url: string }>('/users/avatar', formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    })
    
    return response.data || null
  }
}

export const userService = new UserService()