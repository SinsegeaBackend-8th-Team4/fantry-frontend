<script setup>
import { onMounted, onUnmounted } from 'vue';
import AdminSidebar from '@/components/common/organisms/admin/AdminSidebar.vue';
import AdminNavbar from '@/components/common/organisms/admin/AdminNavbar.vue';
import AdminFooter from '@/components/common/organisms/admin/AdminFooter.vue';

// 관리자 페이지 전용 스타일 및 템플릿 스크립트를 가져옵니다.
import '@/styles/scss/main-admin.scss';
import 'startbootstrap-sb-admin-2/js/sb-admin-2.min.js';

/**
 * 관리자 레이아웃에 필요한 body 클래스와 id를 설정합니다.
 */
const applyAdminBodyAttributes = () => {
  document.body.id = 'page-top';
  document.body.classList.add('admin-layout-active');
};

/**
 * 컴포넌트가 언마운트될 때 추가했던 속성을 제거합니다.
 */
const cleanupAdminBodyAttributes = () => {
  document.body.id = '';
  document.body.classList.remove('admin-layout-active');
};

// 컴포넌트가 마운트될 때 속성을 적용합니다.
onMounted(applyAdminBodyAttributes);

// 컴포넌트가 언마운트될 때 속성을 정리합니다.
onUnmounted(cleanupAdminBodyAttributes);
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

<style scoped>
/*
  이 레이아웃 컴포넌트 자체에만 한정되는 스타일을 정의할 수 있습니다.
  하지만 전역적인 관리자 스타일은 main-admin.scss에서 관리하는 것을 권장합니다.
*/
</style>
