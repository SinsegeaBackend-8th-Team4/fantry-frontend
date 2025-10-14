<script setup>
import { ref, onMounted, computed } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { getFaqById, createFaq, updateFaq } from '@/api/adminFaq.js';

const route = useRoute();
const router = useRouter();

const faqId = ref(route.params.faqId || null);
const isEditMode = computed(() => !!faqId.value);

const form = ref({
  csTypeId: '',
  title: '',
  content: '',
  status: 'ACTIVE',
});

const loading = ref(false);
const error = ref(null);

// From API Spec
const csTypes = ref([
  { id: 1, name: '배송문의' },
  { id: 2, name: '결제문의' },
  { id: 3, name: '기타문의' },
  { id: 4, name: '상품문의' },
  { id: 5, name: '환불/반품 문의' },
  { id: 6, name: '판매 문의' },
]);

const statuses = ref([
  { id: 'DRAFT', name: '임시저장' },
  { id: 'ACTIVE', name: '활성 (노출)' },
  { id: 'PINNED', name: '상단 고정' },
  { id: 'INACTIVE', name: '비활성 (미노출)' },
]);

onMounted(async () => {
  if (isEditMode.value) {
    loading.value = true;
    try {
      const response = await getFaqById(faqId.value);
      const data = response.data;
      // csTypes에 있는 id값으로 맞춰주기 위함.
      const csType = csTypes.value.find(t => t.name === data.csType);
      form.value = {
        csTypeId: csType ? csType.id : '',
        title: data.title,
        content: data.content,
        status: data.status,
      };
    } catch (e) {
      error.value = 'FAQ 데이터를 불러오는데 실패했습니다.';
      console.error(e);
    } finally {
      loading.value = false;
    }
  }
});

async function handleSubmit() {
  if (!form.value.title || !form.value.content || !form.value.csTypeId) {
    alert('카테고리, 제목, 내용은 필수 항목입니다.');
    return;
  }

  loading.value = true;
  try {
    if (isEditMode.value) {
      await updateFaq(faqId.value, form.value);
      alert('FAQ가 성공적으로 수정되었습니다.');
    } else {
      await createFaq(form.value);
      alert('FAQ가 성공적으로 등록되었습니다.');
    }
    router.push({ name: 'AdminFaqList' });
  } catch (e) {
    error.value = '저장 중 오류가 발생했습니다.';
    console.error(e);
  } finally {
    loading.value = false;
  }
}

function goBack() {
  router.back();
}
</script>

<template>
  <div>
    <h1 class="h3 text-gray-800">{{ isEditMode ? 'FAQ 수정' : 'FAQ 신규 등록' }}</h1>
    <p class="mb-4">자주 묻는 질문(FAQ)을 {{ isEditMode ? '수정합니다' : '등록합니다' }}.</p>

    <div v-if="loading && isEditMode" class="text-center">Loading...</div>
    <div v-if="error" class="alert alert-danger">{{ error }}</div>

    <form @submit.prevent="handleSubmit" v-if="!loading || !isEditMode">
      <div class="card shadow-sm">
        <div class="card-body">
          <div class="mb-3">
            <label for="csType" class="form-label">카테고리</label>
            <select id="csType" class="form-select" v-model="form.csTypeId" required>
              <option disabled value="">카테고리를 선택하세요</option>
              <option v-for="type in csTypes" :key="type.id" :value="type.id">{{ type.name }}</option>
            </select>
          </div>

          <div class="mb-3">
            <label for="title" class="form-label">제목</label>
            <input type="text" id="title" class="form-control" v-model="form.title" required />
          </div>

          <div class="mb-3">
            <label for="content" class="form-label">내용</label>
            <textarea id="content" class="form-control" v-model="form.content" rows="10" required></textarea>
            <small class="form-text text-muted">공통 에디터 컴포넌트가 없어 임시로 textarea를 사용합니다.</small>
          </div>

          <div class="mb-3">
            <label for="status" class="form-label">상태</label>
            <select id="status" class="form-select" v-model="form.status" required>
              <option v-for="s in statuses" :key="s.id" :value="s.id">{{ s.name }}</option>
            </select>
          </div>
        </div>
        <div class="card-footer d-flex justify-content-end gap-2">
          <button type="button" class="btn btn-secondary" @click="goBack">취소</button>
          <button type="submit" class="btn btn-primary" :disabled="loading">
            {{ loading ? '저장 중...' : '저장' }}
          </button>
        </div>
      </div>
    </form>
  </div>
</template>

<style scoped>
.gap-2 {
  gap: 0.5rem;
}
</style>
