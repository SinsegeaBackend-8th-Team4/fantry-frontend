<script setup>
import { ref, onMounted, nextTick } from 'vue';
import { useRouter } from 'vue-router';
import ServerDataTable from '@/components/common/datatable/ServerDataTable.vue';
import { searchNotices } from '@/api/adminNotice.js';

const router = useRouter();
const table = ref(null);
const keyword = ref('');
const tableKey = ref(0);

onMounted(() => {
});

const statusFilters = [
  { label: '전체', value: null },
  { label: '활성', value: 'ACTIVE' },
  { label: '비활성', value: 'INACTIVE' },
  { label: '고정', value: 'PINNED' },
  { label: '초안', value: 'DRAFT' },
];
const currentStatusFilter = ref(null);

const typeFilters = [
  { label: '전체', value: null },
  { label: '배송문의', value: 1 },
  { label: '결제문의', value: 2 },
  { label: '기타문의', value: 3 },
  { label: '상품문의', value: 4 },
  { label: '환불/반품 문의', value: 5 },
  { label: '판매 문의', value: 6 },
];
const currentTypeFilter = ref(null);

async function fetcher({ page, size, sort, keyword }) {
  const response = await searchNotices({
    page: page,
    size: size,
    sort: sort,
    status: currentStatusFilter.value,
    csTypeId: currentTypeFilter.value,
    keyword: keyword,
  });
  return {
    rows: response.content,
    total: response.totalElements,
  };
}

const columns = [
  { data: 'noticeId', title: '#', className: 'text-center' },
  {
    data: 'csType',
    title: '유형',
    className: 'text-center',
    render: (data) => {
      const typeName = data || 'N/A';
      let badgeClass = 'bg-secondary';
      switch (typeName) {
        case '배송': badgeClass = 'bg-primary'; break;
        case '결제': badgeClass = 'bg-success'; break;
        case '상품': badgeClass = 'bg-info'; break;
        case '환불/반품': badgeClass = 'bg-danger'; break;
        case '판매': badgeClass = 'bg-dark'; break;
      }
      return `<span class="badge ${badgeClass}">${typeName}</span>`;
    },
  },
  {
    data: 'title',
    title: '제목',
    className: 'text-left clickable-title-cell',
    render: (data, type, row) => {
      return `<span class="notice-title" data-notice-id="${row.noticeId}" style="color: blue; cursor: pointer; text-decoration: underline;">${data}</span>`;
    }
  },
  { data: 'createdBy', title: '작성자', className: 'text-center' },
  {
    data: 'status',
    title: '상태',
    className: 'text-center',
    render: (data) => {
      let badgeClass = 'bg-light text-dark';
      let text = data;
      switch (data) {
        case 'ACTIVE':
          badgeClass = 'bg-success';
          text = '활성';
          break;
        case 'INACTIVE':
          badgeClass = 'bg-danger';
          text = '비활성';
          break;
        case 'PINNED':
          badgeClass = 'bg-info';
          text = '고정';
          break;
        case 'DRAFT':
          badgeClass = 'bg-secondary';
          text = '초안';
          break;
      }
      return `<span class="badge ${badgeClass}">${text}</span>`;
    },
  },
  {
    data: 'createdAt',
    title: '등록일',
    className: 'text-center',
    render: (val) => {
      if (!val || !Array.isArray(val)) return '-';
      const dt = new Date(val[0], val[1] - 1, val[2], val[3], val[4], val[5] || 0);
      
      const year = dt.getFullYear();
      const month = String(dt.getMonth() + 1).padStart(2, '0');
      const day = String(dt.getDate()).padStart(2, '0');
      const hours = String(dt.getHours()).padStart(2, '0');
      const minutes = String(dt.getMinutes()).padStart(2, '0');
      const seconds = String(dt.getSeconds()).padStart(2, '0');

      return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
    }
  },
];

function goToCreate() {
  router.push({ name: 'AdminNoticeCreate' });
}

function handleRowClick(row) {
  // This function is now redundant as click handling is done via attachClickHandlers
  // but kept for reference or if other parts of the row need to be clickable.
  console.log("handleRowClick (redundant for title click):", row);
}

function attachClickHandlers() {
  nextTick(() => {
    const titleElements = document.querySelectorAll('.notice-title');
    titleElements.forEach(el => {
      if (el.dataset.bound) return;
      el.dataset.bound = 'true';
      
      el.addEventListener('click', (e) => {
        const noticeId = e.target.dataset.noticeId;
        router.push({
          name: 'AdminNoticeDetail',
          params: { noticeId }
        });
      });
    });
  });
}

onMounted(() => {
  setTimeout(attachClickHandlers, 500);
});
</script>

<template>
  <main class="container-fluid p-4">
    <div class="card shadow-sm border-0 rounded-3 overflow-hidden">
      <div class="card-header bg-white border-bottom-0 pt-4 px-4 pb-2">
        <div class="d-flex justify-content-between align-items-center">
          <div>
            <h4 class="fw-semibold text-dark mb-1">공지사항 목록</h4>
            <p class="text-muted small">사이트 전체 공지사항을 관리합니다.</p>
          </div>
          <button class="btn btn-primary" @click="goToCreate">새 공지사항 등록</button>
        </div>
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
          <!-- 유형 필터 -->
          <div class="input-group input-group-sm">
            <span class="input-group-text fw-bold">유형</span>
            <div class="btn-group" role="group">
              <button
                v-for="filter in typeFilters"
                :key="filter.label"
                type="button"
                class="btn btn-outline-secondary"
                :class="{ active: currentTypeFilter === filter.value }"
                @click="currentTypeFilter = filter.value; tableKey++;"
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
          @loaded="attachClickHandlers"
        >
          <template #empty>현재 조건에 해당하는 공지사항이 없습니다.</template>
        </ServerDataTable>
      </div>
    </div>
  </main>
</template>

<style scoped>
:deep(table td) {
  pointer-events: none;
}

:deep(table td .notice-title) {
  pointer-events: auto;
}

:deep(table tbody tr:hover) {
  background-color: #f8f9fa;
  cursor: pointer;
}
</style>