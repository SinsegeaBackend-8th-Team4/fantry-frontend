<script setup>
import { ref, reactive, computed, onMounted, nextTick } from 'vue'
import { useRouter } from 'vue-router'
import openAddressSearch from '@/module/kakaoAddressSearch'
import { useUserStore } from '@/stores/userStore'
import { getMemberAddresses } from '@/api/address'

const router = useRouter()

const userStore = useUserStore()
const currentUser = useRouter.currentUser
const props = defineProps({
  product: {
    type: Object,
    default: {
      id: 1,
      name: '소방차 포토카드',
      price: 89000,
      condition: '중고 A급',
      seller: '소방차매니아',
      images: ['/images/fantry_logo.png'],
    },
  },
})

const deliveryInfo = reactive({
  name: '',
  phone: '',
  email: '',
  recipientName: '',
  recipientPhone: '',
  zipcode: '',
  address: '',
  detailAddress: '',
  deliveryRequest: '',
})

// 사용자 저장된 배송지 목록
const savedAddresses = ref([])

const selectedAddressId = ref('')
const isFormValid = ref(false)

const validateForm = () => {
  const isValid =
    deliveryInfo.name &&
    deliveryInfo.phone &&
    deliveryInfo.email &&
    deliveryInfo.recipientName &&
    deliveryInfo.recipientPhone &&
    deliveryInfo.zipcode &&
    deliveryInfo.address

  isFormValid.value = isValid

  console.log('[유효성검사] 결과:', {
    isValid,
    name: !!deliveryInfo.name,
    phone: !!deliveryInfo.phone,
    email: !!deliveryInfo.email,
    recipientName: !!deliveryInfo.recipientName,
    recipientPhone: !!deliveryInfo.recipientPhone,
    zipcode: !!deliveryInfo.zipcode,
    address: !!deliveryInfo.address,
  })

  return isValid
}

const selectSavedAddress = (addressId) => {
  selectedAddressId.value = addressId.toString()

  const selected = savedAddresses.value.find((addr) => addr.id === parseInt(addressId))
  if (selected) {
    console.log('[배송지선택] 저장된 주소 적용:', selected)
    deliveryInfo.zipcode = selected.zipcode
    deliveryInfo.address = selected.address
    deliveryInfo.detailAddress = selected.detailAddress
    validateForm()
  }
}

const onSelectAddress = () => {
  if (selectedAddressId.value) {
    // 저장된 주소 선택
    const selected = savedAddresses.value.find(
      (addr) => addr.id === parseInt(selectedAddressId.value),
    )
    if (selected) {
      console.log('[배송지선택] 저장된 주소 적용:', selected)
      deliveryInfo.zipcode = selected.zipcode
      deliveryInfo.address = selected.address
      deliveryInfo.detailAddress = selected.detailAddress
    }
  } else {
    // 선택 해제 시 주소 정보 초기화
    console.log('[배송지선택] 주소 초기화')
    deliveryInfo.zipcode = ''
    deliveryInfo.address = ''
    deliveryInfo.detailAddress = ''
  }
  validateForm()
}

const onClickAddressSearch = () => {
  openAddressSearch((data) => {
    console.log('[주소검색] API 콜백 실행:', data)

    // 즉시 업데이트 (nextTick 제거)
    selectedAddressId.value = ''
    deliveryInfo.zipcode = data.zonecode
    deliveryInfo.address = data.address
    deliveryInfo.detailAddress = ''

    console.log('[주소검색] deliveryInfo 객체 직후:', deliveryInfo)
    console.log('[주소검색] zipcode 값:', deliveryInfo.zipcode)
    console.log('[주소검색] address 값:', deliveryInfo.address)

    // DOM 업데이트 후 유효성 검사
    nextTick(() => {
      validateForm()
      console.log('[주소검색] 유효성 검사 후 isFormValid:', isFormValid.value)
    })
  })
}

const formatPhoneNumber = (value) => {
  const numbers = value.replace(/[^\d]/g, '')
  if (numbers.length <= 3) return numbers
  if (numbers.length <= 7) return `${numbers.slice(0, 3)}-${numbers.slice(3)}`
  return `${numbers.slice(0, 3)}-${numbers.slice(3, 7)}-${numbers.slice(7, 11)}`
}

const onPhoneInput = (event) => {
  const formatted = formatPhoneNumber(event.target.value)
  deliveryInfo.phone = formatted
  event.target.value = formatted
  validateForm()
}

const onRecipientPhoneInput = (event) => {
  const formatted = formatPhoneNumber(event.target.value)
  deliveryInfo.recipientPhone = formatted
  event.target.value = formatted
  validateForm()
}

