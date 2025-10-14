<script setup>
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
  } finally {
    loading.value = false;
  }
}

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
            </div>
          </div>
        </div>

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
