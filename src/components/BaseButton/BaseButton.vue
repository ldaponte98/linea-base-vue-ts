<template>
  <button
    :class="buttonClasses"
    :disabled="disabled || loading"
    :type="type"
    @click="handleClick"
  >
    <span v-if="loading" class="spinner-border spinner-border-sm me-2" role="status">
      <span class="visually-hidden">Loading...</span>
    </span>
    <i v-if="icon && !loading" :class="[`bi bi-${icon}`, { 'me-2': $slots.default }]"></i>
    <slot />
  </button>
</template>

<script lang="ts" src="./BaseButton.ts"></script>
<style lang="scss" src="./BaseButton.scss" scoped></style>