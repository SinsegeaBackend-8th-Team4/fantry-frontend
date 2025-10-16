<template>
  <div>
    <h2 class="mb-4">1:1 문의하기</h2>

    <!-- 문의 등록 폼 -->
    <div class="card shadow-sm mb-5">
      <div class="card-body p-4">
        <h4 class="card-title mb-4 font-weight-bold">새 문의 작성</h4>
        <form @submit.prevent="submitInquiry">
          <div class="form-row">
            <div class="form-group col-md-6">
              <label for="inquiryType">문의 유형</label>
              <select class="form-control custom-select" id="inquiryType" v-model="newInquiry.csTypeId">
                <option value="" disabled>유형을 선택하세요</option>
                <option value="1">배송</option>
                <option value="2">결제</option>
                <option value="3">기타</option>
                <option value="4">상품</option>
                <option value="5">환불/반품</option>
                <option value="6">판매</option>
              </select>
            </div>
            <div class="form-group col-md-6">
              <label for="inquiryTitle">제목</label>
              <input type="text" class="form-control" id="inquiryTitle" v-model="newInquiry.title" placeholder="제목을 입력하세요">
            </div>
          </div>
          <div class="form-group">
            <label for="inquiryContent">내용</label>
            <textarea class="form-control" id="inquiryContent" rows="6" v-model="newInquiry.content" placeholder="문의하실 내용을 자세하게 입력해주세요."></textarea>
          </div>
          <button type="submit" class="btn btn-primary btn-lg btn-block" :disabled="isSubmitting">
            {{ isSubmitting ? '등록 중...' : '문의 등록' }}
          </button>
        </form>
      </div>
    </div>

    <!-- 내 문의 목록 -->
    <h4 class="mb-4 font-weight-bold">내 문의 내역</h4>
    <table class="table table-hover inquiry-table">
       <tbody>
        <tr v-if="loading">
          <td colspan="3" class="text-center py-5">
            <div class="spinner-border" role="status">
              <span class="sr-only">Loading...</span>
            </div>
          </td>
        </tr>
        <tr v-else-if="inquiries.length === 0">
          <td colspan="3" class="text-center py-5">문의 내역이 없습니다.</td>
        </tr>
        <tr v-for="inquiry in inquiries" :key="inquiry.id" @click="goToInquiryDetail(inquiry.id)">
          <td>
            <span class="inquiry-type">{{ inquiry.csType }}</span>
            <p class="inquiry-title mb-0">{{ inquiry.title }}</p>
          </td>
          <td class="text-center">
            <span class="badge badge-pill" :class="getStatusClass(inquiry.status)">{{ inquiry.status }}</span>
          </td>
          <td class="text-right inquiry-date">{{ formatDate(inquiry.inquiredAt) }}</td>
        </tr>
      </tbody>
    </table>
     <!-- 페이지네이션 추후 구현 -->
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { createInquiry, getMyInquiryList } from '@/api/inquiry';

const router = useRouter();

// 새 문의 관련
const newInquiry = ref({
  csTypeId: '',
  title: '',
  content: ''
});
const isSubmitting = ref(false);

// 내 문의 목록 관련
const inquiries = ref([]);
const loading = ref(false);
const currentPage = ref(1);
const totalPages = ref(1);

const fetchInquiries = async () => {
  loading.value = true;
  try {
    const params = {
      page: currentPage.value,
      size: 10,
    };
    const response = await getMyInquiryList(params);
    inquiries.value = response.content;
    totalPages.value = response.totalPages;
  } catch (error) {
    console.error('내 문의 목록을 불러오는 중 오류가 발생했습니다:', error);
    inquiries.value = [];
  } finally {
    loading.value = false;
  }
};

const submitInquiry = async () => {
  if (!newInquiry.value.csTypeId || !newInquiry.value.title || !newInquiry.value.content) {
    alert('모든 필드를 입력해주세요.');
    return;
  }
  isSubmitting.value = true;
  try {
    await createInquiry(newInquiry.value);
    alert('문의가 성공적으로 등록되었습니다.');
    // 폼 초기화 및 목록 새로고침
    newInquiry.value = { csTypeId: '', title: '', content: '' };
    fetchInquiries();
  } catch (error) {
    console.error('문의 등록 중 오류가 발생했습니다:', error);
    alert('문의 등록에 실패했습니다.');
  } finally {
    isSubmitting.value = false;
  }
};

const formatDate = (dateInput) => {
  if (!dateInput) return '';
  // Ensure the input is a string before splitting
  const dateString = String(dateInput);
  const datePart = dateString.split('T')[0];
  return datePart.replace(/-/g, '.');
};

const getStatusClass = (status) => {
    switch (status) {
        case 'PENDING': return 'badge-warning';
        case 'IN_PROGRESS': return 'badge-info';
        case 'ANSWERED': return 'badge-success';
        case 'REJECTED': return 'badge-danger';
        case 'ON_HOLD': return 'badge-secondary';
        default: return 'badge-light';
    }
};

const goToInquiryDetail = (id) => {
  // 상세 페이지 라우터가 아직 없으므로 주석 처리
  // router.push(`/cs/inquiry/${id}`);
  console.log(`Go to inquiry detail page for id: ${id}`);
};

onMounted(() => {
  fetchInquiries();
});

</script>

<style scoped>
.form-control,
.custom-select {
    height: calc(1.5em + 1rem + 2px);
    padding: 0.5rem 1rem;
    font-size: 1rem;
}

.inquiry-table {
  border-top: 2px solid #212529;
}

.inquiry-table tr {
  border-bottom: 1px solid #dee2e6;
}

.inquiry-table td {
  padding: 1.25rem 0.75rem;
  vertical-align: middle;
}

.inquiry-table tr:hover {
  background-color: #f8f9fa;
  cursor: pointer;
}

.inquiry-type {
  font-size: 0.8rem;
  font-weight: 600;
  color: #6c757d;
  display: block;
  margin-bottom: 0.25rem;
}

.inquiry-title {
  font-weight: 600;
  color: #212529;
  font-size: 1.1rem;
}

.inquiry-date {
  color: #6c757d;
  font-size: 0.9rem;
  white-space: nowrap;
}

.badge {
    font-size: 0.8rem;
    padding: 0.5em 0.75em;
}
</style>
