<script setup>
import { ref, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useModal } from '@/composables/useModal'
import { getOnlineInspectionDetail, approveOnlineInspection, rejectOnlineInspection } from '@/api/adminInspection'
import { useAdminInspectionStore } from '@/stores/adminInspectionStore'

const router = useRouter()
const route = useRoute()
const adminStore = useAdminInspectionStore()
// 상태
const loading = ref(false)
const detail = ref(null)
const selectedImage = ref(null)
const inspectionId = ref(null)
const inspectionStatus = ref(null)

const { initModal, show: showImageModal } = useModal('#imageModal')

// 검수 상세 조회
onMounted(async () => {
  const paramId = parseInt(route.params.id, 10)
  if (paramId) {
    inspectionId.value = paramId
    await fetchDetail(inspectionId.value)
  }

  initModal()
})

async function fetchDetail(inspectionId) {
  loading.value = true
  try {
    const res = await getOnlineInspectionDetail(inspectionId)
    detail.value = {
      ...res,
      files: res.files || [],
      answers: res.answers || [],
      seller: res.seller || {},
    }
    inspectionStatus.value = detail.value.inspectionStatus
  } catch (err) {
    console.error('검수 상세 조회 실패:', err)
    alert(err.message || '데이터를 불러오는 데 실패했습니다.')
  } finally {
    loading.value = false
  }
}

