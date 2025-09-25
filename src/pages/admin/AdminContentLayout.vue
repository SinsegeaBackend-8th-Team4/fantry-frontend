<template>
  <!-- 
    이 컴포넌트는 관리자 페이지의 '대시보드' 영역을 위한 컨테이너입니다.
    실제 컨텐츠는 src/router/adminRoutes.js에 정의된 하위 라우트들이 채웁니다.
    
    예를 들어, 사용자가 '/admin'으로 접속하면 <MainDashboard />가,
    '/admin/settlement/dashboard'로 접속하면 <SettlementDashboard />가
    아래의 <router-view /> 자리에 렌더링됩니다.
    
    이러한 구조는 여러 대시보드나 관련 페이지들을 그룹화하고
    공통 레이아웃을 유지하는 데 효과적입니다.
  -->
  <main role="main" class="dashboard-container">
    <router-view />
  </main>
</template>

<script setup>
// 이 페이지는 특별한 스크립트 로직이 필요하지 않습니다.
// 오직 하위 라우트 컴포넌트(각 대시보드)를 보여주는 '틀' 역할만 수행합니다.
</script>

<script>
export default {
  name: 'AdminContentLayout' // 컴포넌트 이름 정의
}
</script>

<style scoped>
/* 
  이 페이지 자체의 스타일이 필요한 경우 여기에 작성합니다.
  예를 들어, 모든 대시보드에 공통적으로 적용될 배경색이나 패딩 등을 설정할 수 있습니다.
*/
</style>