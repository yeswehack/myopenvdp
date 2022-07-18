<template>
  <q-dialog
    ref="dialogRef"
    class="vdp-dialog"
    @hide="onDialogHide"
  >
    <q-card class="q-dialog-plugin card">
      <q-card-section
        v-if="props.title"
        class="q-dialog__title"
      >
        <h1>{{ props.title }}</h1>
      </q-card-section>
      <!-- eslint-disable vue/no-v-html -->
      <q-card-section
        v-if="props.message"
        class="q-dialog__message message"
        v-html="props.message"
      />
      <!-- eslint-enable -->
      <q-card-actions
        v-if="buttons.length > 0"
        align="right"
      >
        <q-btn
          v-for="(item, idx) of buttons"
          :key="idx"
          :label="item.label"
          flat
          @click="item.click"
        />
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>

<script setup lang="ts">
import { useDialogPluginComponent } from 'quasar';
import { computed } from 'vue';

interface Props {
  title?: string;
  message?: string;
  ok?: string;
  cancel?: string;
}

const props = withDefaults(defineProps<Props>(), {
  title: undefined,
  message: undefined,
  ok: undefined,
  cancel: undefined,
});

const buttons = computed(() => {
  const items = [];
  if (props.cancel) {
    items.push({
      label: props.cancel,
      click: onDialogCancel,
    });
  }
  if (props.ok) {
    items.push({
      label: props.ok,
      click: onDialogOK,
    });
  }
  return items;
});

defineEmits([...useDialogPluginComponent.emits]);

const { dialogRef, onDialogHide, onDialogOK, onDialogCancel } = useDialogPluginComponent();
</script>

<style lang="scss" scoped>
:deep(.vdp-dialog) {
  .card {
    width: 75%;
    max-width: 75%;
  }
  .message {
    max-height: 50vh;
    overflow-y: auto;
  }
  padding: 0 0 0 20px;
  h1,
  h2,
  h3,
  h4,
  h5,
  h6 {
    font-size: 1em;
    font-weight: bold;
    margin: 16px 12px 0 0;
    padding: 0 0 20px 0;
    line-height: 1em;
    text-transform: uppercase !important;
  }
  h2 {
    font-size: 0.95em !important;
  }
  h3 {
    font-size: 0.9em !important;
  }
  h4 {
    font-size: 0.85em !important;
  }
  h5 {
    font-size: 0.8em !important;
  }
  h6 {
    font-size: 0.85em !important;
  }
}
</style>
