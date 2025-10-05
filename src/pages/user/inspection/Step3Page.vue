<script setup>
import { useRouter } from 'vue-router'
import { ref, computed } from 'vue'
import * as bootstrap from 'bootstrap'

// API 모듈
import { submitInspection } from '@/api/userInspection.js'

// 상태 관리 (Pinia)
import { useInspectionStore } from '@/stores/inspectionStore'
import { storeToRefs } from 'pinia'

const router = useRouter()
const inspectionStore = useInspectionStore()

// 로컬 상태
const isAgreed = ref(false) // 정책 동의 여부
const isLoading = ref(false) // 신청 완료 API 로딩 상태
const error = ref(null) // API 에러 메시지

// Store 값 가져오기
const {
  selectedCategory, // id
  selectedCategoryValue, // 객체
  selectedArtist,
  selectedAlbum,
  itemName,
  itemDescription,
  hashtags,

  checklists,
  answers,

  expectedPrice,
  marketAvgPrice,
  sellerHopePrice,

  uploadedFiles,
  shippingAddress,
  shippingAddressDetail,
  bankName,
  bankAccount,
} = storeToRefs(inspectionStore)

// 체크리스트 답변 -> 화면 표시 텍스트
const formatAnswer = (answer) => {
  if (answer === true) return '예'
  if (answer === false) return '아니오'
  if (answer === null || answer === '') '-'

  return answer
}

// 가격 포맷
const formatPrice = (price) => {
  if (price === null || price === undefined) return '데이터 없음'
  return price.toLocaleString() + '원'
}

// 정책 동의 모달
const openPolicyModal = () => {
  const modal = new bootstrap.Modal(document.getElementById('policyModal'))
  modal.show()
}

// 이전 단계
const goPrev = () => {
  router.push('/inspection/step2')
}

// 신청 완료 버튼 클릭 시
const finish = async () => {
  // 최종 유효성 검사 (정책 동의 여부)
  if (!isAgreed.value) {
    alert('검수 및 판매 정책에 동의해주세요.')
    return
  }

  isLoading.value = true
  error.value = null

  try {
    const inspectionData = {
      selectedCategory: selectedCategory.value,
      selectedArtist: selectedArtist.value,
      selectedAlbum: selectedAlbum.value,
      itemName: itemName.value,
      itemDescription: itemDescription.value,
      hashtags: hashtags.value,
      answers: answers.value,

      expectedPrice: expectedPrice.value,
      marketAvgPrice: marketAvgPrice.value,
      sellerHopePrice: sellerHopePrice.value,

      uploadedFiles: uploadedFiles.value,

      shippingAddress: shippingAddress.value,
      shippingAddressDetail: shippingAddressDetail.value,
      bankName: bankName.value,
      bankAccount: bankAccount.value,
    }

    // API 함수를 호출하여 서버에 데이터를 전송합니다.
    await submitInspection(inspectionData)

    alert('검수 신청이 성공적으로 완료되었습니다!')

    // TODO: 신청 완료 후에는 Store를 초기화하고 메인 페이지나 마이페이지로 이동시킵니다.
    // inspectionStore.$reset();
    // router.push('/mypage/inspections');
  } catch (err) {
    error.value = err?.message || '신청 처리 중 오류가 발생했습니다.'
    alert(error.value)
  } finally {
    isLoading.value = false
  }
}
</script>

