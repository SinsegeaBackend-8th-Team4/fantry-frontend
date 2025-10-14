<script setup>
import { ref, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { getInquiryById, answerInquiry, updateInquiryStatus } from '@/api/adminInquiry.js';
import CommonEditor from '@/components/organisms/CommonEditor.vue';

const route = useRoute();
const router = useRouter();

const inquiryId = ref(route.params.inquiryId);
const inquiry = ref(null);
const answer = ref('');
const loading = ref(false);
const error = ref(null);

// 문의 상세 정보 로드
async function fetchInquiryDetail() {
  loading.value = true;
  try {
    const response = await getInquiryById(inquiryId.value);
    inquiry.value = response.data;
    answer.value = response.data.answer || '';
  } catch (e) {
    error.value = '문의 내용을 불러오는 데 실패했습니다.';
    console.error(e);
  } finally {
    loading.value = false;
  }
}

// 답변 제출
async function handleSubmitAnswer() {
  if (!answer.value.trim()) {
    alert('답변 내용을 입력해주세요.');
    return;
  }
  loading.value = true;
  try {
    await answerInquiry(inquiryId.value, { answer: answer.value });
    alert('답변이 성공적으로 등록/수정되었습니다.');
    await fetchInquiryDetail(); // 상태 갱신을 위해 다시 로드
  } catch (e) {
    error.value = '답변 저장 중 오류가 발생했습니다.';
    console.error(e);
  } finally {
    loading.value = false;
  }
}

// 상태 변경
async function handleStatusChange(newStatus) {
  if (!confirm(`상태를 '${newStatus}'(으)로 변경하시겠습니까?`)) return;
  loading.value = true;
  try {
    await updateInquiryStatus(inquiryId.value, { status: newStatus });
    alert('상태가 변경되었습니다.');
    await fetchInquiryDetail(); // 상태 갱신을 위해 다시 로드
  } catch (e) {
    error.value = '상태 변경 중 오류가 발생했습니다.';
    console.error(e);
  } finally {
    loading.value = false;
  }
}

function goBack() {
  router.push('/admin/cs/inquiry');
}

onMounted(fetchInquiryDetail);
</script>

<template>
  <div>
    <h1 class="h3 text-gray-800">1:1 문의 상세 및 답변</h1>
    <p class="mb-4">사용자 문의에 답변하고 처리 상태를 관리합니다.</p>

    <div v-if="loading && !inquiry" class="text-center">Loading...</div>
    <div v-if="error" class="alert alert-danger">{{ error }}</div>

    <div v-if="inquiry">
      <!-- 문의 정보 카드 -->
      <div class="card shadow-sm mb-4">
        <div class="card-header py-3">
          <h6 class="m-0 font-weight-bold text-primary">문의 내용</h6>
        </div>
        <div class="card-body">
          <h5>{{ inquiry.title }}</h5>
          <p>
            <strong>작성자:</strong> {{ inquiry.memberName }} |
            <strong>문의 유형:</strong> {{ inquiry.csType }} |
            <strong>등록일:</strong> {{ new Date(inquiry.inquiredAt).toLocaleString() }} |
            <strong>상태:</strong> <span class="badge bg-primary text-white">{{ inquiry.status }}</span>
          </p>
          <hr>
          <div v-html="inquiry.content"></div>
          <!-- 첨부파일 등 추가 정보 표시 영역 -->
        </div>
      </div>

      <!-- 답변 입력 카드 -->
      <div class="card shadow-sm">
        <div class="card-header py-3 d-flex justify-content-between align-items-center">
          <h6 class="m-0 font-weight-bold text-primary">답변 작성</h6>
          <div>
            <button v-if="inquiry.status === 'WAITING'" @click="handleStatusChange('PROCESSING')" class="btn btn-sm btn-info me-2">답변 중</button>
            <button v-if="inquiry.status !== 'COMPLETED'" @click="handleStatusChange('COMPLETED')" class="btn btn-sm btn-success">답변 완료 처리</button>
          </div>
        </div>
        <div class="card-body">
          <CommonEditor v-model="answer" />
        </div>
        <div class="card-footer d-flex justify-content-end gap-2">
          <button type="button" class="btn btn-secondary" @click="goBack">목록으로</button>
          <button type="button" class="btn btn-primary" @click="handleSubmitAnswer" :disabled="loading">
            {{ loading ? '저장 중...' : '답변 저장' }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.gap-2 { gap: 0.5rem; }
.me-2 { margin-right: 0.5rem; }
</style>
