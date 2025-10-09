<script setup>
import { computed, onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'
import CardHeader from './components/atoms/CardHeader.vue'
import { Payment } from '@/module/paymentModule'
import openDialog from '@/module/dialog'

const router = useRouter()

// 이전 페이지에서 전달된 정보
const deliveryInfo = ref(null)
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
  router.push({ name: 'Info' })
}

const requestPayment = () => {
  if (!deliveryInfo.value || !product.value) {
    openDialog('주문자 정보가 없습니다. 다시 시도해주세요.')
    goBackToUserInfo()
    return
  }

  // Payment 모듈의 purchase 함수에 맞는 파라미터 구성
  const member = {
    id: deliveryInfo.value.id || 'test-user-' + Date.now(), // 테스트용 ID
    name: deliveryInfo.value.name,
    phone: deliveryInfo.value.phone,
    email: deliveryInfo.value.email,
  }

  const item = {
    id: product.value.id,
    name: product.value.name,
    price: totalPrice.value, // 총 결제금액 (상품가격 + 수수료)
    qty: 1,
  }

  const onResponse = (response) => {
    console.log('결제 응답:', response)
    if (response.success == true) {
      // 결제 성공 시 결제 완료 페이지로 이동 (받는 사람 정보 포함)
      sessionStorage.setItem('paymentResult', JSON.stringify({
        ...response.data,
        // 주문자 정보
        customerName: deliveryInfo.value?.name,
        customerPhone: deliveryInfo.value?.phone,
        customerEmail: deliveryInfo.value?.email,
        // 받는 사람 정보
        recipientName: deliveryInfo.value?.recipientName,
        recipientPhone: deliveryInfo.value?.recipientPhone,
        // 배송지 정보
        deliveryZipcode: deliveryInfo.value?.zipcode,
        deliveryAddress: deliveryInfo.value?.address,
        deliveryDetailAddress: deliveryInfo.value?.detailAddress,
        deliveryRequest: deliveryInfo.value?.deliveryRequest,
      }))
      sessionStorage.setItem('deliveryInfo', JSON.stringify(deliveryInfo.value))

      router.push({ name: 'Complete' })
    } else {
      openDialog(response.data?.errorMessage || '결제에 실패했습니다.')
    }
  }

  const onError = (error) => {
    console.error('결제 에러:', error)
    // error가 문자열일 수도 있고 객체일 수도 있음
    const errorMessage = typeof error === 'string'
      ? error
      : error?.errorMessage || '결제 처리 중 오류가 발생했습니다.'
    openDialog(errorMessage)
  }

  // 결제 요청 실행
  Payment.purchase(member, item, totalPrice.value, onResponse, onError)
}

onMounted(() => {
  console.log('CheckoutPage 마운트됨')

  let hasProductData = false
  let hasDeliveryData = false

  // 1. Router state에서 먼저 시도
  if (router.currentRoute.value.state?.product) {
    console.log('Router state에서 상품 정보 가져옴:', router.currentRoute.value.state.product)
    product.value = router.currentRoute.value.state.product
    hasProductData = true
  }

  if (router.currentRoute.value.state?.deliveryInfo) {
    console.log('Router state에서 배송 정보 가져옴:', router.currentRoute.value.state.deliveryInfo)
    deliveryInfo.value = router.currentRoute.value.state.deliveryInfo
    hasDeliveryData = true
  }

  // 2. sessionStorage에서 시도
  if (!hasProductData) {
    const storedProduct = sessionStorage.getItem('checkoutProduct')
    console.log('SessionStorage에서 상품 정보 확인:', storedProduct)

    if (storedProduct) {
      try {
        const parsedProduct = JSON.parse(storedProduct)
        console.log('SessionStorage에서 상품 정보 가져옴:', parsedProduct)
        product.value = parsedProduct
        hasProductData = true
      } catch (error) {
        console.error('상품 정보 파싱 에러:', error)
      }
    }
  }

  if (!hasDeliveryData) {
    const storedDelivery = sessionStorage.getItem('checkoutDeliveryInfo')
    console.log('SessionStorage에서 배송 정보 확인:', storedDelivery)

    if (storedDelivery) {
      try {
        const parsedDelivery = JSON.parse(storedDelivery)
        console.log('SessionStorage에서 배송 정보 가져옴:', parsedDelivery)
        deliveryInfo.value = parsedDelivery
        hasDeliveryData = true
      } catch (error) {
        console.error('배송 정보 파싱 에러:', error)
      }
    }
  }

  // 데이터가 없으면 이전 페이지로 리다이렉트
  if (!hasProductData || !hasDeliveryData) {
    console.warn('필수 정보가 없습니다. 이전 페이지로 이동합니다.')
    openDialog('주문 정보를 먼저 입력해주세요.')
    goBackToUserInfo()
    return
  }

  // 사용 후 sessionStorage 정리
  sessionStorage.removeItem('checkoutProduct')
  sessionStorage.removeItem('checkoutDeliveryInfo')

  console.log('최종 상품 정보:', product.value)
  console.log('최종 배송 정보:', deliveryInfo.value)
})
</script>

