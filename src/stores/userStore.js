import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import { apiClient } from '@/api/index.js';

/**
 * 사용자 관련 전역 상태를 관리하는 Pinia 스토어입니다.
 * 로그인 상태, 사용자 정보, 권한 등을 중앙에서 제어합니다.
 */
export const useUserStore = defineStore('user', () => {
  // ==========================================================================
  // State (상태): 스토어의 핵심 데이터
  // ==========================================================================

  /**
   * @type {import('vue').Ref<string|null>}
   * @description 현재 로그인된 사용자의 정보. 초기값은 null입니다.
   * TODO: 실제 사용자 객체 구조에 맞게 타입을 정의해야 합니다. (e.g., { id, name, email, ... })
   */
  const currentUser = ref(null);

  /**
   * @type {import('vue').Ref<string|null>}
   * @description 서버로부터 발급받은 인증 토큰(JWT).
   */
  const authToken = ref(localStorage.getItem('accessToken')||null);


  // ==========================================================================
  // Getters (게터): 상태를 기반으로 계산된 값을 제공
  // ==========================================================================

  /**
   * @type {import('vue').ComputedRef<boolean>}
   * @description 사용자의 로그인 여부를 반환합니다.
   */
  //const isLoggedIn = computed(() => !!authToken.value && !!currentUser.value);
  const isLoggedIn = computed(() => {
    return !!authToken.value;
  });

  /**
   * @type {import('vue').ComputedRef<boolean>}
   * @description 현재 사용자가 관리자 권한을 가졌는지 여부를 반환합니다.
   * TODO: 실제 사용자 객체의 role 필드 등을 확인하도록 로직을 수정해야 합니다.
   */
  const isAdmin = computed(() => {
    // 임시 로직: currentUser 객체가 있고, role이 'ADMIN'인 경우를 가정
    return currentUser.value && currentUser.value.role === 'ADMIN';
  });


  // ==========================================================================
  // Actions (액션): 상태를 변경하는 메서드
  // ==========================================================================

  /**
   * @description 로그인 성공 후, 사용자 정보와 토큰을 상태에 저장합니다.
   * @param {{ user: object, token: string }} payload - 로그인 API 응답 데이터
   */
  function setLoginInfo(user, token) {
    currentUser.value = user;
    authToken.value = token;
    // TODO: 토큰을 localStorage에 저장하여 페이지 새로고침 시에도 로그인 유지
    localStorage.setItem('accessToken', token);
  }

  /**
   * @description 로그아웃 시, 모든 사용자 관련 상태를 초기화합니다.
   */
  function logout() {
    currentUser.value = null;
    authToken.value = null;
    // TODO: localStorage에 저장된 토큰도 삭제
    localStorage.removeItem('accessToken');
  }

  /**
   * @description 토큰은 존재하나 사용자 정보가 없을 때, 서버에서 정보를 가져와 복구
   */
  const fetchUser = async () => {
    if(!authToken.value) return;
    try {
      const response = await apiClient.get('/member/me');
      currentUser.value = response.data.member;

    } catch (error) {
      if( error.response.status !== 401 ){
        console.error('사용자 정보 가져오기 실패, 토큰 만료 혹은 유효하지 않음.', error);
        logout();
      }
    }
  };

  // 스토어에서 외부로 노출할 상태, 게터, 액션을 반환합니다.
  return {
    // State
    currentUser,
    authToken,
    // Getters
    isLoggedIn,
    isAdmin,
    // Actions
    setLoginInfo,
    logout,
    fetchUser,
  };
});
