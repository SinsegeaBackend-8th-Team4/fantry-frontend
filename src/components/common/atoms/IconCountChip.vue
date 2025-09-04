<script setup>
const props = defineProps({
  count: {
    type: Number,
    default: 0,
  },
})
</script>
<template>
  <div class="btn border">
    <slot></slot>
    <span class="badge">{{ count }}</span>
  </div>
</template>
