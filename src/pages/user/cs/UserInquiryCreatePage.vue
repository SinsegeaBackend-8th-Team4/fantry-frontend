<script setup>
import { ref } from 'vue';
import { createInquiry, addInquiryAttachments } from '@/api/inquiry'; // Import actual API

const success = ref('');
const error = ref('');

const form = ref({
  csTypeId: null,
  title: '',
  content: '',
});

const selectedFiles = ref([]); // To store selected files
const isSubmitting = ref(false);

const handleFileChange = (event) => {
  selectedFiles.value = Array.from(event.target.files);
};

const submitInquiry = async () => {
  isSubmitting.value = true;
  success.value = '';
  error.value = '';

  try {
    if (!form.value.csTypeId) {
      error.value = '문의 유형을 선택해주세요.';
      isSubmitting.value = false;
      return;
    }
    if (!form.value.title) {
      error.value = '제목을 입력해주세요.';
      isSubmitting.value = false;
      return;
    }
    if (!form.value.content) {
      error.value = '내용을 입력해주세요.';
      isSubmitting.value = false;
      return;
    }

    // File attachment validation
    const MAX_TOTAL_SIZE_MB = 20;
    const MAX_FILE_SIZE_MB = 5;
    const MAX_FILE_COUNT = 5;
    const ALLOWED_FILE_TYPES = ['image/jpeg', 'image/png', 'image/gif']; // Only image files

    if (selectedFiles.value.length > 0) {
      if (selectedFiles.value.length > MAX_FILE_COUNT) {
        error.value = `파일은 최대 ${MAX_FILE_COUNT}개까지 첨부할 수 있습니다.`;
        isSubmitting.value = false;
        return;
      }

      let totalSize = 0;
      for (const file of selectedFiles.value) {
        // Individual file size check
        if (file.size > MAX_FILE_SIZE_MB * 1024 * 1024) {
          error.value = `각 파일은 ${MAX_FILE_SIZE_MB}MB를 초과할 수 없습니다. (파일명: ${file.name})`;
          isSubmitting.value = false;
          return;
        }
        // File type check
        if (!ALLOWED_FILE_TYPES.includes(file.type)) {
          error.value = `이미지 파일 (JPG, PNG, GIF)만 첨부할 수 있습니다. (파일명: ${file.name})`;
          isSubmitting.value = false;
          return;
        }
        totalSize += file.size;
      }

      // Total file size check
      if (totalSize > MAX_TOTAL_SIZE_MB * 1024 * 1024) {
        error.value = `총 파일 크기는 ${MAX_TOTAL_SIZE_MB}MB를 초과할 수 없습니다.`;
        isSubmitting.value = false;
        return;
      }
    }

    const inquiryResponse = await createInquiry(form.value);
    const inquiryId = inquiryResponse.data.inquiryId;

    if (selectedFiles.value.length > 0) {
      const formData = new FormData();
      selectedFiles.value.forEach(file => {
        formData.append('files', file);
      });
      await addInquiryAttachments(inquiryId, formData);
    }

    success.value = '문의가 성공적으로 등록되었습니다.';
    // router.push({ name: 'UserInquiryDetail', params: { inquiryId } }); // Redirect to detail page
  } catch (err) {
    console.error('Failed to submit inquiry:', err);
    error.value = '문의 등록에 실패했습니다.';
  } finally {
    isSubmitting.value = false;
  }
};

// Dummy CS Types (replace with API call if categories are dynamic)
const csTypes = ref([
  { id: 1, name: '배송' },
  { id: 2, name: '결제' },
  { id: 3, name: '기타' },
  { id: 4, name: '상품' },
  { id: 5, name: '환불/반품' },
  { id: 6, name: '판매' },
]);
</script>

<template>
  <div class="user-inquiry-create-page">
    <h1 class="h3 mb-4 text-gray-800">1:1 문의하기</h1>

    <div v-if="isVisible" :class="[`alert alert-${alertType}`, 'alert-dismissible fade show']" role="alert">
      {{ alertMessage }}
      <button type="button" class="btn-close" @click="hideAlert" aria-label="Close"></button>
    </div>

    <div v-if="success" class="alert alert-success">{{ success }}</div>
    <div v-if="error" class="alert alert-danger">{{ error }}</div>

    <div class="card shadow-sm border-0 rounded-3 overflow-hidden mb-4">
      <div class="card-body p-4">
        <form @submit.prevent="submitInquiry">
          <div class="form-group mb-3">
            <label for="csType" class="form-label">문의 유형</label>
            <select class="form-select" id="csType" v-model="form.csTypeId">
              <option :value="null" disabled>선택하세요</option>
              <option v-for="type in csTypes" :key="type.id" :value="type.id">{{ type.name }}</option>
            </select>
          </div>

          <div class="form-group mb-3">
            <label for="title" class="form-label">제목</label>
            <input type="text" class="form-control" id="title" v-model="form.title" maxlength="100">
          </div>

          <div class="form-group mb-3">
            <label for="content" class="form-label">내용</label>
            <textarea class="form-control" id="content" v-model="form.content" rows="8" maxlength="2000"></textarea>
          </div>

          <div class="form-group mb-3">
            <label for="attachments" class="form-label">첨부 파일</label>
            <input type="file" class="form-control" id="attachments" @change="handleFileChange" multiple>
            <small class="form-text text-muted">최대 5개 파일 (JPG, PNG, GIF), 각 파일당 5MB 이하, 총 20MB 이하</small>
          </div>
          <div class="d-flex justify-content-end mt-4">
            <button type="submit" class="btn btn-primary" :disabled="isSubmitting">문의 등록</button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<style scoped>
.user-inquiry-create-page {
  /* Add specific styles if needed */
}
</style>
