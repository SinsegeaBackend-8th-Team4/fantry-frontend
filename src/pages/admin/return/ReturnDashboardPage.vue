<script setup>
import { ref, onMounted } from 'vue';
import { searchReturns } from '@/api/adminReturn.js';
import LoadingSpinner from '@/components/common/atoms/LoadingSpinner.vue';
import DashboardSummaryCard from '@/components/common/dashboard/DashboardSummaryCard.vue';
import BaseChart from '@/components/common/chart/BaseChart.vue';
import { useChartPalette } from '@/composables/useChartConfig';

const loading = ref(true);
const error = ref(null);
const summaryData = ref({ statusCounts: {} });

const palette = useChartPalette();

const summaryCards = ref([]);
const chartData = ref({ labels: [], datasets: [] });

const chartOptions = ref({
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: { position: 'bottom' },
    datalabels: {
      color: '#fff',
      font: { weight: 'bold', size: 16 },
      formatter: (value) => value + '건',
    },
  },
});

// API 응답 status를 한글과 아이콘, 색상으로 매핑
const statusMap = {
  REQUESTED: { text: '요청됨', icon: 'fas fa-inbox', color: 'warning' },
  PROCESSING: { text: '처리중', icon: 'fas fa-cogs', color: 'info' },
  APPROVED: { text: '승인', icon: 'fas fa-check-circle', color: 'success' },
  REJECTED: { text: '거절', icon: 'fas fa-times-circle', color: 'danger' },
  COMPLETED: { text: '완료', icon: 'fas fa-check-double', color: 'primary' },
};

async function fetchData() {
  try {
    loading.value = true;
    // 모든 데이터를 가져와서 클라이언트 측에서 집계
    const response = await searchReturns({ page: 0, size: 9999 });
    const returns = response.data.content;

    // 상태별 집계
    const counts = {};
    returns.forEach(item => {
      counts[item.status] = (counts[item.status] || 0) + 1;
    });
    summaryData.value.statusCounts = counts;

    // Summary Cards 데이터 구성
    summaryCards.value = Object.entries(summaryData.value.statusCounts).map(([status, count]) => ({
      key: status,
      title: statusMap[status]?.text || status,
      value: count,
      icon: statusMap[status]?.icon || 'fas fa-question-circle',
      color: statusMap[status]?.color || 'secondary',
    }));

    // Chart 데이터 구성
    const labels = Object.keys(summaryData.value.statusCounts).map(status => statusMap[status]?.text || status);
    const data = Object.values(summaryData.value.statusCounts);
    const backgroundColors = Object.keys(summaryData.value.statusCounts).map((status, i) => 
      statusMap[status]?.color ? palette[statusMap[status].color] : palette.chartColors[i % palette.chartColors.length]
    );

    chartData.value = {
      labels: labels,
      datasets: [{
        backgroundColor: backgroundColors,
        data: data,
      }],
    };

  } catch (e) {
    console.error('반품 대시보드 데이터 조회 실패:', e);
    error.value = '데이터를 불러오는 중 오류가 발생했습니다.';
  } finally {
    loading.value = false;
  }
}

onMounted(fetchData);
</script>

<template>
  <div>
    <h1 class="h3 mb-4 text-gray-800">반품/환불 대시보드</h1>

    <div v-if="loading" class="text-center">
      <LoadingSpinner />
      <p>데이터를 불러오는 중입니다...</p>
    </div>

    <div v-if="error" class="alert alert-danger">{{ error }}</div>

    <div v-if="!loading && !error">
      <!-- Summary Cards -->
      <div class="row">
        <div v-for="card in summaryCards" :key="card.key" class="col-xl-3 col-md-6 mb-4">
          <DashboardSummaryCard :card="card" :value="card.value" />
        </div>
      </div>

      <!-- Chart Section -->
      <div class="row">
        <div class="col-xl-6 col-lg-7 mb-4">
          <div class="card shadow mb-4">
            <div class="card-header py-3">
              <h6 class="m-0 font-weight-bold text-primary">반품 상태 분포</h6>
            </div>
            <div class="card-body">
              <div class="chart-pie pt-4 pb-2">
                <BaseChart
                  type="doughnut"
                  :data="chartData"
                  :options="chartOptions"
                  height="200"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
