import HomePage from '@/pages/HomePage.vue'
import LoginPage from '@/pages/LoginPage.vue'
import SignupTerms from '@/pages/access/user/SignupTerms.vue'
import SignupForm from '@/pages/access/user/SignupForm.vue'
import SignupComplete from '@/pages/access/user/SignupComplete.vue'
import SignupFail from '@/pages/access/user/SignupFail.vue'
import ProductDetailPage from '@/pages/product/ProductDetailPage.vue'
import ProductListPage from '@/pages/product/ProductListPage.vue'
import { createRouter, createWebHistory } from 'vue-router'

//라우트 할 페이지 리스트
const routes = [
  {
    path: '/',
    name: 'Home',
    component: HomePage,
  },
  {
    path: '/login',
    name: 'Login',
    component: LoginPage,
    meta: { requiredLogin: false },
  },
  {
    path: '/signup',
    children: [
      {
        path: 'terms',
        name: 'SignupTerms',
        component: SignupTerms,
        meta: { requiredLogin: false }
      },
      {
        path: 'form',
        name: 'SignupForm',
        component: SignupForm,
        meta: { requiredLogin: false }
      },
      {
        path: 'complete',
        name: "SignupComplete",
        component: SignupComplete,
        meta: { requiredLogin: false }
      },
      {
        path: 'fail',
        name: "SignupFail",
        component: SignupFail,
        meta: { requiredLogin: false }
      }
    ]
  },
  {
    path: '/product',
    name: 'Product',
    component: ProductListPage,
    meta: { requiredLogin: false },
  },
  {
    path: '/product/detail',
    name: 'Detail',
    component: ProductDetailPage,
    meta: { requiredLogin: true },
  },
]
//라우터 생성
const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: routes,
})

export default router
