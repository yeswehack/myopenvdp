<template>
  <q-timeline
    v-if="logs.length > 0"
    layout="dense"
    class="submission-logs q-mx-sm"
  >
    <div
      v-for="[idx, submissionLog] of logs.entries()"
      :key="idx"
      ref="submissionLogEls"
    >
      <q-timeline-entry :icon="submissionLog.icon">
        <template #subtitle>
          [{{ dateFormat(submissionLog.date, timestampFormat) }}] {{ submissionLog.title }}
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
    </div>
  </q-timeline>
</template>

<script lang="ts" setup>
import { ref, watch, toRefs } from 'vue';
import dateFormat from 'dateformat';
import { SubmissionLog } from './types';
import { scrollTo } from './utils';

interface Props {
  logs: SubmissionLog[];
  autoScroll?: boolean;
  timestampFormat?: string;
}

const props = withDefaults(defineProps<Props>(), {
  autoScroll: true,
  timestampFormat: 'yyyy/mm/dd HH:MM:ss.l',
});
const { logs } = toRefs(props);

const submissionLogEls = ref<HTMLElement[]>([]);
watch(
  logs,
  () => {
    if (props.autoScroll && submissionLogEls.value.length) {
      const lastLogEl = submissionLogEls.value[submissionLogEls.value.length - 1];
      scrollTo(lastLogEl);
    }
  },
  {
    deep: true,
    flush: 'post',
  }
);
</script>
