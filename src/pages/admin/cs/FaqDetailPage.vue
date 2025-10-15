<script setup>
import { ref, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { getFaqById, deleteFaq } from '@/api/adminFaq.js';
import LoadingSpinner from '@/components/common/atoms/LoadingSpinner.vue';

const route = useRoute();
const router = useRouter();
const faqId = Number(route.params.faqId);

const faq = ref(null);
const loading = ref(true);
const error = ref(null);

async function fetchFaq() {
  try {
    loading.value = true;
    const response = await getFaqById(faqId);
    faq.value = response.data;
  } catch (e) {
    console.error('FAQ 상세 정보 조회 실패:', e);
    error.value = '데이터를 불러오는 중 오류가 발생했습니다.';
  } finally {
    loading.value = false;
  }
}

async function handleDelete() {
  if (confirm('정말로 이 FAQ를 삭제하시겠습니까?')) {
    try {
      await deleteFaq(faqId);
      alert('FAQ가 삭제되었습니다.');
      router.push({ name: 'AdminFaqList' });
    } catch (e) {
      console.error('FAQ 삭제 실패:', e);
      alert('삭제 중 오류가 발생했습니다.');
    }
  }
}

function goToList() {
  router.push({ name: 'AdminFaqList' });
}

function goToEdit() {
  console.log('Navigating to AdminFaqEdit with faqId:', faqId);
  router.push({ name: 'AdminFaqEdit', params: { faqId } });
}

function formatDate(dateValue) {
  if (!dateValue) return 'N/A';

  let dt;
  if (Array.isArray(dateValue)) {
    // Assuming format [year, month, day, hour, minute, second]
    // Month is 0-indexed in Date constructor
    dt = new Date(dateValue[0], dateValue[1] - 1, dateValue[2], dateValue[3], dateValue[4], dateValue[5] || 0);
  } else {
    // Assuming it's a date string
    dt = new Date(dateValue);
  }

  if (isNaN(dt.getTime())) {
    return 'Invalid Date'; // Handle invalid date values
  }

  const year = dt.getFullYear();
  const month = String(dt.getMonth() + 1).padStart(2, '0');
  const day = String(dt.getDate()).padStart(2, '0');
  const hours = String(dt.getHours()).padStart(2, '0');
  const minutes = String(dt.getMinutes()).padStart(2, '0');
  const seconds = String(dt.getSeconds()).padStart(2, '0');
  return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
}

onMounted(fetchFaq);
</script>

<template>
  <div class="container-fluid p-4">
    <div v-if="loading" class="text-center">
      <LoadingSpinner />
      <p>데이터를 불러오는 중입니다...</p>
    </div>
    <div v-if="error" class="alert alert-danger">{{ error }}</div>

    <div v-if="faq" class="card shadow-sm">
      <div class="card-header">
        <h5 class="card-title mb-0">FAQ 상세 정보</h5>
      </div>
      <div class="card-body">
        <div class="row">
          <div class="col-md-6">
            <p><strong>#ID:</strong> {{ faq.faqId }}</p>
            <p><strong>제목:</strong> {{ faq.title }}</p>
            <p><strong>작성자:</strong> {{ faq.createdBy || 'N/A' }}</p>
          </div>
          <div class="col-md-6">
            <p><strong>문의 유형:</strong> {{ faq.csType || 'N/A' }}</p>
            <p><strong>상태:</strong> 
              <span class="badge" :class="faq.status === 'ACTIVE' ? 'bg-success' : 'bg-danger'">
                {{ faq.status === 'ACTIVE' ? '활성' : '비활성' }}
              </span>
            </p>
            <p><strong>등록일:</strong> {{ formatDate(faq.createdAt) }}</p>
          </div>
        </div>
        <hr>
        <h6>내용</h6>
        <div class="p-3 bg-light rounded" v-html="faq.content"></div>
      </div>
      <div class="card-footer d-flex justify-content-between">
        <button class="btn btn-secondary" @click="goToList">목록</button>
        <div>
          <button class="btn btn-primary me-2" @click="goToEdit">수정</button>
          <button class="btn btn-danger" @click="handleDelete">삭제</button>
        </div>
      </div>
    </div>
  </div>
</template>
