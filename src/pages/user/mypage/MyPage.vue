<script setup>
import { ref, computed } from 'vue'
import ProfileSection from './member/ProfileSection.vue'
import PaymentAccount from './member/PaymentAccount.vue'
import WithdrawalPage from './member/WithdrawalPage.vue'

const activeMenu = ref('account')
const activeSubMenu = ref('profile')

// 컴포넌트 매핑
const componentMap = {
  'profile': ProfileSection,
  'payment-account': PaymentAccount,
  'withdrawal': WithdrawalPage,
  // 다른 메뉴에 대한 컴포넌트도 여기에 추가
}

const currentComponent = computed(()=>{
  return componentMap[activeSubMenu.value] || {
    template: `<div class="placeholder"><p>선택한 메뉴의 콘텐츠가 표시됩니다.</p></div>`
  }
})

const menuItems = [
  {
    id: 'account',
    title: '내 정보 관리',
    icon: '👤',
    subMenus: [
      { id: 'profile', title: '개인정보 관리' },
      { id: 'payment-account', title: '결제 계좌 관리' },
      { id: 'address', title: '배송지 관리' },
      { id: 'withdrawal', title: '회원탈퇴' }
    ]
  },
  {
    id: 'selling',
    title: '판매 관리',
    icon: '💼',
    subMenus: [
      { id: 'my-products', title: '등록 상품 내역' },
      { id: 'inspection', title: '검수 현황' },
      { id: 'sales-history', title: '판매 완료 내역' },
      { id: 'seller-request', title: '판매자 승인 요청' }
    ]
  },
  {
    id: 'buying',
    title: '구매 관리',
    icon: '🛒',
    subMenus: [
      { id: 'auction-history', title: '경매/입찰 내역' },
      { id: 'purchase-history', title: '구매 완료 내역' },
      { id: 'delivery', title: '배송 현황' }
    ]
  },
  {
    id: 'support',
    title: '고객센터',
    icon: '💬',
    subMenus: [
      { id: 'qna-list', title: 'Q&A 내역' },
      { id: 'inquiry', title: '문의 접수' }
    ]
  },
  {
    id: 'report',
    title: '신고 및 제재 관리',
    icon: '⚠️',
    subMenus: [
      { id: 'report-history', title: '신고 내역 확인' },
      { id: 'appeal', title: '신고 구제 요청' }
    ]
  }
]

const selectMenu = (menuId, subMenuId) => {
  activeMenu.value = menuId
  activeSubMenu.value = subMenuId
}

const getContentTitle = () => {
  const menu = menuItems.find(m => m.id === activeMenu.value)
  const subMenu = menu?.subMenus.find(s => s.id === activeSubMenu.value)
  return subMenu?.title || ''
}
</script>

<template>
  <div class="content-page">
    <div class="mypage-container">
      <!-- 좌측 사이드바 -->
      <aside class="sidebar">
        <div class="sidebar-header">
          <h1>마이페이지</h1>
        </div>
        
        <nav class="sidebar-nav">
          <div 
            v-for="menu in menuItems" 
            :key="menu.id" 
            class="menu-section">
            <div class="menu-title">
              <span class="menu-icon">{{ menu.icon }}</span>
              <span>{{ menu.title }}</span>
            </div>
            <ul class="submenu-list">
              <li 
                v-for="subMenu in menu.subMenus" 
                :key="subMenu.id"
                :class="{ active: activeMenu === menu.id && activeSubMenu === subMenu.id }"
                @click="selectMenu(menu.id, subMenu.id)">
                {{ subMenu.title }}
              </li>
            </ul>
          </div>
        </nav>
      </aside>

      <!-- 우측 콘텐츠 영역 -->
      <main class="main-content">
        <div class="content-header">
          <h2>{{ getContentTitle() }}</h2>
        </div>
        
        <div class="content-body">
          <!-- 각 메뉴별 컴포넌트가 들어갈 영역 -->
          <div class="placeholder">
            <component :is="currentComponent" />
          </div>
        </div>
      </main>
    </div>
  </div>
</template>

