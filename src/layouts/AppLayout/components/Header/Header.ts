import { useAuth } from '@/composables/useAuth'
import { useAuthStore } from '@/stores/auth'
import { ConfirmModal } from '@/components'
import { computed, ref } from 'vue'

interface HeaderData {
  userInitial: string
  userName: string
  isMenuOpen: boolean
  showLogoutConfirm: boolean
}

export default {
  name: 'Header',
  components: {
    ConfirmModal
  },
  setup() {
    const { logout } = useAuth()
    const authStore = useAuthStore()
    const currentUser = computed(() => authStore.user)
    const isMenuOpen = ref(false)
    const showLogoutConfirm = ref(false)

    function toggleMenu(): void {
      isMenuOpen.value = !isMenuOpen.value
    }

    function showLogoutConfirmation(): void {
      isMenuOpen.value = false
      showLogoutConfirm.value = true
    }

    function hideLogoutConfirmation(): void {
      showLogoutConfirm.value = false
    }

    async function handleLogout(): Promise<void> {
      try {
        // Limpiar almacenamiento local
        localStorage.clear()
        
        // Cerrar el modal de confirmación
        showLogoutConfirm.value = false
        location.reload()
        // Redirigir al login (esto lo hace el composable useAuth)
      } catch (error) {
        console.error('Error durante el logout:', error)
      }
    }

    return {
      currentUser,
      isMenuOpen,
      showLogoutConfirm,
      toggleMenu,
      showLogoutConfirmation,
      hideLogoutConfirmation,
      handleLogout,
      userInitial: computed(() => currentUser.value?.name?.[0]?.toUpperCase() ?? '?'),
      userName: computed(() => currentUser.value?.name ?? 'Usuario')
    }
  }
}