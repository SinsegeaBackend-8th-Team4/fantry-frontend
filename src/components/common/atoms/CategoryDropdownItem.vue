<script setup>
const props = defineProps({
  name: {
    type: String,
    default: '',
    required: true,
  },
})
</script>
<template>
  <div class="dropdown-item" style="cursor: pointer" v-bind="$attrs">{{ name }}</div>
</template>
<style scoped></style>
