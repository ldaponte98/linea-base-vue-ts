import { ref, onMounted, type Ref } from 'vue'
import { useAuth } from '@/composables/useAuth'
import { useAuthStore } from '@/stores/auth'
import { BaseButton } from '@/components'
import type { AuthResult } from '@/types'

interface LandingPageSetup {
  loading: Ref<boolean>
  handleEntraIDLogin: () => Promise<void>
}

export default {
  name: 'LandingPage',
  components: {
    BaseButton
  },
  setup(): LandingPageSetup {
    const authStore = useAuthStore()
    const loading = ref<boolean>(false)

    // Verificar si ya está autenticado al cargar la página
    onMounted(() => {
      console.log({location: window.location.href.includes('code=')})
      if (authStore.isAuthenticated) {
        console.log('Usuario ya autenticado, debería redirigir automáticamente')
        loading.value = true
      }

      if (window.location.href.includes('code=')) {
        console.log('Detectado callback de autenticación en URL, manejando login...')
        loading.value = true
      }
    })

    // Login inteligente con EntraID - maneja automáticamente sesiones existentes y errores
    async function handleEntraIDLogin(): Promise<void> {
      if (loading.value) return
      
      loading.value = true
      
      try {
        console.log('Iniciando login inteligente con EntraID...')
        
        // Primero verificar si ya hay una sesión existente
        const existingAuth: boolean = await authStore.checkExistingAuth()
        if (existingAuth) {
          console.log('Sesión existente encontrada y restaurada')
          // useAuth ya maneja la redirección
          return
        }
        
        // Si no hay sesión existente, intentar login regular
        console.log('No hay sesión existente, iniciando nuevo login...')
        sessionStorage.clear()
        localStorage.clear()
        const result: boolean = await authStore.loginWithEntraID()
        
        console.log('Login completado:', result)
      } catch (error) {
        console.error('Error en proceso de login:', error)
      } finally {
        loading.value = false
      }
    }

    return {
      loading,
      handleEntraIDLogin
    }
  }
}