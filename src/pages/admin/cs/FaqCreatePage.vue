<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { createFaq } from '@/api/adminFaq.js';
import CommonEditor from '@/components/common/organisms/CommonEditor.vue';

const router = useRouter();

const newFaq = ref({
  csTypeId: null,
  title: '',
  content: '',
});

const error = ref(null);

// 문의 유형 목록 (임시)
const csTypes = ref([
  { id: 1, name: '배송문의' },
  { id: 2, name: '결제문의' },
  { id: 3, name: '기타문의' },
  { id: 4, name: '상품문의' },
  { id: 5, name: '환불/반품 문의' },
  { id: 6, name: '판매 문의' },
]);

async function handleSubmit() {
  if (!newFaq.value.csTypeId || !newFaq.value.title || !newFaq.value.content) {
    alert('모든 필드를 입력해주세요.');
    return;
  }

  try {
    await createFaq(newFaq.value);
    alert('새 FAQ가 성공적으로 등록되었습니다.');
    router.push({ name: 'AdminFaqList' });
  } catch (e) {
    console.error('FAQ 등록 실패:', e);
    error.value = '등록 중 오류가 발생했습니다.';
    alert(error.value);
  }
}

function goToList() {
  router.push({ name: 'AdminFaqList' });
}
</script>

<template>
  <div class="container-fluid p-4">
    <div class="card shadow-sm">
      <div class="card-header">
        <h5 class="card-title mb-0">새 FAQ 등록</h5>
      </div>
      <div class="card-body">
        <form @submit.prevent="handleSubmit">
          <div class="mb-3">
            <label for="faq-title" class="form-label">제목</label>
            <input type="text" id="faq-title" class="form-control" v-model="newFaq.title" required>
          </div>

          <div class="mb-3">
            <label for="faq-cs-type" class="form-label">문의 유형</label>
            <select id="faq-cs-type" class="form-select" v-model="newFaq.csTypeId" required>
              <option :value="null" disabled>유형을 선택하세요</option>
              <option v-for="type in csTypes" :key="type.id" :value="type.id">{{ type.name }}</option>
            </select>
          </div>

          <div class="mb-3">
            <label class="form-label">내용</label>
            <CommonEditor v-model="newFaq.content" />
          </div>

          <div class="d-flex justify-content-between">
            <button type="button" class="btn btn-secondary" @click="goToList">취소</button>
            <button type="submit" class="btn btn-primary">등록</button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>
