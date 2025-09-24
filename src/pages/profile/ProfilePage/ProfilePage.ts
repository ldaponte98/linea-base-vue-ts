import { ref, computed, onMounted, type ComputedRef, type Ref } from 'vue'
import { useAuthStore } from '@/stores/auth'
import { BaseButton } from '@/components'
import type { User } from '@/types'

interface ProfileForm {
  name: string
  email: string
}

interface ProfilePageSetup {
  user: ComputedRef<User | null>
  loading: Ref<boolean>
  profileForm: Ref<ProfileForm>
  userInitials: ComputedRef<string>
  handleUpdateProfile: () => Promise<void>
}

export default {
  name: 'ProfilePage',
  components: {
    BaseButton
  },
  setup(): ProfilePageSetup {
    const authStore = useAuthStore()
    const loading = ref<boolean>(false)
    const user = computed(() => authStore.user)
    
    const profileForm = ref<ProfileForm>({
      name: '',
      email: ''
    })

    const userInitials = computed(() => {
      const name = profileForm.value.name || user.value?.name || 'U'
      return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)
    })

    async function handleUpdateProfile(): Promise<void> {
      loading.value = true
      try {
        await new Promise(resolve => setTimeout(resolve, 1500))
        alert('Perfil actualizado correctamente')
      } catch (error) {
        console.error('Error:', error)
      } finally {
        loading.value = false
      }
    }

    onMounted(() => {
      profileForm.value = {
        name: user.value?.name || 'María García',
        email: user.value?.email || 'maria@ejemplo.com'
      }
    })

    return {
      user,
      loading,
      profileForm,
      userInitials,
      handleUpdateProfile
    }
  }
}