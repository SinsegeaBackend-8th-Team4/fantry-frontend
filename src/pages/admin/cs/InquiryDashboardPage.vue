<script setup>
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { getInquiryStats } from '@/api/adminInquiry.js'; // 올바른 API 함수 임포트
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
  {
    key: 'onHold',
    title: '보류 중',
    color: 'secondary',
    icon: 'fas fa-pause-circle',
    statusValue: 'ON_HOLD',
  },
  {
    key: 'answered',
    title: '답변 완료',
    color: 'success',
    icon: 'fas fa-check-circle',
    statusValue: 'ANSWERED',
  },
  {
    key: 'rejected',
    title: '거절됨',
    color: 'danger',
    icon: 'fas fa-times-circle',
    statusValue: 'REJECTED',
  },
  {
    key: 'total',
    title: '전체 문의',
    color: 'primary',
    icon: 'fas fa-clipboard-list',
    statusValue: null, // 전체 목록은 특정 상태 없이 조회
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
    stats.value = await getInquiryStats();

    if (stats.value) {
      const labels = [
        '답변 대기',
        '처리 중',
        '보류 중',
        '답변 완료',
        '거절됨',
      ];
      const data = [
        stats.value.pending,
        stats.value.inProgress,
        stats.value.onHold,
        stats.value.answered,
        stats.value.rejected,
      ];
      const backgroundColors = [
        palette.warning,
        palette.info,
        palette.secondary,
        palette.success,
        palette.danger,
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
  const card = summaryCards.value.find(c => c.key === cardKey);
  const statusParam = card ? card.statusValue : null;

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
        <div v-for="card in summaryCards" :key="card.key" class="col-xl-4 col-md-6 mb-4">
          <DashboardSummaryCard
            :card="card"
            :value="stats ? stats[card.key] : 0"
            @click="goToInquiryList(card.key)"
          />
        </div>
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