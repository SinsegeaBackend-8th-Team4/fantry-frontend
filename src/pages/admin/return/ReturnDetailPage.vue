<script setup>
import { ref, onMounted, computed } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { getAdminReturnDetail, updateAdminReturnStatus } from '@/api/adminReturn.js';
import { formatDate } from '@/utils/tableFormatters';
import { useAlertDialog } from '@/composables/useAlertDialog';

const route = useRoute();
const router = useRouter();
const { showAlert: showAlertDialog } = useAlertDialog();

const returnRequestId = ref(route.params.returnRequestId);
const returnRequest = ref(null);
const loading = ref(false);
const error = ref(null);

// 반품/환불 상세 정보 로드
async function fetchReturnDetail() {
  loading.value = true;
  try {
    const response = await getAdminReturnDetail(returnRequestId.value);
    returnRequest.value = response.data;
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

  if (!confirm(`상태를 '${statusKorean[newStatus] || newStatus}'(으)로 변경하시겠습니까?`)) return;
  
  loading.value = true;
  try {
    await updateAdminReturnStatus(returnRequestId.value, { status: newStatus });
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
                <p class="fw-bold">{{ formatDate(returnRequest.createdAt) }}</p>
              </div>
              <div class="col-md-6">
                <p class="mb-1 text-muted small">마지막 업데이트</p>
                <p class="fw-bold">{{ formatDate(returnRequest.updatedAt) }}</p>
              </div>
              <div class="col-12">
                <p class="mb-1 text-muted small">요청 사유</p>
                <p class="fw-bold">{{ returnRequest.reason }}</p>
              </div>
              <div v-if="returnRequest.attachments && returnRequest.attachments.length > 0" class="col-12">
                 <p class="mb-1 text-muted small">첨부 파일</p>
                 <!-- 첨부파일 렌더링 -->
              </div>
            </div>
          </div>
        </div>

        <!-- 상품 정보 -->
        <div class="card shadow-sm border-0 rounded-3">
           <div class="card-header bg-white border-bottom-0 pt-4 px-4 pb-2">
            <h5 class="fw-bold text-dark">상품 정보</h5>
          </div>
          <div class="card-body p-4">
             <div class="row g-3">
                <div class="col-md-6"><p class="mb-1 text-muted small">주문 번호</p><p class="fw-bold">{{ returnRequest.orderId }}</p></div>
                <div class="col-md-6"><p class="mb-1 text-muted small">상품 ID</p><p class="fw-bold">{{ returnRequest.productId }}</p></div>
                <div class="col-12"><p class="mb-1 text-muted small">상품명</p><p class="fw-bold">{{ returnRequest.productName }}</p></div>
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
              <button class="btn btn-info" @click="handleStatusChange('IN_TRANSIT')" :disabled="loading">처리중으로 변경</button>
              <button class="btn btn-warning" @click="handleStatusChange('INSPECTING')" :disabled="loading">검수중으로 변경</button>
              <button class="btn btn-success" @click="handleStatusChange('APPROVED')" :disabled="loading">승인</button>
              <button class="btn btn-danger" @click="handleStatusChange('REJECTED')" :disabled="loading">거절</button>
              <button class="btn btn-dark" @click="handleStatusChange('COMPLETED')" :disabled="loading">완료 처리</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </main>
</template>