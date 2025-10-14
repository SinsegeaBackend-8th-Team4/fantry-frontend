<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import ServerDataTable from '@/components/common/datatable/ServerDataTable.vue';
import { searchReturns } from '@/api/adminReturn.js';

const router = useRouter();
const table = ref(null);
const keyword = ref('');
const tableKey = ref(0);

const statusFilters = [
  { label: '전체', value: null },
  { label: '요청됨', value: 'REQUESTED' },
  { label: '처리중', value: 'PROCESSING' },
  { label: '승인', value: 'APPROVED' },
  { label: '거절', value: 'REJECTED' },
  { label: '완료', value: 'COMPLETED' },
];
const currentStatusFilter = ref(null);

// TODO: 백엔드 API에 맞춰 필터 옵션 추가 필요

async function fetcher({ page, size, sort, keyword }) {
  const params = {
    page: page > 0 ? page - 1 : 0,
    size: size,
    sort: sort,
    status: currentStatusFilter.value,
    // 예시: 상품명 또는 구매자명으로 검색
    searchTerm: keyword,
  };
  const response = await searchReturns(params);
  const data = response.data;
  return {
    rows: data.content,
    total: data.totalElements,
  };
}

const columns = [
  { data: 'returnRequestId', title: '#', className: 'text-center' },
  { data: 'productName', title: '상품명', className: 'text-left' },
  { data: 'memberName', title: '구매자', className: 'text-center' },
  {
    data: 'status',
    title: '상태',
    className: 'text-center',
    render: (data) => {
      let badgeClass = 'bg-secondary';
      let text = data;
      switch (data) {
        case 'REQUESTED': badgeClass = 'bg-warning'; text = '요청됨'; break;
        case 'PROCESSING': badgeClass = 'bg-info'; text = '처리중'; break;
        case 'APPROVED': badgeClass = 'bg-success'; text = '승인'; break;
        case 'REJECTED': badgeClass = 'bg-danger'; text = '거절'; break;
        case 'COMPLETED': badgeClass = 'bg-primary'; text = '완료'; break;
      }
      return `<span class="badge ${badgeClass}">${text}</span>`;
    },
  },
  {
    data: 'requestedAt',
    title: '요청일',
    className: 'text-center',
    render: (val) => {
      if (!val || !Array.isArray(val)) return '-';
      const dt = new Date(val[0], val[1] - 1, val[2], val[3], val[4], val[5] || 0);
      return `${dt.getFullYear()}-${String(dt.getMonth() + 1).padStart(2, '0')}-${String(dt.getDate()).padStart(2, '0')}`;
    }
  },
];

function goToDetail(returnRequestId) {
  router.push({ name: 'AdminReturnDetail', params: { returnRequestId } });
}

function handleRowClick(row) {
  if (row && row.returnRequestId) {
    goToDetail(row.returnRequestId);
  }
}
</script>

<template>
  <main class="container-fluid p-4">
    <div class="card shadow-sm border-0 rounded-3 overflow-hidden">
      <div class="card-header bg-white border-bottom-0 pt-4 px-4 pb-2">
        <h4 class="fw-semibold text-dark mb-1">반품/환불 목록</h4>
        <p class="text-muted small">접수된 반품 및 환불 요청을 관리합니다.</p>
      </div>

      <div class="card-body p-4">
        <div class="d-flex flex-column gap-3 mb-4">
          <!-- 상태 필터 -->
          <div class="input-group input-group-sm">
            <span class="input-group-text fw-bold">상태</span>
            <div class="btn-group" role="group">
              <button
                v-for="filter in statusFilters"
                :key="filter.label"
                type="button"
                class="btn btn-outline-secondary"
                :class="{ active: currentStatusFilter === filter.value }"
                @click="currentStatusFilter = filter.value; tableKey++;"
              >
                {{ filter.label }}
              </button>
            </div>
          </div>
        </div>

        <ServerDataTable
          ref="table"
          :key="tableKey"
          v-model:keyword="keyword"
          :columns="columns"
          :fetcher="fetcher"
          @row-click="handleRowClick"
        >
          <template #empty>현재 조건에 해당하는 반품/환불 내역이 없습니다.</template>
        </ServerDataTable>
      </div>
    </div>
  </main>
</template>