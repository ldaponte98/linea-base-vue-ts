import { createApp, nextTick } from 'vue'
import { createPinia } from 'pinia'
import type { AuthenticationResult, AccountInfo } from '@azure/msal-browser'
import type { Router } from 'vue-router'
import App from './App.vue'
import router from './router'
import { useAuthStore } from './stores/auth'
import { entraIDService } from './services/api/entraid.service'
import type { GraphProfile } from './types/api'

import 'bootstrap-icons/font/bootstrap-icons.css'
import './assets/styles/main.scss'

const app = createApp(App)
const pinia = createPinia()

app.use(pinia)

// Función para detectar si es callback de EntraID
function isEntraIDCallback(): boolean {
  const urlParams = new URLSearchParams(window.location.search)
  const hash = window.location.hash.substring(1) // Remover el #
  const hashParams = new URLSearchParams(hash)
  
  // Verificar parámetros típicos de OAuth en query params
  const hasCodeQuery = urlParams.has('code')
  const hasStateQuery = urlParams.has('state')
  const hasErrorQuery = urlParams.has('error')
  
  // Verificar parámetros típicos de OAuth en hash
  const hasCodeHash = hashParams.has('code')
  const hasStateHash = hashParams.has('state') 
  const hasErrorHash = hashParams.has('error')
  const hasClientInfo = hashParams.has('client_info')
  
  const isCallback = hasCodeQuery || hasStateQuery || hasErrorQuery || 
                    hasCodeHash || hasStateHash || hasErrorHash || hasClientInfo
  
  console.log('[Main] Verificando callback OAuth')
  console.log('  - Query params - Code:', hasCodeQuery, 'State:', hasStateQuery, 'Error:', hasErrorQuery)
  console.log('  - Hash params - Code:', hasCodeHash, 'State:', hasStateHash, 'Error:', hasErrorHash, 'ClientInfo:', hasClientInfo)
  console.log('  - Es callback:', isCallback)
  console.log('  - URL completa:', window.location.href)
  
  return isCallback
}

app.use(router)

// Función para procesar el callback de EntraID
async function handleEntraIDCallback(router: Router): Promise<void> {
  console.log('🔄 Detectado callback de EntraID, procesando...')
  const authStore = useAuthStore()
  
  try {
    // Procesar la respuesta del callback
    const response = await entraIDService.handleRedirectResponse()
    
    if (response) {
      console.log('✅ Callback procesado exitosamente')
      console.log('   - Account:', response.account ? response.account.username : 'No account')
      console.log('   - Access Token:', response.accessToken ? 'Recibido' : 'No token')
      
      if (response.account) {
        // Configurar cuenta activa si no está ya configurada
        if (!entraIDService.getCurrentUser()) {
          entraIDService.msalInstance.setActiveAccount(response.account)
          console.log('✅ Cuenta activa configurada:', response.account.username)
        }
        
        // Obtener token de acceso si no viene en la respuesta
        let accessToken = response.accessToken
        if (!accessToken) {
          console.log('🔄 Obteniendo token de acceso...')
          accessToken = await entraIDService.getAccessToken()
        }
        
        if (accessToken) {
          console.log('✅ Token de acceso obtenido')
          
          // Obtener perfil del usuario
          console.log('🔄 Obteniendo perfil del usuario...')
          const userProfile = await entraIDService.getUserProfile(accessToken)
          
          if (userProfile) {
            const userData = {
              id: userProfile.id,
              name: userProfile.displayName,
              email: userProfile.mail || userProfile.userPrincipalName,
              avatar: userProfile.photoUrl || null,
              role: 'user',
              entraId: userProfile.id
            }
            
            console.log('✅ Perfil del usuario obtenido:', {
              name: userData.name,
              email: userData.email,
              id: userData.id
            })
            
            // Actualizar store y localStorage
            authStore.setUser(userData)
            authStore.setToken(accessToken)
            
            console.log('🎉 Usuario autenticado exitosamente:', userData.name)
            console.log('💾 Datos guardados en localStorage')
            
            // Limpiar URL y redirigir
            console.log('🔄 Limpiando URL y redirigiendo al dashboard...')
            window.history.replaceState({}, document.title, window.location.pathname)
            await router.replace({ name: 'Dashboard' })
            
            return
          }
        } else {
          console.error('❌ No se pudo obtener token de acceso')
        }
      } else {
        console.error('❌ No se encontró cuenta en la respuesta')
      }
    } else {
      console.log('⚠️ No hay respuesta de callback de MSAL')
    }
    
    console.log('❌ Callback procesado pero datos incompletos, redirigiendo a login')
    
  } catch (error: any) {
    console.error('💥 Error procesando callback:', error)
    console.error('   - Mensaje:', error.message)
    console.error('   - Código de error:', error.errorCode)
  }
  
  // Si llegamos aquí, algo falló en el callback
  console.log('🔄 Limpiando URL después de error en callback...')
  window.history.replaceState({}, document.title, window.location.pathname)
  await router.replace({ name: 'Login' })
}

