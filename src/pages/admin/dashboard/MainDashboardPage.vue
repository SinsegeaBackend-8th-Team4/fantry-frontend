<template>
  <div>
    <h3>전체 대시보드 요약</h3>
    <p>이곳에 모든 관리 기능에 대한 핵심 지표들을 요약하여 보여줍니다.</p>
    
    <div v-if="summaryData" class="row">
      <!-- 답변 대기 카드 -->
      <div class="col-xl-3 col-md-6 mb-4">
        <div class="card border-left-warning shadow h-100 py-2">
          <div class="card-body">
            <div class="row no-gutters align-items-center">
              <div class="col mr-2">
                <div class="text-xs font-weight-bold text-warning text-uppercase mb-1">
                  답변 대기 (문의)</div>
                <div class="h5 mb-0 font-weight-bold text-gray-800">{{ summaryData.inquiryStats.pendingCount }}</div>
              </div>
              <div class="col-auto">
                <i class="fas fa-comments fa-2x text-gray-300"></i>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- 기존 예시 카드 (수정 또는 필요시 제거) -->
      <div class="col-xl-3 col-md-6 mb-4">
        <div class="card border-left-success shadow h-100 py-2">
          <div class="card-body">
            <div class="row no-gutters align-items-center">
              <div class="col mr-2">
                <div class="text-xs font-weight-bold text-success text-uppercase mb-1">
                  전체 매출 (연간)</div>
                <div class="h5 mb-0 font-weight-bold text-gray-800">$215,000</div>
              </div>
              <div class="col-auto">
                <i class="fas fa-dollar-sign fa-2x text-gray-300"></i>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div v-else-if="error">
      <p class="text-danger">{{ error }}</p>
    </div>
    <div v-else>
      <p>데이터를 불러오는 중입니다...</p>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { getDashboardSummary } from '@/api/adminDashboard.js';

const summaryData = ref(null);
const error = ref(null);

onMounted(async () => {
  try {
    // API 응답에서 data 객체를 직접 받습니다.
    summaryData.value = await getDashboardSummary();
  } catch (err) {
    console.error('대시보드 요약 데이터 조회 실패:', err);
    error.value = '데이터를 불러오는 데 실패했습니다.';
  }
});
</script>