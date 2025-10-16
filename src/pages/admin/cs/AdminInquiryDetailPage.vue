<script setup>
import { ref, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
<<<<<<< HEAD
import { getInquiryById, answerInquiry } from '@/api/adminInquiry';
import CommonEditor from '@/components/common/organisms/CommonEditor.vue';
import LoadingSpinner from '@/components/common/atoms/LoadingSpinner.vue';
=======
<<<<<<< HEAD
import { getInquiryById, answerInquiry, updateInquiryStatus } from '@/api/adminInquiry.js';
import CommonEditor from '@/components/organisms/CommonEditor.vue';
>>>>>>> develop

const route = useRoute();
const router = useRouter();
const inquiryId = Number(route.params.inquiryId);

const inquiry = ref(null);
const loading = ref(true);
const error = ref(null);

// 상태 선택 옵션
const statusOptions = ref([
  { value: 'PENDING', text: '답변 대기' },
  { value: 'IN_PROGRESS', text: '처리 중' },
  { value: 'ON_HOLD', text: '보류' },
  { value: 'REJECTED', text: '거절 (스팸)' },
  { value: 'ANSWERED', text: '답변 완료' },
]);

// 상태를 한글로 변환하는 함수
function getStatusText(status) {
  const option = statusOptions.value.find(opt => opt.value === status);
  return option ? option.text : status;
}

// URL이 이미지 파일인지 확인하는 헬퍼 함수
function isImage(url) {
  return /\.(jpeg|jpg|gif|png|webp|bmp)$/i.test(url);
}

// 문의 상세 정보 로드
async function fetchInquiry() {
  try {
    loading.value = true;
    const response = await getInquiryById(inquiryId);
    inquiry.value = response.data;
    
    // 기존 답변이 있으면 폼에 세팅
    if (!inquiry.value.answerContent) {
      inquiry.value.answerContent = '';
    }
    if (!inquiry.value.comment) {
      inquiry.value.comment = '';
    }
    // 기존 상태가 있다면 그 상태를 기본값으로 설정
    inquiry.value.reqStatus = inquiry.value.status;
  } catch (e) {
<<<<<<< HEAD
    console.error('문의 상세 정보 조회 실패:', e);
    error.value = '데이터를 불러오는 중 오류가 발생했습니다.';
=======
    error.value = '문의 내용을 불러오는 데 실패했습니다.';
    console.error(e);
=======
import { getInquiryById, answerInquiry } from '@/api/adminInquiry';
import CommonEditor from '@/components/common/organisms/CommonEditor.vue';
import LoadingSpinner from '@/components/common/atoms/LoadingSpinner.vue';

const route = useRoute();
const router = useRouter();
const inquiryId = Number(route.params.inquiryId);

const inquiry = ref(null);
const loading = ref(true);
const error = ref(null);

// 상태 선택 옵션
const statusOptions = ref([
  { value: 'PENDING', text: '답변 대기' },
  { value: 'IN_PROGRESS', text: '처리 중' },
  { value: 'ON_HOLD', text: '보류' },
  { value: 'REJECTED', text: '거절 (스팸)' },
  { value: 'ANSWERED', text: '답변 완료' },
]);

// 상태를 한글로 변환하는 함수
function getStatusText(status) {
  const option = statusOptions.value.find(opt => opt.value === status);
  return option ? option.text : status;
}

// URL이 이미지 파일인지 확인하는 헬퍼 함수
function isImage(url) {
  return /\.(jpeg|jpg|gif|png|webp|bmp)$/i.test(url);
}

// 문의 상세 정보 로드
async function fetchInquiry() {
  try {
    loading.value = true;
    const response = await getInquiryById(inquiryId);
    inquiry.value = response.data;
    
    // 기존 답변이 있으면 폼에 세팅
    if (!inquiry.value.answerContent) {
      inquiry.value.answerContent = '';
    }
    if (!inquiry.value.comment) {
      inquiry.value.comment = '';
    }
    // 기존 상태가 있다면 그 상태를 기본값으로 설정
    inquiry.value.reqStatus = inquiry.value.status;
  } catch (e) {
    console.error('문의 상세 정보 조회 실패:', e);
    error.value = '데이터를 불러오는 중 오류가 발생했습니다.';
>>>>>>> 9e2ff05ff607911e93867be14c9d9027c109dd10
>>>>>>> develop
  } finally {
    loading.value = false;
  }
}

// 답변 제출
<<<<<<< HEAD
async function handleSubmit() {
  if (!inquiry.value) return;

  if (!inquiry.value.answerContent || !inquiry.value.answerContent.trim()) {
=======
<<<<<<< HEAD
async function handleSubmitAnswer() {
  if (!answer.value.trim()) {
>>>>>>> develop
    alert('답변 내용을 입력해주세요.');
    return;
  }

  if (!inquiry.value.reqStatus) {
    alert('처리 상태를 선택해주세요.');
    return;
  }

  const payload = {
    answerContent: inquiry.value.answerContent,
    reqStatus: inquiry.value.reqStatus,
    comment: inquiry.value.comment || ''
  };

  try {
    await answerInquiry(inquiryId, payload);
    alert('답변이 성공적으로 등록되었습니다.');
    router.push({ name: 'AdminInquiryList' });
  } catch (e) {
    console.error('답변 저장 실패:', e);
    alert('답변 저장 중 오류가 발생했습니다.');
  }
}

function goToList() {
  router.push({ name: 'AdminInquiryList' });
}

function formatDate(dateValue) {
  if (!dateValue) return 'N/A';

  let dt;
  if (Array.isArray(dateValue)) {
    dt = new Date(dateValue[0], dateValue[1] - 1, dateValue[2], dateValue[3], dateValue[4], dateValue[5] || 0);
  } else {
    dt = new Date(dateValue);
  }

  if (isNaN(dt.getTime())) {
    return 'Invalid Date';
  }

  const year = dt.getFullYear();
  const month = String(dt.getMonth() + 1).padStart(2, '0');
  const day = String(dt.getDate()).padStart(2, '0');
  const hours = String(dt.getHours()).padStart(2, '0');
  const minutes = String(dt.getMinutes()).padStart(2, '0');
  const seconds = String(dt.getSeconds()).padStart(2, '0');
  return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
}

onMounted(fetchInquiry);
</script>

<template>
  <div class="container-fluid p-4">
    <h1 class="h3 mb-2 text-gray-800">1:1 문의 상세 및 답변</h1>
    <p class="mb-4">사용자 문의에 답변하고 처리 상태를 관리합니다.</p>

<<<<<<< HEAD
=======
    <div v-if="loading && !inquiry" class="text-center">Loading...</div>
=======
async function handleSubmit() {
  if (!inquiry.value) return;

  if (!inquiry.value.answerContent || !inquiry.value.answerContent.trim()) {
    alert('답변 내용을 입력해주세요.');
    return;
  }

  if (!inquiry.value.reqStatus) {
    alert('처리 상태를 선택해주세요.');
    return;
  }

  const payload = {
    answerContent: inquiry.value.answerContent,
    reqStatus: inquiry.value.reqStatus,
    comment: inquiry.value.comment || ''
  };

  try {
    await answerInquiry(inquiryId, payload);
    alert('답변이 성공적으로 등록되었습니다.');
    router.push({ name: 'AdminInquiryList' });
  } catch (e) {
    console.error('답변 저장 실패:', e);
    alert('답변 저장 중 오류가 발생했습니다.');
  }
}

function goToList() {
  router.push({ name: 'AdminInquiryList' });
}

function formatDate(dateValue) {
  if (!dateValue) return 'N/A';

  let dt;
  if (Array.isArray(dateValue)) {
    dt = new Date(dateValue[0], dateValue[1] - 1, dateValue[2], dateValue[3], dateValue[4], dateValue[5] || 0);
  } else {
    dt = new Date(dateValue);
  }

  if (isNaN(dt.getTime())) {
    return 'Invalid Date';
  }

  const year = dt.getFullYear();
  const month = String(dt.getMonth() + 1).padStart(2, '0');
  const day = String(dt.getDate()).padStart(2, '0');
  const hours = String(dt.getHours()).padStart(2, '0');
  const minutes = String(dt.getMinutes()).padStart(2, '0');
  const seconds = String(dt.getSeconds()).padStart(2, '0');
  return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
}

onMounted(fetchInquiry);
</script>

<template>
  <div class="container-fluid p-4">
    <h1 class="h3 mb-2 text-gray-800">1:1 문의 상세 및 답변</h1>
    <p class="mb-4">사용자 문의에 답변하고 처리 상태를 관리합니다.</p>

>>>>>>> develop
    <div v-if="loading" class="text-center">
      <LoadingSpinner />
      <p>데이터를 불러오는 중입니다...</p>
    </div>

<<<<<<< HEAD
=======
>>>>>>> 9e2ff05ff607911e93867be14c9d9027c109dd10
>>>>>>> develop
    <div v-if="error" class="alert alert-danger">{{ error }}</div>

    <div v-if="inquiry">
      <!-- 문의 정보 카드 -->
      <div class="card shadow-sm mb-4">
<<<<<<< HEAD
        <div class="card-header">
          <h5 class="card-title mb-0">문의 내용</h5>
=======
<<<<<<< HEAD
        <div class="card-header py-3">
          <h6 class="m-0 font-weight-bold text-primary">문의 내용</h6>
>>>>>>> develop
        </div>
        <div class="card-body">
          <div class="row">
            <div class="col-md-6">
              <p><strong>#ID:</strong> {{ inquiry.inquiryId }}</p>
              <p><strong>제목:</strong> {{ inquiry.title }}</p>
              <p><strong>작성자:</strong> {{ inquiry.inquiredByName || 'N/A' }}</p>
            </div>
            <div class="col-md-6">
              <p><strong>문의 유형:</strong> {{ inquiry.csType.name || 'N/A' }}</p>
              <p><strong>상태:</strong> 
                <span class="badge bg-primary">{{ getStatusText(inquiry.status) }}</span>
              </p>
              <p><strong>등록일:</strong> {{ formatDate(inquiry.inquiredAt) }}</p>
            </div>
          </div>
          <hr>
          <h6>문의 내용</h6>
          <div class="p-3 bg-light rounded" v-html="inquiry.content"></div>

          <!-- 첨부 파일 섹션 -->
          <div v-if="inquiry.attachmentUrls && inquiry.attachmentUrls.length > 0" class="mt-4">
            <h6>첨부 파일</h6>
            <div class="d-flex flex-wrap gap-2">
              <div v-for="(url, index) in inquiry.attachmentUrls" :key="index">
                <a :href="url" target="_blank" class="btn btn-sm btn-outline-info" v-if="!isImage(url)">
                  <i class="fas fa-paperclip me-1"></i> 파일 {{ index + 1 }}
                </a>
                <a :href="url" target="_blank" v-else>
                  <img :src="url" alt="Attachment Preview" class="img-thumbnail" style="max-width: 150px; max-height: 150px; object-fit: cover;">
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- 답변 작성/수정 폼 -->
      <div class="card shadow-sm">
        <div class="card-header">
          <h5 class="card-title mb-0">답변 {{ inquiry.answeredAt ? '수정' : '작성' }}</h5>
        </div>
        <div class="card-body">
<<<<<<< HEAD
=======
          <CommonEditor v-model="answer" />
        </div>
        <div class="card-footer d-flex justify-content-end gap-2">
          <button type="button" class="btn btn-secondary" @click="goBack">목록으로</button>
          <button type="button" class="btn btn-primary" @click="handleSubmitAnswer" :disabled="loading">
            {{ loading ? '저장 중...' : '답변 저장' }}
          </button>
=======
        <div class="card-header">
          <h5 class="card-title mb-0">문의 내용</h5>
        </div>
        <div class="card-body">
          <div class="row">
            <div class="col-md-6">
              <p><strong>#ID:</strong> {{ inquiry.inquiryId }}</p>
              <p><strong>제목:</strong> {{ inquiry.title }}</p>
              <p><strong>작성자:</strong> {{ inquiry.inquiredByName || 'N/A' }}</p>
            </div>
            <div class="col-md-6">
              <p><strong>문의 유형:</strong> {{ inquiry.csType.name || 'N/A' }}</p>
              <p><strong>상태:</strong> 
                <span class="badge bg-primary">{{ getStatusText(inquiry.status) }}</span>
              </p>
              <p><strong>등록일:</strong> {{ formatDate(inquiry.inquiredAt) }}</p>
            </div>
          </div>
          <hr>
          <h6>문의 내용</h6>
          <div class="p-3 bg-light rounded" v-html="inquiry.content"></div>

          <!-- 첨부 파일 섹션 -->
          <div v-if="inquiry.attachmentUrls && inquiry.attachmentUrls.length > 0" class="mt-4">
            <h6>첨부 파일</h6>
            <div class="d-flex flex-wrap gap-2">
              <div v-for="(url, index) in inquiry.attachmentUrls" :key="index">
                <a :href="url" target="_blank" class="btn btn-sm btn-outline-info" v-if="!isImage(url)">
                  <i class="fas fa-paperclip me-1"></i> 파일 {{ index + 1 }}
                </a>
                <a :href="url" target="_blank" v-else>
                  <img :src="url" alt="Attachment Preview" class="img-thumbnail" style="max-width: 150px; max-height: 150px; object-fit: cover;">
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- 답변 작성/수정 폼 -->
      <div class="card shadow-sm">
        <div class="card-header">
          <h5 class="card-title mb-0">답변 {{ inquiry.answeredAt ? '수정' : '작성' }}</h5>
        </div>
        <div class="card-body">
>>>>>>> develop
          <form @submit.prevent="handleSubmit">
            <div class="mb-3">
              <label class="form-label">답변 내용</label>
              <CommonEditor v-model="inquiry.answerContent" />
            </div>

            <div class="mb-3">
              <label for="inquiry-comment" class="form-label">관리자 메모 (선택사항)</label>
              <textarea 
                id="inquiry-comment" 
                class="form-control" 
                v-model="inquiry.comment" 
                rows="3"
                placeholder="관리자용 메모를 입력하세요..."
              ></textarea>
            </div>

            <div class="d-flex justify-content-between align-items-center">
              <button type="button" class="btn btn-secondary" @click="goToList">목록</button>
              <div class="d-flex align-items-center gap-2">
                <label for="inquiry-status" class="form-label mb-0 me-2">처리 상태:</label>
                <select id="inquiry-status" class="form-select" style="width: auto;" v-model="inquiry.reqStatus" required>
                  <option v-for="option in statusOptions" :key="option.value" :value="option.value">
                    {{ option.text }}
                  </option>
                </select>
                <button type="submit" class="btn btn-primary ms-2">답변 저장</button>
              </div>
            </div>
          </form>
<<<<<<< HEAD
=======
>>>>>>> 9e2ff05ff607911e93867be14c9d9027c109dd10
>>>>>>> develop
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
<<<<<<< HEAD
=======
<<<<<<< HEAD
.gap-2 { gap: 0.5rem; }
.me-2 { margin-right: 0.5rem; }
</style>
=======
>>>>>>> develop
.badge {
  padding: 0.35em 0.65em;
  font-size: 0.875em;
}

.gap-2 {
  gap: 0.5rem;
}

.img-thumbnail {
  border: 1px solid #ddd;
  padding: 3px;
  border-radius: 5px;
}
<<<<<<< HEAD
</style>
=======
</style>
>>>>>>> 9e2ff05ff607911e93867be14c9d9027c109dd10
>>>>>>> develop