// Función para inicializar la aplicación
async function initializeApp(): Promise<void> {
  const authStore = useAuthStore()
  
  try {
    console.log('🚀 Iniciando inicialización de aplicación...')
    
    // Inicializar MSAL primero
    await entraIDService.initialize()
    console.log('✅ MSAL inicializado correctamente')
    
    // Verificar si es un callback de EntraID
    const isCallback = isEntraIDCallback()
    
    if (isCallback) {
      await handleEntraIDCallback(router)
      return
    }
    
    // Si no es callback, verificar autenticación existente
    console.log('🔍 No es callback, verificando autenticación existente...')
    const isAuthenticated = await authStore.checkExistingAuth()
    
    if (isAuthenticated) {
      console.log('✅ Usuario ya autenticado, verificando ruta actual...')
      const currentRoute = router.currentRoute.value
      console.log('📍 Ruta actual:', currentRoute.name, 'Path:', currentRoute.path)
      
      // Solo redirigir al dashboard si está en login o ruta por defecto
      if (currentRoute.name === 'Login' || currentRoute.path === '/' || currentRoute.path === '/auth/login') {
        console.log('🔄 Redirigiendo usuario autenticado al dashboard...')
        await router.replace({ name: 'Dashboard' })
      } else {
        console.log('ℹ️ Usuario autenticado ya en ruta válida, no redirigiendo')
      }
    } else {
      console.log('❌ Usuario no autenticado')
      const currentRoute = router.currentRoute.value
      console.log('📍 Ruta actual:', currentRoute.name, 'Requiere auth:', currentRoute.meta?.requiresAuth)
      
      // Solo redirigir a login si la ruta requiere autenticación
      if (currentRoute.meta?.requiresAuth) {
        console.log('🔄 Ruta requiere autenticación, redirigiendo al login')
        await router.replace({ name: 'Login' })
      } else if (currentRoute.path === '/') {
        console.log('🔄 En ruta raíz sin autenticación, redirigiendo al login')
        await router.replace({ name: 'Login' })
      } else {
        console.log('ℹ️ Ruta no requiere autenticación, permitiendo navegación')
      }
    }
    
    console.log('🎯 Aplicación inicializada correctamente')
  } catch (error) {
    console.error('💥 Error crítico inicializando la aplicación:', error)
    // En caso de error crítico, intentar ir al login de forma segura
    try {
      await router.replace({ name: 'Login' })
    } catch (routerError) {
      console.error('💥 Error crítico incluso navegando al login:', routerError)
      // Como último recurso, recargar la página
      //window.location.href = '/auth/login'
    }
  }
}

// Montar la aplicación
app.mount('#app')

// Inicializar después del montaje con un pequeño delay para asegurar que todo esté listo
nextTick(() => {
  setTimeout(() => {
    initializeApp()
  }, 100)
})