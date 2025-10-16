<script setup>
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { getMyInquiryList } from '@/api/inquiry'; // Import actual API
import ServerDataTable from '@/components/common/datatable/ServerDataTable.vue';
import { textCol, dateTimeCol } from '@/composables/useDataTableColumns';

const router = useRouter();
const keyword = ref('');
const tableKey = ref(0);

async function fetchInquiries({ page, size, sort }) {
  try {
    const params = {
      page,
      size,
      sort,
      // keyword is not supported by getMyInquiryList based on api.md
    };
    const response = await getMyInquiryList(params);
    return {
      rows: response.data.content,
      total: response.data.totalElements,
    };
  } catch (error) {
    console.error('Failed to fetch user inquiries:', error);
    return { rows: [], total: 0 }; // Return empty data on error
  }
}

const columns = [
  textCol('inquiryId', '#'),
  textCol('title', '제목'),
  {
    data: 'status',
    title: '상태',
    render: (data) => {
      let badgeClass = 'bg-secondary';
      let koreanText = data;
      switch (data) {
        case 'PENDING': badgeClass = 'bg-warning'; koreanText = '대기중'; break;
        case 'COMPLETED': badgeClass = 'bg-success'; koreanText = '완료됨'; break;
        case 'REJECTED': badgeClass = 'bg-danger'; koreanText = '거절됨'; break;
      }
      return `<span class="badge ${badgeClass}">${koreanText}</span>`;
    },
  },
  dateTimeCol('inquiredAt', '문의일'),
];

const goToDetail = (inquiryId) => {
  router.push({ name: 'UserInquiryDetail', params: { inquiryId } });
};

const goToCreate = () => {
  router.push({ name: 'UserInquiryCreate' });
};

onMounted(() => {
  // Initial data fetch is handled by ServerDataTable's fetcher
});
</script>

<template>
  <div class="user-inquiry-list-page">
    <h1 class="h3 mb-4 text-gray-800">나의 1:1 문의</h1>

    <div class="card shadow-sm border-0 rounded-3 overflow-hidden mb-4">
      <div class="card-header py-3 d-flex justify-content-end">
        <button class="btn btn-primary btn-sm" @click="goToCreate">새 문의 등록</button>
      </div>
      <div class="card-body p-4">
        <ServerDataTable
          ref="table"
          :key="tableKey"
          v-model:keyword="keyword"
          search-placeholder="제목으로 검색"
          :columns="columns"
          :fetcher="fetchInquiries"
          :page-size="10"
          @row-click="({ row }) => goToDetail(row.inquiryId)"
        >
          <template #empty>문의 내역이 없습니다.</template>
        </ServerDataTable>
      </div>
    </div>
  </div>
</template>

<style scoped>
.user-inquiry-list-page {
  /* Add specific styles if needed */
}
</style>
