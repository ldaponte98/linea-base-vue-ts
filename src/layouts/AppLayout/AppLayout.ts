  import { computed, ref, type ComputedRef, type Ref } from 'vue'
  import { useAuthStore } from '@/stores/auth'
  import { Header, Footer, SideMenu } from './components'
  import type { User } from '@/types'

  interface AppLayoutSetup {
    user: ComputedRef<User | null>
    loading: Ref<boolean>
    isMenuCollapsed: Ref<boolean>
    handleMenuCollapse: (collapsed: boolean) => void
  }

  export default {
    name: 'AppLayout',
    components: {
      Header,
      Footer,
      SideMenu
    },
    setup(): AppLayoutSetup {
      const authStore = useAuthStore()
      const loading = ref<boolean>(false)
      const isMenuCollapsed = ref<boolean>(localStorage.getItem('sidemenu_collapsed') !== 'false')
      
      const user = computed(() => authStore.user)

      const handleMenuCollapse = (collapsed: boolean): void => {
        console.log('Menu collapsed state changed:', collapsed)
        isMenuCollapsed.value = collapsed
      }

      return {
        user,
        loading,
        isMenuCollapsed,
        handleMenuCollapse
      }
    }
  }