<template>
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
      <section class="mb-5" v-if="deliveryInfo">
        <h4 class="mb-3">주문자 정보</h4>
        <div class="border p-4">
          <div class="row mb-3">
            <div class="col-sm-3 font-weight-medium text-muted">이름</div>
            <div class="col-sm-9">{{ deliveryInfo.name }}</div>
          </div>
          <div class="row mb-3">
            <div class="col-sm-3 font-weight-medium text-muted">휴대폰</div>
            <div class="col-sm-9">{{ deliveryInfo.phone }}</div>
          </div>
          <div class="row">
            <div class="col-sm-3 font-weight-medium text-muted">이메일</div>
            <div class="col-sm-9">{{ deliveryInfo.email }}</div>
          </div>
        </div>
      </section>

      <!-- 배송지 정보 확인 -->
      <section class="mb-5" v-if="deliveryInfo">
        <div class="d-flex justify-content-between align-items-center mb-3">
          <h4 class="mb-0">배송지 정보</h4>
          <button class="btn btn-outline-primary btn-sm" @click="goBackToUserInfo">
            정보 수정
          </button>
        </div>
        <div class="border p-4">
          <!-- 받는 사람 정보 (한국 쇼핑몰 스타일) -->
          <div class="recipient-section mb-4 pb-4 border-bottom">
            <h6 class="text-primary mb-3">받는 사람</h6>
            <div class="row mb-3">
              <div class="col-sm-3 font-weight-medium text-muted">이름</div>
              <div class="col-sm-9 font-weight-bold">{{ deliveryInfo.recipientName }}</div>
            </div>
            <div class="row">
              <div class="col-sm-3 font-weight-medium text-muted">연락처</div>
              <div class="col-sm-9 font-weight-bold">{{ deliveryInfo.recipientPhone }}</div>
            </div>
          </div>

          <!-- 배송 주소 -->
          <div class="address-section">
            <h6 class="text-secondary mb-3">배송 주소</h6>
            <div class="row mb-3">
              <div class="col-sm-3 font-weight-medium text-muted">우편번호</div>
              <div class="col-sm-9">{{ deliveryInfo.zipcode }}</div>
            </div>
            <div class="row mb-3">
              <div class="col-sm-3 font-weight-medium text-muted">주소</div>
              <div class="col-sm-9">{{ deliveryInfo.address }}</div>
            </div>
            <div class="row mb-3" v-if="deliveryInfo.detailAddress">
              <div class="col-sm-3 font-weight-medium text-muted">상세주소</div>
              <div class="col-sm-9">{{ deliveryInfo.detailAddress }}</div>
            </div>
            <div class="row" v-if="deliveryInfo.deliveryRequest">
              <div class="col-sm-3 font-weight-medium text-muted">배송 요청사항</div>
              <div class="col-sm-9">
                <span class="badge badge-info">{{ deliveryInfo.deliveryRequest }}</span>
              </div>
            </div>
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
/* 공통 결제 페이지 스타일 */
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

.product-img {
  width: 120px;
  height: 120px;
  object-fit: cover;
  border-radius: 8px;
  border: 1px solid #e9ecef;
}

/* 받는 사람/배송지 정보 공통 스타일 */
.recipient-section h6,
.address-section h6 {
  font-weight: 600;
  font-size: 0.95rem;
}

.recipient-section .font-weight-bold {
  color: #333;
  font-size: 1.05rem;
}

.address-section h6 {
  font-size: 0.9rem;
}

/* 페이지 특화 스타일 */
.test-panel {
  border-left: 4px solid #ffc107;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.badge {
  font-size: 12px;
  padding: 4px 8px;
}

/* 반응형 */
@media (max-width: 768px) {
  .hero-title {
    font-size: 1.5rem;
  }

  .product-img {
    width: 80px;
    height: 80px;
  }

  .recipient-section,
  .address-section {
    margin-bottom: 1rem;
  }

  .recipient-section h6,
  .address-section h6 {
    font-size: 0.85rem;
  }
}
</style>
