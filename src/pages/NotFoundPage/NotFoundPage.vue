<template>
  <div class="not-found-page min-vh-100 d-flex align-items-center">
    <div class="container">
      <div class="row justify-content-center text-center">
        <div class="col-lg-6">
          <h1 class="display-1 fw-bold text-primary">404</h1>
          <h2 class="h3 mb-3">Página no encontrada</h2>
          <p class="mb-4">La página que buscas no existe.</p>
          
          <div class="d-flex gap-3 justify-content-center">
            <router-link to="/dashboard" class="btn btn-primary">
              <i class="bi bi-house me-2"></i>
              Ir al Dashboard
            </router-link>
            <button @click="goBack" class="btn btn-outline-secondary">
              <i class="bi bi-arrow-left me-2"></i>
              Volver Atrás
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router'

const router = useRouter()

function goBack(): void {
  router.go(-1)
}
</script>