<template>
  <img :src="currentSrc" :alt="alt" @error="handleError" />
</template>

<script setup>
import { ref, watch } from 'vue';

const props = defineProps({
  src: {
    type: String,
    default: ''
  },
  alt: {
    type: String,
    default: ''
  },
  fallbackSrc: {
    type: String,
    required: true
  }
});

const currentSrc = ref(props.src || props.fallbackSrc);
const hasTriedFallback = ref(false);

watch(() => props.src, (newSrc) => {
  currentSrc.value = newSrc || props.fallbackSrc;
  hasTriedFallback.value = false;
});

const handleError = () => {
  if (!hasTriedFallback.value) {
    hasTriedFallback.value = true;
    currentSrc.value = props.fallbackSrc;
  }
  // If the fallback also fails, the error event will be triggered again,
  // but since hasTriedFallback is true, we won't enter an infinite loop.
};
</script>