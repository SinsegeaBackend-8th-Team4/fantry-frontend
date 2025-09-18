import { createRouter, createWebHistory } from 'vue-router';
import { useUserStore } from '@/stores/userStore';
import { useUiStore } from '@/stores/uiStore';
import userRoutes from './userRoutes';
import adminRoutes from './adminRoutes';

/**
 * Vue Router 설정의 중심 파일입니다.
 * - 사용자/관리자 라우트 모듈을 통합합니다.
 * - 전역 네비게이션 가드를 설정하여 인증 및 권한을 검사합니다.
 * - 페이지 전환 시 스크롤 동작을 제어합니다.
 */
const routes = [userRoutes, adminRoutes];

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
  scrollBehavior: () => ({ top: 0 }), // 페이지 전환 시 항상 최상단으로 스크롤
});

// 전역 네비게이션 가드: 모든 페이지 이동 전에 실행됩니다.
router.beforeEach((to, from, next) => {
  const userStore = useUserStore();
  const uiStore = useUiStore();

  // 1. 페이지 이동 시작 시 로딩 인디케이터를 활성화합니다.
  uiStore.startLoading();

  // --- 개발 편의성을 위해 로그인 및 권한 검사 임시 비활성화 ---
  /*
  // 2. 인증이 필요한 페이지에 비로그인 상태로 접근하는 경우를 처리합니다.
  if (to.meta.requiresAuth && !userStore.isLoggedIn) {
    alert('로그인이 필요한 서비스입니다.');
    return next('/login'); // 로그인 페이지로 리디렉션합니다.
  }

  // 3. 관리자 페이지에 일반 사용자가 접근하는 경우를 처리합니다.
  if (to.meta.isAdmin && !userStore.isAdmin) {
    alert('접근 권한이 없습니다.');
    return next('/'); // 메인 페이지로 리디렉션합니다.
  }
  */

  // 4. 모든 검사를 통과한 경우, 요청된 라우트로 정상적으로 이동합니다.
  next();
});

// 전역 후행 가드: 모든 페이지 이동이 완료된 후 실행됩니다.
router.afterEach(() => {
  const uiStore = useUiStore();
  uiStore.stopLoading();
});

// 라우트 에러 시 로딩 상태가 남지 않도록 처리
router.onError(() => {
  const uiStore = useUiStore();
  uiStore.stopLoading();
});

export default router;