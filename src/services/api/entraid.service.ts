import type { PublicClientApplication, AccountInfo, AuthenticationResult } from '@azure/msal-browser'
import type { MSALResponse, GraphProfile } from '@/types/api'
import { msalInstance, loginRequest, graphConfig } from '@/config/msal'
import axios from 'axios'

class EntraIDService {
  private msalInstance: PublicClientApplication
  private initialized: boolean
  private isInteractionInProgress: boolean
  private interactionType: string | null

  constructor() {
    this.msalInstance = msalInstance
    this.initialized = false
    this.isInteractionInProgress = false
    this.interactionType = null
  }

  async initialize(): Promise<void> {
    if (this.initialized) return
    
    try {
      console.log('[EntraID] Inicializando MSAL...')
      console.log('[EntraID] Client ID:', import.meta.env.VITE_AZURE_CLIENT_ID)
      console.log('[EntraID] Redirect URI:', import.meta.env.VITE_AZURE_REDIRECT_URI)
      
      await this.msalInstance.initialize()
      this.initialized = true
      console.log('[EntraID] MSAL inicializado correctamente')
    } catch (error) {
      console.error('[EntraID] Error initializing MSAL:', error)
      throw error
    }
  }

  async handleRedirectResponse(): Promise<AuthenticationResult | null> {
    try {
      console.log('[EntraID] Procesando respuesta de redirect...')
      
      this.isInteractionInProgress = true
      this.interactionType = 'redirect'
      
      const response = await this.msalInstance.handleRedirectPromise()
      
      if (response) {
        if (response.account) {
          this.msalInstance.setActiveAccount(response.account)
        }
        return response
      }
      
      const accounts = this.msalInstance.getAllAccounts()
        if (accounts.length > 0) {
          this.msalInstance.setActiveAccount(accounts[0])
          // Devolver null en lugar de un objeto incompleto
          return null
        }      return null
    } catch (error) {
      console.error('[EntraID] Error handling redirect:', error)
      throw error
    } finally {
      this.isInteractionInProgress = false
      this.interactionType = null
    }
  }

  async login(forceNew = false): Promise<MSALResponse> {
    try {
      if (forceNew) {
        await this.clearInteractionState()
      }

      if (this.isInteractionInProgress) {
        if (forceNew) {
          await this.forceStopInteraction()
        } else {
          return { success: true, pending: true }
        }
      }

      this.isInteractionInProgress = true
      this.interactionType = 'login'
      
      const redirectUri = import.meta.env.VITE_AZURE_REDIRECT_URI || 'http://localhost:5173/auth/login'
      
      await this.msalInstance.loginRedirect({
        ...loginRequest,
        redirectUri,
        prompt: forceNew ? 'login' : 'select_account'
      })
      
      return { success: true, pending: true }
    } catch (error: any) {
      console.error('[EntraID] Login error:', error)
      
      if ((error.errorCode === 'interaction_in_progress' || error.message?.includes('interaction_in_progress'))) {
        if (forceNew) {
          await this.forceStopInteraction()
          return { success: false, error: 'Se limpió la interacción previa. Intente nuevamente.' }
        }
        return { success: true, pending: true }
      }
      
      return { success: false, error: this.getErrorMessage(error) }
    }
  }

  async logout(): Promise<MSALResponse> {
    try {
      if (this.isInteractionInProgress) {
        await this.waitForInteractionToComplete(5000)
      }
      
      const account = this.msalInstance.getActiveAccount()
      const postLogoutRedirectUri = import.meta.env.VITE_AZURE_REDIRECT_URI || 'http://localhost:5173/auth/login'
      
      this.isInteractionInProgress = true
      this.interactionType = 'logout'
      
      await this.msalInstance.logoutRedirect({
        account: account || undefined,
        postLogoutRedirectUri
      })
      
      return { success: true }
    } catch (error: any) {
      if (error.errorCode === 'interaction_in_progress' || error.message?.includes('interaction_in_progress')) {
        this.clearLocalData()
        return { success: true }
      }
      throw error
    }
  }

