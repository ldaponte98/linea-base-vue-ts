<template>
  <aside 
    class="side-menu" 
    :class="{ 'collapsed': isCollapsed, 'hover-expanded': isHoverExpanded }"
    @mouseenter="handleMouseEnter"
    @mouseleave="handleMouseLeave"
  >
    <nav class="side-menu-nav">
      <!-- Botón de toggle -->
      <div class="side-menu-header">
        <button 
          class="side-menu-toggle"
          :class="{ 'expanded': !isCollapsed || isHoverExpanded }"
        >
          <i class="bi" :class="isCollapsed ? 'bi-list' : 'bi-x-lg'"></i>
        </button>
        
        <!-- Nombre del usuario cuando está expandido -->
        <div 
          class="user-name"
          :class="{ 'd-none': isCollapsed && !isHoverExpanded }"
          v-if="userName"
        >
          {{ userName }}
        </div>
      </div>

      <!-- Contenido del menú -->
      <div class="side-menu-content">
        <ul class="nav flex-column">
          <li v-for="item in menuItems" :key="item.path || item.id" class="nav-item">
            <!-- Item con submenú -->
            <div v-if="item.children && item.children.length > 0">
              <button
                class="nav-link nav-link-parent d-flex align-items-center"
                :class="{ 
                  active: hasActiveChild(item),
                  expanded: expandedItems.includes(item.id)
                }"
                @click="toggleSubmenu(item.id)"
              >
                <i class="bi" :class="item.icon"></i>
                <span :class="{ 'd-none': isCollapsed && !isHoverExpanded }">{{ item.label }}</span>
                <i 
                  v-if="!isCollapsed || isHoverExpanded"
                  class="bi submenu-arrow ms-auto"
                  :class="expandedItems.includes(item.id) ? 'bi-chevron-up' : 'bi-chevron-down'"
                ></i>
              </button>
              
              <!-- Submenú -->
              <div 
                class="submenu-container"
                :class="{ 
                  'show': expandedItems.includes(item.id) && (!isCollapsed || isHoverExpanded),
                  'collapsed-submenu': isCollapsed && !isHoverExpanded
                }"
              >
                <ul class="submenu">
                  <li v-for="child in item.children" :key="child.path" class="submenu-item">
                    <router-link
                      :to="child.path"
                      class="nav-link nav-link-child d-flex align-items-center"
                      :class="{ active: isActive(child.path) }"
                    >
                      <i class="bi" :class="child.icon"></i>
                      <span :class="{ 'd-none': isCollapsed && !isHoverExpanded }">{{ child.label }}</span>
                    </router-link>
                  </li>
                </ul>
              </div>
            </div>

            <!-- Item sin submenú -->
            <router-link 
              v-else
              :to="item.path"
              class="nav-link d-flex align-items-center"
              :class="{ active: isActive(item.path) }"
            >
              <i class="bi" :class="item.icon"></i>
              <span :class="{ 'd-none': isCollapsed && !isHoverExpanded }">{{ item.label }}</span>
            </router-link>
          </li>
        </ul>
      </div>
    </nav>
  </aside>
</template>

<script lang="ts" src="./SideMenu.ts"></script>
<style src="./SideMenu.scss" lang="scss" scoped></style>