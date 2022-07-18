<template>
  <button
    class="vdp-button"
    :class="{ round: !label }"
  >
    <q-icon
      v-if="icon"
      :name="icon"
    />
    <slot>
      <span v-if="label">{{ label }}</span>
    </slot>
    <q-icon
      v-if="iconRight"
      :name="iconRight"
    />
  </button>
</template>

<script lang="ts" setup>
interface Props {
  icon?: string;
  iconRight?: string;
  label?: string;
}

withDefaults(defineProps<Props>(), {
  icon: '',
  label: '',
  iconRight: '',
  disabled: false,
});
</script>

<style lang="scss">
.vdp-button:disabled,
.vdp-button:disabled * {
  opacity: 1 !important;
}
</style>
