<template>
  <div>
    <q-input
      v-model="model"
      :error="errorMessage != ''"
      :error-message="errorMessage"
      :maxlength="maxlen"
      :type="textarea ? 'textarea' : 'text'"
      v-bind="$attrs"
      :label-slot="label != ''"
      stack-label
      outlined
      hide-bottom-space
      @blur="hadFocus = true"
    >
      <template
        v-if="label"
        #label
      >
        {{ label }}
        <span
          v-if="hint"
          class="hint"
          >({{ hint }})</span
        >
        <span :class="{ required }"></span>
      </template>
    </q-input>
  </div>
</template>

<script lang="ts" setup>
import { computed, onMounted, ref, toRefs } from 'vue';
import { renderTemplate } from '../utils';

interface Props {
  required?: boolean;
  requiredLabel?: string;
  label?: string;
  maxlen?: number;
  maxlenLabel?: string;
  modelValue?: string;
  textarea?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
  required: false,
  requiredLabel: 'This value should not be blank.',
  label: '',
  maxlen: -1,
  maxlenLabel: '{{max}} char maximum',
  modelValue: '',
  textarea: false,
});

const { required, label, maxlen, textarea } = toRefs(props);

const emit = defineEmits(['update:model-value']);

const hadFocus = ref(false);
const hint = computed(() => {
  return props.maxlen == -1 ? '' : renderTemplate(props.maxlenLabel, { max: props.maxlen });
});

const model = computed({
  get() {
    return props.modelValue;
  },
  set(v: string) {
    emit('update:model-value', v);
  },
});

const errorMessage = computed(() => {
  return hadFocus.value && props.required && !model.value ? props.requiredLabel : '';
});
onMounted(() => {
  hadFocus.value = false;
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
</style>
