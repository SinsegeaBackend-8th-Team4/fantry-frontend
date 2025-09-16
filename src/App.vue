<script setup>
<<<<<<< HEAD
import { useUiStore } from '@/stores/uiStore';
import LoadingSpinner from '@/components/common/atoms/LoadingSpinner.vue';

const uiStore = useUiStore();
</script>

<template>
  <!-- 로딩 스피너: uiStore의 isLoading 상태가 true일 때만 보입니다. -->
  <LoadingSpinner v-if="uiStore.isLoading" />
  
  <!-- 라우터 뷰: 현재 경로에 맞는 페이지 컴포넌트가 렌더링됩니다. -->
=======
</script>

<template>
>>>>>>> 2a291c3e0585b049f2d2fa5ef26047dbcabc06d9
  <router-view />
</template>

<style scoped></style>