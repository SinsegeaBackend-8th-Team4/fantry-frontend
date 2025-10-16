<script setup>
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { getFaqStats } from '@/api/adminFaq.js';
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
const palette = useChartPalette();

const summaryCards = ref([
  {
    key: 'total',
    title: '전체 FAQ',
    color: 'primary',
    icon: 'fas fa-list-alt',
    statusValue: null,
  },
  {
    key: 'active',
    title: '활성',
    color: 'success',
    icon: 'fas fa-check-circle',
    statusValue: 'ACTIVE',
  },
  {
    key: 'pinned',
    title: '고정',
    color: 'info',
    icon: 'fas fa-thumbtack',
    statusValue: 'PINNED',
  },
  {
    key: 'draft',
    title: '임시저장',
    color: 'secondary',
    icon: 'fas fa-pencil-alt',
    statusValue: 'DRAFT',
  },
  {
    key: 'inactive',
    title: '비활성',
    color: 'danger',
    icon: 'fas fa-minus-circle',
    statusValue: 'INACTIVE',
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
    stats.value = await getFaqStats();

    if (stats.value) {
      const labels = [
        '활성',
        '고정',
        '임시저장',
        '비활성',
      ];
      const data = [
        stats.value.active,
        stats.value.pinned,
        stats.value.draft,
        stats.value.inactive,
      ];
      const backgroundColors = [
        palette.success,
        palette.info,
        palette.secondary,
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
    console.error('FAQ 통계 조회에 실패했습니다:', e);
    error.value = '데이터를 불러오는 중 오류가 발생했습니다.';
  } finally {
    loading.value = false;
  }
});

function goToFaqList(cardKey) {
  const card = summaryCards.value.find(c => c.key === cardKey);
  const statusParam = card ? card.statusValue : null;

  router.push({
    name: 'AdminFaqList',
    query: statusParam ? { status: statusParam } : {},
  });
}
</script>

<template>
  <div>
    <h1 class="h3 mb-4 text-gray-800">FAQ 현황 대시보드</h1>

    <div v-if="loading" class="text-center">
      <LoadingSpinner />
      <p>데이터를 불러오는 중입니다...</p>
    </div>

    <div v-if="error" class="alert alert-danger">{{ error }}</div>

    <div v-if="stats">
      <!-- Summary Cards Section -->
      <div class="row">
        <div v-for="card in summaryCards" :key="card.key" class="col-xl-2 col-md-4 mb-4">
          <DashboardSummaryCard
            :card="card"
            :value="stats ? stats[card.key] : 0"
            @click="goToFaqList(card.key)"
          />
        </div>
      </div>

      <!-- Chart Section -->
      <div class="row">
        <div class="col-xl-6 col-lg-7 mb-4">
          <div class="card shadow mb-4">
            <div class="card-header py-3">
              <h6 class="m-0 font-weight-bold text-primary">FAQ 상태 분포</h6>
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
