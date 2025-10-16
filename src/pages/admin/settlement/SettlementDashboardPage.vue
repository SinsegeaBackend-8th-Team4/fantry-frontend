<template>
  <div>
    <!-- 페이지 제목 -->
    <div class="d-sm-flex align-items-center justify-content-between mb-4">
      <h1 class="h3 mb-0 text-gray-800">정산관리 요약</h1>
      <a href="#" class="d-none d-sm-inline-block btn btn-sm btn-primary shadow-sm">
        <i class="fas fa-download fa-sm text-white-50"></i> 정산 보고서 생성
      </a>
    </div>

    <!-- 요약 카드 섹션 -->
    <div v-if="loading" class="text-center py-5">
      <div class="spinner-border text-primary" role="status">
        <span class="visually-hidden">Loading...</span>
      </div>
    </div>
    <div v-else-if="error" class="alert alert-danger">{{ error }}</div>
    <div v-else-if="dashboardSummary">
      <div class="row">
        <DashboardSummaryCard 
          title="당월 정산 예정액" 
          :value="formatCurrency(dashboardSummary.monthlyScheduledAmount)" 
          icon="fa-calendar-alt" 
          border-color="primary" 
        />
        <DashboardSummaryCard 
          title="어제 정산된 금액" 
          :value="formatCurrency(dashboardSummary.yesterdaySettledAmount)" 
          icon="fa-money-bill-wave" 
          border-color="success" 
        />
        <DashboardSummaryCard 
          title="정산 보류/실패 건수" 
          :value="dashboardSummary.pendingOrFailedCount" 
          icon="fa-exclamation-triangle" 
          border-color="warning" 
        />
        <DashboardSummaryCard 
          title="누적 정산액" 
          :value="formatCurrency(dashboardSummary.cumulativeSettlementAmount)" 
          icon="fa-coins" 
          border-color="info" 
        />
      </div>
    </div>

    <!-- 차트 섹션 -->
    <div class="row">
      <div class="col-lg-7">
        <div class="card shadow mb-4">
          <div class="card-header py-3">
            <h6 class="m-0 font-weight-bold text-primary">주별 정산 현황 (공통 BaseChart)</h6>
          </div>
          <div class="card-body">
            <div class="chart-bar" style="height: 320px;">
              <BaseChart
                v-if="chartData"
                type="bar"
                :data="chartData"
                :options="chartOptions"
                height="320"
              />
              <div v-else class="text-muted small">차트 데이터 로딩 중...</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { onMounted, ref, computed } from 'vue';
import DashboardSummaryCard from '@/components/common/dashboard/DashboardSummaryCard.vue'; // SummaryCard -> DashboardSummaryCard
import BaseChart from '@/components/common/chart/BaseChart.vue';
import { useChartPalette, makeLineDataset } from '@/composables/useChartConfig';
import { getSettlementDashboardSummary } from '@/api/adminSettlement.js'; // API 임포트

const dashboardSummary = ref(null);
const loading = ref(true);
const error = ref(null);

const chartData = ref(null);
const chartOptions = ref({
  maintainAspectRatio: false,
  layout: { padding: { left: 10, right: 25, top: 25, bottom: 0 } },
  scales: {
    y: {
      ticks: {
        callback: (value) => '₩' + new Intl.NumberFormat('ko-KR').format(value)
      }
    }
  },
  plugins: { legend: { display: false } }
});

const palette = useChartPalette();

// 통화 형식 포맷터
const formatCurrency = (value) => {
  if (value === null || value === undefined) return '-';
  return `₩${new Intl.NumberFormat('ko-KR').format(value)}`;
};

onMounted(async () => {
  try {
    const response = await getSettlementDashboardSummary();
    dashboardSummary.value = response.data; // API 응답 데이터 할당

    // 차트 데이터는 현재 하드코딩 유지 (API 명세에 없으므로)
    const labels = ["1주차", "2주차", "3주차", "4주차"];
    const values = [4215000, 5312000, 7825000, 9253000];
    chartData.value = {
      labels,
      datasets: [
        makeLineDataset('주간 정산액', values, palette.primary)
      ]
    };
  } catch (e) {
    console.error('정산 대시보드 요약 조회 실패:', e);
    error.value = '데이터를 불러오는 중 오류가 발생했습니다.';
  } finally {
    loading.value = false;
  }
});
</script>
