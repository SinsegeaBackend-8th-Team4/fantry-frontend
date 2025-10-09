<script setup></script>
<template>
  <div class="card-header custom-header border-0">
    <h4 class="font-weight-semi-bold m-0"><slot></slot></h4>
  </div>
</template>
<style scoped>
.custom-header {
  background-color: #f8f9fa;
  border-bottom: 1px solid #e9ecef;
  color: #333;
}
</style>
