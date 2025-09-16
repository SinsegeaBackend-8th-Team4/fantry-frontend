<template>
  <div>
    <h1 class="h3 mb-4 text-gray-800">{{ pageTitle }}</h1>
    <p>이 페이지는 향후 개발될 페이지의 임시 샘플입니다. 팀원들이 이 구조를 바탕으로 실제 기능을 구현할 예정입니다.</p>
    <p>현재 페이지: <strong>{{ $route.name }}</strong></p>
    <p>경로: <strong>{{ $route.path }}</strong></p>
  </div>
</template>

<script setup>
import { computed } from 'vue';
import { useRoute } from 'vue-router';

const route = useRoute();

// 현재 라우트 이름을 기반으로 페이지 타이틀을 동적으로 생성합니다.
const pageTitle = computed(() => {
  // route.name이 없는 경우를 대비하여 기본값을 설정합니다.
  if (!route.name) return '더미 페이지';

  // 예: 'AdminSettlementDashboard' -> '정산관리 요약'
  // 정규식을 사용하여 대문자 앞에 공백을 추가하고, 'Admin'과 'Dashboard'를 변환합니다.
  return route.name
    .replace('Admin', '')
    .replace(/([A-Z])/g, ' $1')
    .replace('Dashboard', '요약')
    .trim();
});
</script>

<style scoped>
/* 이 페이지에만 필요한 스타일이 있다면 여기에 작성하세요. */
</style>
