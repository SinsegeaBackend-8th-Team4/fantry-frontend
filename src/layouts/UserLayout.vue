<script setup>
import { computed, ref, onUnmounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import CommonHeader from '@/components/common/organisms/CommonHeader.vue'
import CommonFooter from '@/components/common/organisms/CommonFooter.vue'
import SearchBar from '@/components/common/molecules/SearchBar.vue'
import '@/styles/scss/main-user.scss'
import { useUserStore } from '@/stores/userStore'
import { useNotificationStore } from '@/stores/notificationStore'
import { useNotification } from '@/utils/notificationComposable'

const route = useRoute()
const router = useRouter()
const userStore = useUserStore()
const notificationStore = useNotificationStore()

/**
 * 검색 기능
 */
const searchInput = ref('')
const onSearch = (keyword) => {
  if (keyword) {
    router.push({ path: '/product', query: { keyword } })
  } else {
    router.push({ path: '/product' })
  }
}

/**
 * 로그인, 회원가입 페이지에서는 헤더/푸터를 숨깁니다.
 */
const isShowChrome = computed(() => {
  const hiddenPaths = ['/login', '/admin/login', '/signup'];  //헤더/푸터 숨길 페이지('/login/**, /signup/**')
  return !hiddenPaths.some(path => route.path.startsWith(path));
});

/**
 * 알림 시스템 초기화
 */
useNotification(userStore, notificationStore)

/**
 * 레이아웃 활성화 스타일 적용
 */
document.body.classList.add('user-layout-active')
onUnmounted(() => {
  document.body.classList.remove('user-layout-active')
})
</script>

<template>
  <div>
    <template v-if="isShowChrome">
      <CommonHeader>
        <template #searchBar>
          <SearchBar v-model="searchInput" :onSearch="onSearch" />
        </template>
      </CommonHeader>
    </template>
    <router-view />
    <template v-if="isShowChrome">
      <CommonFooter />
    </template>
  </div>
</template>

<style scoped></style>
