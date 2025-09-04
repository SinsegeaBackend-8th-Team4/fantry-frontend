<script setup>
import router from '@/router'
import NavigationItem from '../atoms/NavigationItem.vue'
import NavigationDropdownButton from '../atoms/NavigationDropdownButton.vue'
import { useUserStore } from '@/stores/userStore'
const userStore = useUserStore()
</script>

<template>
  <nav class="navbar navbar-expand-lg bg-light navbar-light py-3 py-lg-0 px-0">
    <a href="" class="text-decoration-none d-block d-lg-none">
      <h1 class="m-0 display-5 font-weight-semi-bold">
        <span class="text-primary font-weight-bold border px-3 mr-1">E</span>Shopper
      </h1>
    </a>
    <button
      type="button"
      class="navbar-toggler"
      data-toggle="collapse"
      data-target="#navbarCollapse"
    >
      <span class="navbar-toggler-icon"></span>
    </button>
    <div class="collapse navbar-collapse justify-content-between" id="navbarCollapse">
      <div class="navbar-nav mr-auto py-0">
        <NavigationItem>Home</NavigationItem>
        <NavigationItem>Shop</NavigationItem>
        <NavigationItem>Shop Detail</NavigationItem>
        <NavigationDropdownButton />
        <NavigationItem>Contact</NavigationItem>
      </div>
      <div class="navbar-nav ml-auto py-0">
        <template v-if="userStore.getIsLogined">
          <NavigationItem>로그아웃</NavigationItem>
          <NavigationItem>마이페이지</NavigationItem>
        </template>
        <template v-else>
          <NavigationItem @click="router.push('login')">로그인</NavigationItem>
        </template>
      </div>
    </div>
  </nav>
</template>
