<template>
  <div>
    <h1 class="h3 mb-2 text-gray-800">검수 목록 조회</h1>
    <p class="mb-4">검수 관련 데이터를 테이블 형태로 조회하는 페이지입니다.</p>
    <div class="card shadow mb-4">
      <div class="card-header py-3">
        <h6 class="m-0 font-weight-bold text-primary">검수 데이터 테이블</h6>
      </div>
      <div class="card-body">
        <div class="table-responsive">
          <DataTable :data="data" :columns="columns" class="table table-bordered" width="100%">
            <thead>
              <tr>
                <th>이름</th>
                <th>포지션</th>
                <th>사무실</th>
                <th>나이</th>
                <th>시작일</th>
                <th>급여</th>
              </tr>
            </thead>
          </DataTable>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import DataTable from 'datatables.net-vue3';
import DataTablesCore from 'datatables.net-bs5';
import { ref } from 'vue';

DataTable.use(DataTablesCore);

// TODO: 실제 검수 데이터 API를 연동하고 컬럼을 정의해야 합니다.
const columns = [
  { data: 'name' },
  { data: 'position' },
  { data: 'office' },
  { data: 'age' },
  { data: 'start_date' },
  { data: 'salary' },
];

const data = ref([
    { "name": "Tiger Nixon", "position": "System Architect", "office": "Edinburgh", "age": 61, "start_date": "2011/04/25", "salary": "$320,800" },
]);
</script>
