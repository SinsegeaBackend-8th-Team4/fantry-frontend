<script setup>
  import { ref, onMounted } from 'vue';
  import { apiClient } from '@/api';

  const inquiries = ref([]);
  const listLoading = ref(true);
  const loading = ref(false);
  const showForm = ref(false);

  const subject = ref('');
  const category = ref('general');
  const message = ref('');
  const email = ref('');
  const success = ref('');
  const error = ref('');

  const categories = [
    { value: 'general', label: '일반문의' },
    { value: 'order', label: '주문/결제' },
    { value: 'product', label: '상품문의' },
    { value: 'etc', label: '기타' },
  ];

  function formatDate(dateString) {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString('ko-KR') + ' ' + date.toLocaleTimeString('ko-KR', { hour: '2-digit', minute: '2-digit' });
  }

  function resetForm() {
    subject.value = '';
    category.value = 'general';
    message.value = '';
    email.value = '';
    success.value = '';
    error.value = '';
  }

  function openForm() {
    resetForm();
    showForm.value = true;
  }

  function closeForm() {
    showForm.value = false;
    success.value = '';
    error.value = '';
  }

  async function fetchInquiries() {
    listLoading.value = true;
    try {
      // 엔드포인트 수정 필요!!!!
      //const res = await apiClient.get('/mypage/support/inquiry', { withCredentials: true });
      
      const data = res.data;
      if (Array.isArray(data)) {
        inquiries.value = data;
      } else if (Array.isArray(data?.inquiries) || Array.isArray(data?.list) || Array.isArray(data?.memberList)) {
        inquiries.value = data.inquiries || data.list || data.memberList;
      } else if (Array.isArray(res?.data?.data)) {
        inquiries.value = res.data.data;
      } else {
        // 단건 또는 다른 구조면 빈 배열 처리
        inquiries.value = data ? (Array.isArray(data) ? data : []) : [];
      }
    } catch (err) {
      console.error('fetch inquiries error', err);
      inquiries.value = [];
    } finally {
      listLoading.value = false;
    }
  }

  async function submitInquiry() {
    success.value = '';
    error.value = '';

    if (!subject.value.trim() || !message.value.trim()) {
      error.value = '제목과 문의 내용을 입력하세요.';
      return;
    }

    loading.value = true;
    try {
      const payload = {
        subject: subject.value.trim(),
        category: category.value,
        message: message.value.trim(),
        contactEmail: email.value?.trim() || null,
      };

      await apiClient.post('/mypage/support/inquiry', payload, { withCredentials: true });

      success.value = '문의가 정상적으로 접수되었습니다.';
      resetForm();

      // 목록 갱신하고 폼 닫기
      await fetchInquiries();
      showForm.value = false;
    } catch (err) {
      console.error('inquiry submit error', err);
      error.value = err?.response?.data?.message || '문의 접수 중 오류가 발생했습니다.';
    } finally {
      loading.value = false;
    }
  }

  onMounted(() => {
    fetchInquiries();
  });
</script>

<template>
  <div class="content-page">
    <div class="d-flex justify-content-between align-items-center mb-4">
      <h1 class="page-title">
        <i class="fa-solid fa-headphones"></i> 문의 내역</h1>
        <button class="btn btn-primary" @click="openForm" v-if="!showForm">문의하기</button>
        <button class="btn btn-secondary" @click="closeForm" v-else>목록으로</button>
      </div>
      <p class="page-description">관리자에게 문의사항이 있다면 해당 페이지를 이용해주세요.</p>

    <div v-if="listLoading" class="text-center py-4">
      <span class="spinner-border" role="status" aria-hidden="true"></span>
    </div>

    <div v-else>
      <div v-if="!showForm">
        <div v-if="inquiries.length === 0" class="alert alert-info">등록된 문의가 없습니다.</div>

        <table v-else class="table table-hover">
          <thead>
            <tr>
              <th class="text-center">#</th>
              <th>제목</th>
              <th class="text-center">카테고리</th>
              <th class="text-center">상태</th>
              <th class="text-center">날짜</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(i, idx) in inquiries" :key="i.id || i.inquiryId || idx">
              <td class="text-center">{{ idx + 1 }}</td>
              <td>
                <div class="fw-bold">{{ i.subject }}</div>
                <div class="text-muted small" v-if="i.answer">답변: {{ i.answer }}</div>
              </td>
              <td class="text-center text-capitalize">{{ i.category }}</td>
              <td class="text-center">
                <span class="badge" :class="i.status === 'answered' ? 'bg-success' : 'bg-secondary'">
                  {{ i.status || 'pending' }}
                </span>
              </td>
              <td class="text-center">{{ formatDate(i.createdAt || i.createAt || i.created) }}</td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- 문의 폼 -->
      <div v-if="showForm" class="card p-4 mt-3">
        <div v-if="success" class="alert alert-success">{{ success }}</div>
        <div v-if="error" class="alert alert-danger">{{ error }}</div>

        <form @submit.prevent="submitInquiry">
          <div class="mb-3">
            <label class="form-label">카테고리</label>
            <select class="form-select" v-model="category" :disabled="loading">
              <option v-for="c in categories" :key="c.value" :value="c.value">{{ c.label }}</option>
            </select>
          </div>

          <div class="mb-3">
            <label class="form-label">제목 <span class="text-danger">*</span></label>
            <input class="form-control" v-model="subject" :disabled="loading" placeholder="문의 제목을 입력하세요" />
          </div>

          <div class="mb-3">
            <label class="form-label">연락처(이메일)</label>
            <input class="form-control" v-model="email" :disabled="loading" placeholder="회신 받을 이메일을 입력하세요 (선택)" />
          </div>

          <div class="mb-3">
            <label class="form-label">문의 내용 <span class="text-danger">*</span></label>
            <textarea class="form-control" v-model="message" :disabled="loading" rows="8" placeholder="문의 내용을 상세히 작성해 주세요"></textarea>
          </div>

          <div class="d-flex justify-content-end">
            <button type="button" class="btn btn-secondary me-2" @click="resetForm" :disabled="loading">취소</button>
            <button type="submit" class="btn btn-primary" :disabled="loading">
              <span v-if="loading" class="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
              제출
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<style scoped>
  .content-page {
    max-width: 900px;
    margin: 20px auto;
    padding: 24px;
    background: #fff;
    border-radius: 10px;
    box-shadow: 0 4px 12px rgba(0,0,0,0.04);
  }
  .page-title {
      font-size: 1.8rem;
      font-weight: 700;
      color: #333;
      border-bottom: 3px solid #f0f0f0;
      padding-bottom: 10px;
      margin-bottom: 10px;
  }

  .page-description {
      color: #666;
      margin-bottom: 30px;
      font-size: 0.95rem;
  }
  .card { border: 1px solid #e9ecef; border-radius: 6px; }
  .table td, .table th { vertical-align: middle; }
</style>