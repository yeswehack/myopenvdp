<template>
  <vdp-input
    v-model="model"
    :label="label"
    :placeholder="placeholder"
    required
    v-bind="$attrs"
  >
    <template #extra>
      <div class="q-mr-xs q-ml-xs">
        <q-img
          v-if="captchaUrl"
          :src="captchaUrl"
          alt="captcha image"
          :width="`${captchaWidth}px`"
          :height="`${captchaHeight}px`"
        />
      </div>
      <div>
        <vdp-button
          icon="refresh"
          type="button"
          @click="refreshCaptcha"
        />
      </div>
    </template>
  </vdp-input>
</template>

<script lang="ts" setup>
import { computed } from 'vue';
import VdpButton from './VdpButton.vue';
import VdpInput from './VdpInput.vue';

interface Props {
  label?: string;
  placeholder?: string;
  captchaUrl?: string;
  captchaValue?: string;
  captchaWidth?: number;
  captchaHeight?: number;
}

const props = withDefaults(defineProps<Props>(), {
  label: 'Captcha',
  placeholder: 'Enter the captcha',
  captchaUrl: '',
  captchaValue: '',
  captchaWidth: 200,
  captchaHeight: 56,
});

const emit = defineEmits(['update:captchaValue', 'refresh']);

const model = computed({
  get() {
    return props.captchaValue;
  },
  set(v: string) {
    emit('update:captchaValue', v);
  },
});

const refreshCaptcha = () => emit('refresh');
</script>

<style lang="scss" scoped></style>
