<template>
  <!-- v-if="isLoading"을 통해 로딩 상태일 때만 이 컴포넌트가 보이도록 합니다. -->
  <div class="loading-overlay">
    <div class="spinner"></div>
  </div>
</template>

<script setup>
// 이 컴포넌트는 외부에서 isLoading props를 받아 표시 여부를 결정할 수도 있지만,
// 이번에는 Pinia 스토어를 통해 전역으로 상태를 관리할 것입니다.
</script>

<style scoped>
.loading-overlay {
  /* 화면 전체를 덮도록 설정 */
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  
  /* 반투명한 검은색 배경 */
  background-color: rgba(0, 0, 0, 0.5);
  
  /* 스피너를 중앙에 위치시키기 위한 flexbox 설정 */
  display: flex;
  justify-content: center;
  align-items: center;
  
  /* 다른 모든 요소들 위에 보이도록 z-index 설정 */
  z-index: 9999;
}

.spinner {
  /* 스피너의 모양과 크기 */
  width: 50px;
  height: 50px;
  border: 5px solid #f3f3f3; /* 스피너의 기본 회색 테두리 */
  border-top: 5px solid #3498db; /* 스피너의 파란색 부분 */
  border-radius: 50%;
  
  /* 빙글빙글 돌아가는 애니메이션 적용 */
  animation: spin 1s linear infinite;
}

/* 스피너 회전 애니메이션 정의 */
@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}
</style>
