<script setup>
import { ref, onMounted, computed } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { getAdminReturnDetail, updateAdminReturn } from '@/api/adminReturn.js';
import { formatDateTime } from '@/utils/tableFormatters';
import { useAlertDialog } from '@/composables/useAlertDialog';

const route = useRoute();
const router = useRouter();
const { showAlert: showAlertDialog } = useAlertDialog();

const returnRequestId = ref(Number(route.params.returnRequestId));
const returnRequest = ref(null);
const loading = ref(false);
const error = ref(null);

const showRejectReasonModal = ref(false);
const rejectReasonInput = ref('');
const deductedShippingFeeInput = ref(0); // 차감 배송비 입력 필드

// URL이 이미지 파일인지 확인하는 헬퍼 함수
function isImage(url) {
  return /\.(jpeg|jpg|gif|png|webp|bmp)$/i.test(url);
}

// 반품/환불 상세 정보 로드
async function fetchReturnDetail() {
  loading.value = true;
  try {
    const response = await getAdminReturnDetail(returnRequestId.value);
    returnRequest.value = response.data;
    // 기존 차감 배송비가 있으면 폼에 설정
    deductedShippingFeeInput.value = returnRequest.value.deductedShippingFee || 0;
  } catch (e) {
    error.value = '환불/반품 정보를 불러오는 데 실패했습니다.';
    console.error(e);
  } finally {
    loading.value = false;
  }
}

// 상태 변경
async function handleStatusChange(newStatus) {
  const statusKorean = {
    'IN_TRANSIT': '처리중',
    'INSPECTING': '검수중',
    'APPROVED': '승인',
    'REJECTED': '거절',
    'COMPLETED': '완료'
  };

  if (newStatus === 'REJECTED') {
    showRejectReasonModal.value = true;
    return;
  }

  if (!confirm(`상태를 '${statusKorean[newStatus] || newStatus}'(으)로 변경하시겠습니까?`)) return;
  
  await updateReturnRequest(newStatus);
}

async function confirmReject() {
  if (!rejectReasonInput.value.trim()) {
    showAlertDialog('알림', '거절 사유를 입력해주세요.');
    return;
  }
  if (!confirm(`상태를 '거절'로 변경하고 거절 사유를 저장하시겠습니까?`)) return;

  showRejectReasonModal.value = false;
  await updateReturnRequest('REJECTED', rejectReasonInput.value);
  rejectReasonInput.value = ''; // 초기화
}

// 차감 배송비 업데이트
async function updateDeductedShippingFee() {
  if (!confirm(`차감 배송비를 ${deductedShippingFeeInput.value.toLocaleString()}원(으)로 저장하시겠습니까?`)) return;

  loading.value = true;
  try {
    const payload = {
      status: returnRequest.value.status, // 현재 상태 유지
      deductedShippingFee: deductedShippingFeeInput.value,
    };
    await updateAdminReturn(returnRequestId.value, payload);
    showAlertDialog('성공', '차감 배송비가 성공적으로 저장되었습니다.');
    await fetchReturnDetail(); // 정보 새로고침
  } catch (e) {
    error.value = '차감 배송비 저장 중 오류가 발생했습니다.';
    console.error(e);
  } finally {
    loading.value = false;
  }
}

async function updateReturnRequest(newStatus, rejectReason = null) {
  loading.value = true;
  try {
    const payload = {
      status: newStatus,
      rejectReason: rejectReason,
      deductedShippingFee: deductedShippingFeeInput.value, // 차감 배송비 추가
      // memo 등 필요시 추가
    };
    await updateAdminReturn(returnRequestId.value, payload);
    showAlertDialog('성공', '상태가 성공적으로 변경되었습니다.');
    await fetchReturnDetail(); // 정보 새로고침
  } catch (e) {
    error.value = '상태 변경 중 오류가 발생했습니다.';
    console.error(e);
  } finally {
    loading.value = false;
  }
}

