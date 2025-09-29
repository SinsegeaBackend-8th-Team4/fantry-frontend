<script setup>
import { ref, reactive, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import openAddressSearch from '@/module/kakaoAddressSearch'

const router = useRouter()

const props = defineProps({
  product: {
    type: Object,
    default: {
      id: 1,
      name: '나이키 에어맥스 270 - 화이트',
      price: 89000,
      originalPrice: 120000,
      condition: '중고 A급',
      size: '270mm',
      seller: '신발매니아',
      images: ['/images/fantry_logo.png']
    },
  },
})

const userInfo = reactive({
  name: '',
  phone: '',
  email: '',
  zipcode: '',
  address: '',
  detailAddress: '',
  deliveryRequest: ''
})

// 사용자 저장된 배송지 목록
const savedAddresses = ref([
  {
    id: 1,
    name: '집',
    zipcode: '12345',
    address: '서울특별시 강남구 테헤란로 123',
    detailAddress: '456호',
    isDefault: true
  },
  {
    id: 2,
    name: '회사',
    zipcode: '67890',
    address: '서울특별시 종로구 세종대로 456',
    detailAddress: '7층',
    isDefault: false
  },
  {
    id: 3,
    name: '부모님댁',
    zipcode: '11111',
    address: '경기도 성남시 분당구 정자일로 789',
    detailAddress: '101동 202호',
    isDefault: false
  }
])

const selectedAddressId = ref('')
const isFormValid = ref(false)

const validateForm = () => {
  isFormValid.value = userInfo.name &&
                     userInfo.phone &&
                     userInfo.email &&
                     userInfo.zipcode &&
                     userInfo.address
}

const onSelectAddress = () => {
  if (selectedAddressId.value) {
    // 저장된 주소 선택
    const selected = savedAddresses.value.find(addr => addr.id === parseInt(selectedAddressId.value))
    if (selected) {
      userInfo.zipcode = selected.zipcode
      userInfo.address = selected.address
      userInfo.detailAddress = selected.detailAddress
    }
  } else {
    // 선택 해제 시 주소 정보 초기화
    userInfo.zipcode = ''
    userInfo.address = ''
    userInfo.detailAddress = ''
  }
  validateForm()
}

const onClickAddressSearch = () => {
  openAddressSearch((data) => {
    userInfo.zipcode = data.zonecode
    userInfo.address = data.address
    selectedAddressId.value = '' // 선택 해제로 설정
    validateForm()
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
  userInfo.phone = formatted
  event.target.value = formatted
  validateForm()
}

const proceedToCheckout = () => {
  if (!isFormValid.value) {
    console.warn('폼 유효성 검사 실패')
    return
  }

  // 사용자 정보와 상품 정보를 다음 페이지로 전달
  router.push({
    name: 'checkout',
    state: {
      userInfo,
      product: props.product
    }
  })
}

// 입력 필드 변경 시 유효성 검사
const onInputChange = () => {
  validateForm()
}

// 컴포넌트 마운트 시 기본 주소 설정
const initializeDefaultAddress = () => {
  const defaultAddress = savedAddresses.value.find(addr => addr.isDefault)
  if (defaultAddress) {
    selectedAddressId.value = defaultAddress.id.toString()
    onSelectAddress()
  }
}

onMounted(() => {
  initializeDefaultAddress()
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
                    <span class="text-muted small">사이즈: {{ props.product.size }}</span>
                  </div>
                  <p class="text-muted small mb-1">판매자: {{ props.product.seller }}</p>
                </div>
                <div class="price-info">
                  <div class="d-flex align-items-center">
                    <span class="text-muted small text-decoration-line-through mr-2">
                      정가 {{ props.product.originalPrice.toLocaleString() }}원
                    </span>
                    <span class="badge badge-danger">
                      {{ Math.round((1 - props.product.price / props.product.originalPrice) * 100) }}% 할인
                    </span>
                  </div>
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
                  <label for="name" class="form-label">이름 <span class="text-danger">*</span></label>
                  <input
                    id="name"
                    v-model="userInfo.name"
                    type="text"
                    class="form-control"
                    placeholder="이름을 입력하세요"
                    required
                    @input="onInputChange"
                  />
                </div>
                <div class="col-md-6 mb-3">
                  <label for="phone" class="form-label">휴대폰 번호 <span class="text-danger">*</span></label>
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
                <label for="email" class="form-label">이메일 <span class="text-danger">*</span></label>
                <input
                  id="email"
                  v-model="userInfo.email"
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
              <!-- 배송지 선택 드롭다운 -->
              <div class="mb-4">
                <label for="addressSelect" class="form-label">배송지 선택</label>
                <select
                  id="addressSelect"
                  v-model="selectedAddressId"
                  class="form-control address-select"
                  @change="onSelectAddress"
                >
                  <option value="">배송지를 선택하세요</option>
                  <template v-for="address in savedAddresses" :key="address.id">
                    <option :value="address.id.toString()">
                      {{ address.name }}{{ address.isDefault ? ' (기본배송지)' : '' }} - {{ address.address }}
                    </option>
                  </template>
                </select>
              </div>
              <div class="d-flex mb-3">
                <input
                  id="zipcode"
                  v-model="userInfo.zipcode"
                  class="form-control col-3 mr-2"
                  type="text"
                  placeholder="우편번호"
                  :readonly="selectedAddressId !== ''"
                  required
                />
                <button
                  type="button"
                  class="btn btn-primary"
                  @click="onClickAddressSearch"
                >
                  주소 검색
                </button>
              </div>
              <div class="mb-3">
                <input
                  v-model="userInfo.address"
                  class="form-control"
                  type="text"
                  placeholder="주소"
                  :readonly="selectedAddressId !== ''"
                  required
                />
              </div>
              <div class="mb-3">
                <input
                  v-model="userInfo.detailAddress"
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
                  v-model="userInfo.deliveryRequest"
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
            <p class="text-muted mt-2 small">
              * 필수 항목을 모두 입력해주세요
            </p>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<style scoped>
.form-label {
  font-weight: 500;
  color: #333;
  margin-bottom: 8px;
}

.form-control {
  border: 1px solid #ddd;
  border-radius: 4px;
  padding: 12px;
  font-size: 14px;
}

.form-control:focus {
  border-color: #007bff;
  box-shadow: 0 0 0 0.2rem rgba(0, 123, 255, 0.25);
}

.btn:disabled {
  cursor: not-allowed;
  opacity: 0.6;
}

.text-danger {
  color: #dc3545 !important;
}

section {
  background: #fff;
  border-radius: 8px;
}

h4 {
  color: #333;
  font-weight: 600;
}

.delivery-select,
.address-select {
  height: auto;
  min-height: 48px;
  line-height: 1.5;
  white-space: normal;
  word-wrap: break-word;
  padding: 12px 30px 12px 12px;
  background-image: url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%236b7280' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='m6 8 4 4 4-4'/%3e%3c/svg%3e");
  background-position: right 12px center;
  background-repeat: no-repeat;
  background-size: 16px 12px;
  appearance: none;
}

.delivery-select option {
  padding: 8px 12px;
  white-space: normal;
  word-wrap: break-word;
}

.product-img {
  width: 120px;
  height: 120px;
  object-fit: cover;
  border-radius: 8px;
  border: 1px solid #e9ecef;
}

.price-info {
  margin-top: 12px;
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