<script setup>
import { ref, onMounted } from 'vue';
import { useRoute } from 'vue-router';
import { getNoticeDetail } from '@/api/notice'; // Import actual API

const route = useRoute();
const noticeId = ref(route.params.noticeId);
const notice = ref(null);
const loading = ref(true);
const error = ref(false);

// 날짜 포맷터 (from SettlementSettingPage.vue)
const formatDate = (datetime) => {
  if (!datetime || !Array.isArray(datetime) || datetime.length < 6) return '';
  // Month is 0-indexed in JavaScript Date constructor
  const date = new Date(datetime[0], datetime[1] - 1, datetime[2], datetime[3], datetime[4], datetime[5]);
  return date.toLocaleString();
};

const fetchNoticeDetail = async () => {
  loading.value = true;
  error.value = false;
  try {
    const response = await getNoticeDetail(noticeId.value);
    notice.value = response.data;
  } catch (err) {
    console.error('Failed to fetch notice detail:', err);
    error.value = true;
  } finally {
    loading.value = false;
  }
};

onMounted(fetchNoticeDetail);
</script>

<template>
  <div class="user-notice-detail-page">
    <h1 class="h3 mb-4 text-gray-800">공지사항 상세</h1>

    <div v-if="loading" class="text-center">로딩 중...</div>
    <div v-else-if="error" class="alert alert-danger">공지사항 정보를 불러오는데 실패했습니다.</div>
    <div v-else-if="!notice" class="alert alert-info">공지사항을 찾을 수 없습니다.</div>
    <div v-else class="card shadow-sm border-0 rounded-3 overflow-hidden mb-4">
      <div class="card-header py-3">
        <h5 class="m-0 font-weight-bold text-primary">{{ notice.title }}</h5>
      </div>
      <div class="card-body">
        <p><strong>작성자:</strong> {{ notice.createdBy }}</p>
        <p><strong>작성일:</strong> {{ formatDate(notice.createdAt) }}</p>
        <hr>
        <div class="notice-content" v-html="notice.content"></div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.user-notice-detail-page {
  /* Add specific styles if needed */
}
</style>
