<template>
    <div class="header">
        <div>
            <h1 class="h3 mb-2 text-gray-800">신고 목록 조회</h1>
            <p class="mb-4">접수된 회원 신고 내역을 확인하고 처리하는 페이지입니다.</p>
        </div>
        <button class="bottom btn btn-primary" @click="registReport">신고등록</button>
    </div>
  <div>
    <!-- ServerDataTable 컴포넌트를 사용하여 서버측 페이징/정렬/검색 구현 -->
    <ServerDataTable
      v-model:keyword="keyword"
      :columns="columns"
      :fetcher="fetchReports"
      :page-size="10">

      <!-- 데이터가 없을 때 -->
      <template #empty>접수된 신고 내역이 없습니다.</template>
    </ServerDataTable>
  </div>
</template>

<script setup>
import ServerDataTable from '@/components/common/datatable/ServerDataTable.vue';
import { ref, nextTick, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { getAllReports } from '@/api/member';

const router = useRouter();
const keyword = ref('');

/**
 * 날짜 포맷 함수
 */
function formatDate(dateString) {
  if (!dateString) return '';
  const date = new Date(dateString);
  return date.toLocaleString('ko-KR', { 
    year: 'numeric', 
    month: '2-digit', 
    day: '2-digit', 
    hour: '2-digit', 
    minute: '2-digit' 
  });
}

/**
 * 신고 상태를 한글로 변환하는 함수
 */
function formatReportStatus(status) {
  switch (status) {
    case 'RESOLVED': return '신고 승인 (제재 완료)';
    case 'RECEIVED': return '구제 신청 접수중';
    case 'WITHDRAWN': return '신고 철회됨';
    case 'REJECTED': return '구제 신청 반려';
    default: return status;
  }
}

/**
 * 신고 상태에 따른 뱃지 CSS 클래스를 반환하는 함수
 */
function getStatusBadgeClass(status) {
  let badgeClass;
  switch (status) {
    case 'RESOLVED':
      badgeClass = 'badge-primary';
      break;
    case 'RECEIVED': 
      badgeClass = 'badge-warning'; 
      break;
    case 'WITHDRAWN': 
      badgeClass = 'badge-success'; 
      break;
    case 'REJECTED': 
      badgeClass = 'badge-danger'; 
      break;
    default: 
      badgeClass = 'badge-secondary';
  }
  return `badge badge-pill ${badgeClass}`;
}

// 신고 목록 테이블 컬럼 정의
const columns = [
  { data: 'reportId', title: '신고 ID', sortable: true},
  { data: 'memberId', title: '신고된 회원 ID', sortable: true},
  { data: 'reportReason', title: '신고 내용 (요약)', sortable: false, className: 'text-left',
    render: (data, type, row) => {
        // 긴 신고 내용을 50자 이내로 요약하여 보여줍니다.
        const summary = data.length > 10 ? data.substring(0, 10) + '...' : data;
        
        // 신고 내용을 클릭 가능하도록 래핑하고 reportId를 데이터 속성으로 전달
        return `<span class="report-link" data-report-id="${row.reportId}" style="color: blue; cursor: pointer; text-decoration: underline;">${summary}</span>`;
    }
  },
  { data: 'reportAt', title: '신고 일시', sortable: true,
    render: (data) => {
      return formatDate(data);
    }
  },
  { data: 'reportStatus', title: '처리 상태', sortable: true,
    render: (data) => {
      const statusText = formatReportStatus(data);
      const badgeClass = getStatusBadgeClass(data);
      return `<span class="${badgeClass}">${statusText}</span>`;
    }
  }
].map(col => ({ ...col, 
  className: 'text-center',
}));

/**
 * 테이블 렌더링 후 이벤트 바인딩 (클릭 핸들러)
 */
function attachClickHandlers() {
  console.log('attachClickHandlers 호출됨');
  
  nextTick(() => {
    // 신고 ID 클릭 시 신고 상세 페이지 이동
    const reportIdElements = document.querySelectorAll('.report-link');
    
    reportIdElements.forEach(el => {
      // 이미 바인딩된 요소는 스킵
      if (el.dataset.boundReport) return;
      el.dataset.boundReport = 'true';
      
      el.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();
        const reportId = e.target.dataset.reportId;
        router.push({ 
          name: 'AdminReportDetail', 
          params: { reportId }
        });
      });
    });
  });
}

/**
 * 신고 목록 데이터를 가져오는 함수 (fetcher)
 * @param {object} params - 페이징, 정렬, 검색어 파라미터
 */
async function fetchReports({page, size, sort, keyword}){
  try {
    const res = await getAllReports();
    if (!res.status === 200 ) {
      console.error("Failed to fetch reports:", res.statusText);
      return { rows: [], total: 0 };
    }
    let allReports = res.data.reportList || [];

    // 검색 필터링
    if (keyword) {
      const lowerKeyword = keyword.toLowerCase();
      allReports = allReports.filter(r => 
        (r.reportReason && r.reportReason.toLowerCase().includes(lowerKeyword)) || 
        (r.memberId && r.memberId.toString().includes(lowerKeyword)) ||
        (r.reportId && r.reportId.toString().includes(lowerKeyword)) ||
        (r.reportStatus && r.reportStatus.toLowerCase().includes(lowerKeyword))
      );
    }

    // 정렬
    if (sort) {
      const [column, dir] = sort.split(',');
      allReports.sort((a, b) => {
        const aValue = getNestedValue(a, column);
        const bValue = getNestedValue(b, column);
        
        let compare = 0;
        if (aValue === bValue) {
          compare = 0;
        } else if (aValue === null || aValue === undefined) {
          compare = -1;
        } else if (bValue === null || bValue === undefined) {
          compare = 1;
        } else {
          compare = aValue > bValue ? 1 : -1;
        }
        return dir === 'asc' ? compare : -compare;
      });
    }

    // 페이징 적용
    const start = (page - 1) * size;
    const rows = allReports.slice(start, start + size);

    return {
      rows,
      total: allReports.length
    };
  } catch (error) {
    console.error('데이터 로드 중 오류:', error);
    return { rows: [], total: 0 };
  }
}

/**
 * 중첩된 속성 접근 유틸리티 (Sorting용)
 */
function getNestedValue(obj, path) {
  return path.split('.').reduce((o, p) => o?.[p], obj);
} 

onMounted(() => {
  // 초기 로드 후에도 바인딩
  setTimeout(attachClickHandlers, 500);
});

function registReport() {
  router.push({ name: 'AdminReportCreate' });
}
</script>

<style scoped>
/* DataTables의 셀에 적용되는 스타일을 위한 :deep() 셀렉터 */
:deep(table th),
:deep(table td) {
  text-align: center;
}

:deep(table td){
  pointer-events: none;
}

:deep(table td .report-link){
  pointer-events: auto;
}

:deep(table tbody tr:hover) {
  background-color: #f8f9fa;
  cursor: default;
}

.badge-primary {
    background-color: #007bff;
    color: white;
}
.badge-warning {
    background-color: #ffc107;
    color: #333;
}
.badge-success {
    background-color: #28a745;
    color: white;
}
.badge-danger {
    background-color: #dc3545;
    color: white;
}
.badge-secondary {
    background-color: #6c757d;
    color: white;
}
.badge {
    padding: 0.35em 0.65em;
    font-size: 75%;
    font-weight: 700;
    line-height: 1;
    text-align: center;
    white-space: nowrap;
    vertical-align: baseline;
    border-radius: 0.35rem;
}
.header {
    display: flex;
    justify-content: space-between;
    align-items: center;
}
.bottom {
    right: 0px;
}
</style>