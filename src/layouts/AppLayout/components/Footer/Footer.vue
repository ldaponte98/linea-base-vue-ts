<template>
  <footer class="app-footer">
    <div class="footer-content">
      <!-- Título y divisor -->
       <h5 class="footer-title">Infocuenca</h5>
      <div class="title-section">
        <div class="divider"></div>
      </div>

      <!-- Sección de copyright y enlaces -->
      <div class="bottom-section">
        <!-- Copyright -->
        <div class="copyright">
          <span>Comisión Interinstitucional de la Cuenca Hidrográfica (</span>
          <span>CICH</span>
          <span>)</span>
          <span>©</span>
          <span>Todos los derechos reservados</span>
        </div>

        <!-- Enlaces -->
        <div class="links-section">
          <button class="footer-link" @click="handleTermsClick">
            Términos y condiciones
          </button>
          <button class="footer-link" @click="handlePoliciesClick">
            Políticas de seguridad
          </button>
        </div>
      </div>
    </div>
  </footer>
</template>

<script lang="ts" src="./Footer.ts"></script>
<style src="./Footer.scss" lang="scss" scoped></style>