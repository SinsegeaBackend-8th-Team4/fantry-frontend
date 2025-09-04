<script setup>
import IconCountChip from '../atoms/IconCountChip.vue'
import SearchBar from '../molecules/SearchBar.vue'
import NavigationBar from '../molecules/NavigationBar.vue'
import BrandLogo from '../atoms/BrandLogo.vue'
</script>
<template>
  <div class="container-fluid">
    <div class="row bg-secondary py-2 px-xl-5">
      <div class="col-lg-6 d-none d-lg-block">
        <div class="d-inline-flex align-items-center">
          <a class="text-dark" href="">FAQs</a>
          <span class="text-muted px-2">|</span>
          <a class="text-dark" href="">Help</a>
          <span class="text-muted px-2">|</span>
          <a class="text-dark" href="">Support</a>
        </div>
      </div>
    </div>
    <div class="row align-items-center py-3 px-xl-5">
      <div class="col-lg-3 d-none d-lg-block">
        <BrandLogo />
      </div>
      <div class="col-lg-6 col-6 text-left">
        <slot name="saerchBar"></slot>
      </div>
      <div class="col-lg-3 col-6 text-right">
        <IconCountChip count="30">
          <i class="fas fa-heart text-primary"></i>
        </IconCountChip>
        <IconCountChip count="10">
          <i class="fas fa-shopping-cart text-primary"></i>
        </IconCountChip>
      </div>
    </div>
  </div>
  <div class="container-fluid mb-5">
    <div class="row border-top px-xl-5">
      <div class="col-lg-12">
        <NavigationBar />
      </div>
    </div>
  </div>
</template>
