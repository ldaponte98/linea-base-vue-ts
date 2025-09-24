import { computed, type ComputedRef, nextTick } from 'vue'
import { useAuthStore } from '@/stores/auth'
import { useRouter, useRoute, type Router, type RouteLocationNormalizedLoaded } from 'vue-router'
import type { User } from '@/types'
import type { LoginCredentials } from '@/types/api'

interface AuthComposable {
  isAuthenticated: ComputedRef<boolean>
  user: ComputedRef<User | null>
  loading: ComputedRef<boolean>
  error: ComputedRef<string | null>
  login: (credentials?: LoginCredentials | null) => Promise<{ success: boolean; pending?: boolean; error?: string }>
  logout: () => Promise<void>
  handleSuccessfulLogin: () => Promise<void>
}

export function useAuth(): AuthComposable {
  const authStore = useAuthStore()
  const router: Router = useRouter()
  const route: RouteLocationNormalizedLoaded = useRoute()

  const isAuthenticated = computed(() => authStore.isAuthenticated)
  const user = computed(() => authStore.user)
  const loading = computed(() => authStore.loading)
  const error = computed(() => authStore.error)

  async function login(credentials: LoginCredentials | null = null) {
    try {
      if (credentials) {
        const success = await authStore.loginWithCredentials(credentials.email, credentials.password)
        if (success) {
          await handleSuccessfulLogin()
          return { success: true }
        }
        return { success: false, error: authStore.error || 'Error en el proceso de autenticación' }
      } else {
        await authStore.loginWithEntraID()
        // Si es pending (redirect), no hacer nada aquí, el main.ts manejará la redirección
        return { success: true, pending: true }
      }
    } catch (err: any) {
      return { 
        success: false, 
        error: err.message || 'Error durante el proceso de login' 
      }
    }
  }

  async function handleSuccessfulLogin() {
    await nextTick()
    
    // Verificar si hay una URL de redirect en los query params o el store
    const redirectPath = authStore.redirectPath || route.query.redirect?.toString() || '/dashboard'
    
    console.log('Login exitoso, redirigiendo a:', redirectPath)
    
    try {
      await router.push(redirectPath)
      // Limpiar la ruta de redirección después de usarla
      if (redirectPath !== '/dashboard') {
        authStore.setRedirectPath('')
      }
    } catch (error) {
      console.error('Error redirigiendo:', error)
      await router.push({ name: 'Dashboard' })
    }
  }

  async function logout() {
    try {
      await authStore.logout()
      
      // Redirigir al login
      await router.push({ name: 'Login' })
    } catch (error: any) {
      console.error('Error durante logout:', error)
      throw new Error('No se pudo cerrar sesión correctamente')
    }
  }

  return {
    isAuthenticated,
    user,
    loading,
    error,
    login,
    logout,
    handleSuccessfulLogin
  }
}