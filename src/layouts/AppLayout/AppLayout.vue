<template>
  <div class="app-layout">
    <Header />
    <SideMenu @collapse-change="handleMenuCollapse" />
    
    <main class="main-content" :class="{ 'menu-collapsed': isMenuCollapsed }">
      <div class="container my-4">
        <router-view />
      </div>
    </main>
    
    <Footer />
  </div>
</template>

<script lang="ts" src="./AppLayout.ts"></script>
<style lang="scss" src="./AppLayout.scss" scoped></style>