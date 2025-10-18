<script setup>
import { ref, nextTick } from 'vue'; // nextTick 임포트
import { useRouter } from 'vue-router';
import ServerDataTable from '@/components/common/datatable/ServerDataTable.vue';
import { getAdminReturnList } from '@/api/adminReturn.js';
import { debounce } from 'lodash-es';

const router = useRouter();
const table = ref(null);

// --- 필터링 & 검색 관련 상태 ---
const tableKey = ref(0);
const keyword = ref(''); // buyerName 검색어
const currentStatusFilter = ref(null);

// Debounce 적용
const triggerRefresh = () => tableKey.value++;
const debouncedRefresh = debounce(triggerRefresh, 300);

// 상태 필터 버튼 목록 정의 (api.md 기반)
const statusFilters = [
  { label: '전체', value: null },
  { label: '요청됨', value: 'REQUESTED' },
  { label: '처리중', value: 'IN_TRANSIT' },
  { label: '검수중', value: 'INSPECTING' },
  { label: '승인됨', value: 'APPROVED' },
  { label: '거절됨', value: 'REJECTED' },
  { label: '완료됨', value: 'COMPLETED' },
  { label: '사용자 취소', value: 'USER_CANCELLED' },
];

function handleStatusFilterClick(value) {
  currentStatusFilter.value = value;
  debouncedRefresh();
}

// --- API ---
async function fetcher({ page, size, sort }) {
  const params = {
    page: page,
    size: size,
    sort: sort,
    status: currentStatusFilter.value,
    buyerName: keyword.value || null,
  };
  const response = await getAdminReturnList(params);
  return {
    rows: response.data.content,
    total: response.data.totalElements,
  };
}

// --- 테이블 컬럼, 이벤트 핸들러 ---
const columns = [
  {
    data: 'returnRequestId',
    title: '#',
    className: 'text-center',
  },
  {
    data: 'orderId',
    title: '주문 번호',
    className: 'text-center clickable-id-cell',
    render: (data, type, row) => {
      return `<span class="order-id-link" data-order-id="${row.orderId}" style="color: blue; cursor: pointer; text-decoration: underline;">${data}</span>`;
    }
  },
  { data: 'buyerName', title: '구매자', className: 'text-center' },
  {
    data: 'status',
    title: '상태',
    className: 'text-center',
    render: (data) => {
      let badgeClass = 'bg-light text-dark';
      let koreanText = data;
      switch (data) {
        case 'REQUESTED': badgeClass = 'bg-primary'; koreanText = '요청됨'; break;
        case 'IN_TRANSIT': badgeClass = 'bg-info'; koreanText = '처리중'; break;
        case 'INSPECTING': badgeClass = 'bg-warning'; koreanText = '검수중'; break;
        case 'APPROVED': badgeClass = 'bg-success'; koreanText = '승인됨'; break;
        case 'REJECTED': badgeClass = 'bg-danger'; koreanText = '거절됨'; break;
        case 'COMPLETED': badgeClass = 'bg-dark'; koreanText = '완료됨'; break;
        case 'USER_CANCELLED': badgeClass = 'bg-secondary'; koreanText = '사용자 취소'; break;
        case 'DELETED': badgeClass = 'bg-danger bg-opacity-50'; koreanText = '삭제됨'; break;
      }
      return `<span class="badge ${badgeClass}">${koreanText}</span>`;
    },
  },
  {
    data: 'requestedAt',
    title: '요청일',
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

// 주문 상세 페이지로 이동
function goToOrderDetail(orderId) {
  router.push({ name: 'AdminOrderDetail', params: { orderId } });
}

// 새 환불/반품 등록 페이지로 이동
function goToCreate() {
  router.push({ name: 'AdminReturnCreate' });
}

// 클릭 핸들러 동적 바인딩
function attachClickHandlers() {
  nextTick(() => {
    const orderIdLinks = document.querySelectorAll('.order-id-link');
    orderIdLinks.forEach(el => {
      if (el.dataset.bound) return; // 중복 바인딩 방지
      el.dataset.bound = 'true';
      el.addEventListener('click', (e) => {
        const orderId = e.target.dataset.orderId;
        goToOrderDetail(orderId);
      });
    });
  });
}
</script>

<template>
  <main class="container-fluid p-4">
    <div class="card shadow-sm border-0 rounded-3 overflow-hidden">
      <!-- 헤더 -->
      <div class="card-header bg-white border-bottom-0 pt-4 px-4 pb-2">
        <div class="d-flex justify-content-between align-items-center">
          <div>
            <h4 class="fw-semibold text-dark mb-1">환불/반품 목록</h4>
            <p class="text-muted small">사용자들의 환불/반품 요청을 관리합니다.</p>
          </div>
          <button class="btn btn-primary" @click="goToCreate">새 환불/반품 등록</button>
        </div>
      </div>

      <!-- 필터 버튼 -->
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
                @click="handleStatusFilterClick(filter.value)"
              >
                {{ filter.label }}
              </button>
            </div>
          </div>
        </div>

        <!-- 테이블 -->
        <ServerDataTable
          ref="table"
          :key="tableKey"
          v-model:keyword="keyword"
          search-placeholder="구매자 이름으로 검색"
          :columns="columns"
          :fetcher="fetcher"
          @loaded="attachClickHandlers"
        >
          <template #empty>현재 조건에 해당하는 환불/반품 내역이 없습니다.</template>
        </ServerDataTable>
      </div>
    </div>
  </main>
</template>

<style scoped>
/* 기존 스타일 유지 */
:deep(table td){
  pointer-events: none;
}

:deep(table td .order-id-link){ /* 새로운 클래스에 대한 스타일 추가 */
  pointer-events: auto;
}

:deep(table tbody tr:hover) {
  background-color: #f8f9fa;
  cursor: pointer;
}
</style>