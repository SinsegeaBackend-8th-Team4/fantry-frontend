<script setup>
import { ref, onMounted } from 'vue';
import { useRoute } from 'vue-router';
import { getMyInquiryDetail } from '@/api/inquiry'; // Import actual API

const route = useRoute();
const inquiryId = ref(route.params.inquiryId);
const inquiry = ref(null);
const loading = ref(true);
const error = ref(false);

// 날짜 포맷터 (from SettlementSettingPage.vue)
const formatDate = (datetime) => {
  if (!datetime || !Array.isArray(datetime) || datetime.length < 6) return '';
  // Month is 0-indexed in JavaScript Date constructor
  const date = new Date(datetime[0], datetime[1] - 1, datetime[2], datetime[3], datetime[4], datetime[5]);
  return date.toLocaleString();
};

const fetchInquiryDetail = async () => {
  loading.value = true;
  error.value = false;
  try {
    const response = await getMyInquiryDetail(inquiryId.value);
    inquiry.value = response.data;
  } catch (err) {
    console.error('Failed to fetch inquiry detail:', err);
    error.value = true;
  } finally {
    loading.value = false;
  }
};

onMounted(fetchInquiryDetail);
</script>

<template>
  <div class="user-inquiry-detail-page">
    <h1 class="h3 mb-4 text-gray-800">1:1 문의 상세</h1>

    <div v-if="loading" class="text-center">로딩 중...</div>
    <div v-else-if="error" class="alert alert-danger">문의 정보를 불러오는데 실패했습니다.</div>
    <div v-else-if="!inquiry" class="alert alert-info">문의를 찾을 수 없습니다.</div>
    <div v-else class="card shadow-sm border-0 rounded-3 overflow-hidden mb-4">
      <div class="card-header py-3">
        <h5 class="m-0 font-weight-bold text-primary">{{ inquiry.title }}</h5>
      </div>
      <div class="card-body">
        <p><strong>문의 유형:</strong> {{ inquiry.csType }}</p>
        <p><strong>상태:</strong> {{ inquiry.status }}</p>
        <p><strong>문의일:</strong> {{ formatDate(inquiry.inquiredAt) }}</p>
        <hr>
        <div class="inquiry-content" v-html="inquiry.content"></div>
        <template v-if="inquiry.answerContent">
          <hr>
          <h5>답변 내용</h5>
          <p><strong>답변일:</strong> {{ formatDate(inquiry.answeredAt) }}</p>
          <div class="answer-content" v-html="inquiry.answerContent"></div>
        </template>
      </div>
    </div>
  </div>
</template>

<style scoped>
.user-inquiry-detail-page {
  /* Add specific styles if needed */
}
</style>
