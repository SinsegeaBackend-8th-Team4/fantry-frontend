<script setup>
import router from './router'
import { computed, ref } from 'vue'
import { useUserStore } from './stores/userStore'
import CommonHeader from './components/common/organisms/CommonHeader.vue'
import CommonFooter from './components/common/organisms/CommonFooter.vue'
import SearchBar from './components/common/molecules/SearchBar.vue'

const userStore = useUserStore()

//현재 화면 라웉터 값
const route = ref('/')
// 로그인 화면에서 공통헤더 보일지정하는 부분
const isShowHeader = computed(() => {
  return route.value !== '/login'
})
// 로그인 화면에서 공통풋터 보일지정하는 부분
const isShowFooter = computed(() => {
  return route.value !== '/login'
})

//화면 전환시 해당 화면이 로그인이 필요한 화면인지 로그인이 되었는지 확인하여 로그인 화면으로 이동시킴
router.beforeEach((to, from, next) => {
  if (to.meta.requiredLogin && !userStore.getIsLogined) {
    alert('로그인이 필요한 서비스입니다.')
    next('/login')
    route.value = '/login'
  } else {
    route.value = to.path
    next()
  }
})

//검색창 검색 버튼 클릭시 검색어가 value로 나옴
const onSearch = (value) => {}

const searchInput = ref('')
</script>

<template>
  <template v-if="isShowHeader">
    <!-- 공통 헤더 시작 -->
    <CommonHeader>
      <template #saerchBar>
        <SearchBar v-model="searchInput" :onSearch="onSearch" />
      </template>
    </CommonHeader>
    <!-- 공통 헤더 끝 -->
  </template>
  <!-- 페이지 영역 시작 -->
  <router-view />
  <!-- 페이지 영역 끝 -->
  <template v-if="isShowFooter">
    <!-- 공통 헤더 시작  -->
    <CommonFooter />
    <!-- 공통 헤더 끝 -->
  </template>
</template>

<style scoped></style>
