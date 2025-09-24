<template>
  <div class="profile-page">
    <div class="row mb-4">
      <div class="col-12">
        <h1 class="h3 mb-1">Mi Perfil</h1>
        <p class="text-muted">Gestiona tu información personal</p>
      </div>
    </div>

    <div class="row">
      <div class="col-lg-4 mb-4">
        <div class="card border-0 shadow-sm">
          <div class="card-body text-center">
            <div class="position-relative d-inline-block mb-3">
              <div v-if="user?.avatar" class="avatar-large mx-auto position-relative">
                <img :src="user.avatar" :alt="user.name" class="rounded-circle" width="100" height="100" style="object-fit: cover;">
              </div>
              <div v-else class="avatar-large bg-primary text-white rounded-circle d-flex align-items-center justify-content-center mx-auto">
                <span class="fs-1 fw-bold">{{ userInitials }}</span>
              </div>
              <button class="btn btn-sm btn-primary rounded-circle position-absolute bottom-0 end-0">
                <i class="bi bi-camera"></i>
              </button>
            </div>
            
            <h4 class="mb-1">{{ user?.name || 'Usuario' }}</h4>
            <p class="text-muted mb-3">{{ user?.email || 'email@ejemplo.com' }}</p>
            
            <span class="badge bg-success-subtle text-success border border-success-subtle">
              <i class="bi bi-check-circle me-1"></i>
              Cuenta verificada
            </span>
          </div>
        </div>
      </div>

      <div class="col-lg-8">
        <div class="card border-0 shadow-sm">
          <div class="card-header bg-transparent">
            <h5 class="card-title mb-0">
              <i class="bi bi-person-gear me-2"></i>
              Información Personal
            </h5>
          </div>
          <div class="card-body">
            <form @submit.prevent="handleUpdateProfile">
              <div class="row">
                <div class="col-md-6 mb-3">
                  <label class="form-label">Nombre completo</label>
                  <input 
                    v-model="profileForm.name"
                    type="text" 
                    class="form-control" 
                    placeholder="Tu nombre completo"
                  />
                </div>
                
                <div class="col-md-6 mb-3">
                  <label class="form-label">Correo electrónico</label>
                  <input 
                    v-model="profileForm.email"
                    type="email" 
                    class="form-control" 
                    placeholder="tu@email.com"
                  />
                </div>
              </div>
              
              <div class="d-flex justify-content-end mt-4">
                <BaseButton
                  type="submit"
                  variant="primary"
                  :loading="loading"
                  icon="check-lg"
                >
                  {{ loading ? 'Guardando...' : 'Guardar Cambios' }}
                </BaseButton>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script src="./ProfilePage.js"></script>
<style lang="scss" src="./ProfilePage.scss" scoped></style>