const proceedToCheckout = () => {
  if (!isFormValid.value) {
    console.warn('[결제진행] 폼 유효성 검사 실패')
    alert('필수 항목을 모두 입력해주세요.')
    return
  }

  console.log('[결제진행] 전달할 상품 정보:', props.product)
  console.log('[결제진행] 전달할 배송 정보:', deliveryInfo)

  // sessionStorage에 상품 정보와 배송 정보 함께 저장
  sessionStorage.setItem('checkoutProduct', JSON.stringify(props.product))
  sessionStorage.setItem('checkoutDeliveryInfo', JSON.stringify(deliveryInfo))

  // 상품 정보와 배송 정보를 다음 페이지로 전달
  router.push({
    name: 'Checkout',
  })
}

// 입력 필드 변경 시 유효성 검사
const onInputChange = () => {
  validateForm()
}

// 컴포넌트 마운트 시 기본 주소 설정
const initializeDefaultAddress = () => {
  if (!savedAddresses.value || savedAddresses.value.length === 0) {
    return
  }
  const defaultAddress = savedAddresses.value.find((addr) => addr.isDefault)
  if (defaultAddress) {
    selectedAddressId.value = defaultAddress.id.toString()
    onSelectAddress()
  }
}

onMounted(async () => {
  try {
    initializeDefaultAddress()
    savedAddresses.value = await getMemberAddresses()
  } catch (error) {
    console.error('배송지 목록 로드 실패:', error)
    savedAddresses.value = []
  }
})
</script>

