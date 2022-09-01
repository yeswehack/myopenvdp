<template>
  <q-field
    ref="field"
    borderless
    lazy-rules
    :rules="rules"
  >
    <div>
      <vdp-label
        :label="label"
        :hint="hint"
        required
      />
      <div class="radio-group">
        <template
          v-for="choice of choices"
          :key="choice.label"
        >
          <input
            :id="`${uid}-${choice.label}`"
            v-model="model"
            :value="choice.value"
            type="radio"
          />
          <label
            :for="`${uid}-${choice.label}`"
            tabindex="0"
            @keydown="(evt) => onKeydown(evt, `${uid}-${choice.label}`)"
            >{{ choice.label }} ({{ choice.value }})</label
          >
        </template>
      </div>
    </div>
  </q-field>
</template>

<script lang="ts" setup>
import { ref, onMounted, computed } from 'vue';
import { QField } from 'quasar';
import { randomId } from '../utils';
import VdpLabel from './VdpLabel.vue';

type RadioOption<T = unknown> = {
  label: string;
  value: T;
};

interface Props {
  required?: boolean;
  requiredLabel?: string;
  label?: string;
  hint?: string;
  choices?: RadioOption[];
  modelValue?: string;
}

const props = withDefaults(defineProps<Props>(), {
  required: false,
  requiredLabel: 'This value should not be blank.',
  label: '',
  hint: '',
  choices: () => [],
  modelValue: '',
});

const emit = defineEmits(['update:model-value']);
const uid = ref('');
const field = ref<QField>();
defineExpose({
  validate: () => field.value?.validate(),
  resetValidation: () => field.value?.resetValidation(),
});

const model = computed({
  get() {
    return props.modelValue;
  },
  set(v: string) {
    emit('update:model-value', v);
  },
});
const rules = [() => !props.required || !!model.value || props.requiredLabel];

function onKeydown(evt: KeyboardEvent, targetId: string) {
  if (evt.code == 'Enter' || evt.code == 'Space') {
    evt.stopPropagation();
    evt.preventDefault();
    document.getElementById(targetId)?.click();
  }
}

onMounted(() => {
  uid.value = randomId();
});
</script>

<style lang="scss" scoped>
@import 'quasar/src/css/variables.sass';

.radio-group {
  display: flex;
  column-gap: 1px;
  border-radius: $generic-border-radius;

  & > label:first-of-type {
    border-radius: $generic-border-radius 0 0 $generic-border-radius;
  }

  & > label:last-of-type {
    border-radius: 0 $generic-border-radius $generic-border-radius 0;
  }

  input {
    display: none;
  }

  input:checked + label {
    background: $positive;
    color: $dark;
  }

  label {
    text-align: center;
    background: white;
    color: black;

    display: inline-block;
    text-transform: capitalize;
    line-height: $body-line-height;
    font-size: $input-font-size;
    padding: 0.4rem 0.75rem;
    box-shadow: $shadow-1;
    cursor: pointer;
    &:hover,
    &:focus {
      background: $negative;
      color: white;
    }
  }
}
</style>
