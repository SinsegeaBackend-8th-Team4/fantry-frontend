<script setup>
import ArrowBulletPoint from '../atoms/ArrowBulletPoint.vue'

const props = defineProps({
  text: {
    type: [String, Object],
    default: '',
  },
})
</script>

<template>
  <div class="d-flex flex-row text-dark mb-2 cursor-pointer"><ArrowBulletPoint />{{ text }}</div>
</template>

<style scoped>
.cursor-pointer {
  cursor: pointer;
}
</style>
