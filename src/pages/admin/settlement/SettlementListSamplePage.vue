<script setup>
/**
 * SettlementListSamplePage.vue
 * - 정산 목록 샘플: ServerDataTable + BaseChart 데모
 */
import { ref, computed } from 'vue';
import ServerDataTable from '@/components/common/datatable/ServerDataTable.vue';
import BaseChart from '@/components/common/chart/BaseChart.vue';
import { useChartPalette, makeLineDataset } from '@/composables/useChartConfig';
import { currencyCol, dateTimeCol, textCol } from '@/composables/useDataTableColumns';

function badgeClass(status) {
  return {
    'wait': status === '대기',
    '완료': status === '완료',
    '보류': status === '보류'
  };
}

const keyword = ref('');

// 더미 fetcher (실제 API 연동 시 axios 호출로 교체)
async function fetchSettlements({ page, size, sort, keyword }) {
  await new Promise(r => setTimeout(r, 300));
  const total = 57;
  const start = (page - 1) * size;
  const rows = Array.from({ length: size }).map((_, i) => {
    const id = start + i + 1;
    return {
      id,
      orderNo: 'O-' + String(20250000 + id),
      amount: 100000 + (id * 1234) % 500000,
      createdAt: Date.now() - id * 3600_000,
      status: id % 3 === 0 ? '대기' : (id % 3 === 1 ? '완료' : '보류')
    };
  }).filter(r => !keyword || r.orderNo.includes(keyword));
  return { rows, total };
}

const columns = [
  textCol('orderNo', '주문번호'),
  currencyCol('amount', '정산금액'),
  dateTimeCol('createdAt', '생성일'),
  { data: 'status', title: '상태', sortable: true }
];

// Chart 샘플 데이터
const palette = useChartPalette();
const chartData = computed(() => {
  const labels = Array.from({ length: 7 }).map((_, i) => `${i+1}일`);
  const dataset = makeLineDataset('일별 정산액', labels.map(() => Math.round(Math.random()*500)+200), palette.primary);
  return { labels, datasets: [dataset] };
});

const chartOptions = { scales: { y: { beginAtZero: true } } };
</script>

<template>
  <div class="settlement-list-page">
    <h1 class="h4 mb-4">정산 목록 (샘플)</h1>

    <div class="row g-4 mb-4">
      <div class="col-lg-6">
        <div class="card shadow-sm">
          <div class="card-header py-2"><strong>최근 7일 정산 추이</strong></div>
          <div class="card-body">
            <BaseChart type="line" :data="chartData" :options="chartOptions" height="240" />
          </div>
        </div>
      </div>
    </div>

    <ServerDataTable
      v-model:keyword="keyword"
      :columns="columns"
      :fetcher="fetchSettlements"
      page-size="10"
      @loaded="info => console.log('loaded', info)"
    >
      <template #empty>정산 데이터가 없습니다.</template>
      <template #cell-status="{ row }">
        <span class="badge" :class="badgeClass(row.status)">{{ row.status }}</span>
      </template>
    </ServerDataTable>
  </div>
</template>


<style scoped lang="scss">
.settlement-list-page {
  .badge { font-weight: 500; }
  .badge.wait, .badge.대기 { background:#f6c23e; }
  .badge.완료 { background:#1cc88a; }
  .badge.보류 { background:#e74a3b; }
}
</style>

