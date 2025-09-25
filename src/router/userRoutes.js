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
const ProductAuctionPage = () => import('@/pages/product/ProductAuctionPage.vue');

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
      meta: { requiresAuth: false },
    },
        {
      path: 'product/auction',
      name: 'ProducAuction',
      component: ProductAuctionPage,
      meta: { requiresAuth: false },
    }
  ],
};

export default userRoutes;
