<template>
  <header class="app-header">
    <!-- Sección izquierda con logos -->
    <div class="brand-section">
      <div class="brand-title">CICH</div>
      <div class="divider"></div>
      <div class="brand-title">Infocuenca</div>
    </div>

    <!-- Sección derecha con botón de usuario y menú -->
    <div class="user-section">
      <div class="dropdown">
        <button class="user-button" @click="toggleMenu">
          <span>{{ userInitial }}</span>
        </button>
        
        <!-- Menú desplegable -->
        <div :class="`dropdown-menu ${isMenuOpen && 'force-show'}`" v-show="isMenuOpen">
            <button class="dropdown-item">
              Ver perfil
            </button>
            <button class="dropdown-item" @click="showLogoutConfirmation">
              Cerrar sesión
            </button>
        </div>
      </div>
    </div>

    <!-- Modal de confirmación -->
    <ConfirmModal
      :is-visible="showLogoutConfirm"
      title="Cerrar sesión"
      message="¿Está seguro que desea cerrar la sesión?"
      @confirm="handleLogout"
      @cancel="hideLogoutConfirmation"
    />
  </header>
</template>

<script lang="ts" src="./Header.ts"></script>
<style src="./Header.scss" lang="scss" scoped></style>