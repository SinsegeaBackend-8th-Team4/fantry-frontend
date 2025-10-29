import { defineStore } from 'pinia';
import { ref, readonly } from 'vue';

<<<<<<< HEAD
export const useUiStore = defineStore('ui', () => {
  const isLoading = ref(false);
  const delayTimeout = ref(null); // 로딩 표시 지연을 위한 setTimeout ID
  const DELAY_TIME = 200; // 200ms 이후에 로딩 표시

  function startLoading() {
    // 이전 지연 타임아웃이 있다면 취소
    if (delayTimeout.value) {
      clearTimeout(delayTimeout.value);
      delayTimeout.value = null;
    }

    // DELAY_TIME 이후에 로딩 상태를 true로 설정
    delayTimeout.value = setTimeout(() => {
      isLoading.value = true;
    }, DELAY_TIME);
  }

  function stopLoading() {
    // 로딩 표시가 지연 중이었다면 취소하고 즉시 숨김
    if (delayTimeout.value) {
      clearTimeout(delayTimeout.value);
      delayTimeout.value = null;
    }
=======
/**
 * UI 관련 전역 상태를 관리하는 Pinia 스토어입니다.
 * 로딩 상태, 모달, 알림 등 공통 UI 요소의 상태를 중앙에서 제어합니다.
 *
 * @author Sin-Se-Gea
 * @since 2024.07.22
 */
export const useUiStore = defineStore('ui', () => {
  /**
   * @type {import('vue').Ref<boolean>}
   * @description 전역 로딩 인디케이터의 활성화 상태.
   * 컴포넌트 외부에서 직접 수정을 방지하기 위해 readonly로 노출하는 것을 권장합니다.
   * (현재는 편의를 위해 직접 노출)
   */
  const isLoading = ref(false);

  /**
   * @description 전역 로딩 상태를 활성화합니다.
   * 페이지 이동 시작(router.beforeEach)이나 주요 API 요청 전에 호출됩니다.
   */
  function startLoading() {
    isLoading.value = true;
  }

  /**
   * @description 전역 로딩 상태를 비활성화합니다.
   * 페이지 이동 완료(router.afterEach)나 API 요청 완료 후에 호출됩니다.
   */
  function stopLoading() {
>>>>>>> origin/main
    isLoading.value = false;
  }

  return {
<<<<<<< HEAD
    isLoading: readonly(isLoading),
=======
    // State
    isLoading: readonly(isLoading), // 외부에서의 직접적인 수정 방지

    // Actions
>>>>>>> origin/main
    startLoading,
    stopLoading,
  };
});