// 유틸리티
const getImageUrl = (path) => {
  if (!path) return ''
  if (/^https?:\/\//i.test(path)) return path
  // .env 파일의 VITE_FILE_BASE_URL 환경변수가 올바르게 설정되었는지 확인하세요.
  const base = import.meta.env.VITE_FILE_BASE_URL || ''
  return `${base.replace(/\/$/, '')}/${path.replace(/^\//, '')}`
}
const formatDate = (v) => (v ? new Date(v).toLocaleString('ko-KR') : '-')
const formatPrice = (v) => (v != null ? `${Number(v).toLocaleString()}원` : '-')
const cleanString = (v) => v?.replace(/"/g, '') || '-'

// 이미지 모달
const openImageModal = (url) => {
  selectedImage.value = url
  showImageModal()
}

// 승인
const approve = async () => {
  if (!confirm('정말로 승인 처리하시겠습니까?')) return
  loading.value = true

  try {
    await approveOnlineInspection(inspectionId.value)
    alert('승인 처리가 완료되었습니다.')
    router.push('/admin/inspection/online')
  } catch (err) {
    console.error('승인 처리 실패:', err)
    alert(err.message || '승인 처리 중 오류가 발생했습니다.')
  } finally {
    loading.value = false
  }
}

// 반려
const reject = async () => {
  const reason = prompt('반려 사유를 입력해주세요.')
  // 사용자가 취소하거나 입력하지 않을 시
  if (!reason) {
    if (reason === '') alert('반려 사유를 반드시 입력해야 합니다.')
    return
  }

  loading.value = true
  try {
    await rejectOnlineInspection(inspectionId.value, reason)
    alert('반려 처리가 완료되었습니다.')
    router.push('/admin/inspection/online')
  } catch (err) {
    console.error('반려 처리 실패:', err)
    alert(err.message || '반려 처리 중 오류가 발생했습니다.')
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <main class="container-fluid p-4">
    <div class="card shadow-sm border-0 rounded-3 overflow-hidden">
      <div class="card-header bg-white border-bottom-0 pt-4 px-4 pb-2">
        <div class="d-flex justify-content-between align-items-center">
          <div>
            <h4 class="fw-semibold text-dark mb-1">1차 온라인 검수 상세</h4>
            <p class="text-muted small mb-0">판매자가 제출한 상품의 상세 정보를 확인하고 승인 또는 반려를 진행합니다.</p>
          </div>
          <div class="d-flex align-items-center">
            <button class="btn btn-sm btn-outline-secondary fw-medium px-3" @click="router.back()">목록</button>
            <div v-if="inspectionStatus === 'SUBMITTED'">
              <button class="btn btn-sm btn-danger fw-medium px-3 ms-3" @click="reject">반려</button>
              <button class="btn btn-sm btn-primary fw-medium px-3 ms-2" @click="approve">승인</button>
            </div>
          </div>
        </div>
      </div>

      <div class="card-body p-4">
        <div v-if="loading" class="text-center py-5">
          <div class="spinner-border text-primary" role="status" style="width: 3rem; height: 3rem"></div>
          <p class="mt-3 text-muted">데이터를 불러오는 중입니다...</p>
        </div>

        <div v-else-if="detail" class="row g-4 g-lg-5">
          <div class="col-lg-7">
            <section>
              <h5 class="fw-semibold border-bottom pb-2 mb-3">상품 정보</h5>
              <dl class="info-grid">
                <dt>상품명</dt>
                <dd>{{ detail.itemName }}</dd>
                <dt>카테고리</dt>
                <dd>{{ detail.goodsCategoryName }}</dd>
                <dt>아티스트</dt>
                <dd>{{ detail.artistName }}</dd>
                <dt>상품 설명</dt>
                <dd>{{ detail.itemDescription }}</dd>
              </dl>
            </section>

            <section class="mt-4 pt-2">
              <h5 class="fw-semibold border-bottom pb-2 mb-3">가격 정보</h5>
              <dl class="info-grid">
                <dt>판매자 희망가</dt>
                <dd class="text-primary fw-bold">{{ formatPrice(detail.sellerHopePrice) }}</dd>
                <dt>시스템 예상가</dt>
                <dd>{{ formatPrice(detail.expectedPrice) }}</dd>
                <dt>시장 평균가</dt>
                <dd>{{ detail.marketAvgPrice ? formatPrice(detail.marketAvgPrice) : '-' }}</dd>
              </dl>
            </section>

            <section class="mt-4 pt-2">
              <h5 class="fw-semibold border-bottom pb-2 mb-3">판매자 정보</h5>
              <dl class="info-grid">
                <dt>이름</dt>
                <dd>{{ detail.seller.name || '-' }}</dd>
                <dt>이메일</dt>
                <dd>{{ detail.seller.email || '-' }}</dd>
                <dt>연락처</dt>
                <dd>{{ detail.seller.tel || '-' }}</dd>
                <dt>배송 주소</dt>
                <dd>{{ detail.shippingAddress }} {{ detail.shippingAddressDetail }}</dd>
                <dt>정산 계좌</dt>
                <dd>{{ detail.bankName }} / {{ detail.bankAccount }}</dd>
              </dl>
            </section>
          </div>

          <div class="col-lg-5">
            <section class="mb-4">
              <div class="d-flex justify-content-between align-items-start mb-3">
                <h5 class="fw-semibold mb-0">검수 정보</h5>
                <span :class="['badge fs-6', adminStore.getStatusBadge(detail.inspectionStatus)]">
                  {{ adminStore.getStatusLabel(detail.inspectionStatus) }}
                </span>
              </div>
              <div class="bg-light rounded-3 p-3">
                <dl class="info-grid small">
                  <dt>검수 ID</dt>
                  <dd>{{ detail.productInspectionId }}</dd>
                  <dt>제출일</dt>
                  <dd>{{ formatDate(detail.submittedAt) }}</dd>
                  <dt>UUID</dt>
                  <dd class="text-break">{{ detail.submissionUuid }}</dd>
                </dl>
              </div>
            </section>

            <section class="mb-4">
              <h5 class="fw-semibold border-bottom pb-2 mb-3">상품 이미지</h5>
              <div v-if="detail.files.length" class="d-flex flex-wrap gap-2">
                <div v-for="file in detail.files" :key="file.fileId" class="thumbnail-wrapper" @click="openImageModal(getImageUrl(file.fileUrl))">
                  <img :src="getImageUrl(file.fileUrl)" alt="상품 썸네일" />
                </div>
              </div>
              <p v-else class="text-muted small mb-0">등록된 이미지가 없습니다.</p>
            </section>

            <section>
              <h5 class="fw-semibold border-bottom pb-2 mb-3">셀러 체크리스트</h5>
              <div v-if="detail.answers.length">
                <dl class="info-grid info-grid-wide">
                  <template v-for="answer in detail.answers" :key="answer.itemKey">
                    <dt>{{ answer.itemLabel }}</dt>
                    <dd class="text-primary">{{ cleanString(answer.answerValue) }}</dd>
                  </template>
                </dl>
              </div>
              <p v-else class="text-muted small mb-0">체크리스트 답변이 없습니다.</p>
            </section>
          </div>
        </div>

        <div v-else class="text-center py-5">
          <p class="text-muted">검수 정보를 찾을 수 없습니다.</p>
        </div>
      </div>
    </div>

    <div class="modal fade" id="imageModal" tabindex="-1">
      <div class="modal-dialog modal-lg modal-dialog-centered">
        <div class="modal-content border-0 bg-transparent">
          <div class="modal-body p-0">
            <img :src="selectedImage" class="img-fluid rounded" alt="확대 이미지" />
          </div>
        </div>
      </div>
    </div>
  </main>
</template>

<style scoped lang="scss">
/* 카드 헤더 제목 */
.card-header h4 {
  font-size: 1.25rem;
}

/* 정보 표시 그리드 기본 스타일 */
.info-grid {
  display: grid;
  grid-template-columns: 120px 1fr; /* 기본 라벨 너비 */
  gap: 0.8rem 1rem;

  dt {
    color: #555;
    font-weight: 500;
    flex-shrink: 0;
  }

  dd {
    margin: 0;
    color: #222;
    word-break: break-word; /* 긴 텍스트 줄바꿈 처리 */
    min-width: 0; /* 그리드 컨테이너 내에서 줄바꿈이 잘 동작하도록 함 */
  }

  /* 검수 정보처럼 작은 그리드 */
  &.small {
    grid-template-columns: 80px 1fr;
    gap: 0.5rem 1rem;
  }
}

/* 체크리스트처럼 넓은 라벨이 필요한 그리드 */
.info-grid-wide {
  grid-template-columns: 200px 1fr; /* 확장된 라벨 너비 */
}

/* 썸네일 이미지 스타일 */
.thumbnail-wrapper {
  width: 80px;
  height: 80px;
  border-radius: 0.5rem;
  overflow: hidden;
  cursor: pointer;
  border: 1px solid #dee2e6;
  background-color: #f8f9fa;

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    transition: transform 0.2s ease-in-out;
  }

  &:hover img {
    transform: scale(1.1);
  }
}
</style>
