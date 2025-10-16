<script setup>
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { searchNotices, getNoticeStats } from '@/api/adminNotice.js';
import LoadingSpinner from '@/components/common/atoms/LoadingSpinner.vue';
import DashboardSummaryCard from '@/components/common/dashboard/DashboardSummaryCard.vue';
import BaseChart from '@/components/common/chart/BaseChart.vue';
import { useChartPalette } from '@/composables/useChartConfig';
import ChartDataLabels from 'chartjs-plugin-datalabels';

// Chart.js 컴포넌트 로컬 등록
import { Chart, ArcElement, DoughnutController, Legend, Tooltip } from 'chart.js';
Chart.register(ArcElement, DoughnutController, Legend, Tooltip, ChartDataLabels);

const router = useRouter();
const palette = useChartPalette();

const loading = ref(true);
const error = ref(null);
const stats = ref(null);
const recentNotices = ref([]);

const summaryCards = ref([
  { key: 'total', title: '총 공지사항', color: 'primary', icon: 'fas fa-bullhorn', statusValue: null },
  { key: 'active', title: '활성', color: 'success', icon: 'fas fa-check-circle', statusValue: 'ACTIVE' },
  { key: 'pinned', title: '고정', color: 'info', icon: 'fas fa-thumbtack', statusValue: 'PINNED' },
  { key: 'draft', title: '임시저장', color: 'secondary', icon: 'fas fa-pencil-alt', statusValue: 'DRAFT' },
  { key: 'inactive', title: '비활성', color: 'danger', icon: 'fas fa-minus-circle', statusValue: 'INACTIVE' },
]);

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
      formatter: (value) => value > 0 ? `${value}건` : '',
      textStrokeColor: 'black',
      textStrokeWidth: 2,
    },
    tooltip: {
      callbacks: {
        label: (context) => `${context.label}: ${context.parsed}건`,
      },
    },
  },
});

const statusMap = {
  ACTIVE: { text: '활성', class: 'bg-success' },
  INACTIVE: { text: '비활성', class: 'bg-danger' },
  PINNED: { text: '고정', class: 'bg-info' },
  DRAFT: { text: '초안', class: 'bg-secondary' },
};

function getStatusDisplay(status) {
  return statusMap[status] || { text: status, class: 'bg-light text-dark' };
}

async function fetchData() {
  try {
    loading.value = true;
    const [statsData, noticesResponse] = await Promise.all([
      getNoticeStats(),
      searchNotices({ page: 0, size: 5, sort: 'createdAt,desc' }) // page를 0-based로 수정
    ]);

    stats.value = statsData;
    recentNotices.value = noticesResponse.content;

    // 차트 데이터 구성
    if (stats.value) {
      const labels = ['활성', '고정', '임시저장', '비활성'];
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
        labels,
        datasets: [{ backgroundColor: backgroundColors, data }],
      };
    }

  } catch (e) {
    console.error('공지사항 대시보드 데이터 조회 실패:', e);
    error.value = '데이터를 불러오는 중 오류가 발생했습니다.';
  } finally {
    loading.value = false;
  }
}

function goToList(status = null) {
  const query = status ? { status } : {};
  router.push({ name: 'AdminNoticeList', query });
}

function goToDetail(noticeId) {
  router.push({ name: 'AdminNoticeDetail', params: { noticeId } });
}

function handleCardClick(cardKey) {
  const card = summaryCards.value.find(c => c.key === cardKey);
  goToList(card ? card.statusValue : null);
}

function formatDate(dateArray) {
  if (!dateArray || !Array.isArray(dateArray)) return '-';
  const dt = new Date(dateArray[0], dateArray[1] - 1, dateArray[2]);
  return `${dt.getFullYear()}-${String(dt.getMonth() + 1).padStart(2, '0')}-${String(dt.getDate()).padStart(2, '0')}`;
}

onMounted(fetchData);
</script>

<template>
  <div>
    <h1 class="h3 mb-4 text-gray-800">공지사항 대시보드</h1>

    <div v-if="loading" class="text-center">
      <LoadingSpinner />
      <p>데이터를 불러오는 중입니다...</p>
    </div>

    <div v-if="error" class="alert alert-danger">{{ error }}</div>

    <div v-if="!loading && !error && stats">
      <!-- Summary Cards -->
      <div class="row">
        <div v-for="card in summaryCards" :key="card.key" class="col-xl-2 col-md-4 mb-4"> <!-- col-xl-2 col-md-4로 변경 -->
          <DashboardSummaryCard
            :card="card"
            :value="stats[card.key] || 0"
            @click="handleCardClick(card.key)"
          />
        </div>
      </div>

      <div class="row">
        <!-- Chart Section -->
        <div class="col-xl-6 col-lg-7 mb-4">
          <div class="card shadow mb-4">
            <div class="card-header py-3">
              <h6 class="m-0 font-weight-bold text-primary">공지사항 상태 분포</h6>
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

        <!-- Recent Notices Table -->
        <div class="col-xl-6 col-lg-5 mb-4">
          <div class="card shadow mb-4">
            <div class="card-header py-3 d-flex justify-content-between align-items-center">
              <h6 class="m-0 font-weight-bold text-primary">최근 공지사항</h6>
              <button class="btn btn-sm btn-outline-primary" @click="goToList()">전체 보기</button>
            </div>
            <div class="card-body">
              <div class="table-responsive">
                <table class="table table-hover">
                  <thead>
                    <tr>
                      <th>#</th>
                      <th>제목</th>
                      <th>상태</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr v-if="recentNotices.length === 0">
                      <td colspan="3" class="text-center">최근 공지사항이 없습니다.</td>
                    </tr>
                    <tr v-for="notice in recentNotices" :key="notice.noticeId" @click="goToDetail(notice.noticeId)" style="cursor: pointer;">
                      <td>{{ notice.noticeId }}</td>
                      <td>{{ notice.title }}</td>
                      <td>
                        <span class="badge" :class="getStatusDisplay(notice.status).class">
                          {{ getStatusDisplay(notice.status).text }}
                        </span>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>