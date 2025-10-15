// src/router/adminRoutes.js

/**
 * 관리자(Admin) 영역의 라우팅 설정입니다.
 * '/admin' 경로 하위의 모든 페이지를 관리합니다.
 */

// --- 레이아웃 ---
import AdminLayout from '@/layouts/AdminLayout.vue'
import AdminContentLayout from '@/pages/admin/AdminContentLayout.vue'

// --- 페이지 컴포넌트 (Lazy Loading) ---

// 대시보드
const MainDashboardPage = () => import('@/pages/admin/dashboard/MainDashboardPage.vue')

// 정산 관리
const SettlementDashboardPage = () => import('@/pages/admin/settlement/SettlementDashboardPage.vue')
const SettlementListPage = () => import('@/pages/admin/settlement/SettlementListPage.vue')
const SettlementListSamplePage = () => import('@/pages/admin/settlement/SettlementListSamplePage.vue')

// 반품 관리
const ReturnDashboardPage = () => import('@/pages/admin/return/ReturnDashboardPage.vue')
const ReturnListPage = () => import('@/pages/admin/return/ReturnListPage.vue')

// CS 관리
const CsDashboardPage = () => import('@/pages/admin/cs/CsDashboardPage.vue')
const CsListPage = () => import('@/pages/admin/cs/CsListPage.vue')
const CsWritePage = () => import('@/pages/admin/cs/CsWritePage.vue') // 글쓰기 페이지 import

// 검수 관리
const InspectionDashboardPage = () => import('@/pages/admin/inspection/InspectionDashboardPage.vue')
const OnlineInspectionListPage = () => import('@/pages/admin/inspection/OnlineInspectionListPage.vue')
const OnlineInspectionDetailPage = () => import('@/pages/admin/inspection/OnlineInspectionDetailPage.vue')
const OfflineInspectionListPage = () => import('@/pages/admin/inspection/OfflineInspectionListPage.vue')
const OfflineInspectionDetailPage = () => import('@/pages/admin/inspection/OfflineInspectionDetailPage.vue')

// 재고 관리
const InventoryDashboardPage = () => import('@/pages/admin/inventory/InventoryDashboardPage.vue')
const InventoryListPage = () => import('@/pages/admin/inventory/InventoryListPage.vue')

// 회원 관리
const MemberDashboardPage = () => import('@/pages/admin/member/MemberDashboardPage.vue')
const MemberListPage = () => import('@/pages/admin/member/MemberListPage.vue')
const MemberDetailPage = () => import('@/pages/admin/member/MemberDetailPage.vue')
const MemberEditPage = () => import('@/pages/admin/member/MemberEditPage.vue')
const MemberCreatePage = () => import('@/pages/admin/member/MemberCreatePage.vue')
// 회원 관리 - 신고 관련
const ReportListPage = () => import('@/pages/admin/member/ReportListPage.vue')
const ReportDetailPage = () => import('@/pages/admin/member/ReportDetailPage.vue')
const ReportCreatePage = () => import('@/pages/admin/member/ReportCreatePage.vue')
const ReportReceiveListPage = () => import('@/pages/admin/member/ReportReceivedListPage.vue')
const ReportReceiveEditPage = () => import('@/pages/admin/member/MemberReceivedEditPage.vue')

// 경매 관리
const AuctionDashboardPage = () => import('@/pages/admin/auction/AuctionDashboardPage.vue')
const AuctionListPage = () => import('@/pages/admin/auction/AuctionListPage.vue')

// 로그인
const AdminLogin = () => import('@/pages/admin/access/AdminLogin.vue')
const AdminSignUp = () => import('@/pages/admin/access/AdminSignup.vue')

