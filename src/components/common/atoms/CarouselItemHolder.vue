<script setup>
const props = defineProps({
  isActive: {
    type: Boolean,
    default: false,
  },
})
</script>
<template>
  <div class="carousel-item" :class="isActive ? 'active' : ''" style="height: 410px">
    <slot></slot>
  </div>
</template>
