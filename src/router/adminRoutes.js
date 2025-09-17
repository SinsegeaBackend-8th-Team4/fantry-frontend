// src/router/adminRoutes.js

/**
 * 관리자(Admin) 영역의 라우팅 설정입니다.
 * '/admin' 경로 하위의 모든 페이지를 관리합니다.
 */

// --- 레이아웃 ---
import AdminLayout from '@/layouts/AdminLayout.vue';
import AdminContentLayout from '@/pages/admin/AdminContentLayout.vue';

// --- 페이지 컴포넌트 (Lazy Loading) ---

// 대시보드
const MainDashboardPage = () => import('@/pages/admin/dashboard/MainDashboardPage.vue');

// 정산 관리
const SettlementDashboardPage = () => import('@/pages/admin/settlement/SettlementDashboardPage.vue');
const SettlementListPage = () => import('@/pages/admin/settlement/SettlementListPage.vue');

// 반품 관리
const ReturnDashboardPage = () => import('@/pages/admin/return/ReturnDashboardPage.vue');
const ReturnListPage = () => import('@/pages/admin/return/ReturnListPage.vue');

// CS 관리
const CsDashboardPage = () => import('@/pages/admin/cs/CsDashboardPage.vue');
const CsListPage = () => import('@/pages/admin/cs/CsListPage.vue');
const CsWritePage = () => import('@/pages/admin/cs/CsWritePage.vue'); // 글쓰기 페이지 import

// 검수 관리
const InspectionDashboardPage = () => import('@/pages/admin/inspection/InspectionDashboardPage.vue');
const InspectionListPage = () => import('@/pages/admin/inspection/InspectionListPage.vue');

// 재고 관리
const InventoryDashboardPage = () => import('@/pages/admin/inventory/InventoryDashboardPage.vue');
const InventoryListPage = () => import('@/pages/admin/inventory/InventoryListPage.vue');

// 회원 관리
const MemberDashboardPage = () => import('@/pages/admin/member/MemberDashboardPage.vue');
const MemberListPage = () => import('@/pages/admin/member/MemberListPage.vue');

// 경매 관리
const AuctionDashboardPage = () => import('@/pages/admin/auction/AuctionDashboardPage.vue');
const AuctionListPage = () => import('@/pages/admin/auction/AuctionListPage.vue');


const adminRoutes = {
  path: '/admin',
  component: AdminLayout,
  meta: { requiresAuth: true, isAdmin: true },
  children: [
    {
      path: '',
      component: AdminContentLayout, // 모든 관리자 컨텐츠 페이지의 상위 레이아웃
      children: [
        // --- 대시보드 ---
        {
          path: '',
          name: 'AdminDashboard',
          component: MainDashboardPage,
          meta: { title: '메인 대시보드', icon: 'fas fa-fw fa-tachometer-alt' }
        },
        // --- 정산 관리 ---
        {
          path: 'settlement',
          redirect: { name: 'AdminSettlementDashboard' },
          meta: { title: '정산관리', icon: 'fas fa-fw fa-dollar-sign', menu: true },
          children: [
            { path: 'dashboard', name: 'AdminSettlementDashboard', component: SettlementDashboardPage },
            { path: 'list', name: 'AdminSettlementList', component: SettlementListPage },
          ]
        },
        // --- 반품 관리 ---
        {
          path: 'return',
          redirect: { name: 'AdminReturnDashboard' },
          meta: { title: '반품관리', icon: 'fas fa-fw fa-undo', menu: true },
          children: [
            { path: 'dashboard', name: 'AdminReturnDashboard', component: ReturnDashboardPage },
            { path: 'list', name: 'AdminReturnList', component: ReturnListPage },
          ]
        },
        // --- CS 관리 ---
        {
          path: 'cs',
          redirect: { name: 'AdminCsDashboard' },
          meta: { title: 'CS관리', icon: 'fas fa-fw fa-headset', menu: true },
          children: [
            { path: 'dashboard', name: 'AdminCsDashboard', component: CsDashboardPage },
            { path: 'list', name: 'AdminCsList', component: CsListPage },
            { path: 'write', name: 'AdminCsWrite', component: CsWritePage }, // 글쓰기 페이지 라우트 추가
          ]
        },
        // --- 검수 관리 ---
        {
          path: 'inspection',
          redirect: { name: 'AdminInspectionDashboard' },
          meta: { title: '검수관리', icon: 'fas fa-fw fa-check-circle', menu: true },
          children: [
            { path: 'dashboard', name: 'AdminInspectionDashboard', component: InspectionDashboardPage },
            { path: 'list', name: 'AdminInspectionList', component: InspectionListPage },
          ]
        },
        // --- 재고 관리 ---
        {
          path: 'inventory',
          redirect: { name: 'AdminInventoryDashboard' },
          meta: { title: '재고관리', icon: 'fas fa-fw fa-boxes', menu: true },
          children: [
            { path: 'dashboard', name: 'AdminInventoryDashboard', component: InventoryDashboardPage },
            { path: 'list', name: 'AdminInventoryList', component: InventoryListPage },
          ]
        },
        // --- 회원 관리 ---
        {
          path: 'member',
          redirect: { name: 'AdminMemberDashboard' },
          meta: { title: '회원관리', icon: 'fas fa-fw fa-users', menu: true },
          children: [
            { path: 'dashboard', name: 'AdminMemberDashboard', component: MemberDashboardPage },
            { path: 'list', name: 'AdminMemberList', component: MemberListPage },
          ]
        },
        // --- 경매 관리 ---
        {
          path: 'auction',
          redirect: { name: 'AdminAuctionDashboard' },
          meta: { title: '경매관리', icon: 'fas fa-fw fa-gavel', menu: true },
          children: [
            { path: 'dashboard', name: 'AdminAuctionDashboard', component: AuctionDashboardPage },
            { path: 'list', name: 'AdminAuctionList', component: AuctionListPage },
          ]
        },
      ]
    },
  ]
};

export default adminRoutes;
