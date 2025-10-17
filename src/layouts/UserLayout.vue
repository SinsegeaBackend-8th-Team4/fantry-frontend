<script setup>
import { computed, ref, onUnmounted } from 'vue';
import { useRoute } from 'vue-router';
import CommonHeader from '@/components/common/organisms/CommonHeader.vue';
import CommonFooter from '@/components/common/organisms/CommonFooter.vue';
import SearchBar from '@/components/common/molecules/SearchBar.vue';
import LoadingSpinner from '@/components/common/LoadingSpinner.vue'; // Import LoadingSpinner
import { useUiStore } from '@/stores/uiStore'; // Import useUiStore
import '@/styles/scss/main-user.scss'; // User 전용 번들

const route = useRoute();
const searchInput = ref('');
const onSearch = (v) => {};
const uiStore = useUiStore(); // Initialize uiStore

// 로그인, 회원가입 페이지에서는 헤더/푸터 숨김
const isShowChrome = computed(() => {
  const hiddenPaths = ['/login', '/admin/login', '/signup'];  //헤더/푸터 숨길 페이지('/login/**, /signup/**')
  return !hiddenPaths.some(path => route.path.startsWith(path));
});

// 스타일 범위 표시 (레이아웃 활성화)
document.body.classList.add('user-layout-active');
onUnmounted(() => document.body.classList.remove('user-layout-active'));
</script>

<template>
  <div>
    <template v-if="isShowChrome">
      <CommonHeader>
        <template #saerchBar>
          <SearchBar v-model="searchInput" :onSearch="onSearch" />
        </template>
      </CommonHeader>
    </template>
    <router-view />
    <template v-if="isShowChrome">
      <CommonFooter />
    </template>
    <LoadingSpinner :show="uiStore.isLoading" /> <!-- Add LoadingSpinner here -->
  </div>
</template>

<style scoped></style>