const statusInfo = computed(() => {
  if (!returnRequest.value) return {};
  const status = returnRequest.value.status;
  let badgeClass = 'bg-light text-dark';
  let koreanText = status;
  switch (status) {
    case 'REQUESTED': badgeClass = 'bg-primary'; koreanText = '요청됨'; break;
    case 'IN_TRANSIT': badgeClass = 'bg-info'; koreanText = '처리중'; break;
    case 'INSPECTING': badgeClass = 'bg-warning'; koreanText = '검수중'; break;
    case 'APPROVED': badgeClass = 'bg-success'; koreanText = '승인됨'; break;
    case 'REJECTED': badgeClass = 'bg-danger'; koreanText = '거절됨'; break;
    case 'COMPLETED': badgeClass = 'bg-dark'; koreanText = '완료됨'; break;
    case 'USER_CANCELLED': badgeClass = 'bg-secondary'; koreanText = '사용자 취소'; break;
    case 'DELETED': badgeClass = 'bg-danger bg-opacity-50'; koreanText = '삭제됨'; break;
  }
  return { badgeClass, koreanText };
});


function goBack() {
  router.push('/admin/return/list');
}

onMounted(fetchReturnDetail);
</script>

<template>
  <main class="container-fluid p-4">
    <div class="d-flex justify-content-between align-items-center mb-4">
      <div>
        <h4 class="fw-semibold text-dark mb-1">환불/반품 상세 정보</h4>
        <p class="text-muted small">요청된 환불/반품 건의 상세 내역을 확인하고 처리 상태를 관리합니다.</p>
      </div>
      <button type="button" class="btn btn-outline-secondary" @click="goBack">
        <i class="fas fa-list me-2"></i> 목록으로
      </button>
    </div>

    <div v-if="loading && !returnRequest" class="text-center py-5">
      <div class="spinner-border text-primary" role="status">
        <span class="visually-hidden">Loading...</span>
      </div>
    </div>
    <div v-if="error" class="alert alert-danger">{{ error }}</div>

    <div v-if="returnRequest" class="row">
      <div class="col-lg-8">
        <!-- 요청 상세 정보 -->
        <div class="card shadow-sm border-0 rounded-3 mb-4">
          <div class="card-header bg-white border-bottom-0 pt-4 px-4 pb-2">
            <h5 class="fw-bold text-dark">요청 정보</h5>
          </div>
          <div class="card-body p-4">
            <div class="row g-3">
              <div class="col-md-6">
                <p class="mb-1 text-muted small">요청 번호</p>
                <p class="fw-bold">{{ returnRequest.returnRequestId }}</p>
              </div>
              <div class="col-md-6">
                <p class="mb-1 text-muted small">현재 상태</p>
                <p><span class="badge fs-6" :class="statusInfo.badgeClass">{{ statusInfo.koreanText }}</span></p>
              </div>
              <div class="col-md-6">
                <p class="mb-1 text-muted small">요청일</p>
                <p class="fw-bold">{{ formatDateTime(returnRequest.requestedAt) }}</p>
              </div>
              <div class="col-md-6">
                <p class="mb-1 text-muted small">마지막 업데이트</p>
                <p class="fw-bold">{{ formatDateTime(returnRequest.updatedAt) }}</p>
              </div>
              <div class="col-12">
                <p class="mb-1 text-muted small">요청 사유</p>
                <p class="fw-bold">{{ returnRequest.reason }}</p>
              </div>
              <div v-if="returnRequest.detailReason" class="col-12">
                <p class="mb-1 text-muted small">상세 사유</p>
                <p class="fw-bold">{{ returnRequest.detailReason }}</p>
              </div>
              <div v-if="returnRequest.rejectReason" class="col-12">
                <p class="mb-1 text-muted small">거절 사유</p>
                <p class="fw-bold text-danger">{{ returnRequest.rejectReason }}</p>
              </div>
              <div v-if="returnRequest.comment" class="col-12">
                <p class="mb-1 text-muted small">관리자 메모</p>
                <p class="fw-bold">{{ returnRequest.comment }}</p>
              </div>
              <div v-if="returnRequest.attachmentUrls && returnRequest.attachmentUrls.length > 0" class="col-12">
                 <p class="mb-1 text-muted small">첨부 파일</p>
                 <div class="d-flex flex-wrap gap-2">
                    <div v-for="(url, index) in returnRequest.attachmentUrls" :key="index">
                        <a :href="url" target="_blank" class="btn btn-sm btn-outline-info" v-if="!isImage(url)">
                            <i class="fas fa-paperclip me-1"></i> 파일 {{ index + 1 }}
                        </a>
                        <a :href="url" target="_blank" v-else>
                            <img :src="url" alt="Attachment Preview" class="img-thumbnail" style="max-width: 150px; max-height: 150px; object-fit: cover;">
                        </a>
                    </div>
                 </div>
              </div>
            </div>
          </div>
        </div>

        <!-- 상품 정보 -->
        <div class="card shadow-sm border-0 rounded-3 mb-4">
           <div class="card-header bg-white border-bottom-0 pt-4 px-4 pb-2">
            <h5 class="fw-bold text-dark">상품 정보</h5>
          </div>
          <div class="card-body p-4">
             <div v-if="returnRequest.items && returnRequest.items.length > 0">
                <div v-for="(item, index) in returnRequest.items" :key="index" class="mb-3 pb-3 border-bottom">
                    <div class="row g-3">
                        <div class="col-md-6"><p class="mb-1 text-muted small">주문 번호</p><p class="fw-bold">{{ item.orderId }}</p></div>
                        <div class="col-md-6"><p class="mb-1 text-muted small">상품명</p><p class="fw-bold">{{ item.productName }}</p></div>
                        <div class="col-md-6"><p class="mb-1 text-muted small">판매 금액</p><p class="fw-bold">{{ item.itemSaleAmount?.toLocaleString() }}원</p></div>
                        <div class="col-md-6"><p class="mb-1 text-muted small">수수료율</p><p class="fw-bold">{{ item.commissionRate }}%</p></div>
                        <div class="col-md-6"><p class="mb-1 text-muted small">수수료 금액</p><p class="fw-bold">{{ item.commissionAmount?.toLocaleString() }}원</p></div>
                        <div class="col-md-6"><p class="mb-1 text-muted small">총 정산 금액</p><p class="fw-bold">{{ item.totalAmount?.toLocaleString() }}원</p></div>
                        <div class="col-md-6"><p class="mb-1 text-muted small">반품 여부</p><p class="fw-bold">{{ item.isReturned ? '예' : '아니오' }}</p></div>
                    </div>
                </div>
             </div>
             <div v-else class="alert alert-info">관련 상품 정보가 없습니다.</div>
          </div>
        </div>

        <!-- 정산 정보 -->
        <div class="card shadow-sm border-0 rounded-3 mb-4">
          <div class="card-header bg-white border-bottom-0 pt-4 px-4 pb-2">
            <h5 class="fw-bold text-dark">정산 정보</h5>
          </div>
          <div class="card-body p-4">
            <div class="row g-3">
              <div class="col-md-6">
                <p class="mb-1 text-muted small">원래 결제 금액</p>
                <p class="fw-bold">{{ returnRequest.originalPaymentAmount?.toLocaleString() }}원</p>
              </div>
              <div class="col-md-6">
                <p class="mb-1 text-muted small">차감 배송비</p>
                <p class="fw-bold">{{ returnRequest.deductedShippingFee?.toLocaleString() }}원</p>
              </div>
              <div class="col-md-6">
                <p class="mb-1 text-muted small">최종 환불 금액</p>
                <p class="fw-bold">{{ returnRequest.finalRefundAmount?.toLocaleString() }}원</p>
              </div>
            </div>
          </div>
        </div>

      </div>

      <div class="col-lg-4">
        <!-- 구매자 정보 -->
        <div class="card shadow-sm border-0 rounded-3 mb-4">
          <div class="card-header bg-white border-bottom-0 pt-4 px-4 pb-2">
            <h5 class="fw-bold text-dark">구매자 정보</h5>
          </div>
          <div class="card-body p-4">
            <p class="mb-1 text-muted small">이름</p>
            <p class="fw-bold">{{ returnRequest.buyerName }}</p>
            <p class="mb-1 text-muted small">요청자</p>
            <p class="fw-bold">{{ returnRequest.createdBy || 'N/A' }}</p>
          </div>
        </div>

        <!-- 상태 관리 -->
        <div class="card shadow-sm border-0 rounded-3">
          <div class="card-header bg-white border-bottom-0 pt-4 px-4 pb-2">
            <h5 class="fw-bold text-dark">요청 처리</h5>
          </div>
          <div class="card-body p-4">
            <p class="text-muted small mb-3">요청 상태를 변경합니다. 상태 변경은 되돌릴 수 없으니 신중하게 결정해주세요.</p>
            <div class="d-grid gap-2">
              <button class="btn btn-info" @click="handleStatusChange('IN_TRANSIT')" :disabled="loading || returnRequest.status === 'IN_TRANSIT'">처리중으로 변경</button>
              <button class="btn btn-warning" @click="handleStatusChange('INSPECTING')" :disabled="loading || returnRequest.status === 'INSPECTING'">검수중으로 변경</button>
              <button class="btn btn-success" @click="handleStatusChange('APPROVED')" :disabled="loading || returnRequest.status === 'APPROVED'">승인</button>
              <button class="btn btn-danger" @click="handleStatusChange('REJECTED')" :disabled="loading || returnRequest.status === 'REJECTED'">거절</button>
              <button class="btn btn-dark" @click="handleStatusChange('COMPLETED')" :disabled="loading || returnRequest.status === 'COMPLETED'">완료 처리</button>
            </div>
          </div>
        </div>

        <!-- 차감 배송비 입력 -->
        <div class="card shadow-sm border-0 rounded-3 mt-4">
          <div class="card-header bg-white border-bottom-0 pt-4 px-4 pb-2">
            <h5 class="fw-bold text-dark">차감 배송비 설정</h5>
          </div>
          <div class="card-body p-4">
            <div class="input-group mb-3">
              <span class="input-group-text">₩</span>
              <input type="number" class="form-control" v-model.number="deductedShippingFeeInput" min="0" :disabled="loading">
              <button class="btn btn-primary" type="button" @click="updateDeductedShippingFee" :disabled="loading">저장</button>
            </div>
            <small class="form-text text-muted">환불 시 차감할 배송비를 입력하고 저장하세요.</small>
          </div>
        </div>

      </div>
    </div>

    <!-- 거절 사유 입력 모달 -->
    <div v-if="showRejectReasonModal" class="modal fade show" style="display: block; background-color: rgba(0,0,0,0.5);" tabindex="-1" aria-labelledby="rejectReasonModalLabel" aria-hidden="true">
      <div class="modal-dialog">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title" id="rejectReasonModalLabel">거절 사유 입력</h5>
            <button type="button" class="btn-close" @click="showRejectReasonModal = false" aria-label="Close"></button>
          </div>
          <div class="modal-body">
            <div class="mb-3">
              <label for="reject-reason-text" class="form-label">거절 사유</label>
              <textarea class="form-control" id="reject-reason-text" rows="3" v-model="rejectReasonInput"></textarea>
            </div>
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-secondary" @click="showRejectReasonModal = false">취소</button>
            <button type="button" class="btn btn-primary" @click="confirmReject">확인</button>
          </div>
        </div>
      </div>
    </div>
  </main>
</template>

<style scoped>
.img-thumbnail {
  border: 1px solid #ddd;
  padding: 3px;
  border-radius: 5px;
}

.gap-2 {
  gap: 0.5rem;
}
</style>
