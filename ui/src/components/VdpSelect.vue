<template>
  <div>
    <q-select
      v-model="model"
      :error="errorMessage != ''"
      :error-message="errorMessage"
      :options="options"
      v-bind="$attrs"
      emit-value
      label-slot
      stack-label
      outlined
      hide-bottom-space
      @blur="hadFocus = true"
    >
      <template #label>
        {{ label }}
        <span :class="{ required }"></span>
      </template>
      <template #selected-item="scope">
        <span
          v-if="scope.opt == ''"
          class="placeholder"
        >
          {{ placeholder }}
        </span>
        <span v-else>{{ displayValue }}</span>
      </template>
    </q-select>
  </div>
</template>

<script lang="ts" setup>
import { computed, ref, onMounted } from 'vue';

export type SelectOption<T = unknown> = {
  label: string;
  value: T;
};

interface Props {
  required?: boolean;
  requiredLabel?: string;
  label?: string;
  placeholder?: string;
  modelValue?: string;
  options?: SelectOption[];
}
const props = withDefaults(defineProps<Props>(), {
  required: false,
  requiredLabel: 'This value should not be blank.',
  label: '',
  placeholder: 'Select...',
  modelValue: '',
  options: () => [],
});

const emit = defineEmits(['update:model-value']);

const hadFocus = ref(false);

const options = computed(() => [
  {
    label: props.placeholder,
    value: '',
    disable: true,
  },
  ...props.options,
]);

const model = computed({
  get() {
    return props.modelValue;
  },
  set(v: string) {
    emit('update:model-value', v);
  },
});
const displayValue = computed(() => options.value.find((v) => v.value == model.value)?.label);

onMounted(() => {
  hadFocus.value = false;
});

const errorMessage = computed(() => {
  return hadFocus.value && props.required && model.value === '' ? props.requiredLabel : '';
});
</script>

<style lang="scss" scoped>
@import 'quasar/src/css/variables.sass';

.required::after {
  content: '*';
  color: $negative;
  display: inline;
  margin-left: 0.1875em;
}
.placeholder {
  opacity: 0.7;
}
</style>
