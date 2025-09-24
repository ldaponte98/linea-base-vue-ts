import { createRouter, createWebHistory, RouteRecordRaw } from 'vue-router'
import { authGuard } from './guards/auth'
import authRoutes from './modules/auth'
import dashboardRoutes from './modules/dashboard'
import { useAuthStore } from '@/stores/auth'

const routes: RouteRecordRaw[] = [
  {
    path: '/',
    redirect: '/dashboard'
  },
  ...authRoutes,
  ...dashboardRoutes,
  {
    path: '/:pathMatch(.*)*',
    name: 'NotFound',
    component: () => import('@/pages/NotFoundPage/NotFoundPage.vue')
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes,
  scrollBehavior: (to, from, savedPosition) => {
    if (savedPosition) {
      return savedPosition
    }
    return { top: 0 }
  }
})

// Configuración de guard global
router.beforeEach(async (to, from, next) => {
  const authStore = useAuthStore()
  const isPublicRoute = to.matched.some(record => record.meta.public)
  
  if (!isPublicRoute && !authStore.isAuthenticated) {
    // Guardar la ruta a la que intentaba acceder
    authStore.setRedirectPath(to.fullPath)
    next('/auth/login')
  } else {
    next()
  }
})

export default router