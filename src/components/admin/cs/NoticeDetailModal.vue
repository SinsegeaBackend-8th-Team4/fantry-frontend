<template>
  <div class="modal fade" :id="id" tabindex="-1" aria-labelledby="noticeDetailModalLabel" aria-hidden="true">
    <div class="modal-dialog modal-lg modal-dialog-centered modal-dialog-scrollable">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title" id="noticeDetailModalLabel">공지사항 상세</h5>
          <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
        </div>
        <div class="modal-body">
          <div v-if="loading" class="text-center">
            <LoadingSpinner />
          </div>
          <div v-if="error" class="alert alert-danger">{{ error }}</div>
          <div v-if="notice">
            <h5>{{ notice.title }}</h5>
            <div class="d-flex justify-content-between text-muted small mb-3">
              <span>작성자: {{ notice.authorName || 'N/A' }}</span>
              <span>등록일: {{ formatDate(notice.createdAt) }}</span>
              <span>조회수: {{ notice.viewCount }}</span>
            </div>
            <hr>
            <div v-html="notice.content" class="mt-4"></div>
          </div>
        </div>
        <div class="modal-footer">
          <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">닫기</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, watch } from 'vue';
import { getNoticeById } from '@/api/adminNotice.js';
import LoadingSpinner from '@/components/common/atoms/LoadingSpinner.vue';

const props = defineProps({
  id: { type: String, required: true },
  noticeId: { type: Number, default: null },
});

const notice = ref(null);
const loading = ref(false);
const error = ref(null);

async function fetchNotice() {
  if (!props.noticeId) return;

  try {
    loading.value = true;
    const response = await getNoticeById(props.noticeId);
    notice.value = response.data;
  } catch (e) {
    console.error('공지사항 상세 정보 조회 실패:', e);
    error.value = '데이터를 불러오는 중 오류가 발생했습니다.';
  } finally {
    loading.value = false;
  }
}

function formatDate(dateString) {
  if (!dateString) return 'N/A';
  try {
    const dt = new Date(dateString);
    return dt.toLocaleString();
  } catch (e) {
    return dateString;
  }
}

watch(() => props.noticeId, fetchNotice);

</script>
