<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
// API 모듈
import { getInspectionsByStatus } from '@/api/adminInspection'

// 상태관리
import { useAdminInspectionStore } from '@/stores/adminInspectionStore'

// Datatable
import ServerDataTable from '@/components/common/datatable/ServerDataTable.vue'
import { currencyCol, dateCol } from '@/composables/useDataTableColumns'

const router = useRouter()
const adminStore = useAdminInspectionStore()

// 상태 변수
const loading = ref(false) // 로딩 상태
const keyword = ref('')
const tableKey = ref(0) // 필터 변경 시 테이블을 강제로 리로드하기 위한 키

// 필터 상태 관리
const currentFilter = ref(['SUBMITTED', 'FIRST_REVIEWED', 'FIRST_REJECTED']) // 기본값 : '1차 제출'

const filters = [
  { label: '전체', value: ['SUBMITTED', 'FIRST_REVIEWED', 'FIRST_REJECTED'] },
  { label: '1차 제출', value: ['SUBMITTED'] },
  { label: '1차 승인', value: ['FIRST_REVIEWED'] },
  { label: '1차 반려', value: ['FIRST_REJECTED'] },
]

// fetcher : 1차 검수 신청 목록 조회
async function fetchInspections({ page, size, sort, keyword }) {
  loading.value = true
  try {
    const res = await getInspectionsByStatus({
      statuses: currentFilter.value,
      page: page,
      size,
      sort,
      keyword,
    })

    return {
      rows: res?.items || [],
      total: res?.meta?.totalElements || 0,
    }
  } catch (err) {
    console.error('1차 검수 목록 조회 실패:', err)
    return { rows: [], total: 0 }
  } finally {
    loading.value = false
  }
}

// 상태에 따라 다른 배경색
const getStatusBadgeClass = (status) => {
  switch (status) {
    case 'SUBMITTED':
      return 'bg-warning text-dark' // 1차 제출 (노란색)
    case 'FIRST_REVIEWED':
      return 'bg-success' // 1차 승인 (초록색)
    case 'FIRST_REJECTED':
      return 'bg-danger' // 1차 반려 (빨간색)
    default:
      return 'bg-secondary' // 기타 (회색)
  }
}

// 테이블 컬럼 정의
const columns = [
  { data: 'productInspectionId', title: 'ID', width: '6%' },
  { data: 'memberName', title: '회원명', width: '10%' },
  { data: 'goodsCategoryName', title: '카테고리', width: '10%' },
  { data: 'artistName', title: '아티스트', width: '10%' },
  { data: 'itemName', title: '상품명', width: '15%' },
  currencyCol('expectedPrice', '예상가'),
  currencyCol('sellerHopePrice', '희망가'),
  dateCol('submittedAt', '제출일'),
  {
    data: 'inspectionStatus',
    title: '상태',
    render: (data) => `<span class="badge status-badge bg-warning text-dark">${adminStore.getStatusLabel(data)}</span>`,
  },
  {
    data: null,
    title: '관리',
    sortable: false,
    render: (data, type, row) => `<button class="btn btn-sm btn-outline-primary detail-btn" data-id="${row.productInspectionId}">상세</button>`,
  },
]

onMounted(() => {
  // 상세 이동
  document.addEventListener('click', (e) => {
    if (e.target && e.target.classList.contains('detail-btn')) {
      const id = e.target.getAttribute('data-id')
      if (id) {
        router.push(`/admin/inspection/detail/${id}`)
      }
    }
  })
})

// 필터 변경
function changeFilter(statuses) {
  currentFilter.value = statuses
  tableKey.value++
}
</script>

<template>
  <div class="inspection-list-page">
    <h1 class="h3 mb-2 text-gray-800">1차 온라인 검수 목록</h1>
    <p class="mb-4">판매자가 제출한 상품의 1차 온라인 검수 내역을 확인하고 상세 검수를 진행합니다.</p>

    <!-- 필터 테이블 -->
    <div class="btn-group mb-3" role="group">
      <button
        v-for="filter in filters"
        :key="filter.label"
        type="button"
        class="btn btn-sm"
        :class="JSON.stringify(currentFilter) === JSON.stringify(filter.value) ? 'btn-primary' : 'btn-outline-secondary'"
        @click="changeFilter(filter.value)"
      >
        {{ filter.label }}
      </button>
    </div>

    <!-- 검수 리스트 -->
    <ServerDataTable :key="tableKey" v-model:keyword="keyword" :columns="columns" :fetcher="fetchInspections" :page-size="10" :loading="loading">
      <!-- 데이터 없을 때 -->
      <template #empty>현재 선택된 조건에 해당하는 검수 상품이 없습니다.</template>
    </ServerDataTable>
  </div>
</template>

<style scoped lang="scss">
.inspection-list-page {
  .badge.status-badge {
    font-weight: 500;
    font-size: 0.85rem;
    padding: 0.35em 0.6em;
    border-radius: 0.4rem;
  }

  .badge.bg-warning {
    background-color: #f6c23e !important;
  }

  ::v-deep(.datatable td),
  ::v-deep(.datatable th) {
    text-align: center;
    vertical-align: middle;
  }
}
</style>
