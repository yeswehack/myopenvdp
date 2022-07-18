<template>
  <div
    class="vdp-field"
    :data-error="error"
  >
    <slot />
  </div>
</template>

<script lang="ts" setup>
interface Props {
  error: string;
}

defineProps<Props>();
</script>

<style lang="scss" scoped>
@import 'quasar/src/css/variables.sass';

.vdp-field {
  border: 0.0625rem solid $dimmed-background;
  box-shadow: $shadow-0;
  transition: border-color $generic-hover-transition;
  border-radius: $generic-border-radius;
  background-color: transparent;
  position: relative;
  margin-bottom: 0.8em;

  &:focus-within,
  &:hover {
    border-color: $primary;
  }

  &::after {
    content: '';
    opacity: 0;
    transition: opacity 0.3s;
  }

  &[data-error]:not([data-error='']) {
    border-color: $negative;

    &::after {
      content: attr(data-error);
      position: absolute;
      left: 0;
      bottom: -2em;
      color: $negative;
      font-size: 0.8em;
      font-weight: 600;
      opacity: 1;
    }
  }
}
</style>
