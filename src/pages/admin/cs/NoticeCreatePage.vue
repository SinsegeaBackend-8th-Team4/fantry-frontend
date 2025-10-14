<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { createNotice } from '@/api/adminNotice.js';
import CommonEditor from '@/components/common/organisms/CommonEditor.vue';

const router = useRouter();

const newNotice = ref({
  title: '',
  content: '',
  status: 'ACTIVE', // 기본값
  csTypeId: 3, // 기본값 '기타문의'
});

const typeOptions = [
  { id: 1, name: '배송문의' },
  { id: 2, name: '결제문의' },
  { id: 3, name: '기타문의' },
  { id: 4, name: '상품문의' },
  { id: 5, name: '환불/반품 문의' },
  { id: 6, name: '판매 문의' },
];

const error = ref(null);

async function handleSubmit() {
  if (!newNotice.value.title || !newNotice.value.content) {
    alert('제목과 내용을 모두 입력해주세요.');
    return;
  }

  try {
    await createNotice(newNotice.value);
    alert('새 공지사항이 성공적으로 등록되었습니다.');
    router.push({ name: 'AdminNoticeList' });
  } catch (e) {
    console.error('공지사항 등록 실패:', e);
    error.value = '등록 중 오류가 발생했습니다.';
    alert(error.value);
  }
}

function goToList() {
  router.push({ name: 'AdminNoticeList' });
}
</script>

<template>
  <div class="container-fluid p-4">
    <div class="card shadow-sm">
      <div class="card-header">
        <h5 class="card-title mb-0">새 공지사항 등록</h5>
      </div>
      <div class="card-body">
        <form @submit.prevent="handleSubmit">
          <div class="mb-3">
            <label for="notice-title" class="form-label">제목</label>
            <input type="text" id="notice-title" class="form-control" v-model="newNotice.title" required>
          </div>

          <div class="mb-3">
            <label for="notice-type" class="form-label">유형</label>
            <select id="notice-type" class="form-select" v-model="newNotice.csTypeId" required>
              <option v-for="type in typeOptions" :key="type.id" :value="type.id">{{ type.name }}</option>
            </select>
          </div>

          <div class="mb-3">
            <label class="form-label">내용</label>
            <CommonEditor v-model:content="newNotice.content" />
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
