<script setup>
import { ref, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import CardHeader from './components/atoms/CardHeader.vue'

const router = useRouter()
const route = useRoute()

// 결제 정보
const paymentInfo = ref({
  orderId: '',
  productName: '',
  totalAmount: 0,
  paymentMethod: '',
  paymentDate: '',
  customerName: '',
  customerPhone: '',
  deliveryAddress: '',
  estimatedDelivery: ''
})

// 페이지 로딩 상태
const isLoading = ref(true)

// 결제 완료 데이터 초기화
const initializePaymentData = () => {
  // URL 쿼리 파라미터나 라우터 state에서 결제 정보 가져오기
  const { state } = route

  if (state?.paymentResult) {
    const result = state.paymentResult
    paymentInfo.value = {
      orderId: result.orderId || generateOrderId(),
      productName: result.productName || '상품명',
      totalAmount: result.totalAmount || 0,
      paymentMethod: result.paymentMethod || '신용카드',
      paymentDate: result.paymentDate || new Date().toLocaleDateString('ko-KR'),
      customerName: result.customerName || '고객명',
      customerPhone: result.customerPhone || '010-0000-0000',
      deliveryAddress: result.deliveryAddress || '배송지 주소',
      estimatedDelivery: calculateEstimatedDelivery()
    }
  } else {
    // 테스트용 더미 데이터
    paymentInfo.value = {
      orderId: generateOrderId(),
      productName: '나이키 에어맥스 270 - 화이트',
      totalAmount: 95000,
      paymentMethod: '신용카드',
      paymentDate: new Date().toLocaleDateString('ko-KR'),
      customerName: '김테스트',
      customerPhone: '010-1234-5678',
      deliveryAddress: '서울특별시 강남구 테헤란로 123, 456호',
      estimatedDelivery: calculateEstimatedDelivery()
    }
  }

  // 로딩 완료
  setTimeout(() => {
    isLoading.value = false
  }, 1000)
}

// 주문번호 생성
const generateOrderId = () => {
  const now = new Date()
  const year = now.getFullYear().toString().slice(-2)
  const month = (now.getMonth() + 1).toString().padStart(2, '0')
  const day = now.getDate().toString().padStart(2, '0')
  const random = Math.floor(Math.random() * 10000).toString().padStart(4, '0')
  return `F${year}${month}${day}${random}`
}

// 예상 배송일 계산 (영업일 기준 2-3일)
const calculateEstimatedDelivery = () => {
  const today = new Date()
  const deliveryDate = new Date(today)
  deliveryDate.setDate(today.getDate() + 3) // 3일 후

  return deliveryDate.toLocaleDateString('ko-KR', {
    month: 'long',
    day: 'numeric',
    weekday: 'short'
  })
}

// 페이지 이동 함수들
const goToHome = () => {
  router.push('/')
}

const goToMyPage = () => {
  router.push('/mypage')
}

const goToOrderHistory = () => {
  router.push('/mypage/orders')
}


onMounted(() => {
  initializePaymentData()
})
</script>

<template>
  <!-- 로딩 상태 -->
  <div v-if="isLoading" class="loading-container">
    <div class="container-fluid">
      <div class="d-flex flex-column align-items-center justify-content-center" style="min-height: 400px">
        <div class="spinner-border text-primary mb-3" role="status">
          <span class="sr-only">로딩 중...</span>
        </div>
        <p class="text-muted">결제 정보를 확인하고 있습니다...</p>
      </div>
    </div>
  </div>

  <!-- 결제 완료 화면 -->
  <div v-else>
    <!-- Hero Section -->
    <div class="hero-section mb-5">
      <div class="container-fluid">
        <div class="d-flex flex-column align-items-center justify-content-center" style="min-height: 300px">
          <div class="success-icon mb-4">
            <svg width="80" height="80" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <circle cx="12" cy="12" r="12" fill="#28a745"/>
              <path d="M9 12l2 2 4-4" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
          </div>
          <h1 class="hero-title mb-3">결제가 완료되었습니다</h1>
          <p class="hero-subtitle">주문해 주셔서 감사합니다. 빠른 시일 내에 배송해드리겠습니다.</p>
        </div>
      </div>
    </div>

    <div class="container-fluid">
      <div class="row justify-content-center">
        <div class="col-lg-8">
          <!-- 주문 정보 카드 -->
          <section class="mb-5">
            <div class="card border-secondary">
              <CardHeader>주문 정보</CardHeader>
              <div class="card-body">
                <div class="row mb-4">
                  <div class="col-sm-3 font-weight-medium text-muted">주문번호</div>
                  <div class="col-sm-9">
                    <span class="font-weight-bold">{{ paymentInfo.orderId }}</span>
                  </div>
                </div>
                <div class="row mb-4">
                  <div class="col-sm-3 font-weight-medium text-muted">상품명</div>
                  <div class="col-sm-9">{{ paymentInfo.productName }}</div>
                </div>
                <div class="row mb-4">
                  <div class="col-sm-3 font-weight-medium text-muted">결제금액</div>
                  <div class="col-sm-9">
                    <span class="font-weight-bold text-primary h5">
                      {{ paymentInfo.totalAmount.toLocaleString() }}원
                    </span>
                  </div>
                </div>
                <div class="row mb-4">
                  <div class="col-sm-3 font-weight-medium text-muted">결제방법</div>
                  <div class="col-sm-9">{{ paymentInfo.paymentMethod }}</div>
                </div>
                <div class="row">
                  <div class="col-sm-3 font-weight-medium text-muted">결제일시</div>
                  <div class="col-sm-9">{{ paymentInfo.paymentDate }}</div>
                </div>
              </div>
            </div>
          </section>

          <!-- 배송 정보 카드 -->
          <section class="mb-5">
            <div class="card border-secondary">
              <CardHeader>배송 정보</CardHeader>
              <div class="card-body">
                <div class="row mb-4">
                  <div class="col-sm-3 font-weight-medium text-muted">받는분</div>
                  <div class="col-sm-9">{{ paymentInfo.customerName }}</div>
                </div>
                <div class="row mb-4">
                  <div class="col-sm-3 font-weight-medium text-muted">연락처</div>
                  <div class="col-sm-9">{{ paymentInfo.customerPhone }}</div>
                </div>
                <div class="row mb-4">
                  <div class="col-sm-3 font-weight-medium text-muted">배송지</div>
                  <div class="col-sm-9">{{ paymentInfo.deliveryAddress }}</div>
                </div>
                <div class="row">
                  <div class="col-sm-3 font-weight-medium text-muted">예상 배송일</div>
                  <div class="col-sm-9">
                    <span class="badge badge-info">{{ paymentInfo.estimatedDelivery }}</span>
                    <small class="text-muted ml-2">검수 완료 후 배송됩니다</small>
                  </div>
                </div>
              </div>
            </div>
          </section>

          <!-- 다음 단계 안내 -->
          <section class="mb-5">
            <div class="card border-info bg-light">
              <div class="card-body">
                <h5 class="card-title text-info mb-3">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" class="mr-2">
                    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
                  </svg>
                  다음 단계 안내
                </h5>
                <div class="step-guide">
                  <div class="step-item">
                    <div class="step-number">1</div>
                    <div class="step-content">
                      <h6>검수 진행</h6>
                      <p class="text-muted mb-0">전문 검수팀이 상품을 꼼꼼히 검수합니다 (1-2일 소요)</p>
                    </div>
                  </div>
                  <div class="step-item">
                    <div class="step-number">2</div>
                    <div class="step-content">
                      <h6>배송 준비</h6>
                      <p class="text-muted mb-0">검수 완료 후 안전하게 포장하여 배송 준비합니다</p>
                    </div>
                  </div>
                  <div class="step-item">
                    <div class="step-number">3</div>
                    <div class="step-content">
                      <h6>배송 완료</h6>
                      <p class="text-muted mb-0">고객님께 안전하게 배송됩니다 (배송 시 SMS 알림)</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>

          <!-- 액션 버튼 그룹 -->
          <div class="action-buttons text-center mb-5">
            <button class="btn btn-primary btn-lg mr-3 px-4 py-3" @click="goToOrderHistory">
              주문 내역 확인
            </button>
            <button class="btn btn-outline-primary btn-lg mr-3 px-4 py-3" @click="goToMyPage">
              마이페이지
            </button>
            <button class="btn btn-outline-secondary btn-lg px-4 py-3" @click="goToHome">
              홈으로 가기
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.loading-container {
  min-height: 60vh;
}

.success-icon {
  animation: bounce 0.6s ease-in-out;
}

@keyframes bounce {
  0%, 20%, 60%, 100% {
    transform: translateY(0);
  }
  40% {
    transform: translateY(-10px);
  }
  80% {
    transform: translateY(-5px);
  }
}

.hero-section {
  background: linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%);
  border-bottom: 1px solid #e9ecef;
}

