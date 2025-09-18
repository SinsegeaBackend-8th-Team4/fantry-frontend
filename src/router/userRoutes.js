// src/router/userRoutes.js

/**
 * 사용자(User) 영역의 라우팅 설정입니다.
 * '/' 경로 하위의 모든 페이지를 관리합니다.
 */

// --- 레이아웃 ---
import UserLayout from '@/layouts/UserLayout.vue';

// --- 페이지 컴포넌트 (Lazy Loading) ---
const HomePage = () => import('@/pages/HomePage.vue');
const LoginPage = () => import('@/pages/LoginPage.vue');
const ProductListPage = () => import('@/pages/product/ProductListPage.vue');
const ProductDetailPage = () => import('@/pages/product/ProductDetailPage.vue');
// 검수 페이지 컴포넌트
const InspectionStep1Page = () => import('@/pages/user/inspection/Step1Page.vue');
const InspectionStep2Page = () => import('@/pages/user/inspection/Step2Page.vue');
const InspectionStep3Page = () => import('@/pages/user/inspection/Step3Page.vue');

const userRoutes = {
  path: '/',
  component: UserLayout,
  children: [
    {
      path: '',
      name: 'Home',
      component: HomePage,
    },
    {
      path: 'login',
      name: 'Login',
      component: LoginPage,
      meta: { requiredLogin: false },
    },
    {
      path: 'product',
      name: 'ProductList',
      component: ProductListPage,
      meta: { requiredLogin: false },
    },
    {
      path: 'product/detail/:id',
      name: 'ProductDetail',
      component: ProductDetailPage,
      meta: { requiresAuth: true },
    },
    // 검수
    {
      path: 'inspection/step1',
      name: 'InspectionStep1',
      component: InspectionStep1Page,
      meta: {requiredLogin: true },
    },
    {
      path: 'inspection/step2',
      name: 'InspectionStep2',
      component: InspectionStep2Page,
      meta: {requiredLogin: true },
    },
    {
      path: 'inspection/step3',
      name: 'InspectionStep3',
      component: InspectionStep3Page,
      meta: {requiredLogin: true },
    },
  ],
};

export default userRoutes;
