<script setup>
import { ref, onMounted } from 'vue';
import { useRoute } from 'vue-router';
import { searchFaqs } from '@/api/faq'; // Import searchFaqs

const route = useRoute();
const faqId = ref(route.params.faqId);
const faq = ref(null);
const loading = ref(true);
const error = ref(false);

// 날짜 포맷터 (from SettlementSettingPage.vue)
const formatDate = (datetime) => {
  if (!datetime || !Array.isArray(datetime) || datetime.length < 6) return '';
  // Month is 0-indexed in JavaScript Date constructor
  const date = new Date(datetime[0], datetime[1] - 1, datetime[2], datetime[3], datetime[4], datetime[5]);
  return date.toLocaleString();
};

const fetchFaqDetail = async () => {
  loading.value = true;
  error.value = false;
  try {
    // Use searchFaqs with faqId as a filter
    const response = await searchFaqs({ faqId: faqId.value, page: 0, size: 1 });
    if (response.data && response.data.content && response.data.content.length > 0) {
      faq.value = response.data.content[0];
    } else {
      faq.value = null; // No FAQ found
    }
  } catch (err) {
    console.error('Failed to fetch FAQ detail:', err);
    error.value = true;
  } finally {
    loading.value = false;
  }
};

onMounted(fetchFaqDetail);
</script>

<template>
  <div class="user-faq-detail-page">
    <h1 class="h3 mb-4 text-gray-800">자주 묻는 질문 상세</h1>

    <div v-if="loading" class="text-center">로딩 중...</div>
    <div v-else-if="error" class="alert alert-danger">자주 묻는 질문 정보를 불러오는데 실패했습니다.</div>
    <div v-else-if="!faq" class="alert alert-info">자주 묻는 질문을 찾을 수 없습니다.</div>
    <div v-else class="card shadow-sm border-0 rounded-3 overflow-hidden mb-4">
      <div class="card-header py-3">
        <h5 class="m-0 font-weight-bold text-primary">{{ faq.title }}</h5>
      </div>
      <div class="card-body">
        <p><strong>작성자:</strong> {{ faq.createdBy }}</p>
        <p><strong>작성일:</strong> {{ formatDate(faq.createdAt) }}</p>
        <hr>
        <div class="faq-content" v-html="faq.content"></div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.user-faq-detail-page {
  /* Add specific styles if needed */
}
</style>
