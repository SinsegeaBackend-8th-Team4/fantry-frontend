<script setup>
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { getDashboardSummary } from '@/api/adminDashboard.js';
import ChartDataLabels from 'chartjs-plugin-datalabels';
import LoadingSpinner from '@/components/common/atoms/LoadingSpinner.vue';
import DashboardSummaryCard from '@/components/common/dashboard/DashboardSummaryCard.vue';
import BaseChart from '@/components/common/chart/BaseChart.vue';
import { useChartPalette } from '@/composables/useChartConfig';

// Chart.js 컴포넌트 로컬 등록 (도넛 차트용)
import {
  Chart,
  ArcElement, DoughnutController, Legend, Tooltip
} from 'chart.js';
Chart.register(
  ArcElement, DoughnutController, Legend, Tooltip, ChartDataLabels
);

const router = useRouter();
const palette = useChartPalette(); // 색상 팔레트 초기화

const summaryCards = ref([
  {
    key: 'todayNew',
    title: '오늘 접수 문의',
    color: 'primary',
    icon: 'fas fa-calendar-plus',
    statusValue: null, // 오늘 접수 문의는 특정 상태값이 없을 수 있음
  },
  {
    key: 'pending',
    title: '답변 대기',
    color: 'warning',
    icon: 'fas fa-hourglass-half',
    statusValue: 'PENDING',
  },
  {
    key: 'inProgress',
    title: '처리 중',
    color: 'info',
    icon: 'fas fa-tasks',
    statusValue: 'IN_PROGRESS',
  },
]);

const stats = ref(null);
const loading = ref(true);
const error = ref(null);

const chartData = ref({
  labels: [],
  datasets: [],
});
const chartOptions = ref({
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      position: 'bottom',
    },
    datalabels: {
      color: '#fff',
      textAlign: 'center',
      font: {
        weight: 'bold',
        size: 16,
      },
      formatter: (value) => {
        return value + '건';
      },
      textStrokeColor: 'black',
      textStrokeWidth: 2,
    },
    tooltip: {
      callbacks: {
        label: function(context) {
          let label = context.label || '';
          if (label) {
            label += ': ';
          }
          if (context.parsed !== null) {
            label += context.parsed + '건';
          }
          return label;
        }
      }
    }
  },
});

onMounted(async () => {
  try {
    const response = await getDashboardSummary();
    stats.value = response.inquiryStats;

    // 차트 데이터 구성
    if (stats.value) {
      const labels = [
        '오늘 접수 문의',
        '답변 대기',
        '처리 중',
      ];
      const data = [
        stats.value.todayNew,
        stats.value.pending,
        stats.value.inProgress,
      ];
      const backgroundColors = [
        palette.primary,
        palette.warning,
        palette.info,
      ];

      chartData.value = {
        labels: labels,
        datasets: [
          {
            backgroundColor: backgroundColors,
            data: data,
          },
        ],
      };
    }
  } catch (e) {
    console.error('대시보드 통계 조회에 실패했습니다:', e);
    error.value = '데이터를 불러오는 중 오류가 발생했습니다.';
  } finally {
    loading.value = false;
  }
});

function goToInquiryList(cardKey) {
  let statusParam = null;
  // cardKey가 statusValue를 직접 포함하는 경우를 대비
  const card = summaryCards.value.find(c => c.key === cardKey);
  if (card && card.statusValue) {
    statusParam = card.statusValue;
  } else {
    // 기존 로직 유지 (todayNew 등)
    switch (cardKey) {
      case 'pending':
        statusParam = 'PENDING';
        break;
      case 'inProgress':
        statusParam = 'IN_PROGRESS';
        break;
    }
  }

  router.push({
    name: 'AdminInquiryList',
    query: statusParam ? { status: statusParam } : {}
  });
}
</script>

<template>
  <div>
    <h1 class="h3 mb-4 text-gray-800">문의 현황 대시보드</h1>

    <div v-if="loading" class="text-center">
      <LoadingSpinner />
      <p>데이터를 불러오는 중입니다...</p>
    </div>

    <div v-if="error" class="alert alert-danger">{{ error }}</div>

    <div v-if="stats">
      <!-- Summary Cards Section -->
      <div class="row">
        <DashboardSummaryCard
          v-for="card in summaryCards"
          :key="card.key"
          :card="card"
          :value="stats ? stats[card.key] : 0"
          @click="goToInquiryList(card.key)"
        />
      </div>

      <!-- Chart Section -->
      <div class="row">
        <div class="col-xl-6 col-lg-7 mb-4">
          <div class="card shadow mb-4">
            <div class="card-header py-3">
              <h6 class="m-0 font-weight-bold text-primary">문의 상태 분포</h6>
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

<style scoped>
/* 필요한 경우 여기에 스타일 추가 */
</style>
<style scoped>
/* 임시 디버그 CSS: 카드 강제 표시 */
.col-xl-3.col-md-6.mb-4 {
  display: block !important;
  visibility: visible !important;
  background-color: rgba(255, 0, 0, 0.1); /* 디버그용 배경색 */
}
</style>
