import { ref, computed, onMounted, type ComputedRef, type Ref } from 'vue'
import { useAuthStore } from '@/stores/auth'
import type { User } from '@/types'

interface DashboardStats {
  users: number
  sales: number
}

interface DashboardSetup {
  user: ComputedRef<User | null>
  stats: Ref<DashboardStats>
}

export default {
  name: 'DashboardPage',
  setup(): DashboardSetup {
    const authStore = useAuthStore()
    const user = computed(() => authStore.user)
    
    const stats = ref<DashboardStats>({
      users: 0,
      sales: 0
    })

    onMounted(() => {
      const animateCounter = (target: number, key: keyof DashboardStats): void => {
        let current = 0
        const increment = target / 50
        const timer = setInterval(() => {
          current += increment
          if (current >= target) {
            stats.value[key] = target
            clearInterval(timer)
          } else {
            stats.value[key] = Math.floor(current)
          }
        }, 30)
      }
      
      setTimeout(() => {
        animateCounter(1247, 'users')
        animateCounter(856, 'sales')
      }, 500)
    })

    return {
      user,
      stats
    }
  }
}