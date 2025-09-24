<template>
  <div class="modal fade" :class="{ 'show': isVisible }" tabindex="-1" aria-hidden="true">
    <div class="modal-dialog modal-dialog-centered">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title">{{ title }}</h5>
          <button 
            type="button" 
            class="btn-close" 
            @click="onCancel"
            aria-label="Close"
          ></button>
        </div>
        <div class="modal-body">
          {{ message }}
        </div>
        <div class="modal-footer">
          <button 
            type="button" 
            class="btn btn-secondary" 
            @click="onCancel"
          >
            Cancelar
          </button>
          <button 
            type="button" 
            class="btn btn-primary" 
            @click="onConfirm"
          >
            Confirmar
          </button>
        </div>
      </div>
    </div>
  </div>
  <div 
    v-if="isVisible" 
    class="modal-backdrop fade show"
    @click="onCancel"
  ></div>
</template>

<script lang="ts" src="./ConfirmModal.ts"></script>
<style lang="scss" src="./ConfirmModal.scss" scoped></style>]]>