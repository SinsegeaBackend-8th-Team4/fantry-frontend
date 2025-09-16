import { createRouter, createWebHistory } from 'vue-router'
import { useUserStore } from '@/stores/userStore'

// 레이아웃 컴포넌트들을 가져옵니다.
// 레이아웃은 여러 페이지에서 공통적으로 사용되는 뼈대(헤더, 푸터 등)라고 생각하면 쉬워요.
import UserLayout from '@/layouts/UserLayout.vue'
import AdminLayout from '@/layouts/AdminLayout.vue'

// 페이지 컴포넌트들을 가져옵니다.
// 실제 컨텐츠가 표시되는 개별 페이지들입니다.
import HomePage from '@/pages/HomePage.vue'
import LoginPage from '@/pages/LoginPage.vue'
import ProductListPage from '@/pages/product/ProductListPage.vue'
import ProductDetailPage from '@/pages/product/ProductDetailPage.vue'
import AdminDashboardPage from '@/pages/admin/DashboardPage.vue'


// 라우트(경로) 목록을 정의합니다.
// 웹사이트의 각 페이지 경로와 어떤 컴포넌트를 보여줄지 짝지어주는 곳이에요.
const routes = [
  // 사용자 페이지들 (UserLayout 사용)
  {
    path: '/',
    component: UserLayout, // 이 경로와 하위 경로들은 모두 UserLayout 안에서 보여집니다.
    children: [
      {
        path: '', // path가 비어있으면 기본 페이지가 됩니다. (예: http://localhost:5173/)
        name: 'Home',
        component: HomePage,
      },
      {
        path: 'login', // (예: http://localhost:5173/login)
        name: 'Login',
        component: LoginPage,
        meta: { requiredLogin: false }, // meta 정보: 페이지에 대한 추가 데이터 (여기선 로그인이 필요 없는 페이지로 표시)
      },
      {
        path: 'product',
        name: 'ProductList',
        component: ProductListPage,
        meta: { requiredLogin: false },
      },
      {
        path: 'product/detail/:id', // ':id'는 동적인 값(파라미터)을 의미해요. 상품 ID가 들어오겠죠?
        name: 'ProductDetail',
        component: ProductDetailPage,
        meta: { requiresAuth: true }, // 이 페이지는 로그인이 필요하다고 표시!
      },
    ]
  },
  
  // 관리자 페이지들 (AdminLayout 사용)
  {
    path: '/admin',
    component: AdminLayout, // '/admin'으로 시작하는 모든 경로는 AdminLayout 안에서 보여집니다.
    // beforeEnter: ... // 특정 경로에 들어오기 전에만 실행할 로직이 있다면 여기에! (지금은 전역으로 처리 중)
    children: [
      {
        path: '', // '/admin' 경로로 접속하면 바로 대시보드가 보입니다.
        name: 'AdminDashboard',
        component: AdminDashboardPage,
        // meta: { requiresAdmin: true } // 나중에 관리자 권한 체크가 필요하면 이런 식으로 meta 정보를 추가할 수 있어요.
      },
    ]
  },
]

// Vue Router 인스턴스를 생성합니다.
const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL), // 웹 브라우저의 history API를 사용해 URL을 관리해요. (뒤로가기/앞으로가기 가능)
  routes: routes, // 위에서 정의한 경로 목록을 사용합니다.
})

// 네비게이션 가드(Navigation Guard): 페이지 이동이 일어나기 전에 항상 실행되는 부분
// 모든 페이지 이동을 감시하면서 특정 조건(예: 로그인 여부)에 따라 접근을 제어할 수 있어요.
router.beforeEach((to, from, next) => {
  const userStore = useUserStore() // Pinia 스토어에서 사용자 로그인 정보를 가져옵니다.

  // 이동하려는 페이지(to)가 로그인이 필요한지(meta.requiresAuth) 확인하고,
  // 로그인이 되어있지 않다면(!userStore.isLoggedIn) 로그인 페이지로 보냅니다.
  if (to.meta.requiresAuth && !userStore.isLoggedIn) {
    alert('로그인이 필요한 서비스입니다.')
    next('/login') // '/login' 경로로 리다이렉트
  } else {
    next() // 그 외의 경우는 원래 이동하려던 페이지로 이동을 허용합니다.
  }
})


export default router