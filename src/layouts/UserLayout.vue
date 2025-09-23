<script setup>
import router from '@/router' // './router'에서 '@/router'로 경로 수정
import { computed, ref, onMounted, onUnmounted } from 'vue'
import { useUserStore } from '@/stores/userStore' // '@' 경로 사용
import CommonHeader from '@/components/common/organisms/CommonHeader.vue' // '@' 경로 사용
import CommonFooter from '@/components/common/organisms/CommonFooter.vue' // '@' 경로 사용
import SearchBar from '@/components/common/molecules/SearchBar.vue' // '@' 경로 사용
import { useRoute } from 'vue-router'
// 1. 사용자 레이아웃 전용 스타일 파일을 임포트합니다.
import '@/styles/scss/main-user.scss';

const userStore = useUserStore()

//현재 화면 라웉터 값
// const route = ref('/')
const route = useRoute()

const hiddenLayouts = ['/login', '/signup']
// 공통헤더 보일지정하는 부분
const isShowHeader = computed(() => {
  return !hiddenLayouts.some(path => route.path.startsWith(path))
})
// 공통풋터 보일지정하는 부분
const isShowFooter = computed(() => {
  return !hiddenLayouts.some(path => route.path.startsWith(path))
})

//화면 전환시 해당 화면이 로그인이 필요한 화면인지 로그인이 되었는지 확인하여 로그인 화면으로 이동시킴
router.beforeEach((to, from, next) => {
  if (to.meta.requiredLogin && !userStore.getIsLogined) {
    alert('로그인이 필요한 서비스입니다.')
    next('/login')
    // route.value = '/login'
  } else {
    // route.value = to.path
    next()
  }
})

onMounted(() => {
  // 2. 이 컴포넌트가 DOM에 렌더링될 때 body에 'user-page-active' 같은
  //    고유한 클래스를 추가하여, 어떤 레이아웃이 활성화 상태인지 CSS에서 구별할 수 있게 합니다.
  document.body.classList.add('user-layout-active');
});

onUnmounted(() => {
  // 3. 컴포넌트가 사라질 때 (다른 레이아웃으로 이동 시) 추가했던 클래스를 제거하여
  //    스타일이 중첩되지 않도록 합니다.
  document.body.classList.remove('user-layout-active');
});

//검색창 검색 버튼 클릭시 검색어가 value로 나옴
const onSearch = (value) => {}

const searchInput = ref('')
</script>

<template>
  <div>
    <template v-if="isShowHeader">
      <CommonHeader>
        <template #saerchBar>
          <SearchBar v-model="searchInput" :onSearch="onSearch" />
        </template>
      </CommonHeader>
      </template>
    <router-view />
    <template v-if="isShowFooter">
      <CommonFooter />
      </template>
  </div>
</template>

<style scoped></style>