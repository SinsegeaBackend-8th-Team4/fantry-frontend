<script setup>
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { getDashboardSummary } from '@/api/adminDashboard.js';
import LoadingSpinner from '@/components/common/atoms/LoadingSpinner.vue';
import DashboardSummaryCard from '@/components/common/dashboard/DashboardSummaryCard.vue';

const router = useRouter();

const summaryCards = ref([
  {
    key: 'returnRequestCount',
    title: '전체 환불/반품',
    color: 'danger',
    icon: 'fas fa-undo-alt',
    statusValue: null,
  },
]);

const stats = ref(null);
const loading = ref(true);
const error = ref(null);

onMounted(async () => {
  try {
    const summary = await getDashboardSummary();
    stats.value = {
      returnRequestCount: summary.returnRequestCount,
    };
  } catch (e) {
    console.error('대시보드 요약 정보 조회에 실패했습니다:', e);
    error.value = '데이터를 불러오는 중 오류가 발생했습니다.';
  } finally {
    loading.value = false;
  }
});

function goToReturnList() {
  router.push({ name: 'AdminReturnList' });
}
</script>

<template>
  <div>
    <h1 class="h3 mb-4 text-gray-800">환불/반품 현황 대시보드</h1>

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
            @click="goToReturnList"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
/* 필요한 경우 여기에 스타일 추가 */
</style>
