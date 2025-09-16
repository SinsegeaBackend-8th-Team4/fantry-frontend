<script setup>
import { onMounted, onUnmounted } from 'vue';
import AdminSidebar from '@/components/common/organisms/admin/AdminSidebar.vue';
import AdminNavbar from '@/components/common/organisms/admin/AdminNavbar.vue';
import AdminFooter from '@/components/common/organisms/admin/AdminFooter.vue';

// 1. 관리자 페이지 전용 스타일 파일을 불러옵니다.
//    UserLayout과 마찬가지로, 아래 로직과 함께 동작하며 스타일 충돌을 막아줘요.
import '@/styles/scss/main-admin.scss'; 

// 이 컴포넌트(레이아웃)가 화면에 나타날 때 실행되는 부분이에요.
onMounted(() => {
  // 2. body에 관리자 템플릿이 요구하는 id와, 우리가 정의한 식별용 클래스를 추가합니다.
  //    - 'page-top': SB Admin 2 템플릿의 일부 기능(ex: 스크롤 상단 이동 버튼)이 이 id를 필요로 해요.
  //    - 'admin-layout-active': main-admin.scss 스타일을 활성화시키는 역할을 합니다.
  document.body.id = 'page-top';
  document.body.classList.add('admin-layout-active');

  // 3. SB Admin 2 템플릿의 메인 JavaScript 파일을 동적으로 불러옵니다.
  //    템플릿의 접기/펼치기 같은 동적 기능들이 이 파일에 들어있어요.
  //    Vue 컴포넌트 안에서 이렇게 직접 스크립트를 추가하는 건 특별한 경우!
  const adminScript = document.createElement('script');
  adminScript.src = '/js/sb-admin-2.min.js';
  adminScript.id = 'sb-admin-dynamic-script'; // 나중에 지우기 쉽도록 id를 붙여줍니다.
  document.body.appendChild(adminScript);
});

// 이 컴포넌트가 화면에서 사라질 때 실행되는 부분이에요.
onUnmounted(() => {
  // 4. 다른 페이지(특히 사용자 페이지)로 이동할 때, 관리자 페이지의 스타일과 스크립트가
  //    영향을 주지 않도록 깨끗하게 정리합니다.
  document.body.id = '';
  document.body.classList.remove('admin-layout-active');

  const adminScript = document.getElementById('sb-admin-dynamic-script');
  if (adminScript) {
    document.body.removeChild(adminScript);
  }
});
</script>

<template>
  <!-- SB Admin 2 템플릿의 기본 HTML 구조입니다. -->
  <div id="wrapper">
    <!-- 사이드바 -->
    <AdminSidebar />

    <!-- 메인 컨텐츠 영역 -->
    <div id="content-wrapper" class="d-flex flex-column">
      <div id="content">
        <!-- 상단 네비게이션 바 -->
        <AdminNavbar />

        <!-- 페이지 컨텐츠가 들어올 자리 -->
        <div class="container-fluid">
          <!-- 라우터에 연결된 관리자 페이지(예: DashboardPage)가 여기에 표시됩니다. -->
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
  이 레이아웃 자체에만 적용할 스타일이 있다면 여기에 작성하세요.
  대부분의 스타일은 main-admin.scss에서 관리하는 것이 좋습니다.
*/
</style>
