<script setup>
import { computed } from 'vue';
import { RouterLink, useRouter } from 'vue-router';

const router = useRouter();

const menuItems = computed(() => {
  const adminRoute = router.options.routes.find(r => r.path === '/admin');
  if (!adminRoute) return [];

  const contentLayoutRoute = adminRoute.children.find(r => r.component.name === 'AdminContentLayout');
  if (!contentLayoutRoute || !contentLayoutRoute.children) return [];

  return contentLayoutRoute.children
    .filter(route => route.meta && route.meta.menu)
    .map(route => {
      // 서브메뉴가 있는지 확인
      const hasSubMenus = route.children && route.children.length > 0;

      const subMenus = hasSubMenus ? route.children
        .filter(child => !(child.meta && child.meta.hidden))
        .map(child => {
          let title = '대시보드';
            if (child.path === 'list') title = '목록 조회';
            else if (child.path === 'write') title = '글쓰기 (샘플)';
          return { to: { name: child.name }, title: title };
        }) : [];

      return {
        id: route.path || 'dashboard', // 기본 대시보드는 path가 ''이므로 고유 ID 부여
        name: route.meta.title,
        icon: route.meta.icon,
        // ⭐️ 서브메뉴가 없으면 to 속성을 직접 가짐
        to: hasSubMenus ? null : { name: route.name },
        subMenus: subMenus
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
      <div class="sidebar-brand-text mx-3">Fantry 관리</div>
    </RouterLink>

    <!-- 구분선 -->
    <hr class="sidebar-divider">

    <!-- 메뉴 제목 -->
    <div class="sidebar-heading">
      관리 메뉴
    </div>

    <!-- v-for를 사용해서 메뉴 아이템들을 동적으로 렌더링합니다. -->
    <li class="nav-item" v-for="item in menuItems" :key="item.id">
      <!-- Case 1: 서브메뉴가 없는 단일 메뉴 (예: Dashboard) -->
      <RouterLink v-if="item.to" :to="item.to" class="nav-link">
        <i :class="item.icon"></i>
        <span>{{ item.name }}</span>
      </RouterLink>
      
      <!-- Case 2: 서브메뉴가 있는 그룹 메뉴 -->
      <a v-else class="nav-link collapsed" href="#" data-toggle="collapse" :data-target="`#collapse-${item.id}`"
          aria-expanded="true" :aria-controls="`#collapse-${item.id}`">
        <i :class="item.icon"></i>
        <span>{{ item.name }}</span>
      </a>
      <div v-if="!item.to" :id="`collapse-${item.id}`" class="collapse" :aria-labelledby="`heading-${item.id}`" data-parent="#accordionSidebar">
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
