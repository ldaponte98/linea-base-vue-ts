<template>
  <div class="landing-page">
    <div class="main-container">
      <div class="content-box">
        <div class="row h-100 g-0">
            <!-- Contenido -->
          <div class="col-5 d-flex align-items-center">
            <div class="content-section">
              <!-- Logo -->
              <div class="logo-container">
                <img src="@/assets/images/logo-cich.png" alt="CICH Logo" class="img-fluid" />
              </div>

              <!-- Textos -->
              <div class="text-section">
                <h1>¡Bienvenido</h1>
                <h2>a Infocuenca!</h2>
                <p>
                  La plataforma de seguimiento y monitoreo de proyectos del Plan Indicativo de Ordenamiento Territorial Ambiental (PIOTA).
                </p>
              </div>

              <!-- Botón -->
              <div class="button-section">
                <BaseButton
                    @click="handleEntraIDLogin"
                    variant="primary"
                    size="lg"
                    :loading="loading"
                    :block="true"
                >
                    {{ loading ? 'Iniciando sesión...' : 'Ingresar' }}
                </BaseButton>
              </div>
            </div>
          </div>

          <!-- Imagen de fondo con máscara -->
          <div class="col-7 position-relative overflow-hidden">
            <div class="background-image h-100" />
          </div>          
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" src="./LoginPage.ts"></script>
<style src="./LoginPage.scss" lang="scss" scoped></style>