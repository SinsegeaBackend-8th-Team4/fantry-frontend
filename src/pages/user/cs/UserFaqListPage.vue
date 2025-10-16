<script setup>
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { searchFaqs } from '@/api/faq'; // Import actual API
import ServerDataTable from '@/components/common/datatable/ServerDataTable.vue';
import { textCol, dateTimeCol } from '@/composables/useDataTableColumns';

const router = useRouter();
const keyword = ref('');
const tableKey = ref(0);
const csTypeId = ref(null);

// Dummy CS Types (replace with API call if categories are dynamic)
const csTypes = ref([
  { id: null, name: '전체' },
  { id: 1, name: '배송' },
  { id: 2, name: '결제' },
  { id: 3, name: '기타' },
  { id: 4, name: '상품' },
  { id: 5, name: '환불/반품' },
  { id: 6, name: '판매' },
]);

async function fetchFaqs({ page, size, sort }) {
  try {
    const params = {
      page,
      size,
      sort,
      keyword: keyword.value || null,
      csTypeId: csTypeId.value,
      status: 'ACTIVE', // Assuming user FAQs are always active
    };
    const response = await searchFaqs(params);
    return {
      rows: response.data.content,
      total: response.data.totalElements,
    };
  } catch (error) {
    console.error('Failed to fetch user FAQs:', error);
    return { rows: [], total: 0 }; // Return empty data on error
  }
}

const columns = [
  textCol('faqId', '#'),
  textCol('title', '제목'),
  textCol('createdBy', '작성자'),
  dateTimeCol('createdAt', '작성일'),
];

const goToDetail = (faqId) => {
  router.push({ name: 'UserFaqDetail', params: { faqId } });
};

const changeCategory = (id) => {
  csTypeId.value = id;
  tableKey.value++; // Force ServerDataTable re-render
};

onMounted(() => {
  // Initial data fetch is handled by ServerDataTable's fetcher
});
</script>

<template>
  <div class="user-faq-list-page">
    <h1 class="h3 mb-4 text-gray-800">자주 묻는 질문</h1>

    <div class="card shadow-sm border-0 rounded-3 overflow-hidden mb-4">
      <div class="card-body p-4">
        <ul class="nav nav-pills mb-4">
          <li class="nav-item" v-for="type in csTypes" :key="type.id">
            <a class="nav-link" :class="{ active: csTypeId === type.id }" @click.prevent="changeCategory(type.id)" href="#">
              {{ type.name }}
            </a>
          </li>
        </ul>

        <ServerDataTable
          ref="table"
          :key="tableKey"
          v-model:keyword="keyword"
          search-placeholder="제목으로 검색"
          :columns="columns"
          :fetcher="fetchFaqs"
          :page-size="10"
          @row-click="({ row }) => goToDetail(row.faqId)"
        >
          <template #empty>자주 묻는 질문이 없습니다.</template>
        </ServerDataTable>
      </div>
    </div>
  </div>
</template>

<style scoped>
.user-faq-list-page {
  /* Add specific styles if needed */
}
</style>
