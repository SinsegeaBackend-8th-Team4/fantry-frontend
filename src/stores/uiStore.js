import { defineStore } from 'pinia';
import { ref } from 'vue';

// 'ui' 스토어를 정의합니다. UI 관련 전역 상태를 여기서 관리해요.
export const useUiStore = defineStore('ui', () => {
  // 로딩 상태를 관리하는 ref. true이면 로딩 중, false이면 로딩 완료.
  const isLoading = ref(false);

  // 로딩 상태를 true로 변경하는 함수 (로딩 시작)
  function startLoading() {
    isLoading.value = true;
  }

  // 로딩 상태를 false로 변경하는 함수 (로딩 끝)
  function stopLoading() {
    isLoading.value = false;
  }

  // 외부에서 사용할 수 있도록 상태와 함수를 반환합니다.
  return {
    isLoading,
    startLoading,
    stopLoading,
  };
});
