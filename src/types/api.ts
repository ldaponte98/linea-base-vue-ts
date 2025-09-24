import { User } from './index'
import type { AccountInfo } from '@azure/msal-browser'

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface LoginResponse {
  success: boolean;
  token?: string;
  user?: User;
  error?: string;
}

export interface RegisterData {
  name: string;
  email: string;
  password: string;
  password_confirmation: string;
}

export interface UserResponse {
  id: string;
  name: string;
  email: string;
  photoUrl?: string;
  roles?: string[];
  createdAt?: string;
  updatedAt?: string;
}

export interface MSALResponse {
  success: boolean;
  pending?: boolean;
  error?: string;
  accessToken?: string;
  account?: AccountInfo;
}

export interface GraphProfile {
  id: string;
  displayName: string;
  mail: string;
  userPrincipalName: string;
  photoUrl?: string;
  businessPhones?: string[];
  givenName?: string;
  jobTitle?: string;
  mobilePhone?: string;
  officeLocation?: string;
  preferredLanguage?: string;
  surname?: string;
}

// Tipos para la configuración de Graph
export interface GraphConfig {
  graphMeEndpoint: string;
  graphPhotoEndpoint: string;
  requestHeaders: {
    'Content-Type': string;
    'Access-Control-Allow-Origin': string;
  };
}

// Tipos para el perfil
export interface Profile extends User {
  phone?: string;
  address?: string;
  company?: string;
  position?: string;
  settings?: Record<string, any>;
}