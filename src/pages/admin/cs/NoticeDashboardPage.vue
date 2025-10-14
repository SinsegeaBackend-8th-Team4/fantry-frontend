<script setup>
import { ref, onMounted, computed } from 'vue';
import { useRouter } from 'vue-router';
import { searchNotices } from '@/api/adminNotice.js';
import LoadingSpinner from '@/components/common/atoms/LoadingSpinner.vue';
import DashboardSummaryCard from '@/components/common/dashboard/DashboardSummaryCard.vue';

const router = useRouter();
const loading = ref(true);
const error = ref(null);
const notices = ref([]);
const totalNotices = ref(0);

const activeNotices = computed(() => notices.value.filter(n => n.status === 'ACTIVE').length);
const recentNotices = computed(() => notices.value.slice(0, 5));

const summaryCards = computed(() => [
  {
    key: 'totalNotices',
    title: '총 공지사항 수',
    color: 'primary',
    icon: 'fas fa-bullhorn',
    value: totalNotices.value,
  },
  {
    key: 'activeNotices',
    title: '활성 공지사항',
    color: 'success',
    icon: 'fas fa-check-circle',
    value: activeNotices.value,
  },
]);

async function fetchData() {
  try {
    loading.value = true;
    // 최신순으로 모든 공지사항을 가져옴
    const response = await searchNotices({ page: 0, size: 9999, sort: 'createdAt,desc' });
    notices.value = response.data.content;
    totalNotices.value = response.data.totalElements;
  } catch (e) {
    console.error('공지사항 대시보드 데이터 조회 실패:', e);
    error.value = '데이터를 불러오는 중 오류가 발생했습니다.';
  } finally {
    loading.value = false;
  }
}

function goToList() {
  router.push({ name: 'AdminNoticeList' });
}

function goToDetail(noticeId) {
  router.push({ name: 'AdminNoticeDetail', params: { noticeId } });
}

function formatDate(dateArray) {
  if (!dateArray || !Array.isArray(dateArray)) return '-';
  const dt = new Date(dateArray[0], dateArray[1] - 1, dateArray[2]);
  return `${dt.getFullYear()}-${String(dt.getMonth() + 1).padStart(2, '0')}-${String(dt.getDate()).padStart(2, '0')}`;
}

onMounted(fetchData);
</script>

<template>
  <div>
    <h1 class="h3 mb-4 text-gray-800">공지사항 대시보드</h1>

    <div v-if="loading" class="text-center">
      <LoadingSpinner />
      <p>데이터를 불러오는 중입니다...</p>
    </div>

    <div v-if="error" class="alert alert-danger">{{ error }}</div>

    <div v-if="!loading && !error">
      <!-- Summary Cards -->
      <div class="row">
        <div v-for="card in summaryCards" :key="card.key" class="col-xl-3 col-md-6 mb-4">
          <DashboardSummaryCard :card="card" :value="card.value" />
        </div>
      </div>

      <!-- Recent Notices Table -->
      <div class="card shadow mb-4">
        <div class="card-header py-3 d-flex justify-content-between align-items-center">
          <h6 class="m-0 font-weight-bold text-primary">최근 공지사항</h6>
          <button class="btn btn-sm btn-outline-primary" @click="goToList">전체 보기</button>
        </div>
        <div class="card-body">
          <div class="table-responsive">
            <table class="table table-hover">
              <thead>
                <tr>
                  <th>#</th>
                  <th>제목</th>
                  <th>작성자</th>
                  <th>등록일</th>
                  <th>상태</th>
                </tr>
              </thead>
              <tbody>
                <tr v-if="recentNotices.length === 0">
                  <td colspan="5" class="text-center">최근 공지사항이 없습니다.</td>
                </tr>
                <tr v-for="notice in recentNotices" :key="notice.noticeId" @click="goToDetail(notice.noticeId)" style="cursor: pointer;">
                  <td>{{ notice.noticeId }}</td>
                  <td>{{ notice.title }}</td>
                  <td>{{ notice.authorName }}</td>
                  <td>{{ formatDate(notice.createdAt) }}</td>
                  <td>
                    <span class="badge" :class="notice.status === 'ACTIVE' ? 'bg-success' : 'bg-secondary'">
                      {{ notice.status === 'ACTIVE' ? '활성' : '비활성' }}
                    </span>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>