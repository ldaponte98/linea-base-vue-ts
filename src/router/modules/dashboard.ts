import { RouteRecordRaw } from 'vue-router'
import { authGuard } from '../guards/auth'

const dashboardRoutes: RouteRecordRaw[] = [
  {
    path: '/dashboard',
    component: () => import('@/layouts/AppLayout/AppLayout.vue'),
    beforeEnter: authGuard,
    children: [
      {
        path: '',
        name: 'Dashboard',
        component: () => import('@/pages/dashboard/DashboardPage/DashboardPage.vue')
      },
      {
        path: '/profile',
        name: 'Profile',
        component: () => import('@/pages/profile/ProfilePage/ProfilePage.vue')
      }
    ]
  }
]

export default dashboardRoutes