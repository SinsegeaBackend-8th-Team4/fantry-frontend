<template>
  <div class="modal fade" :id="id" tabindex="-1" aria-labelledby="inquiryDetailModalLabel" aria-hidden="true">
    <div class="modal-dialog modal-lg modal-dialog-centered modal-dialog-scrollable">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title" id="inquiryDetailModalLabel">문의 상세</h5>
          <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
        </div>
        <div class="modal-body">
          <div v-if="loading" class="text-center">
            <LoadingSpinner />
          </div>
          <div v-if="error" class="alert alert-danger">{{ error }}</div>
          <div v-if="inquiry">
            <h5>{{ inquiry.title }}</h5>
            <div class="d-flex justify-content-between text-muted small mb-3">
              <span>작성자: {{ inquiry.inquiredByName || 'N/A' }}</span>
              <span>등록일: {{ formatDate(inquiry.inquiredAt) }}</span>
            </div>
            <hr>
            <div v-html="inquiry.content" class="mt-4"></div>
            <hr>
            <h6>답변</h6>
            <div v-if="inquiry.answerContent" v-html="inquiry.answerContent" class="mt-4"></div>
            <div v-else class="text-muted">아직 답변이 없습니다.</div>
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
import { getInquiryById } from '@/api/adminInquiry.js';
import LoadingSpinner from '@/components/common/atoms/LoadingSpinner.vue';

const props = defineProps({
  id: { type: String, required: true },
  inquiryId: { type: Number, default: null },
});

const inquiry = ref(null);
const loading = ref(false);
const error = ref(null);

async function fetchInquiry() {
  if (!props.inquiryId) return;

  try {
    loading.value = true;
    const response = await getInquiryById(props.inquiryId);
    inquiry.value = response.data;
  } catch (e) {
    console.error('문의 상세 정보 조회 실패:', e);
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

watch(() => props.inquiryId, fetchInquiry);

</script>
