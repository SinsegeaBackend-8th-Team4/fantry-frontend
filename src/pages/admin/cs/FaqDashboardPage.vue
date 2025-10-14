<script setup>
import { ref, onMounted } from 'vue';
import { searchFaqs } from '@/api/adminFaq.js';
import LoadingSpinner from '@/components/common/atoms/LoadingSpinner.vue';
import DashboardSummaryCard from '@/components/common/dashboard/DashboardSummaryCard.vue';
import BaseChart from '@/components/common/chart/BaseChart.vue';
import { useChartPalette } from '@/composables/useChartConfig';

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

const chartData = ref({
  labels: [],
  datasets: [],
});

const chartOptions = ref({
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
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
    error.value = '데이터를 불러오는 중 오류가 발생했습니다.';
  } finally {
    loading.value = false;
  }
}

onMounted(fetchData);
</script>

<template>
  <div>
    <h1 class="h3 mb-4 text-gray-800">FAQ 현황 대시보드</h1>

    <div v-if="loading" class="text-center">
      <LoadingSpinner />
      <p>데이터를 불러오는 중입니다...</p>
    </div>

    <div v-if="error" class="alert alert-danger">{{ error }}</div>

    <div v-if="!loading && !error">
      <!-- Summary Card -->
      <div class="row">
        <div class="col-xl-3 col-md-6 mb-4">
          <DashboardSummaryCard
            :card="summaryCard"
            :value="totalFaqs"
          />
        </div>
      </div>

      <!-- Chart Section -->
      <div class="row">
        <div class="col-xl-6 col-lg-7 mb-4">
          <div class="card shadow mb-4">
            <div class="card-header py-3">
              <h6 class="m-0 font-weight-bold text-primary">FAQ 유형별 분포</h6>
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