.hero-title {
  font-weight: 600;
  font-size: 2.2rem;
  color: #333;
  text-transform: uppercase;
  letter-spacing: 1px;
}

.hero-subtitle {
  font-size: 1.1rem;
  color: #6c757d;
  font-weight: 400;
}

.card {
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
  margin-bottom: 1.5rem;
}

.font-weight-medium {
  font-weight: 500;
}

.step-guide {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.step-item {
  display: flex;
  align-items: flex-start;
  gap: 1rem;
}

.step-number {
  width: 32px;
  height: 32px;
  background-color: #2f4dca;
  color: white;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: bold;
  font-size: 14px;
  flex-shrink: 0;
}

.step-content h6 {
  color: #333;
  font-weight: 600;
  margin-bottom: 0.25rem;
}

.step-content p {
  font-size: 0.9rem;
  line-height: 1.4;
}

.action-buttons .btn {
  transition: all 0.3s ease;
  border-radius: 8px;
  font-weight: 500;
}

.action-buttons .btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}

.badge {
  font-size: 0.85rem;
  padding: 0.5rem 0.75rem;
}

.spinner-border {
  width: 3rem;
  height: 3rem;
}

/* 반응형 디자인 */
@media (max-width: 768px) {
  .hero-title {
    font-size: 1.8rem;
  }

  .action-buttons .btn {
    margin-bottom: 0.5rem;
    width: 100%;
  }

  .step-guide {
    gap: 1rem;
  }

  .step-item {
    flex-direction: row;
    align-items: center;
  }
}

@media (max-width: 576px) {
  .hero-title {
    font-size: 1.5rem;
  }

  .hero-subtitle {
    font-size: 1rem;
  }
}
</style>