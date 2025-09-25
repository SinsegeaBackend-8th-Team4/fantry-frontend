<script setup>
import { onMounted, onUnmounted } from 'vue';
import AdminSidebar from '@/components/common/organisms/admin/AdminSidebar.vue';
import AdminNavbar from '@/components/common/organisms/admin/AdminNavbar.vue';
import AdminFooter from '@/components/common/organisms/admin/AdminFooter.vue';
import '@/styles/scss/main-admin.scss';

const loadAdminScript = async () => {
  document.body.id = 'page-top';
  try { await import('startbootstrap-sb-admin-2/js/sb-admin-2.min.js'); } catch (e) { console.warn('admin script load failed', e); }
};

document.body.classList.add('admin-layout-active');
onMounted(loadAdminScript);
onUnmounted(() => {
  document.body.id = '';
  document.body.classList.remove('admin-layout-active');
});
</script>

<template>
  <!-- SB Admin 2 템플릿의 기본 HTML 구조 -->
  <div id="wrapper">
    <!-- 사이드바 (메뉴) -->
    <AdminSidebar />

    <!-- 메인 컨텐츠 래퍼 -->
    <div id="content-wrapper" class="d-flex flex-column">
      <!-- 메인 컨텐츠 -->
      <div id="content">
        <!-- 상단 네비게이션 바 -->
        <AdminNavbar />

        <!-- 페이지별 컨텐츠가 렌더링되는 영역 -->
        <div class="container-fluid">
          <!-- vue-router에 의해 현재 경로에 맞는 페이지 컴포넌트가 표시됩니다. -->
          <router-view />
        </div>
      </div>

      <!-- 푸터 -->
      <AdminFooter />
    </div>
  </div>
</template>

<style scoped></style>
