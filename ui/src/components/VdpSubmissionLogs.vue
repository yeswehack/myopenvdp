<template>
  <q-timeline
    v-if="logs.length > 0"
    layout="dense"
    class="submission-logs q-mx-sm"
  >
    <q-timeline-entry
      v-for="[idx, submissionLog] of logs.entries()"
      :key="idx"
      :icon="submissionLog.icon"
    >
      <template #subtitle>
        {{ submissionLog.title }}
      </template>
      {{ submissionLog.message }}
      <ul v-if="submissionLog.links">
        <li
          v-for="[idl, link] of submissionLog.links.entries()"
          :key="idl"
        >
          <a
            :href="link.url"
            target="_blank"
            :download="link.download"
            >{{ link.label }}</a
          >
          <span v-if="link.suffix">{{ link.suffix }}</span>
        </li>
      </ul>
    </q-timeline-entry>
  </q-timeline>
</template>

<script lang="ts" setup>
import { SubmissionLog } from './types';

interface Props {
  logs: SubmissionLog[];
}

defineProps<Props>();
</script>