const adminRoutes = [
  // 1. 로그인/회원가입 페이지 (인증이 필요 없는 페이지)
  {
    path: '/admin/login',
    name: 'AdminLogin',
    component: AdminLogin,
    meta: { requiresAuth: false, isAdmin: false },
  },
  {
    path: '/admin/signup',
    name: 'AdminSignUp',
    component: AdminSignUp,
    meta: { requiresAuth: false, isAdmin: false },
  },
  // 2. 관리자 전용 페이지 (인증이 필요한 페이지)
  {
    path: '/admin',
    component: AdminLayout,
    meta: { requiresAuth: true, isAdmin: true },
    children: [
      {
        path: '', // '/admin' 경로에 대한 기본 페이지
        component: AdminContentLayout,
        redirect: { name: 'AdminDashboard' }, // 대시보드로 리디렉션
        children: [
        // --- 대시보드 ---
        {
          path: '',
          name: 'AdminDashboard',
          component: MainDashboardPage,
          meta: { title: 'Dashboard', icon: 'fas fa-fw fa-tachometer-alt', menu: true }, // ⭐️ menu: true 추가
        },
        // --- 정산 관리 ---
        {
          path: 'settlement',
          redirect: { name: 'AdminSettlementDashboard' },
          meta: { title: '정산관리', icon: 'fas fa-fw fa-dollar-sign', menu: true },
          children: [
            { path: 'dashboard', name: 'AdminSettlementDashboard', component: SettlementDashboardPage },
            { path: 'list', name: 'AdminSettlementList', component: SettlementListPage },
          ],
        },
        // --- 반품 관리 ---
        {
          path: 'return',
          redirect: { name: 'AdminReturnDashboard' },
          meta: { title: '반품관리', icon: 'fas fa-fw fa-undo', menu: true },
          children: [
            { path: 'dashboard', name: 'AdminReturnDashboard', component: ReturnDashboardPage },
            { path: 'list', name: 'AdminReturnList', component: ReturnListPage },
          ],
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
          ],
        },
        // --- 검수 관리 ---
        {
          path: 'inspection',
          redirect: { name: 'AdminInspectionDashboard' },
          meta: { title: '검수관리', icon: 'fas fa-fw fa-check-circle', menu: true },
          children: [
            { path: 'dashboard', name: 'AdminInspectionDashboard', component: InspectionDashboardPage },
            { path: 'online', name: 'AdminOnlineInspectionList', component: OnlineInspectionListPage, meta: { title: '온라인 1차 검수' } },
            { path: 'online/:id', name: 'AdminOnlineInspectionDetail', component: OnlineInspectionDetailPage, meta: { title: '온라인 1차 상세', hidden: true } },
            { path: 'offline', name: 'AdminOfflineInspectionList', component: OfflineInspectionListPage, meta: { title: '오프라인 2차 검수' } },
            { path: 'offline/:id', name: 'AdminOfflineInspectionDetail', component: OfflineInspectionDetailPage, meta: { title: '오프라인 2차 상세', hidden: true } },
          ],
        },
        // --- 재고 관리 ---
        {
          path: 'inventory',
          redirect: { name: 'AdminInventoryDashboard' },
          meta: { title: '재고관리', icon: 'fas fa-fw fa-boxes', menu: true },
          children: [
            { path: 'dashboard', name: 'AdminInventoryDashboard', component: InventoryDashboardPage },
            { path: 'list', name: 'AdminInventoryList', component: InventoryListPage },
          ],
        },
        // --- 회원 관리 ---
        {
          path: 'member',
          redirect: { name: 'AdminMemberDashboard' },
          meta: { title: '회원관리', icon: 'fas fa-fw fa-users', menu: true },
          children: [
            { path: 'dashboard', name: 'AdminMemberDashboard', component: MemberDashboardPage },
            { path: 'list', name: 'AdminMemberList', component: MemberListPage, meta: { title: '회원목록' } },
            { path: 'create', name: 'AdminMemberCreate', component: MemberCreatePage, meta: { title: '회원등록' } },
            { path: 'reportList', name: 'AdminReportList', component: ReportListPage, meta: { title: '신고관리' } },
            { path: 'reportReceiveList', name: 'AdminReportReceiveList', component: ReportReceiveListPage, meta: { title: '접수된 신고' } },
            { path: 'detail/:memberId', name: 'AdminMemberDetail', component: MemberDetailPage, props: true, meta: { menu: false, hidden: true } },
            { path: 'edit/:memberId', name: 'AdminMemberEdit', component: MemberEditPage, props: true, meta: { menu: false, hidden: true } },
            { path: 'reportDetail/:reportId', name: 'AdminReportDetail', component: ReportDetailPage, props: true, meta: { menu: false, hidden: true } },
            { path: 'reportCreate', name: 'AdminReportCreate', component: ReportCreatePage, meta: { menu: false, hidden: true } },
            { path: 'reportReceiveEdit/:reportId', name: 'AdminReportReceiveEdit', component: ReportReceiveEditPage, props: true, meta: { menu: false, hidden: true } },
          ],
        },
        // --- 경매 관리 ---
        {
          path: 'auction',
          redirect: { name: 'AdminAuctionDashboard' },
          meta: { title: '경매관리', icon: 'fas fa-fw fa-gavel', menu: true },
          children: [
            { path: 'dashboard', name: 'AdminAuctionDashboard', component: AuctionDashboardPage },
            { path: 'list', name: 'AdminAuctionList', component: AuctionListPage },
          ],
        },
        // --- 주문 관리 (추가) ---
        {
          path: 'order',
          redirect: { name: 'AdminOrderList' },
          meta: { title: '주문관리', icon: 'fas fa-fw fa-receipt', menu: true },
          children: [
            { 
              path: 'list', 
              name: 'AdminOrderList', 
              component: () => import('@/pages/admin/order/OrderListPage.vue'), 
              meta: { title: '주문 목록' } 
            },
            { 
              path: 'detail/:orderId', 
              name: 'AdminOrderDetail', 
              component: () => import('@/pages/admin/order/OrderDetailPage.vue'), 
              props: true, 
              meta: { menu: false, hidden: true, title: '주문 상세' } 
            },
          ],
        },

        // --- 입찰 관리 (추가) ---
        {
          path: 'bid',
          redirect: { name: 'AdminBidList' },
          meta: { title: '입찰관리', icon: 'fas fa-fw fa-hand-paper', menu: true },
          children: [
            {
              path: 'list',
              name: 'AdminBidList',
              component: () => import('@/pages/admin/bid/BidListPage.vue'),
              meta: { title: '입찰 목록' }
            },
          ],
        },
      ],
    }
  ]
  }
];

export default adminRoutes
