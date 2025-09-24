export interface User {
  id: string;
  name: string;
  email: string;
  photoUrl?: string;
  role: string;
  roles?: string[];
  entraId?: string;
  avatar?: string | null;
}

export interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
}

export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export interface AuthResult {
  success: boolean;
  user?: User;
  token?: string;
  error?: string;
}