<template>
  <main class="bg-light py-5 inspection">
    <div class="container">
      <div class="mb-4 text-center">
        <h2 class="font-weight-bold">온라인 1차 검수 신청</h2>
      </div>

      <div class="mb-5">
        <p class="text-primary font-weight-bold mb-1">[3 / 3] 신청 내용 확인</p>
        <div class="progress" style="height: 6px">
          <div class="progress-bar bg-primary" style="width: 100%"></div>
        </div>
      </div>

      <div class="card shadow-sm mb-4">
        <div class="card-body">
          <h5 class="font-weight-bold mb-4">신청 정보 요약</h5>

          <!-- 상품 정보 -->
          <div class="mb-4">
            <h6 class="font-weight-bold">상품 정보</h6>
            <dl class="row mt-3">
              <dt class="col-sm-3 text-muted">카테고리</dt>
              <dd class="col-sm-9">{{ selectedCategoryValue?.name || '-' }}</dd>

              <dt class="col-sm-3 text-muted">아티스트</dt>
              <dd class="col-sm-9">{{ selectedArtist?.nameKo || '-' }}</dd>

              <dt class="col-sm-3 text-muted">앨범</dt>
              <dd class="col-sm-9">{{ selectedAlbum?.title || '-' }}</dd>

              <dt class="col-sm-3 text-muted">상품명</dt>
              <dd class="col-sm-9">{{ itemName || '-' }}</dd>

              <dt class="col-sm-3 text-muted">설명</dt>
              <dd class="col-sm-9">{{ itemDescription || '-' }}</dd>

              <dt class="col-sm-3 text-muted">해시태그</dt>
              <dd class="col-sm-9">{{ hashtags || '-' }}</dd>
            </dl>
          </div>

          <div class="border-top pt-3 mb-4">
            <h6 class="font-weight-bold">상세 체크리스트</h6>
            <dl class="row mt-3" v-if="checklists.length > 0">
              <template v-for="c in checklists" :key="c.checklistItemId">
                <dt class="col-sm-3 text-muted">{{ c.label }}</dt>
                <dd class="col-sm-9">{{ formatAnswer(answers[c.itemKey]) }}</dd>
              </template>
            </dl>
            <p v-else class="text-muted">선택된 체크리스트가 없습니다.</p>
          </div>

          <div class="border-top pt-3 mb-4">
            <h6 class="font-weight-bold">가격 정보</h6>
            <dl class="row mt-3">
              <dt class="col-sm-3 text-muted">시스템 예상가</dt>
              <dd class="col-sm-9">{{ formatPrice(expectedPrice) }}</dd>

              <dt class="col-sm-3 text-muted">평균 시세</dt>
              <dd class="col-sm-9">{{ formatPrice(marketAvgPrice) }}</dd>

              <dt class="col-sm-3 text-muted">판매 희망가</dt>
              <dd class="col-sm-9">{{ formatPrice(sellerHopePrice) }}</dd>
            </dl>
          </div>

          <div class="border-top pt-3 mb-4">
            <h6 class="font-weight-bold">배송 및 정산 정보</h6>
            <dl class="row mt-3">
              <dt class="col-sm-3 text-muted">배송 주소</dt>
              <dd class="col-sm-9">{{ shippingAddress }} {{ shippingAddressDetail }}</dd>

              <dt class="col-sm-3 text-muted">정산 계좌</dt>
              <dd class="col-sm-9">[{{ bankName }}] {{ bankAccount }}</dd>
            </dl>
          </div>

          <div class="border-top pt-3 mb-4">
            <h6 class="font-weight-bold">업로드된 사진</h6>
            <div class="d-flex gap-2 mt-3 flex-wrap">
              <div v-for="f in uploadedFiles" :key="f.previewUrl" class="thumbnail-wrapper">
                <img :src="f.previewUrl" class="img-thumbnail rounded" :alt="f.name" />
              </div>
            </div>
          </div>
        </div>
      </div>

      <div class="mb-3 form-check">
        <input class="form-check-input" type="checkbox" id="agree" v-model="isAgreed" />
        <label class="form-check-label" for="agree">
          검수 및 판매 대행 정책에 모두 동의합니다.
          <a href="#" @click.prevent="openPolicyModal" class="text-primary font-weight-bold ml-2">(내용 보기)</a>
        </label>
      </div>
      <div class="d-flex justify-content-between">
        <button class="btn btn-secondary px-5" @click="goPrev" :disabled="isLoading">이전 단계</button>
        <button class="btn btn-primary px-5" @click="finish" :disabled="!isAgreed || isLoading">
          <span v-if="isLoading" class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
          {{ isLoading ? '신청 처리 중...' : '신청 완료' }}
        </button>
      </div>
    </div>
  </main>

  <div class="modal fade" id="policyModal" tabindex="-1" aria-hidden="true">
    <div class="modal-dialog modal-dialog-centered modal-lg modal-dialog-scrollable">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title font-weight-bold">검수 및 판매 대행 정책</h5>
          <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
        </div>
        <div class="modal-body">
          <p>검수 신청 전, 아래의 판매 대행 정책을 반드시 확인하고 동의해주세요.</p>

          <h6><strong>제 1조: 판매 가격 결정 정책</strong></h6>
          <p>1. 판매자는 '판매 희망가'를 제안할 수 있습니다.</p>
          <p>2. 판매자의 '판매 희망가'가 당사가 산정한 '시스템 예상가'의 150%를 초과할 경우, 해당 상품은 우선적으로 <strong>경매 방식</strong>으로 판매가 진행됩니다.</p>
          <ul>
            <li>경매 시작가는 판매자의 '판매 희망가'로 설정됩니다.</li>
            <li>경매는 48시간 동안 진행되며, 최고가에 낙찰됩니다.</li>
          </ul>
          <p>
            3. 경매가 유찰되거나(48시간 내에 입찰자가 없는 경우), 판매자의 '판매 희망가'가 예상가의 150% 이하인 경우, 상품은 당사의 내부 가격 정책에 따라 최종 판매가가 결정되어 일반 판매로 전환됩니다.
            최종 판매가는 '시스템 예상가'와 '평균 시세' 등을 종합적으로 고려하여 산정됩니다.
          </p>

          <h6><strong>제 2조: 검수 및 등급 판정</strong></h6>
          <p>1. 온라인 1차 검수 신청 내용과 실제 상품의 상태가 현저히 다를 경우, 검수가 반려되거나 판매 가격이 조정될 수 있습니다.</p>

          <h6><strong>제 3조: 정산</strong></h6>
          <p>판매 대금은 상품 판매 완료일로부터 5영업일 이내에 등록된 계좌로 정산됩니다. (판매 수수료 5% 차감)</p>

          <hr />
          <p class="font-weight-bold">위 정책에 동의하고 검수 신청을 진행하시겠습니까?</p>
        </div>
        <div class="modal-footer">
          <button type="button" class="btn btn-primary" data-bs-dismiss="modal" @click="isAgreed = true">확인 및 동의</button>
        </div>
      </div>
    </div>
  </div>
</template>
<style lang="scss" scoped>
.thumbnail-wrapper {
  position: relative;
  display: inline-block;

  img {
    width: 100px;
    height: 100px;
    object-fit: cover;
    border-radius: 6px;
  }
}
dl {
  font-size: 0.95rem;
}
dt {
  font-weight: 400;
}
dd {
  font-weight: 500;
  color: #333;
}
</style>