<template>
  <div class="hero-section mb-5">
    <div class="container-fluid">
      <div
        class="d-flex flex-column align-items-center justify-content-center"
        style="min-height: 300px"
      >
        <h1 class="hero-title mb-3">주문 정보 입력</h1>
        <p class="hero-subtitle">배송을 위한 정보를 입력해주세요</p>
      </div>
    </div>
  </div>

  <div class="container-fluid">
    <div class="row justify-content-center">
      <div class="col-lg-8">
        <!-- 구매 상품 정보 -->
        <section class="mb-5">
          <h4 class="mb-4">구매 상품</h4>
          <div class="border p-4 bg-light">
            <div class="d-flex align-items-start">
              <img
                class="product-img mr-4"
                :src="props.product.images[0]"
                :alt="props.product.name"
              />
              <div class="flex-grow-1">
                <h5 class="mb-2 font-weight-bold">{{ props.product.name }}</h5>
                <div class="mb-3">
                  <div class="d-flex align-items-center mb-1">
                    <span class="badge badge-success mr-2">{{ props.product.condition }}</span>
                  </div>
                  <p class="text-muted small mb-1">판매자: {{ props.product.seller }}</p>
                </div>
                <div class="price-info">
                  <h4 class="text-primary font-weight-bold mb-0">
                    {{ props.product.price.toLocaleString() }}원
                  </h4>
                </div>
              </div>
            </div>
          </div>
        </section>

        <form @submit.prevent="proceedToCheckout">
          <!-- 주문자 정보 -->
          <section class="mb-5">
            <h4 class="mb-4">주문자 정보</h4>
            <div class="border p-4">
              <div class="row">
                <div class="col-md-6 mb-3">
                  <label for="name" class="form-label"
                    >이름 <span class="text-danger">*</span></label
                  >
                  <input
                    id="name"
                    v-model="deliveryInfo.name"
                    type="text"
                    class="form-control"
                    placeholder="이름을 입력하세요"
                    required
                    @input="onInputChange"
                  />
                </div>
                <div class="col-md-6 mb-3">
                  <label for="phone" class="form-label"
                    >휴대폰 번호 <span class="text-danger">*</span></label
                  >
                  <input
                    id="phone"
                    type="tel"
                    class="form-control"
                    placeholder="010-0000-0000"
                    maxlength="13"
                    required
                    @input="onPhoneInput"
                  />
                </div>
              </div>
              <div class="mb-3">
                <label for="email" class="form-label"
                  >이메일 <span class="text-danger">*</span></label
                >
                <input
                  id="email"
                  v-model="deliveryInfo.email"
                  type="email"
                  class="form-control"
                  placeholder="example@email.com"
                  required
                  @input="onInputChange"
                />
              </div>
            </div>
          </section>

          <!-- 배송지 정보 -->
          <section class="mb-5">
            <h4 class="mb-4">배송지 정보</h4>
            <div class="border p-4">
              <!-- 배송지 선택 리스트 -->
              <div class="mb-4">
                <label class="form-label">배송지 선택</label>
                <div
                  v-if="savedAddresses && savedAddresses.length > 0"
                  class="d-flex flex-column"
                  style="gap: 12px"
                >
                  <div
                    v-for="address in savedAddresses"
                    :key="address.id"
                    class="border p-3 address-item"
                    :class="{
                      'border-primary bg-light': selectedAddressId === address.id.toString(),
                    }"
                    style="cursor: pointer; transition: all 0.2s"
                    @click="selectSavedAddress(address.id)"
                  >
                    <div class="d-flex align-items-center mb-2" style="gap: 10px">
                      <input
                        type="radio"
                        :value="address.id.toString()"
                        v-model="selectedAddressId"
                        style="cursor: pointer"
                        @change="onSelectAddress"
                      />
                      <span class="font-weight-bold">{{ address.name }}</span>
                      <span v-if="address.isDefault" class="badge badge-primary">기본배송지</span>
                    </div>
                    <div class="ml-4">
                      <p class="text-muted small mb-1">{{ address.address }}</p>
                      <p class="text-muted small mb-0">{{ address.phone }}</p>
                    </div>
                  </div>
                </div>
                <div v-else class="border p-4 text-center text-muted">
                  <p class="mb-0">저장된 배송지가 없습니다. 아래에서 새 주소를 입력해주세요.</p>
                </div>
              </div>
              <div class="row mb-3">
                <div class="col-md-6">
                  <label for="recipientName" class="form-label"
                    >받는 사람 <span class="text-danger">*</span></label
                  >
                  <input
                    id="recipientName"
                    v-model="deliveryInfo.recipientName"
                    type="text"
                    class="form-control"
                    placeholder="받는 사람 이름"
                    required
                    @input="onInputChange"
                  />
                </div>
                <div class="col-md-6">
                  <label for="recipientPhone" class="form-label"
                    >받는 사람 연락처 <span class="text-danger">*</span></label
                  >
                  <input
                    id="recipientPhone"
                    type="tel"
                    class="form-control"
                    placeholder="010-0000-0000"
                    maxlength="13"
                    required
                    @input="onRecipientPhoneInput"
                  />
                </div>
              </div>
              <div class="d-flex mb-3">
                <input
                  id="zipcode"
                  v-model="deliveryInfo.zipcode"
                  class="form-control col-3 mr-2"
                  type="text"
                  placeholder="우편번호"
                  required
                />
                <button type="button" class="btn btn-primary" @click="onClickAddressSearch">
                  주소 검색
                </button>
              </div>
              <div class="mb-3">
                <input
                  v-model="deliveryInfo.address"
                  class="form-control"
                  type="text"
                  placeholder="주소"
                  required
                />
              </div>
              <div class="mb-3">
                <input
                  v-model="deliveryInfo.detailAddress"
                  class="form-control"
                  type="text"
                  placeholder="상세주소를 입력하세요"
                  @input="onInputChange"
                />
              </div>
              <div class="mb-3">
                <label for="deliveryRequest" class="form-label">배송 요청사항</label>
                <select
                  id="deliveryRequest"
                  v-model="deliveryInfo.deliveryRequest"
                  class="form-control delivery-select"
                >
                  <option value="">배송 요청사항을 선택하세요</option>
                  <option value="문앞에 놓아주세요">문앞에 놓아주세요</option>
                  <option value="경비실에 맡겨주세요">경비실에 맡겨주세요</option>
                  <option value="택배함에 넣어주세요">택배함에 넣어주세요</option>
                  <option value="직접 받겠습니다">직접 받겠습니다</option>
                  <option value="부재 시 연락주세요">부재 시 연락주세요</option>
                </select>
              </div>
            </div>
          </section>

          <!-- 다음 단계 버튼 -->
          <div class="text-center mb-5">
            <button
              type="submit"
              class="btn btn-primary btn-lg px-5 py-3"
              :disabled="!isFormValid"
              :class="{ 'btn-secondary': !isFormValid }"
            >
              결제 정보 확인하기
            </button>
            <p class="text-muted mt-2 small">* 필수 항목을 모두 입력해주세요</p>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<style scoped>
/* 공통 결제 페이지 스타일 */
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

/* 페이지 특화 스타일 */
.delivery-select {
  background-image: url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%236b7280' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='m6 8 4 4 4-4'/%3e%3c/svg%3e");
  background-position: right 12px center;
  background-repeat: no-repeat;
  background-size: 16px 12px;
  appearance: none;
}

.address-item:hover {
  border-color: #d19c97 !important;
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
}
</style>
