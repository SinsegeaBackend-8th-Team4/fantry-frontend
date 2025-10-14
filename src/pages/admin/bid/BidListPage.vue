<template>
  <div>
    <h1 class="h3 mb-2 text-gray-800">입찰 목록 조회</h1>
    <p class="mb-4">전체 입찰 내역을 조회하고, 통합 검색을 통해 필터링합니다.</p>

    <ServerDataTable
      v-model:keyword="searchKeyword"
      :columns="columns"
      :fetcher="fetchBids"
    >
      <template #empty>
        <div v-if="isLoading">데이터를 불러오는 중입니다...</div>
        <div v-else>입찰 내역이 없습니다.</div>
      </template>
    </ServerDataTable>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import ServerDataTable from '@/components/common/datatable/ServerDataTable.vue';
import { getAllBids } from '@/api/bid';

// --- 상태 관리 ---
const allBids = ref([]);
const isLoading = ref(true);
const searchKeyword = ref(null); // ServerDataTable의 v-model과 연결될 단일 검색어

// --- 데이터 테이블 컬럼 정의 ---
const columns = [
  { data: 'bidderId', title: '입찰자 ID' },
  { data: 'bidderName', title: '입찰자 이름' },
  { data: 'itemId', title: '상품 ID' },
  { data: 'itemName', title: '상품명' },
  { data: 'bidAmount', title: '입찰 가격', render: data => `${(data || 0).toLocaleString()}원` }, // bidPrice -> bidAmount
  { 
    data: 'bidAt', // bidTime -> bidAt
    title: '입찰 시간', 
    render: data => {
      const dateObj = parseJavaLocalDateTime(data);
      return dateObj ? dateObj.toLocaleString('ko-KR') : '유효하지 않은 날짜';
    }
  },
].map(col => ({ ...col, className: 'text-center' }));

// --- 데이터 로딩 ---
onMounted(async () => {
  try {
    const response = await getAllBids();
    allBids.value = response.data || [];
  } catch (error) {
    console.error('전체 입찰 목록 조회 실패:', error);
    allBids.value = [];
  } finally {
    isLoading.value = false;
    // 데이터 로딩 완료 후, 테이블을 강제로 다시 그리도록 트리거
    // keyword를 null -> '' 로 변경하여 watch를 트리거
    searchKeyword.value = ''; 
  }
});

// --- 클라이언트 사이드 필터링 및 페이징 로직 ---
async function fetchBids({ page, size, keyword }) {
  let filteredBids = allBids.value;
  const searchTxt = (keyword || '').trim().toLowerCase();

  if (searchTxt) {
    filteredBids = filteredBids.filter(bid => 
      // 상품 ID, 상품명, 회원 이름, 회원 PK(bidderId) 검색
      bid.itemId?.toString().includes(searchTxt) ||
      bid.itemName?.toLowerCase().includes(searchTxt) ||
      bid.bidderName?.toLowerCase().includes(searchTxt) ||
      bid.bidderId?.toString().includes(searchTxt)
    );
  }

  // 페이징
  const start = (page - 1) * size;
  const end = start + size;
  const paginatedBids = filteredBids.slice(start, end);

  return {
    rows: paginatedBids,
    total: filteredBids.length,
  };
}

// --- 유틸리티 함수 ---
const parseJavaLocalDateTime = (dt) => {
    if (!Array.isArray(dt) || dt.length < 5) {
        return null; 
    }
    const [year, month, day, hour, minute, second = 0] = dt;
    return new Date(year, month - 1, day, hour, minute, second);
};

</script>

<style scoped>
  :deep(table th),
  :deep(table td) {
    text-align: center;
  }
</style>