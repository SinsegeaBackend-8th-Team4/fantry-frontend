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
const ReturnDetailPage = () => import('@/pages/admin/return/ReturnDetailPage.vue')

// CS 관리
const InquiryDashboardPage = () => import('@/pages/admin/cs/InquiryDashboardPage.vue')
// const CsListPage = () => import('@/pages/admin/cs/CsListPage.vue') // 기존 것 주석 처리
const AdminInquiryListPage = () => import('@/pages/admin/cs/AdminInquiryListPage.vue') // 새로 추가
const AdminInquiryDetailPage = () => import('@/pages/admin/cs/AdminInquiryDetailPage.vue') // 새로 추가

const FaqListPage = () => import('@/pages/admin/cs/FaqListPage.vue')
const FaqDetailPage = () => import('@/pages/admin/cs/FaqDetailPage.vue')
const FaqCreatePage = () => import('@/pages/admin/cs/FaqCreatePage.vue')
const FaqEditPage = () => import('@/pages/admin/cs/FaqEditPage.vue')

const NoticeListPage = () => import('@/pages/admin/cs/NoticeListPage.vue')
const NoticeDetailPage = () => import('@/pages/admin/cs/NoticeDetailPage.vue')
const NoticeCreatePage = () => import('@/pages/admin/cs/NoticeCreatePage.vue')
const NoticeEditPage = () => import('@/pages/admin/cs/NoticeEditPage.vue')
const NoticeDashboardPage = () => import('@/pages/admin/cs/NoticeDashboardPage.vue')

const FaqDashboardPage = () => import('@/pages/admin/cs/FaqDashboardPage.vue')

// 검수 관리
const InspectionDashboardPage = () => import('@/pages/admin/inspection/InspectionDashboardPage.vue')
const OnlineInspectionListPage = () => import('@/pages/admin/inspection/OnlineInspectionListPage.vue')
const OnlineInspectionDetailPage = () => import('@/pages/admin/inspection/OnlineInspectionDetailPage.vue')
const OfflineInspectionListPage = () => import('@/pages/admin/inspection/OfflineInspectionListPage.vue')
const OfflineInspectionDetailPage = () => import('@/pages/admin/inspection/OfflineInspectionDetailPage.vue')
const InspectionHistoryPage = () => import('@/pages/admin/inspection/InspectionHistoryPage.vue')

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

const adminRoutes = {
  path: '/admin',
  component: AdminLayout,
  meta: { requiresAuth: true, isAdmin: true },
  children: [
    {
      path: '',
      component: AdminContentLayout, // 모든 관리자 컨텐츠 페이지의 상위 레이아웃
      children: [
        // --- 로그인 ---
        {
          path: 'login',
          name: 'AdminLogin',
          component: AdminLogin,
          meta: { requiredLogin: false, isAdmin: false, menu: false },
        },
        // --- 회원가입 ---
        {
          path: 'signup',
          name: 'AdminSignUp',
          component: AdminSignUp,
          meta: { requiredLogin: false, isAdmin: false, menu: false },
        },

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
            { path: 'dashboard', name: 'AdminSettlementDashboard', component: SettlementDashboardPage, meta: { title: '정산 대시보드' } },
            { path: 'list', name: 'AdminSettlementList', component: SettlementListPage, meta: { title: '정산 내역' } },
            { path: 'sample', name: 'AdminSettlementListSample', component: SettlementListSamplePage, meta: { title: '샘플 목록' } },
          ],
        },
        // --- 반품 관리 ---
        {
          path: 'return',
          redirect: { name: 'AdminReturnDashboard' },
          meta: { title: '반품관리', icon: 'fas fa-fw fa-undo', menu: true },
          children: [
            { path: 'dashboard', name: 'AdminReturnDashboard', component: ReturnDashboardPage, meta: { title: '반품 현황' } },
            { path: 'list', name: 'AdminReturnList', component: ReturnListPage, meta: { title: '반품 목록' } },
            { path: 'detail/:returnRequestId', name: 'AdminReturnDetail', component: ReturnDetailPage, props: true, meta: { title: '반품 상세', hidden: true } },
          ],
        },
        // --- 문의 관리 ---
        {
          path: 'inquiry',
          redirect: { name: 'AdminInquiryDashboard' },
          meta: { title: '문의 관리', icon: 'fas fa-fw fa-headset', menu: true },
          children: [
            { path: 'dashboard', name: 'AdminInquiryDashboard', component: InquiryDashboardPage, meta: { title: '문의 현황' } },
            { path: 'list', name: 'AdminInquiryList', component: AdminInquiryListPage, meta: { title: '1:1 문의 목록' } },
            { path: 'detail/:inquiryId', name: 'AdminInquiryDetail', component: AdminInquiryDetailPage, props: true, meta: { title: '1:1 문의 상세', hidden: true } },
          ],
        },
        // --- FAQ 관리 ---
        {
          path: 'faq',
          redirect: { name: 'AdminFaqDashboard' },
          meta: { title: 'FAQ 관리', icon: 'fas fa-fw fa-question-circle', menu: true },
          children: [
            { path: 'dashboard', name: 'AdminFaqDashboard', component: FaqDashboardPage, meta: { title: 'FAQ 현황' } },
            { path: 'list', name: 'AdminFaqList', component: FaqListPage, meta: { title: 'FAQ 목록' } },
            { path: 'detail/:faqId', name: 'AdminFaqDetail', component: FaqDetailPage, props: true, meta: { title: 'FAQ 상세', hidden: true } },
            { path: 'create', name: 'AdminFaqCreate', component: FaqCreatePage, meta: { title: 'FAQ 작성', hidden: true } },
            { path: 'edit/:faqId', name: 'AdminFaqEdit', component: FaqEditPage, props: true, meta: { title: 'FAQ 수정', hidden: true } },
          ],
        },
        // --- 공지사항 관리 ---
        {
          path: 'notice',
          redirect: { name: 'AdminNoticeDashboard' },
          meta: { title: '공지사항 관리', icon: 'fas fa-fw fa-bullhorn', menu: true },
          children: [
            { path: 'dashboard', name: 'AdminNoticeDashboard', component: NoticeDashboardPage, meta: { title: '공지사항 현황' } },
            { path: 'list', name: 'AdminNoticeList', component: NoticeListPage, meta: { title: '공지사항 목록' } },
            { path: 'detail/:noticeId', name: 'AdminNoticeDetail', component: NoticeDetailPage, props: true, meta: { title: '공지사항 상세', hidden: true } },
            { path: 'create', name: 'AdminNoticeCreate', component: NoticeCreatePage, meta: { title: '공지사항 작성', hidden: true } },
            { path: 'edit/:noticeId', name: 'AdminNoticeEdit', component: NoticeEditPage, props: true, meta: { title: '공지사항 수정', hidden: true } },
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
            { path: 'history', name: 'AdminInspectionHistory', component: InspectionHistoryPage, meta: { title: '검수 이력' } },
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
      ],
    },
  ],
}

export default adminRoutes