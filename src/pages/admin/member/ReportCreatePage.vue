<template>
  <div>
    <div class="d-flex justify-content-between align-items-center mb-4">
      <h1 class="h3 mb-0 text-gray-800">신고 등록</h1>
      <button class="btn btn-secondary" @click="router.back()">목록으로</button>
    </div>

    <div class="card">
      <div class="card-body">
        <form @submit.prevent="submitReport">
          <div class="mb-3">
            <label for="memberId" class="form-label">회원 번호</label>
            <input type="number" id="memberId" v-model="form.memberId" class="form-control" required />
          </div>

          <div class="mb-3">
            <label for="reportReason" class="form-label">신고 사유</label>
            <textarea id="reportReason" v-model="form.reportReason" class="form-control" rows="3" required></textarea>
          </div>

          <div class="mb-3">
            <label class="form-label">신고 상태</label>
            <input type="text" class="form-control" :value="form.reportStatus" disabled />
          </div>

          <button type="submit" class="btn btn-primary">신고 등록</button>
        </form>
      </div>
    </div>

    <div v-if="successMessage" class="alert alert-success mt-3">
      {{ successMessage }}
    </div>

    <div v-if="errorMessage" class="alert alert-danger mt-3">
      {{ errorMessage }}
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { registReport } from '@/api/member';

const router = useRouter();

const form = ref({
  reportReason: '',
  reportStatus: 'RESOLVED', // 기본값 설정
  rejectedComment: '',
  memberId: null,
});

const successMessage = ref('');
const errorMessage = ref('');

const submitReport = async () => {
  successMessage.value = '';
  errorMessage.value = '';

  try {
    const response = await registReport(form.value);

    if (!response.status == 200) throw new Error('신고 등록에 실패했습니다.');

    successMessage.value = '신고가 성공적으로 등록되었습니다.';
    // 입력 초기화
    form.value = {
      reportReason: '',
      reportStatus: 'RESOLVED',
      rejectedComment: '',
      memberId: null,
    };
    // 2초 후에 목록 페이지로 이동
    setTimeout(() => {
      router.push({ name: 'AdminReportList' });
    }, 2000);
  } catch (error) {
    console.error(error);
    errorMessage.value = error.message || '신고 등록 중 오류가 발생했습니다.';
  }
};
</script>

<style scoped></style>