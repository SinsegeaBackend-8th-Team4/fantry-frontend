<template>
  <div>
    <h1 class="h3 mb-2 text-gray-800">정산 목록 조회</h1>
    <p class="mb-4">정산 관련 데이터를 테이블 형태로 조회하는 페이지입니다.</p>
    <div class="card shadow mb-4">
      <div class="card-header py-3">
        <h6 class="m-0 font-weight-bold text-primary">정산 데이터 테이블</h6>
      </div>
      <div class="card-body">
        <div class="table-responsive">
          <!-- <thead>는 columns prop에 title이 정의되었으므로 제거해도 됩니다. -->
          <DataTable :data="data" :columns="columns" class="table table-bordered" width="100%" />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import DataTable from 'datatables.net-vue3';
import DataTablesCore from 'datatables.net-bs5';
import { ref, onMounted } from 'vue';
import { getSettlements } from '@/api/settlement'; // 모듈화된 API 함수를 가져옵니다.

DataTable.use(DataTablesCore);

// ⭐️ 테이블의 구조(컬럼)는 미리 정의합니다.
// 이렇게 하면 API 호출 여부와 관계없이 테이블이 안정적으로 초기화됩니다.
const columns = [
  { data: 'name', title: '이름' },
  { data: 'position', title: '포지션' },
  { data: 'office', title: '사무실' },
  { data: 'age', title: '나이' },
  { data: 'start_date', title: '시작일' },
  { data: 'salary', title: '급여' },
];

// 테이블의 내용(데이터)는 API를 통해 채워질 것이므로 빈 배열로 시작합니다.
const data = ref([]);

onMounted(async () => {
  try {
    const response = await getSettlements();

    // ⭐️ API 응답이 배열인지 확인하여 데이터 형식의 안정성을 보장합니다.
    if (Array.isArray(response.data)) {
      data.value = response.data;
    } else {
      // 배열이 아닌 경우 (e.g., 404 페이지의 HTML이 반환될 때) 콘솔에 경고를 남기고 빈 배열로 처리합니다.
      console.warn('API 응답이 예상된 배열 형식이 아닙니다. 백엔드 API를 확인해주세요.', response.data);
      data.value = [];
    }
  } catch (error) {
    console.error('정산 목록을 불러오는 데 실패했습니다:', error);
    data.value = []; // 에러 발생 시에도 안전하게 빈 배열을 할당합니다.
  }
});
</script>
