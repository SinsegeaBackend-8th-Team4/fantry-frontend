<script setup>
import { ref, onMounted } from 'vue';
<<<<<<< HEAD
import { searchFaqs } from '@/api/adminFaq.js';
=======
import { useRouter } from 'vue-router';
import { getFaqStats } from '@/api/adminFaq.js';
import ChartDataLabels from 'chartjs-plugin-datalabels';
>>>>>>> 9e2ff05ff607911e93867be14c9d9027c109dd10
import LoadingSpinner from '@/components/common/atoms/LoadingSpinner.vue';
import DashboardSummaryCard from '@/components/common/dashboard/DashboardSummaryCard.vue';
import BaseChart from '@/components/common/chart/BaseChart.vue';
import { useChartPalette } from '@/composables/useChartConfig';

<<<<<<< HEAD
const loading = ref(true);
const error = ref(null);
const totalFaqs = ref(0);
const faqsByType = ref({});

const palette = useChartPalette();

const summaryCard = ref({
  key: 'totalFaqs',
  title: '총 FAQ 건수',
  color: 'primary',
  icon: 'fas fa-question-circle',
});
=======
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
>>>>>>> 9e2ff05ff607911e93867be14c9d9027c109dd10

const chartData = ref({
  labels: [],
  datasets: [],
});

const chartOptions = ref({
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
<<<<<<< HEAD
    legend: { position: 'bottom' },
    datalabels: {
      color: '#fff',
      textAlign: 'center',
      font: { weight: 'bold', size: 16 },
      formatter: (value) => value + '건',
      textStrokeColor: 'black',
      textStrokeWidth: 2,
    },
  },
});

async function fetchData() {
  try {
    loading.value = true;
    // 모든 데이터를 가져오기 위해 큰 size 값 사용
    const response = await searchFaqs({ page: 0, size: 9999 });
    const faqs = response.data.content;

    totalFaqs.value = response.data.totalElements;

    // 유형별 집계
    const counts = {};
    faqs.forEach(faq => {
      const typeName = faq.csType ? faq.csType.name : '기타';
      counts[typeName] = (counts[typeName] || 0) + 1;
    });
    faqsByType.value = counts;

    // 차트 데이터 구성
    const labels = Object.keys(faqsByType.value);
    const data = Object.values(faqsByType.value);
    const backgroundColors = labels.map((_, i) => palette.chartColors[i % palette.chartColors.length]);

    chartData.value = {
      labels: labels,
      datasets: [{
        backgroundColor: backgroundColors,
        data: data,
      }],
    };

  } catch (e) {
    console.error('FAQ 대시보드 데이터 조회 실패:', e);
=======
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
>>>>>>> 9e2ff05ff607911e93867be14c9d9027c109dd10
    error.value = '데이터를 불러오는 중 오류가 발생했습니다.';
  } finally {
    loading.value = false;
  }
<<<<<<< HEAD
}

onMounted(fetchData);
=======
});

function goToFaqList(cardKey) {
  const card = summaryCards.value.find(c => c.key === cardKey);
  const statusParam = card ? card.statusValue : null;

  router.push({
    name: 'AdminFaqList',
    query: statusParam ? { status: statusParam } : {},
  });
}
>>>>>>> 9e2ff05ff607911e93867be14c9d9027c109dd10
</script>

<template>
  <div>
    <h1 class="h3 mb-4 text-gray-800">FAQ 현황 대시보드</h1>

    <div v-if="loading" class="text-center">
      <LoadingSpinner />
      <p>데이터를 불러오는 중입니다...</p>
    </div>

    <div v-if="error" class="alert alert-danger">{{ error }}</div>

<<<<<<< HEAD
    <div v-if="!loading && !error">
      <!-- Summary Card -->
      <div class="row">
        <div class="col-xl-3 col-md-6 mb-4">
          <DashboardSummaryCard
            :card="summaryCard"
            :value="totalFaqs"
=======
    <div v-if="stats">
      <!-- Summary Cards Section -->
      <div class="row">
        <div v-for="card in summaryCards" :key="card.key" class="col-xl-2 col-md-4 mb-4">
          <DashboardSummaryCard
            :card="card"
            :value="stats ? stats[card.key] : 0"
            @click="goToFaqList(card.key)"
>>>>>>> 9e2ff05ff607911e93867be14c9d9027c109dd10
          />
        </div>
      </div>

      <!-- Chart Section -->
      <div class="row">
        <div class="col-xl-6 col-lg-7 mb-4">
          <div class="card shadow mb-4">
            <div class="card-header py-3">
<<<<<<< HEAD
              <h6 class="m-0 font-weight-bold text-primary">FAQ 유형별 분포</h6>
=======
              <h6 class="m-0 font-weight-bold text-primary">FAQ 상태 분포</h6>
>>>>>>> 9e2ff05ff607911e93867be14c9d9027c109dd10
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
<<<<<<< HEAD
</template>
=======
</template>

<style scoped>
/* 필요한 경우 여기에 스타일 추가 */
</style>
>>>>>>> 9e2ff05ff607911e93867be14c9d9027c109dd10
