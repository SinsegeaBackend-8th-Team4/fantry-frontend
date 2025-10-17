<script setup>
import { useRouter } from 'vue-router'
const router = useRouter();
</script> 
<template>
  <div class="logo">
    <img @click="router.push('/')" src="/images/fantry_logo.png" style="cursor: pointer;" />
  </div>
</template>
<style scoped>
img {
  display: block;
  margin: 0 auto;
}
</style>
