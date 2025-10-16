<script setup>
<<<<<<< HEAD
import { ref, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { getReturnById, updateReturnStatus } from '@/api/adminReturn.js';
import LoadingSpinner from '@/components/common/atoms/LoadingSpinner.vue';

const route = useRoute();
const router = useRouter();
const returnRequestId = Number(route.params.returnRequestId);

const returnDetails = ref(null);
const loading = ref(true);
const error = ref(null);

// 상태 변경 관련
const selectedStatus = ref('');
const statusOptions = [
  { value: 'REQUESTED', text: '요청됨' },
  { value: 'PROCESSING', text: '처리중' },
  { value: 'APPROVED', text: '승인' },
  { value: 'REJECTED', text: '거절' },
  { value: 'COMPLETED', text: '완료' },
];

async function fetchData() {
  try {
    loading.value = true;
    const response = await getReturnById(returnRequestId);
    returnDetails.value = response.data;
    selectedStatus.value = response.data.status; // 현재 상태로 초기화
  } catch (e) {
    console.error('반품 상세 정보 조회 실패:', e);
    error.value = '데이터를 불러오는 중 오류가 발생했습니다.';
=======
import { ref, onMounted, computed } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { getAdminReturnDetail, updateAdminReturnStatus } from '@/api/adminReturn.js';
import { formatDate } from '@/utils/tableFormatters';

const route = useRoute();
const router = useRouter();

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
>>>>>>> 9e2ff05ff607911e93867be14c9d9027c109dd10
  } finally {
    loading.value = false;
  }
}

<<<<<<< HEAD
async function handleStatusUpdate() {
  if (!selectedStatus.value || selectedStatus.value === returnDetails.value.status) {
    alert('새로운 상태를 선택해주세요.');
    return;
  }
  if (confirm(`상태를 '${statusOptions.find(o => o.value === selectedStatus.value)?.text}' (으)로 변경하시겠습니까?`)) {
    try {
      await updateReturnStatus(returnRequestId, { status: selectedStatus.value });
      alert('상태가 성공적으로 변경되었습니다.');
      fetchData(); // 데이터 새로고침
    } catch (e) {
      console.error('상태 변경 실패:', e);
      alert('상태 변경 중 오류가 발생했습니다.');
    }
  }
}

function goToList() {
  router.push({ name: 'AdminReturnList' });
}

function formatDate(dateArray) {
  if (!dateArray || !Array.isArray(dateArray)) return '-';
  const dt = new Date(dateArray[0], dateArray[1] - 1, dateArray[2], dateArray[3], dateArray[4], dateArray[5] || 0);
  return `${dt.getFullYear()}-${String(dt.getMonth() + 1).padStart(2, '0')}-${String(dt.getDate()).padStart(2, '0')} ${String(dt.getHours()).padStart(2, '0')}:${String(dt.getMinutes()).padStart(2, '0')}`;
}

onMounted(fetchData);
</script>

<template>
  <div class="container-fluid p-4">
    <div v-if="loading" class="text-center"><LoadingSpinner /></div>
    <div v-if="error" class="alert alert-danger">{{ error }}</div>

    <div v-if="returnDetails" class="card shadow-sm">
      <div class="card-header d-flex justify-content-between align-items-center">
        <h5 class="card-title mb-0">반품/환불 상세 (ID: {{ returnDetails.returnRequestId }})</h5>
        <button class="btn btn-secondary" @click="goToList">목록</button>
      </div>
      <div class="card-body">
        <!-- 반품 상태 관리 -->
        <div class="row border-bottom pb-3 mb-3">
          <div class="col-md-8">
            <h6>상태 변경</h6>
            <div class="input-group">
              <select class="form-select" v-model="selectedStatus">
                <option v-for="opt in statusOptions" :key="opt.value" :value="opt.value">{{ opt.text }}</option>
              </select>
              <button class="btn btn-primary" @click="handleStatusUpdate">적용</button>
=======
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
    alert('상태가 성공적으로 변경되었습니다.');
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
>>>>>>> 9e2ff05ff607911e93867be14c9d9027c109dd10
            </div>
          </div>
        </div>

<<<<<<< HEAD
        <!-- 상세 정보 -->
        <div class="row">
          <div class="col-md-6">
            <p><strong>요청자:</strong> {{ returnDetails.memberName }}</p>
            <p><strong>상품명:</strong> {{ returnDetails.productName }}</p>
            <p><strong>주문번호:</strong> {{ returnDetails.orderId }}</p>
          </div>
          <div class="col-md-6">
            <p><strong>현재 상태:</strong> {{ returnDetails.status }}</p>
            <p><strong>요청일:</strong> {{ formatDate(returnDetails.requestedAt) }}</p>
            <p><strong>처리일:</strong> {{ returnDetails.processedAt ? formatDate(returnDetails.processedAt) : '-' }}</p>
          </div>
        </div>
        <hr>
        <h6>반품 사유</h6>
        <div class="p-3 bg-light rounded">
          <p>{{ returnDetails.reason || '사유 없음' }}</p>
        </div>
      </div>
    </div>
  </div>
</template>
=======
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
>>>>>>> 9e2ff05ff607911e93867be14c9d9027c109dd10
