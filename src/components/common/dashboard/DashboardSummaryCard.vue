<template>
<<<<<<< HEAD
  <div :class="`card border-left-${card.color} shadow h-100 py-2`">
    <div class="card-body clickable-card" @click="$emit('click', card.key)">
      <div class="row no-gutters align-items-center">
        <div class="col mr-2">
          <div :class="`text-xs font-weight-bold text-${card.color} text-uppercase mb-1`">
            {{ card.title }}
=======
<<<<<<< HEAD
  <div class="col-xl-3 col-md-6 mb-4">
    <div :class="`card border-left-${card.color} shadow h-100 py-2`">
      <div class="card-body clickable-card" @click="$emit('click', card.key)">
        <div class="row no-gutters align-items-center">
          <div class="col mr-2">
            <div :class="`text-xs font-weight-bold text-${card.color} text-uppercase mb-1`">
              {{ card.title }}
            </div>
            <div class="h5 mb-0 font-weight-bold text-gray-800">
              {{ (value || 0).toLocaleString() }} 건
            </div>
>>>>>>> develop
          </div>
          <div class="h5 mb-0 font-weight-bold text-gray-800">
            {{ (value || 0).toLocaleString() }} 건
          </div>
        </div>
<<<<<<< HEAD
        <div class="col-auto">
          <i :class="`fas ${card.icon} fa-2x text-gray-300`"></i>
        </div>
=======
=======
  <div :class="`card border-left-${card.color} shadow h-100 py-2`">
    <div class="card-body clickable-card" @click="$emit('click', card.key)">
      <div class="row no-gutters align-items-center">
        <div class="col mr-2">
          <div :class="`text-xs font-weight-bold text-${card.color} text-uppercase mb-1`">
            {{ card.title }}
          </div>
          <div class="h5 mb-0 font-weight-bold text-gray-800">
            {{ (value || 0).toLocaleString() }} 건
          </div>
        </div>
        <div class="col-auto">
          <i :class="`fas ${card.icon} fa-2x text-gray-300`"></i>
        </div>
>>>>>>> 9e2ff05ff607911e93867be14c9d9027c109dd10
>>>>>>> develop
      </div>
    </div>
  </div>
</template>

<script setup>
import { defineProps } from 'vue';

const props = defineProps({
  card: { type: Object, required: true },
  value: { type: Number, default: 0 } // 대시보드에서 계산된 실제 값
});

defineEmits(['click']);
</script>

<style scoped>
.clickable-card {
  cursor: pointer;
  transition: transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out;
}
.clickable-card:hover {
  transform: translateY(-5px); /* 살짝 위로 뜨는 효과 */
  box-shadow: 0 0.5rem 1rem rgba(0, 0, 0, 0.15) !important; /* 그림자 강조 */
}
</style>