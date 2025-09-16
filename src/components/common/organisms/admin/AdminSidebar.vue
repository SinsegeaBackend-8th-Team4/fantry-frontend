<script setup>
// Vue의 라우터 링크 컴포넌트를 가져옵니다. a 태그 대신 사용해요.
import { RouterLink } from 'vue-router';

// 메뉴 데이터를 배열로 정의해서 관리하면 훨씬 깔끔하고 유지보수하기 쉬워요.
// 나중에 메뉴를 추가하거나 수정할 때 이 배열만 건드리면 됩니다.
const menuItems = [
  { id: 'settlement', name: '정산관리', icon: 'fas fa-fw fa-dollar-sign' },
  { id: 'return', name: '반품관리', icon: 'fas fa-fw fa-undo' },
  { id: 'cs', name: 'CS관리', icon: 'fas fa-fw fa-headset' },
  { id: 'inspection', name: '검수관리', icon: 'fas fa-fw fa-check-circle' },
  { id: 'inventory', name: '재고관리', icon: 'fas fa-fw fa-boxes' },
  { id: 'member', name: '회원관리', icon: 'fas fa-fw fa-users' },
  { id: 'auction', name: '경매관리', icon: 'fas fa-fw fa-gavel' },
];
</script>

<template>
  <!-- 사이드바 -->
  <ul class="navbar-nav bg-gradient-primary sidebar sidebar-dark accordion" id="accordionSidebar">
      
    <!-- 사이드바 로고/브랜드 -->
    <RouterLink to="/admin" class="sidebar-brand d-flex align-items-center justify-content-center">
      <div class="sidebar-brand-icon rotate-n-15">
        <i class="fas fa-laugh-wink"></i>
      </div>
      <div class="sidebar-brand-text mx-3">Fantry 관리자</div>
    </RouterLink>

    <!-- 구분선 -->
    <hr class="sidebar-divider my-0">

    <!-- Nav Item - Dashboard (기본 대시보드) -->
    <li class="nav-item">
      <RouterLink to="/admin" class="nav-link">
        <i class="fas fa-fw fa-tachometer-alt"></i>
        <span>Dashboard</span>
      </RouterLink>
    </li>

    <!-- 구분선 -->
    <hr class="sidebar-divider">

    <!-- 메뉴 제목 -->
    <div class="sidebar-heading">
      관리 메뉴
    </div>

    <!-- v-for를 사용해서 메뉴 아이템들을 동적으로 렌더링합니다. -->
    <li class="nav-item" v-for="item in menuItems" :key="item.id">
      <!-- 각 메뉴는 접고 펼칠 수 있는 Collapse 형태입니다. -->
      <a class="nav-link collapsed" href="#" data-toggle="collapse" :data-target="`#collapse-${item.id}`"
          aria-expanded="true" :aria-controls="`collapse-${item.id}`">
        <i :class="item.icon"></i>
        <span>{{ item.name }}</span>
      </a>
      <!-- 서브 메뉴 영역 -->
      <div :id="`collapse-${item.id}`" class="collapse" :aria-labelledby="`heading-${item.id}`" data-parent="#accordionSidebar">
        <div class="bg-white py-2 collapse-inner rounded">
          <h6 class="collapse-header">{{ item.name }}:</h6>
          <!-- 모든 메뉴에 공통적으로 들어가는 'Dashboard(요약)' 서브 메뉴 -->
          <!-- to 속성에 라우터에 정의된 name을 사용하면 경로가 바뀌어도 안전해요. -->
          <RouterLink :to="{ name: `Admin${item.id.charAt(0).toUpperCase() + item.id.slice(1)}Dashboard` }" class="collapse-item">
            Dashboard(요약)
          </RouterLink>
          <RouterLink :to="{ name: `Admin${item.id.charAt(0).toUpperCase() + item.id.slice(1)}List` }" class="collapse-item">
            (임시)일괄조회
          </RouterLink>
          <!-- 
            여기에 추가적인 서브 메뉴들을 넣을 수 있습니다.
            팀원들이 <RouterLink>를 사용해서 새 페이지 링크를 추가하면 돼요.
            <RouterLink to="/admin/settlement/list" class="collapse-item">정산 목록</RouterLink>
          -->
        </div>
      </div>
    </li>

    <!-- 구분선 -->
    <hr class="sidebar-divider d-none d-md-block">

    <!-- 사이드바 토글 버튼 -->
    <div class="text-center d-none d-md-inline">
      <button class="rounded-circle border-0" id="sidebarToggle"></button>
    </div>

  </ul>
  <!-- End of Sidebar -->
</template>
