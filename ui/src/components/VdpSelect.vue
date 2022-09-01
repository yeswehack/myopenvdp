<template>
  <div>
    <q-select
      ref="select"
      v-model="model"
      :options="options"
      v-bind="$attrs"
      emit-value
      label-slot
      stack-label
      outlined
      hide-bottom-space
      lazy-rules
      :rules="rules"
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
import { computed, ref } from 'vue';
import { QSelect, useFormChild } from 'quasar';

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

const rules = [(value: unknown) => !props.required || !!value || props.requiredLabel];

const select = ref<QSelect>();
useFormChild({
  validate: () => Promise.resolve(model.value != '').then(() => select.value?.validate() || false),
  resetValidation: () => select.value?.resetValidation(),
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
