<template>
  <!-- eslint-disable vue/no-v-html -->
  <div
    class="markdown-body"
    v-html="rendered"
  />
  <!-- eslint-enable -->
</template>

<script lang="ts" setup>
import { nextTick, onMounted, ref, toRefs, watch } from 'vue';
import MarkdownIt from 'markdown-it';

interface Props {
  content: string;
}

const props = defineProps<Props>();
const { content } = toRefs(props);
const md: MarkdownIt = new MarkdownIt();
const rendered = ref('');
const render = (value: string) => (rendered.value = md.render(value));
watch(content, async (value) => {
  await nextTick(() => {
    render(value);
  });
});
onMounted(() => render(content.value));
</script>
