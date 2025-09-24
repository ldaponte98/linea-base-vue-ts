import { ref, watch, computed } from 'vue'
import { useRoute, type RouteLocationNormalizedLoaded } from 'vue-router'
import { useAuthStore } from '@/stores/auth'

const STORAGE_KEY = 'sidemenu_collapsed'
const EXPANDED_ITEMS_KEY = 'sidemenu_expanded_items'

interface SubMenuItem {
  path: string
  label: string
  icon?: string
}

interface MenuItem {
  id: string
  path?: string
  label: string
  icon?: string
  children?: SubMenuItem[]
}

type SideMenuEmits = (e: 'collapse-change', value: boolean) => void

export default {
  name: 'SideMenu',
  emits: ['collapse-change'],
  setup(props: {}, { emit }: { emit: SideMenuEmits }) {
    const route: RouteLocationNormalizedLoaded = useRoute()
    const authStore = useAuthStore()
    const isCollapsed = ref<boolean>(localStorage.getItem(STORAGE_KEY) !== 'false')
    const isHoverExpanded = ref<boolean>(false)
    const hoverTimeout = ref<NodeJS.Timeout | null>(null)
    const expandedItems = ref<string[]>(
      JSON.parse(localStorage.getItem(EXPANDED_ITEMS_KEY) || '[]')
    )

    // Computado para obtener el nombre del usuario
    const userName = computed(() => {
      const user = authStore.user
      if (!user) return ''
      
      // Intentar obtener el nombre en este orden de prioridad
      return user.name || 'Usuario'
    })

    const menuItems: MenuItem[] = [
      {
        id: 'dashboard',
        path: '/dashboard',
        label: 'Inicio',
        icon: 'bi-house-door'
      },
      {
        id: 'projects',
        label: 'Proyectos',
        icon: 'bi-folder',
        children: [
          {
            path: '/projects/create',
            label: 'Ver proyectos'
          },
          {
            path: '/projects/list',
            label: 'Revisar avances'
          }
        ]
      },
      {
        id: 'reports',
        label: 'Reportes',
        icon: 'bi-file-earmark-text',
        children: [
          {
            path: '/reports/generate',
            label: 'Generar Reporte',
          },
          {
            path: '/reports/history',
            label: 'Historial',
          }
        ]
      },
      {
        id: 'manage',
        path: '/manage',
        label: 'Gestionar responsables',
        icon: 'bi-people'
      }
    ]

    // Guardar estado de items expandidos en localStorage
    watch(expandedItems, (newValue) => {
      localStorage.setItem(EXPANDED_ITEMS_KEY, JSON.stringify(newValue))
    }, { deep: true })

    const hasActiveChild = (item: MenuItem): boolean => {
      if (!item.children) return false
      return item.children.some(child => route.path === child.path)
    }

    // Auto-expandir menú si hay una ruta activa dentro
    const autoExpandParentMenu = () => {
      menuItems.forEach(item => {
        if (item.children && hasActiveChild(item) && !expandedItems.value.includes(item.id)) {
          expandedItems.value.push(item.id)
        }
      })
    }

    // Ejecutar auto-expansión al montar y cuando cambie la ruta
    autoExpandParentMenu()
    watch(() => route.path, autoExpandParentMenu)

    const handleMouseEnter = (): void => {
      if (isCollapsed.value) {
        // Cancelar cualquier timeout pendiente
        if (hoverTimeout.value) {
          clearTimeout(hoverTimeout.value)
          hoverTimeout.value = null
        }
        
        // Expandir con un pequeño delay para evitar expansiones accidentales
        hoverTimeout.value = setTimeout(() => {
          isHoverExpanded.value = true
          // Emitir cambio para que AppLayout ajuste el layout (simular menú expandido)
          emit('collapse-change', false)
          // Auto-expandir submenús que tengan rutas activas
          autoExpandParentMenu()
        }, 150)
      }
    }

    const handleMouseLeave = (): void => {
      if (isCollapsed.value) {
        // Cancelar expansion si está pendiente
        if (hoverTimeout.value) {
          clearTimeout(hoverTimeout.value)
          hoverTimeout.value = null
        }
        
        // Contraer con un pequeño delay para permitir navegar entre elementos
        hoverTimeout.value = setTimeout(() => {
          isHoverExpanded.value = false
          // Emitir cambio para que AppLayout vuelva al estado colapsado
          emit('collapse-change', true)
          // Colapsar submenús cuando se sale del hover
          expandedItems.value = []
        }, 200)
      }
    }

    const toggleMenu = (): void => {
      isCollapsed.value = !isCollapsed.value
      localStorage.setItem(STORAGE_KEY, String(isCollapsed.value))
      emit('collapse-change', isCollapsed.value)
      
      // Reset hover state when manually toggling
      isHoverExpanded.value = false
      if (hoverTimeout.value) {
        clearTimeout(hoverTimeout.value)
        hoverTimeout.value = null
      }
      
      // Colapsar todos los submenús cuando se colapsa el menú principal
      if (isCollapsed.value) {
        expandedItems.value = []
      } else {
        // Re-expandir menús que tengan rutas activas
        autoExpandParentMenu()
      }
    }

    const toggleSubmenu = (itemId: string): void => {
      // Permitir toggle solo si el menú no está colapsado O está en hover
      if (isCollapsed.value && !isHoverExpanded.value) return
      
      const index = expandedItems.value.indexOf(itemId)
      if (index === -1) {
        expandedItems.value.push(itemId)
      } else {
        expandedItems.value.splice(index, 1)
      }
    }

    const isActive = (path: string): boolean => {
      return route.path === path
    }

    return {
      menuItems,
      isCollapsed,
      isHoverExpanded,
      expandedItems,
      userName,
      handleMouseEnter,
      handleMouseLeave,
      toggleMenu,
      toggleSubmenu,
      isActive,
      hasActiveChild
    }
  }
}