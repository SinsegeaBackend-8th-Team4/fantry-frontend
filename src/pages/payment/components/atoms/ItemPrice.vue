<script setup>
const props = defineProps({
  name: {
    type: String,
    default: '',
  },
  price: {
    type: Number,
    default: 0,
  },
})
</script>
<template>
  <div class="d-flex justify-content-between">
    <p>{{ name }}</p>
    <p>{{ price }}원</p>
  </div>
</template>
<style scoped></style>
