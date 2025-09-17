<script setup>
import { computed } from 'vue';
import { RouterLink, useRouter } from 'vue-router';

const router = useRouter();

// 라우터 설정에서 사이드바에 표시할 메뉴들을 동적으로 가져옵니다.
const menuItems = computed(() => {
  // 1. 전체 라우트 설정에서 '/admin' 경로를 찾습니다.
  const adminRoute = router.options.routes.find(r => r.path === '/admin');
  if (!adminRoute) return [];

  // 2. '/admin'의 자식 중 AdminContentLayout을 사용하는 라우트를 찾습니다.
  const contentLayoutRoute = adminRoute.children.find(r => r.component.name === 'AdminContentLayout');
  if (!contentLayoutRoute || !contentLayoutRoute.children) return [];

  // 3. AdminContentLayout의 자식 라우트들 중에서 meta.menu가 true인 것만 필터링합니다.
  return contentLayoutRoute.children
    .filter(route => route.meta && route.meta.menu)
    .map(route => {
      // 4. 각 메뉴의 서브메뉴(Dashboard, List)를 구성합니다.
      const subMenus = route.children ? route.children.map(child => {
        let title = '대시보드'; // 기본 서브메뉴 이름
        if (child.path === 'list') {
          title = '목록 조회';
        }
        return {
          to: { name: child.name },
          title: title
        };
      }) : [];

      return {
        id: route.path, // 고유 ID로 사용
        name: route.meta.title, // 메뉴 이름 (예: 정산관리)
        icon: route.meta.icon,  // 메뉴 아이콘
        subMenus: subMenus      // 서브메뉴 배열
      };
    });
});
</script>

<template>
  <!-- 사이드바 -->
  <ul class="navbar-nav bg-gradient-primary sidebar sidebar-dark accordion" id="accordionSidebar">
      
    <!-- 사이드바 로고/브랜드 -->
    <RouterLink to="/admin" class="sidebar-brand d-flex align-items-center justify-content-center">
      <div class="sidebar-brand-icon">
        <i class="fas fa-cogs"></i>
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
          <RouterLink v-for="subMenu in item.subMenus" :key="subMenu.to.name" :to="subMenu.to" class="collapse-item">
            {{ subMenu.title }}
          </RouterLink>
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
