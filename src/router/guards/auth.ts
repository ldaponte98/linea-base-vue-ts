import { NavigationGuardNext, RouteLocationNormalized } from 'vue-router'
import { useAuthStore } from '@/stores/auth'

export const authGuard = async (
  to: RouteLocationNormalized,
  from: RouteLocationNormalized,
  next: NavigationGuardNext
) => {
  const authStore = useAuthStore()
  
  if (!authStore.isAuthenticated) {
    // Guardar la ruta a la que intentaba acceder
    authStore.setRedirectPath(to.fullPath)
    next('/auth/login')
    return
  }
  
  next()
}