import type { User } from './index'

export interface AuthState {
  user: User | null
  token: string | null
  loading: boolean
  error: string | null
  useEntraID: boolean
  loginInProgress: boolean
  redirectPath: string | null
}

export interface UserData {
  id: string
  name: string
  email: string
  avatar?: string | null
  role: string
  entraId?: string
}