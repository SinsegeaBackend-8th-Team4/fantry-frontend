<template>
  <div class="settlement-setting-page">
    <h1 class="h3 mb-4 text-gray-800">정산 설정</h1>

    <div class="card shadow mb-4">
      <div class="card-header py-3">
        <h6 class="m-0 font-weight-bold text-primary">현재 정산 설정</h6>
      </div>
      <div class="card-body">
        <div v-if="loading" class="text-center">
          <div class="spinner-border text-primary" role="status">
            <span class="sr-only">Loading...</span>
          </div>
        </div>
        <div v-else-if="error" class="alert alert-danger">설정 정보를 불러오는데 실패했습니다.</div>
        <div v-else-if="!currentSettings" class="alert alert-info">현재 설정된 정산 정보가 없습니다.</div>
        <div v-else>
          <p><strong>수수료율:</strong> {{ currentSettings.commissionRate }}%</p>
          <p><strong>정산 주기:</strong> {{ settlementCycleTypeDisplay(currentSettings.settlementCycleType) }}</p>
          <p v-if="currentSettings.settlementDay">
            <strong>정산일:</strong>
            <span v-if="currentSettings.settlementCycleType === 'WEEKLY'">{{ getDayOfWeek(currentSettings.settlementDay) }}요일</span>
            <span v-else-if="currentSettings.settlementCycleType === 'MONTHLY'">{{ currentSettings.settlementDay }}일</span>
          </p>
          <p><strong>생성일:</strong> {{ formatDate(currentSettings.createdAt) }}</p>
          <p><strong>생성자:</strong> {{ currentSettings.createdBy }}</p>
          <p><strong>수정일:</strong> {{ formatDate(currentSettings.updatedAt) }}</p>
          <p><strong>수정자:</strong> {{ currentSettings.updatedBy }}</p>
        </div>
      </div>
    </div>

    <div class="card shadow mb-4">
      <div class="card-header py-3">
        <h6 class="m-0 font-weight-bold text-primary">정산 설정 변경/등록</h6>
      </div>
      <div class="card-body">
        <form @submit.prevent="saveSettings">
          <div class="form-group">
            <label for="commissionRate">수수료율 (%)</label>
            <input type="number" class="form-control" id="commissionRate" v-model.number="form.commissionRate" step="0.01" min="0" max="100" required>
            <small class="form-text text-muted">0.00% ~ 100.00% 사이의 값을 입력하세요.</small>
          </div>

          <div class="form-group">
            <label for="settlementCycleType">정산 주기</label>
            <select class="form-control" id="settlementCycleType" v-model="form.settlementCycleType" required>
              <option value="">선택하세요</option>
              <option value="WEEKLY">주간</option>
              <option value="MONTHLY">월간</option>
            </select>
          </div>

          <div class="form-group" v-if="form.settlementCycleType === 'WEEKLY'">
            <label for="settlementDayWeekly">정산 요일</label>
            <select class="form-control" id="settlementDayWeekly" v-model.number="form.settlementDay" required>
              <option value="">선택하세요</option>
              <option value="1">월요일</option>
              <option value="2">화요일</option>
              <option value="3">수요일</option>
              <option value="4">목요일</option>
              <option value="5">금요일</option>
              <option value="6">토요일</option>
              <option value="7">일요일</option>
            </select>
          </div>

          <div class="form-group" v-if="form.settlementCycleType === 'MONTHLY'">
            <label for="settlementDayMonthly">정산 일</label>
            <input type="number" class="form-control" id="settlementDayMonthly" v-model.number="form.settlementDay" min="1" max="31" required>
            <small class="form-text text-muted">1일 ~ 31일 사이의 값을 입력하세요.</small>
          </div>

          <button type="submit" class="btn btn-primary" :disabled="isSaving">
            <span v-if="isSaving" class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
            {{ isSaving ? '저장 중...' : '설정 저장' }}
          </button>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, watch } from 'vue';
import { getSettlementSettings, createOrUpdateSettlementSettings } from '@/api/adminSettlement';
import { useAlert } from '@/composables/useAlert';

