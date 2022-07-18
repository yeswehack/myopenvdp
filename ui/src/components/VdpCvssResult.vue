<template>
  <div class="vdp-cvss-score">
    <div class="panel score">
      <div>{{ scoreLabel }}</div>
      <div>{{ score }}</div>
    </div>
    <div class="panel severity">
      <div>{{ severityLabel }}</div>
      <div>{{ severity }}</div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { computed } from 'vue';

interface Props {
  scoreLabel?: string;
  score?: number;
  severityLabel?: string;
  severity?: string;
}

const props = withDefaults(defineProps<Props>(), {
  scoreLabel: 'CVSS Score',
  score: 0,
  severityLabel: 'Severity',
  severity: 'None',
});

function getColor(severity: string) {
  switch (severity.toLowerCase()) {
    case 'critical':
      return '#ff2424';
    case 'high':
      return '#ee5a24';
    case 'medium':
      return '#f79f1f';
    case 'low':
      return '#ffc312';
    default:
      return '#d9d9d9';
  }
}
const color = computed(() => getColor(props.severity));
</script>

<style lang="scss" scoped>
@import 'quasar/src/css/variables.sass';
.vdp-cvss-score {
  --background-color: v-bind(color);

  display: flex;
  align-items: flex-start;
  @media screen and (min-width: $breakpoint-sm-max) {
    display: grid;
    grid-template-columns: 1fr 1fr;
  }
  gap: 1px;
  border-radius: 0.1875rem;
  overflow: hidden;

  .panel {
    background: var(--background-color);
    padding: 1.5rem 0.3125rem 1.25rem;
    display: grid;
    grid-template-rows: auto 1fr;
    justify-content: center;
    justify-items: center;
    align-items: center;
    width: 160px;
    aspect-ratio: 1;

    & div:first-of-type {
      color: #070707;
      font-weight: bolder;
      line-height: 1.6923076;

      font-size: 0.8125em;
    }

    & div:last-of-type {
      color: white;
      font-size: 3.5em;
      padding: 0 0.5em;
    }

    &.severity {
      & div:last-of-type {
        text-transform: uppercase;
        font-size: 2em;
        font-weight: 600;
      }
    }
  }
}
</style>
