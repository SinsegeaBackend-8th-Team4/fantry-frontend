<script setup>
import { useUiStore } from '@/stores/uiStore';
import LoadingSpinner from '@/components/common/atoms/LoadingSpinner.vue';
import { onMounted } from 'vue';
import { useUserStore } from '@/stores/userStore';

const uiStore = useUiStore();

const userStore = useUserStore();
onMounted(() => {
  if(userStore.isLoggedIn || userStore.currentUser == null) {
    userStore.fetchUser();  //토큰 기반 유저 상태복구
  }
});
</script>

<template>
  <!-- 로딩 스피너: uiStore의 isLoading 상태가 true일 때만 보입니다. -->
  <LoadingSpinner v-if="uiStore.isLoading" />
  
  <!-- 라우터 뷰: 현재 경로에 맞는 페이지 컴포넌트가 렌더링됩니다. -->
  <router-view />
</template>

<style scoped></style>