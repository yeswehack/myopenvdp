<template>
  <label :class="{ required, dark: darkMode }">
    <slot>
      {{ label }}
      <span
        v-if="hint"
        class="hint"
        >({{ hint }})</span
      >
    </slot>
  </label>
</template>

<script lang="ts" setup>
import { computed, toRefs } from 'vue';
import { useQuasar } from 'quasar';

const $q = useQuasar();
const darkMode = computed(() => $q.dark.isActive);

interface Props {
  label?: string;
  hint?: string;
  required?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
  label: '',
  hint: '',
  required: false,
});
const { label, hint, required } = toRefs(props);
</script>

<style lang="scss" scoped>
@import 'quasar/src/css/variables.sass';

label {
  justify-content: space-between;
  position: relative;
  width: 100%;
  color: $input-text-color;
  font-size: $input-font-size;
  line-height: $body-line-height;
  font-weight: 500;

  &.required::after {
    content: '*';
    color: $negative;
    display: inline;
    margin-left: 0.1875em;
  }
  :deep(.hint) {
    font-weight: 300;
  }
  &.dark {
    color: #fff;
  }
}
</style>
