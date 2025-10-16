// src/router/userRoutes.js

/**
 * 사용자(User) 영역의 라우팅 설정입니다.
 * '/' 경로 하위의 모든 페이지를 관리합니다.
 */

// --- 레이아웃 ---
import UserLayout from '@/layouts/UserLayout.vue'
import CheckoutPage from '@/pages/payment/CheckoutPage.vue'
import UserInfoPage from '@/pages/payment/UserInfoPage.vue'
import PaymentCompletePage from '@/pages/payment/PaymentCompletePage.vue'

// --- 페이지 컴포넌트 (Lazy Loading) ---
const HomePage = () => import('@/pages/HomePage.vue');
const LoginPage = () => import('@/pages/user/access/LoginPage.vue');
const LoginFind = () => import('@/pages/user/access/LoginFind.vue');
const LoginFindSuccess = () => import('@/pages/user/access/LoginFindSuccess.vue');
const LoginResetPwd = () => import('@/pages/user/access/LoginResetPwd.vue');
const LoginFail = () => import('@/pages/user/access/LoginFail.vue');
const SignupTerms = () => import('@/pages/user/access/SignupTerms.vue');
const SignupForm = () => import('@/pages/user/access/SignupForm.vue');
const SignupComplete = () => import('@/pages/user/access/SignupComplete.vue');
const SignupFail = () => import('@/pages/user/access/SignupFail.vue');
const ProductListPage = () => import('@/pages/product/ProductListPage.vue');
const ProductDetailPage = () => import('@/pages/product/ProductDetailPage.vue');
const ProductAuctionPage = () => import('@/pages/product/ProductAuctionPage.vue');
const ProductAuctionPolicyPage = () => import('@/pages/product/ProductAuctionPolicyPage.vue');
// 검수 페이지 컴포넌트
const InspectionStep1Page = () => import('@/pages/user/inspection/Step1Page.vue')
const InspectionStep2Page = () => import('@/pages/user/inspection/Step2Page.vue')
const InspectionStep3Page = () => import('@/pages/user/inspection/Step3Page.vue')
const InspectionPolicyPage = () => import('@/pages/user/inspection/InspectionPolicyPage.vue'); 
// 마이페이지
const MyPageLayout = () => import('@/pages/user/mypage/MyPage.vue')

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
      children: [
        {
          path: '',
          name: 'Login',
          component: LoginPage,
          meta: { requiredLogin: false },
        },
        {
          path: 'find',
          name: 'LoginFind',
          component: LoginFind,
          meta: { requiredLogin: false },
        },
        {
          path: 'findSuccess/:foundEmail',
          name: 'LoginFindSuccess',
          component: LoginFindSuccess,
          meta: { requiredLogin: false },
        },
        {
          path: 'resetPwd',
          name: 'LoginResetPwd',
          component: LoginResetPwd,
          meta: { requiredLogin: false },
        },
        {
          path: 'fail',
          name: 'LoginFail',
          component: LoginFail,
          meta: { requiredLogin: false },
        },
      ],
    },
    {
      path: 'signup',
      children: [
        {
          path: 'terms',
          name: 'SignupTerms',
          component: SignupTerms,
          meta: { requiredLogin: false },
        },
        {
          path: 'form',
          name: 'SignupForm',
          component: SignupForm,
          meta: { requiredLogin: false },
        },
        {
          path: 'complete',
          name: 'SignupComplete',
          component: SignupComplete,
          meta: { requiredLogin: false },
        },
        {
          path: 'fail',
          name: 'SignupFail',
          component: SignupFail,
          meta: { requiredLogin: false },
        },
      ],
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
      path: 'product/auction/:id',
      name: 'ProducAuction',
      component: ProductAuctionPage,
      meta: { requiresAuth: false },
    },
    {
      path: 'product/auction-policy',
      name: 'ProductAuctionPolicy',
      component: ProductAuctionPolicyPage,
      meta: { requiresAuth: false },
    },
    // 검수
    {
      path: 'inspection/step1',
      name: 'InspectionStep1',
      component: InspectionStep1Page,
      meta: { requiresAuth: true },
    },
    {
      path: 'inspection/step2',
      name: 'InspectionStep2',
      component: InspectionStep2Page,
      meta: { requiresAuth: true },
    },
    {
      path: 'inspection/step3',
      name: 'InspectionStep3',
      component: InspectionStep3Page,
      meta: { requiresAuth: true },
    },
    {
      path: 'inspection/policy',
      name: 'InspectionPolicy',
      component: InspectionPolicyPage,
      meta: { requiresAuth: false },
    },
     // 마이페이지
    {
      path: 'mypage',
      name: 'MyPageLayout',
      component: MyPageLayout,
      meta: { requiresAuth: true },
    },
    {
      path: 'order',
      children: [
        {
          path: 'info',
          name: 'Info',
          component: UserInfoPage,
          meta: { requiredLogin: false },
        },
        {
          path: 'checkout',
          name: 'Checkout',
          component: CheckoutPage,
          meta: { requiredLogin: false },
        },
        {
          path: 'complete',
          name: 'Complete',
          component: PaymentCompletePage,
          meta: { requiredLogin: false },
        },
      ],
    },
    // CS (고객 서비스) 관련 페이지
    {
      path: 'cs',
      name: 'CustomerService',
      component: () => import('@/pages/user/cs/CustomerServiceHomePage.vue'), // Default component for /cs
      meta: { title: '고객센터' },
      children: [
        // 공지사항
        {
          path: 'notice',
          name: 'UserNoticeList',
          component: () => import('@/pages/user/cs/UserNoticeListPage.vue'),
          meta: { requiresAuth: false, title: '공지사항' },
        },
        {
          path: 'notice/:noticeId',
          name: 'UserNoticeDetail',
          component: () => import('@/pages/user/cs/UserNoticeDetailPage.vue'),
          props: true,
          meta: { requiresAuth: false, hidden: true, title: '공지사항 상세' },
        },
        // 자주 묻는 질문 (FAQ)
        {
          path: 'faq',
          name: 'UserFaqList',
          component: () => import('@/pages/user/cs/UserFaqListPage.vue'),
          meta: { requiresAuth: false, title: '자주 묻는 질문' },
        },
        {
          path: 'faq/:faqId',
          name: 'UserFaqDetail',
          component: () => import('@/pages/user/cs/UserFaqDetailPage.vue'),
          props: true,
          meta: { requiresAuth: false, hidden: true, title: '자주 묻는 질문 상세' },
        },
        // 1:1 문의
        {
          path: 'inquiry',
          name: 'UserInquiryList',
          component: () => import('@/pages/user/cs/UserInquiryListPage.vue'),
          meta: { requiresAuth: true, title: '나의 1:1 문의' },
        },
        {
          path: 'inquiry/create',
          name: 'UserInquiryCreate',
          component: () => import('@/pages/user/cs/UserInquiryCreatePage.vue'),
          meta: { requiresAuth: true, title: '1:1 문의하기' },
        },
        {
          path: 'inquiry/:inquiryId',
          name: 'UserInquiryDetail',
          component: () => import('@/pages/user/cs/UserInquiryDetailPage.vue'),
          props: true,
          meta: { requiresAuth: true, hidden: true, title: '1:1 문의 상세' },
        },
      ],
    },
  ],
}

export default userRoutes
