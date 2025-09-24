import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import type { User } from '@/types'
import type { AuthState, UserData } from '@/types/store'
import type { GraphProfile } from '@/types/api'
import { entraIDService } from '@/services/api/entraid.service'
import { authService } from '@/services/api/auth.service'

export const useAuthStore = defineStore('auth', () => {
  const user = ref<AuthState['user']>(null)
  const token = ref<AuthState['token']>(null)
  const loading = ref<boolean>(false)
  const error = ref<string | null>(null)
  const useEntraID = ref<boolean>(true)
  const loginInProgress = ref<boolean>(false)
  const redirectPath = ref<string | null>(null)

  const isAuthenticated = computed<boolean>(() => {
    if (useEntraID.value) {
      const hasUserAndToken = !!user.value && !!token.value
      const msalLoggedIn = entraIDService.isLoggedIn()
      console.log('[AuthStore] Auth check - User:', !!user.value, 'Token:', !!token.value, 'MSAL:', msalLoggedIn)
      return hasUserAndToken && msalLoggedIn
    }
    return !!token.value && !!user.value
  })

  // Función para establecer usuario
  function setUser(userData: UserData): void {
    user.value = userData
    localStorage.setItem('user_data', JSON.stringify(userData))
    console.log('[AuthStore] Usuario guardado:', userData.name)
  }

  // Función para establecer token
  function setToken(accessToken: string): void {
    token.value = accessToken
    localStorage.setItem('entraid_token', accessToken)
    localStorage.setItem('auth_token', accessToken) // Para compatibilidad
    console.log('[AuthStore] Token guardado')
  }

  // Función para establecer ruta de redirección
  function setRedirectPath(path: string): void {
    redirectPath.value = path
  }

  // Método helper para manejar login exitoso
  async function handleSuccessfulLogin(): Promise<boolean> {
    try {
      loading.value = true
      error.value = null
      
      // Obtener token de acceso
      const accessToken = await entraIDService.getAccessToken()
      if (accessToken) {
        setToken(accessToken)
        
        // Obtener perfil del usuario
        const userProfile = await entraIDService.getUserProfile(accessToken)
        
        if (userProfile) {
          const userData: UserData = {
            id: userProfile.id,
            name: userProfile.displayName,
            email: userProfile.mail || userProfile.userPrincipalName,
            avatar: userProfile.photoUrl || null,
            role: 'user',
            entraId: userProfile.id
          }
          
          setUser(userData)
          console.log('[AuthStore] Usuario autenticado:', userProfile.displayName)
          return true
        }
      }
      
      error.value = 'No se pudo obtener el token o perfil del usuario'
      return false
    } catch (err: any) {
      console.error('[AuthStore] Error obteniendo datos después del login:', err)
      error.value = err.message || 'Error obteniendo datos del usuario'
      return false
    } finally {
      loading.value = false
    }
  }

  // Verificar autenticación existente
  async function checkExistingAuth(): Promise<boolean> {
    try {
      loading.value = true
      error.value = null
      console.log('[AuthStore] Verificando autenticación existente...')
      
      // Verificar si hay datos guardados
      const savedUser = localStorage.getItem('user_data')
      const savedToken = localStorage.getItem('entraid_token') || localStorage.getItem('auth_token')
      
      console.log('[AuthStore] Datos guardados - User:', !!savedUser, 'Token:', !!savedToken)
      
      if (savedUser && savedToken) {
        user.value = JSON.parse(savedUser)
        token.value = savedToken
        
        // Verificar que MSAL también tenga la sesión
        if (useEntraID.value) {
          const currentUser = entraIDService.getCurrentUser()
          console.log('[AuthStore] Usuario MSAL actual:', !!currentUser)
          
          if (currentUser) {
            console.log('[AuthStore] Sesión restaurada exitosamente para:', currentUser.username)
            return true
          } else {
            console.log('[AuthStore] Token local existe pero no hay sesión MSAL activa')
            // Intentar obtener una nueva sesión silenciosa
            try {
              const newToken = await entraIDService.getAccessToken()
              if (newToken) {
                console.log('[AuthStore] Token renovado exitosamente')
                setToken(newToken)
                return true
              }
            } catch (err) {
              console.warn('[AuthStore] No se pudo renovar el token:', err)
            }
          }
        }
        
        // Si llegamos aquí con EntraID activo, significa que no hay sesión válida
        if (useEntraID.value) {
          clearAuth()
          error.value = 'La sesión ha expirado'
          return false
        }
        
        return true
      }
      
      console.log('[AuthStore] No hay datos de sesión guardados')
      return false
    } catch (err: any) {
      console.error('[AuthStore] Error verificando autenticación:', err)
      error.value = err.message || 'Error verificando autenticación'
      return false
    } finally {
      loading.value = false
    }
  }

  // Iniciar sesión con EntraID
  async function loginWithEntraID(forceNew = false): Promise<boolean> {
    try {
      if (loginInProgress.value) {
        console.log('[AuthStore] Login ya en progreso')
        return false
      }
      
      loading.value = true
      loginInProgress.value = true
      error.value = null
      
      const response = await entraIDService.login(forceNew)
      
      if (!response.success) {
        error.value = response.error || 'Error en el proceso de autenticación'
        return false
      }
      
      if (response.pending) {
        console.log('[AuthStore] Proceso de autenticación en curso')
        return true
      }
      
      return true
    } catch (err: any) {
      console.error('[AuthStore] Error en login con EntraID:', err)
      error.value = err.message || 'Error iniciando sesión'
      return false
    } finally {
      loading.value = false
      loginInProgress.value = false
    }
  }

  // Iniciar sesión con credenciales
  async function loginWithCredentials(email: string, password: string): Promise<boolean> {
    try {
      loading.value = true
      error.value = null
      
      const response = await authService.login({ email, password })
      
      if (response.success && response.token && response.user) {
        setToken(response.token)
        setUser(response.user)
        return true
      }
      
      error.value = response.error || 'Error en el proceso de autenticación'
      return false
    } catch (err: any) {
      console.error('[AuthStore] Error en login con credenciales:', err)
      error.value = err.message || 'Error iniciando sesión'
      return false
    } finally {
      loading.value = false
    }
  }

  // Cerrar sesión
  async function logout(): Promise<void> {
    try {
      loading.value = true
      
      if (useEntraID.value) {
        await entraIDService.logout()
      }
      
      clearAuth()
    } catch (err: any) {
      console.error('[AuthStore] Error en logout:', err)
      error.value = err.message || 'Error cerrando sesión'
    } finally {
      loading.value = false
    }
  }

  // Limpiar datos de autenticación
  function clearAuth(): void {
    user.value = null
    token.value = null
    error.value = null
    redirectPath.value = null
    localStorage.removeItem('user_data')
    localStorage.removeItem('entraid_token')
    localStorage.removeItem('auth_token')
  }

  return {
    user,
    token,
    loading,
    error,
    useEntraID,
    loginInProgress,
    redirectPath,
    isAuthenticated,
    setUser,
    setToken,
    setRedirectPath,
    handleSuccessfulLogin,
    checkExistingAuth,
    loginWithEntraID,
    loginWithCredentials,
    logout,
    clearAuth
  }
})