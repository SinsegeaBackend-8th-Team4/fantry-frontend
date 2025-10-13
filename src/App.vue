<script setup>
import { useUiStore } from '@/stores/uiStore';
import LoadingSpinner from '@/components/common/atoms/LoadingSpinner.vue';
import { onMounted, watch } from 'vue';
import { useUserStore } from '@/stores/userStore';
import { connect, disconnect } from '@/services/websocketService';
import { useIdleTimer } from './utils/TimerComposable';

const uiStore = useUiStore();
const userStore = useUserStore();

// 미활동 시 자동 로그아웃 로직 적용
const IDLE_TIMEOUT_MINUTES = 110;   //2시간 기준 10분 일찍 로그아웃
const { showLogoutMessage } = useIdleTimer(IDLE_TIMEOUT_MINUTES);
console.log("미활동 감지 메시지: ", showLogoutMessage);

onMounted(() => {
  if(userStore.isLoggedIn || userStore.currentUser == null) {
    userStore.fetchUser();  //토큰 기반 유저 상태복구
  }
});

// userStore의 'authToken' 상태를 감시(watch).
// 로그인/로그아웃으로 인해 이 값이 변경될 때마다, 이 로직이 자동으로 실행.
watch(
  () => userStore.authToken,
  (newToken) => {
    // [디버깅 로그] 토큰 변경 감지 시 로그를 출력하여 흐름 파악. 필요시 매개변수 newToken 옆에 oldToken 추가한다음 주석 해제
    //console.log(`Authentication token changed. Re-establishing WebSocket connection. Old token exists: ${!!oldToken}, New token exists: ${!!newToken}`);
    
    // 1. 기존 연결이 있다면 우선 안전하게 연결 종료.
    disconnect();
    
    // 2. 새로운 토큰 상태로 재연결.
    //    - 로그인 성공 시: newToken에 JWT가 담겨 '인증된' 연결.
    //    - 로그아웃 시: newToken은 null이 되어 '익명' 연결.
    connect(newToken);
  },
  {
    // immediate: true 옵션은 watch를 설정하는 즉시,
    // (컴포넌트가 로드될 때) 현재 값으로 한번 실행
    // 이를 통해 사용자가 페이지를 새로고침했을 때, localStorage에 남아있는
    // 토큰으로 초기 WebSocket 연결을 맺을 수 있습니다.
    immediate: true 
  }
);
</script>

<template>
  <!-- 로딩 스피너: uiStore의 isLoading 상태가 true일 때만 보입니다. -->
  <LoadingSpinner v-if="uiStore.isLoading" />
  
  <!-- 라우터 뷰: 현재 경로에 맞는 페이지 컴포넌트가 렌더링됩니다. -->
  <router-view />
</template>

<style scoped></style>