  async getUserProfile(accessToken: string): Promise<GraphProfile | null> {
    try {
      const response = await axios.get<GraphProfile>(graphConfig.graphMeEndpoint, {
        headers: { Authorization: `Bearer ${accessToken}` }
      })

      try {
        const photoResponse = await axios.get(graphConfig.graphPhotoEndpoint, {
          headers: { Authorization: `Bearer ${accessToken}` },
          responseType: 'blob'
        })
        
        if (photoResponse.status === 200) {
          response.data.photoUrl = URL.createObjectURL(photoResponse.data)
        }
      } catch (error) {
        console.warn('[EntraID] No photo available')
      }

      return response.data
    } catch (error) {
      console.error('[EntraID] Error getting profile:', error)
      return null
    }
  }

  async getAccessToken(): Promise<string | null> {
    try {
      const account = this.msalInstance.getActiveAccount()
      if (!account) return null

      if (this.isInteractionInProgress && this.interactionType !== 'token') {
        await this.waitForInteractionToComplete(3000)
      }

      const response = await this.msalInstance.acquireTokenSilent({
        ...loginRequest,
        account
      })
      
      return response.accessToken
    } catch (error: any) {
      if (error.errorCode === 'interaction_in_progress' || error.message?.includes('interaction_in_progress')) {
        return null
      }

      if (['consent_required', 'interaction_required', 'login_required'].includes(error.errorCode)) {
        if (!this.isInteractionInProgress) {
          this.isInteractionInProgress = true
          this.interactionType = 'token'
          
          await this.msalInstance.acquireTokenRedirect({
            ...loginRequest,
            redirectUri: import.meta.env.VITE_AZURE_REDIRECT_URI || 'http://localhost:5173/auth/login'
          })
        }
      }
      
      return null
    }
  }

  private async forceStopInteraction(): Promise<void> {
    try {
      this.isInteractionInProgress = false
      this.interactionType = null
      await this.clearInteractionState()
      await new Promise(resolve => setTimeout(resolve, 500))
    } catch (error) {
      console.error('[EntraID] Error forcing interaction stop:', error)
    }
  }

  private async clearInteractionState(): Promise<void> {
    try {
      ['msal.interaction.status', 'msal.interaction.in.progress', 'msal.request.params'].forEach(key => {
        try {
          localStorage.removeItem(key)
          sessionStorage.removeItem(key)
        } catch (e) {
          console.warn('[EntraID] Could not clear key:', key)
        }
      })

      Object.keys(localStorage)
        .filter(key => key.includes('msal') && key.includes('interaction'))
        .forEach(key => localStorage.removeItem(key))

      Object.keys(sessionStorage)
        .filter(key => key.includes('msal') && key.includes('interaction'))
        .forEach(key => sessionStorage.removeItem(key))
    } catch (error) {
      console.error('[EntraID] Error clearing interaction state:', error)
    }
  }

  private async waitForInteractionToComplete(timeoutMs: number = 3000): Promise<void> {
    const startTime = Date.now()
    while (this.isInteractionInProgress) {
      if (Date.now() - startTime > timeoutMs) {
        this.isInteractionInProgress = false
        this.interactionType = null
        break
      }
      await new Promise(resolve => setTimeout(resolve, 100))
    }
  }

  private clearLocalData(): void {
    localStorage.removeItem('entraid_token')
    localStorage.removeItem('auth_token')
    localStorage.removeItem('user_data')
  }

  getCurrentUser(): AccountInfo | null {
    try {
      return this.msalInstance.getActiveAccount()
    } catch (error) {
      console.error('[EntraID] Error getting current user:', error)
      return null
    }
  }

  isLoggedIn(): boolean {
    try {
      const account = this.msalInstance.getActiveAccount()
      const token = localStorage.getItem('entraid_token')
      return Boolean(account && token)
    } catch (error) {
      console.error('[EntraID] Error checking login status:', error)
      return false
    }
  }

  private getErrorMessage(error: any): string {
    if (error.errorCode === 'user_cancelled') {
      return 'Inicio de sesión cancelado por el usuario.'
    }
    if (error.errorCode === 'interaction_in_progress' || error.message?.includes('interaction_in_progress')) {
      return 'Ya hay una operación de autenticación en curso. Por favor espere.'
    }
    if (error.message?.includes('redirect_uri_mismatch')) {
      return 'Error de configuración: La URI de redirección no coincide con la configurada en Azure Portal.'
    }
    return error.message || 'Error de autenticación con EntraID'
  }
}

export const entraIDService = new EntraIDService()