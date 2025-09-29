<script setup>
import { computed, onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'
import CardHeader from './components/atoms/CardHeader.vue'
import { Payment } from '@/module/paymentModule'
import openDialog from '@/module/dialog'

const router = useRouter()

// 이전 페이지에서 전달된 정보
const userInfo = ref(null)
const product = ref(null)

// 수수료 설정
const fees = {
  inspection: 3000, // 검수비
  delivery: 3000, // 배송비
}

const totalPrice = computed(() => {
  if (!product.value) return 0
  return product.value.price + fees.inspection + fees.delivery
})

const goBackToUserInfo = () => {
  router.push({ name: 'user-info' })
}

const requestPayment = () => {
  if (!userInfo.value || !product.value) {
    openDialog('주문자 정보가 없습니다. 다시 시도해주세요.')
    goBackToUserInfo()
    return
  }

  // Payment 모듈의 purchase 함수에 맞는 파라미터 구성
  const member = {
    id: userInfo.value.id || 'test-user-' + Date.now(), // 테스트용 ID
    name: userInfo.value.name,
    phone: userInfo.value.phone,
    email: userInfo.value.email,
  }

  const item = {
    id: product.value.id,
    name: product.value.name,
    price: totalPrice.value, // 총 결제금액 (상품가격 + 수수료)
    qty: 1,
  }

  const onResponse = (response) => {
    console.log('결제 응답:', response)
    if (response.data.success == true) {
      // 결제 성공 시 결제 완료 페이지로 이동
      router.push({ name: 'payment-complete' })
    } else {
      openDialog(response.data.errorMessage)
    }
  }

  const onError = (error) => {
    console.error('결제 에러:', error)
    openDialog(error.errorMessage || '결제 처리 중 오류가 발생했습니다.')
  }

  // 결제 요청 실행
  Payment.purchase(member, item, totalPrice.value, onResponse, onError)
}

// 테스트용 더미 데이터 설정
const setDummyData = () => {
  userInfo.value = {
    id: 'test-user-001',
    name: '김테스트',
    phone: '010-1234-5678',
    email: 'test@example.com',
    zipcode: '12345',
    address: '서울특별시 강남구 테헤란로 123',
    detailAddress: '456호',
    deliveryRequest: '문앞에 놓아주세요',
  }

  product.value = {
    id: 1,
    name: '나이키 에어맥스 270 - 화이트 (테스트 상품)',
    price: 89000,
    originalPrice: 120000,
    condition: '중고 A급',
    size: '270mm',
    seller: '신발매니아',
    images: ['/images/fantry_logo.png'],
  }
}

onMounted(() => {
  // 이전 페이지에서 전달된 사용자 정보와 상품 정보 가져오기
  if (router.currentRoute.value.state?.userInfo && router.currentRoute.value.state?.product) {
    userInfo.value = router.currentRoute.value.state.userInfo
    product.value = router.currentRoute.value.state.product
  } else {
    // 테스트용: 더미 데이터로 초기화 (실제 서비스에서는 제거 필요)
    console.warn('테스트 모드: 더미 데이터를 사용합니다.')
    setDummyData()

    // 정보가 없으면 이전 페이지로 리다이렉트 (테스트용으로 주석 처리)
    // openDialog('주문자 정보를 먼저 입력해주세요.')
    // goBackToUserInfo()
  }
})
</script>

<template>
  <!-- 테스트 모드 컨트롤 패널 -->
  <div class="test-panel bg-warning p-3 mb-3" v-if="!router.currentRoute.value.state?.userInfo">
    <div class="container">
      <div class="d-flex justify-content-between align-items-center">
        <div>
          <h6 class="mb-0">🧪 테스트 모드</h6>
          <small class="text-muted">더미 데이터로 결제 프로세스를 테스트할 수 있습니다</small>
        </div>
        <div>
          <button class="btn btn-sm btn-outline-dark mr-2" @click="setDummyData">
            더미 데이터 재설정
          </button>
          <button class="btn btn-sm btn-dark" @click="goBackToUserInfo">정상 플로우로 이동</button>
        </div>
      </div>
    </div>
  </div>

  <div class="hero-section mb-5">
    <div class="container-fluid">
      <div
        class="d-flex flex-column align-items-center justify-content-center"
        style="min-height: 300px"
      >
        <h1 class="hero-title mb-3">주문 최종 확인</h1>
        <p class="hero-subtitle">결제 전 주문 내용을 확인해주세요</p>
      </div>
    </div>
  </div>
  <div class="d-flex flex-row">
    <main class="col-lg-8">
      <!-- 구매 상품 정보 -->
      <section class="mb-5" v-if="product">
        <h4 class="mb-3">구매 상품</h4>
        <div class="border p-4">
          <div class="d-flex align-items-start">
            <img class="product-img mr-4" :src="product.images[0]" :alt="product.name" />
            <div class="flex-grow-1">
              <h5 class="mb-2 font-weight-bold">{{ product.name }}</h5>
              <div class="mb-2">
                <span class="badge badge-success mr-2">{{ product.condition }}</span>
                <span class="text-muted small">사이즈: {{ product.size }}</span>
              </div>
              <p class="text-muted small mb-0">판매자: {{ product.seller }}</p>
            </div>
            <div class="text-right">
              <h5 class="text-primary font-weight-bold mb-0">
                {{ product.price.toLocaleString() }}원
              </h5>
            </div>
          </div>
        </div>
      </section>

      <!-- 주문자 정보 확인 -->
      <section class="mb-5" v-if="userInfo">
        <h4 class="mb-3">주문자 정보</h4>
        <div class="border p-4">
          <div class="row mb-3">
            <div class="col-sm-3 font-weight-medium">이름</div>
            <div class="col-sm-9">{{ userInfo.name }}</div>
          </div>
          <div class="row mb-3">
            <div class="col-sm-3 font-weight-medium">휴대폰</div>
            <div class="col-sm-9">{{ userInfo.phone }}</div>
          </div>
          <div class="row">
            <div class="col-sm-3 font-weight-medium">이메일</div>
            <div class="col-sm-9">{{ userInfo.email }}</div>
          </div>
        </div>
      </section>

      <!-- 배송지 정보 확인 -->
      <section class="mb-5" v-if="userInfo">
        <div class="d-flex justify-content-between align-items-center mb-3">
          <h4 class="mb-0">배송지 정보</h4>
          <button class="btn btn-outline-primary btn-sm" @click="goBackToUserInfo">
            정보 수정
          </button>
        </div>
        <div class="border p-4">
          <div class="row mb-3">
            <div class="col-sm-3 font-weight-medium">우편번호</div>
            <div class="col-sm-9">{{ userInfo.zipcode }}</div>
          </div>
          <div class="row mb-3">
            <div class="col-sm-3 font-weight-medium">주소</div>
            <div class="col-sm-9">{{ userInfo.address }}</div>
          </div>
          <div class="row mb-3" v-if="userInfo.detailAddress">
            <div class="col-sm-3 font-weight-medium">상세주소</div>
            <div class="col-sm-9">{{ userInfo.detailAddress }}</div>
          </div>
          <div class="row" v-if="userInfo.deliveryRequest">
            <div class="col-sm-3 font-weight-medium">배송 요청사항</div>
            <div class="col-sm-9">{{ userInfo.deliveryRequest }}</div>
          </div>
        </div>
      </section>
    </main>
    <aside class="col-lg-4">
      <div class="card border-secondary mb-5" v-if="product">
        <CardHeader>결제 정보</CardHeader>
        <div class="card-body">
          <div class="d-flex justify-content-between mb-3 pt-1">
            <h6 class="font-weight-medium">상품가격</h6>
            <h6 class="font-weight-medium">{{ product.price.toLocaleString() }}원</h6>
          </div>
          <div class="d-flex justify-content-between mb-2">
            <span class="text-muted small">검수비</span>
            <span class="text-muted small">{{ fees.inspection.toLocaleString() }}원</span>
          </div>
          <div class="d-flex justify-content-between mb-3">
            <span class="text-muted small">배송비</span>
            <span class="text-muted small">{{ fees.delivery.toLocaleString() }}원</span>
          </div>
          <hr class="mt-0" />
          <div class="d-flex justify-content-between mb-3">
            <h6 class="font-weight-bold">총 결제금액</h6>
            <h6 class="font-weight-bold text-primary">{{ totalPrice.toLocaleString() }}원</h6>
          </div>
        </div>
        <div class="card-footer border-secondary bg-transparent">
          <button
            class="btn btn-lg btn-block btn-primary font-weight-bold my-3 py-3"
            @click="requestPayment"
          >
            {{ totalPrice.toLocaleString() }}원 결제하기
          </button>
        </div>
      </div>
    </aside>
  </div>
</template>
<style scoped>
.product-img {
  width: 120px;
  height: 120px;
  object-fit: cover;
  border-radius: 8px;
  border: 1px solid #e9ecef;
}

.test-panel {
  border-left: 4px solid #ffc107;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.badge {
  font-size: 12px;
  padding: 4px 8px;
}

.hero-section {
  background-color: #f8f9fa;
  border-bottom: 1px solid #e9ecef;
}

.hero-title {
  font-weight: 600;
  font-size: 2rem;
  color: #333;
  text-transform: uppercase;
  letter-spacing: 1px;
}

.hero-subtitle {
  font-size: 1rem;
  color: #6c757d;
  font-weight: 400;
}
</style>
