<script setup></script>
<template>
  <div class="nav-item dropdown">
    <a href="#" class="nav-link" data-toggle="dropdown"
      >Dresses <i class="fa fa-angle-down float-right mt-1"></i
    ></a>
    <div class="dropdown-menu position-absolute bg-secondary border-0 rounded-0 w-100 m-0">
        <slot></slot>
    </div>
  </div>
</template>
<style scoped></style>
