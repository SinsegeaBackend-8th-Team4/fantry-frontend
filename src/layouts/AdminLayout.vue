<script setup>
import { onMounted, onUnmounted } from 'vue';
import AdminSidebar from '@/components/common/organisms/admin/AdminSidebar.vue';
import AdminNavbar from '@/components/common/organisms/admin/AdminNavbar.vue';
import AdminFooter from '@/components/common/organisms/admin/AdminFooter.vue';

// 관리자 페이지 전용 스타일만 가져옵니다.
import '@/styles/scss/main-admin.scss';

/**
 * 관리자 레이아웃에 필요한 리소스를 적용하고 정리합니다.
 *
 * @description
 * 이 컴포넌트는 관리자 페이지의 뼈대를 이루며, 다음과 같은 역할을 수행합니다.
 * 1. body 태그에 고유 ID와 클래스를 부여하여 관리자 전용 스타일을 활성화합니다.
 * 2. SB Admin 2 템플릿의 핵심 JS 파일을 동적으로 로드합니다.
 *    - 이 스크립트는 jQuery와 특정 DOM 구조에 의존하므로, Vue 앱이 렌더링을 마친 후(onMounted)에
 *      로드해야 런타임 오류를 방지할 수 있습니다. main.js에서 전역으로 로드하면 안 됩니다.
 */
const applyAdminResources = () => {
  document.body.id = 'page-top';
  document.body.classList.add('admin-layout-active');

  const adminScript = document.createElement('script');
  // npm으로 설치한 패키지 내의 스크립트 경로를 지정합니다.
  adminScript.src = '/node_modules/startbootstrap-sb-admin-2/js/sb-admin-2.min.js';
  adminScript.id = 'sb-admin-dynamic-script';
  adminScript.async = true;
  document.body.appendChild(adminScript);
};

/**
 * 컴포넌트가 언마운트될 때(다른 레이아웃으로 전환될 때) 추가했던 리소스를 깨끗하게 정리합니다.
 */
const cleanupAdminResources = () => {
  document.body.id = '';
  document.body.classList.remove('admin-layout-active');

  const adminScript = document.getElementById('sb-admin-dynamic-script');
  if (adminScript) {
    document.body.removeChild(adminScript);
  }
};

// 컴포넌트가 마운트될 때 리소스를 적용합니다.
onMounted(applyAdminResources);

// 컴포넌트가 언마운트될 때 리소스를 정리합니다.
onUnmounted(cleanupAdminResources);
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
