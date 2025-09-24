import { RouteRecordRaw } from 'vue-router'

const authRoutes: RouteRecordRaw[] = [
  {
    path: '/auth',
    meta: {
      public: true
    },
    children: [
      {
        path: 'Login',
        name: 'Login',
        component: () => import('@/pages/auth/LoginPage/LoginPage.vue')
      }
    ]
  }
]

export default authRoutes