const { showAlert } = useAlert();

const currentSettings = ref(null);
const loading = ref(true);
const error = ref(false);
const isSaving = ref(false);

const form = ref({
  commissionRate: null,
  settlementCycleType: '',
  settlementDay: null,
});

// 현재 설정 불러오기
const fetchSettings = async () => {
  console.log('fetchSettings function called.');
  loading.value = true;
  error.value = false;
  try {
    const response = await getSettlementSettings();
    console.log('API Response for getSettlementSettings:', response);
    // Check if response exists and has the expected property
    if (response && response.commissionRate !== undefined) { // Corrected check
      currentSettings.value = response; // Assign response directly
      // 폼에 현재 설정값 채우기
      form.value.commissionRate = currentSettings.value.commissionRate;
      form.value.settlementCycleType = currentSettings.value.settlementCycleType;
      form.value.settlementDay = currentSettings.value.settlementDay;
    } else {
      // If no data or data is malformed, treat as no settings found or an error
      currentSettings.value = null;
      showAlert('현재 설정된 정산 정보가 없거나 불러오는데 실패했습니다.', 'info');
    }
  } catch (err) {
    console.error('Failed to fetch settlement settings:', err);
    error.value = true;
    showAlert('정산 설정 정보를 불러오는데 실패했습니다.', 'danger');
    // Handle 401 specifically if needed, e.g., redirect to login
    if (err.response && err.response.status === 401) {
      showAlert('로그인이 필요합니다.', 'warning');
      // router.push({ name: 'AdminLogin' }); // Example: redirect to login
    }
  } finally {
    loading.value = false;
  }
};

// 설정 저장
const saveSettings = async () => {
  isSaving.value = true;
  try {
    // 유효성 검사 (프론트엔드 추가)
    if (form.value.settlementCycleType === 'WEEKLY' && (form.value.settlementDay < 1 || form.value.settlementDay > 7)) {
      showAlert('주간 정산일은 1(월)부터 7(일) 사이여야 합니다.', 'warning');
      return;
    }
    if (form.value.settlementCycleType === 'MONTHLY' && (form.value.settlementDay < 1 || form.value.settlementDay > 31)) {
      showAlert('월간 정산일은 1일부터 31일 사이여야 합니다.', 'warning');
      return;
    }

    const response = await createOrUpdateSettlementSettings(form.value);
    currentSettings.value = response.data;
    error.value = false; // Reset error state on successful save
    showAlert('정산 설정이 성공적으로 저장되었습니다.', 'success');
    await fetchSettings(); // Re-fetch settings to update display and reset error state
  } catch (err) {
    console.error('Failed to save settlement settings:', err);
    showAlert('정산 설정 저장에 실패했습니다.', 'danger');
    error.value = true; // Set error state on failed save
  } finally {
    isSaving.value = false;
  }
};

// 정산 주기 변경 시 정산일 초기화
watch(() => form.value.settlementCycleType, (newVal, oldVal) => {
  if (newVal !== oldVal) {
    form.value.settlementDay = null;
  }
});

// 날짜 포맷터
const formatDate = (datetime) => {
  if (!datetime || !Array.isArray(datetime) || datetime.length < 6) return '';
  // Month is 0-indexed in JavaScript Date constructor
  const date = new Date(datetime[0], datetime[1] - 1, datetime[2], datetime[3], datetime[4], datetime[5]);
  return date.toLocaleString();
};

// 정산 요일 표시
const getDayOfWeek = (day) => {
  const days = ['', '월', '화', '수', '목', '금', '토', '일'];
  return days[day];
};

// 정산 주기 타입 표시
const settlementCycleTypeDisplay = (type) => {
  if (type === 'WEEKLY') return '주간';
  if (type === 'MONTHLY') return '월간';
  return type;
};

onMounted(fetchSettings);
</script>

<style scoped lang="scss">
.settlement-setting-page {
  .card-body {
    p {
      margin-bottom: 0.5rem;
    }
  }
  .form-group {
    margin-bottom: 1.5rem;
  }
}
</style>