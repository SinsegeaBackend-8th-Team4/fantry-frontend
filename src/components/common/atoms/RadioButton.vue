<script setup>
const props = defineProps({
  modelValue: {
    type: Number,
    default: 0,
  },
  id: {
    type: String,
    required: true,
  },
})
const emit = defineEmits(['update:modelValue'])
</script>
<template>
  <div class="custom-control custom-radio custom-control-inline">
    <input
      type="radio"
      :id="id"
      class="custom-control-input"
      :class="$attrs.class"
      :checked="$attrs.value == modelValue"
      @change="emit('update:modelValue', Number($event.target.value))"
      :name="$attrs.name"
      :value="$attrs.value"
    />
    <label class="custom-control-label" :for="id"><slot></slot></label>
  </div>
</template>

<style scoped></style>
