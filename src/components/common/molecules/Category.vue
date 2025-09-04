<script setup>
import router from '@/router'
import CategoryDropDown from '../atoms/CategoryDropDown.vue'
import CategoryHolder from '../atoms/CategoryHolder.vue'
import CategoryItem from '../atoms/CategoryItem.vue'
import CategoryDropdownItem from '../atoms/CategoryDropdownItem.vue'
import { ref } from 'vue'

const categoryCollapse = ref(false)

router.afterEach((to, from) => {
  if (to.path === '/') {
    categoryCollapse.value = false
  } else {
    categoryCollapse.value = true
  }
})

const routeTo = (route) => {
  router.push(route)
}
</script>
<template>
  <CategoryHolder :class="!categoryCollapse.value ? 'show' : ''">
    <CategoryItem @click="routeTo('/product')">Shirts</CategoryItem>
    <CategoryItem>Jeans</CategoryItem>
    <CategoryItem>Swimwear</CategoryItem>
    <CategoryItem>Sleepwear</CategoryItem>
    <CategoryItem>Sportswear</CategoryItem>
    <CategoryItem>Jumpsuits</CategoryItem>
    <CategoryItem>Jackets</CategoryItem>
    <CategoryItem>Shoes</CategoryItem>
    <!-- 드롭다운 카테고리 아이템 -->
    <!-- <CategoryDropDown>
      <CategoryDropdownItem :name="`Men's Dresses`" />
      <CategoryDropdownItem :name="`Women's Dresses`" />
      <CategoryDropdownItem :name="`Baby's Dresses`" />
    </CategoryDropDown> -->
  </CategoryHolder>
</template>