<style scoped>
.content-page {
  min-height: 100vh;
  background: linear-gradient(135deg, #f5f7fa 0%, #e8ecf3 100%);
  padding: 40px 20px;
}

.mypage-container {
  max-width: 1400px;
  margin: 0 auto;
  display: grid;
  grid-template-columns: 280px 1fr;
  gap: 30px;
  align-items: start;
}

/* 사이드바 스타일 */
.sidebar {
  background: white;
  border-radius: 16px;
  box-shadow: 0 4px 20px rgba(60, 77, 255, 0.08);
  overflow: hidden;
  position: sticky;
  top: 40px;
  max-height: calc(100vh - 80px);
  display: flex;
  flex-direction: column;
}

.sidebar-header {
  background: #3C4DFF;
  padding: 30px 24px;
  color: white;
  flex-shrink: 0;
}

.sidebar-header h1 {
  margin: 0;
  font-size: 24px;
  font-weight: 700;
  color: white
}

.sidebar-nav {
  padding: 20px 0;
  overflow-y: auto;
  flex: 1;
}

.sidebar-nav::-webkit-scrollbar {
  width: 6px;
}

.sidebar-nav::-webkit-scrollbar-track {
  background: transparent;
}

.sidebar-nav::-webkit-scrollbar-thumb {
  background: rgba(60, 77, 255, 0.2);
  border-radius: 3px;
}

.sidebar-nav::-webkit-scrollbar-thumb:hover {
  background: rgba(60, 77, 255, 0.4);
}

.menu-section {
  margin-bottom: 24px;
}

.menu-title {
  padding: 12px 24px;
  font-weight: 700;
  font-size: 14px;
  color: #1a1a1a;
  display: flex;
  align-items: center;
  gap: 10px;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.menu-icon {
  font-size: 18px;
}

.submenu-list {
  list-style: none;
  padding: 0;
  margin: 0;
}

.submenu-list li {
  padding: 12px 24px 12px 56px;
  color: #666;
  cursor: pointer;
  transition: all 0.3s ease;
  font-size: 14px;
  position: relative;
}

.submenu-list li::before {
  content: '';
  position: absolute;
  left: 0;
  top: 0;
  bottom: 0;
  width: 4px;
  background: transparent;
  transition: all 0.3s ease;
}

.submenu-list li:hover {
  background: rgba(60, 77, 255, 0.05);
  color: #3C4DFF;
}

.submenu-list li.active {
  background: rgba(60, 77, 255, 0.1);
  color: #3C4DFF;
  font-weight: 600;
}

.submenu-list li.active::before {
  background: linear-gradient(180deg, #3C4DFF 0%, #5C7BFF 100%);
}

/* 메인 콘텐츠 스타일 */
.main-content {
  background: white;
  border-radius: 16px;
  box-shadow: 0 4px 20px rgba(60, 77, 255, 0.08);
  height: calc(100vh - 80px);
  overflow-y: auto;
}

.content-header {
  padding: 32px 40px;
  border-bottom: 2px solid #f5f7fa;
  background: linear-gradient(135deg, rgba(60, 77, 255, 0.03) 0%, rgba(191, 212, 255, 0.05) 100%);
  border-radius: 16px 16px 0 0;
}

.content-header h2 {
  margin: 0;
  font-size: 28px;
  font-weight: 700;
  color: #1a1a1a;
  background: linear-gradient(135deg, #3C4DFF 0%, #5C7BFF 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.content-body {
  padding: 40px;
}

.placeholder {
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 400px;
  background: linear-gradient(135deg, rgba(60, 77, 255, 0.02) 0%, rgba(191, 212, 255, 0.05) 100%);
  border-radius: 12px;
  border: 2px dashed rgba(60, 77, 255, 0.2);
}

.placeholder p {
  color: #999;
  font-size: 16px;
  font-weight: 500;
}

/* 반응형 디자인 */
@media (max-width: 1024px) {
  .mypage-container {
    grid-template-columns: 240px 1fr;
    gap: 20px;
  }

  .sidebar-header h1 {
    font-size: 20px;
  }

  .content-header h2 {
    font-size: 24px;
  }
}

@media (max-width: 768px) {
  .content-page {
    padding: 20px 10px;
  }

  .mypage-container {
    grid-template-columns: 1fr;
    gap: 20px;
  }

  .sidebar {
    position: static;
  }

  .content-header {
    padding: 24px 20px;
  }

  .content-body {
    padding: 24px 20px;
  }
}
</style>