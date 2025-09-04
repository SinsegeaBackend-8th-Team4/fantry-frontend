<script setup>
import BrandLogo from '../atoms/BrandLogo.vue'
import FooterQuickLink from '../molecules/FooterQuickLink.vue'
</script>

<template>
  <div class="container-fluid bg-secondary text-dark mt-5 pt-5">
    <div class="row px-xl-5 pt-5">
      <div class="col-lg-4 col-md-12 mb-5 pr-3 pr-xl-5">
        <BrandLogo />
        <p>
          Dolore erat dolor sit lorem vero amet. Sed sit lorem magna, ipsum no sit erat lorem et
          magna ipsum dolore amet erat.
        </p>
        <p class="mb-2">
          <i class="fa fa-map-marker-alt text-primary mr-3"></i>123 Street, New York, USA
        </p>
        <p class="mb-2"><i class="fa fa-envelope text-primary mr-3"></i>info@example.com</p>
        <p class="mb-0"><i class="fa fa-phone-alt text-primary mr-3"></i>+012 345 67890</p>
      </div>
      <div class="col-lg-8 col-md-12">
        <div class="row">
          <div class="col-md-4 mb-5">
            <h5 class="font-weight-bold text-dark mb-4">Quick Links</h5>
            <div class="d-flex flex-column justify-content-start">
              <FooterQuickLink text="Home" />
              <FooterQuickLink text="Our Shop" />
              <FooterQuickLink text="Shop Detail" />
              <FooterQuickLink text="Shopping Cart" />
              <FooterQuickLink text="Checkout" />
              <FooterQuickLink text="Contact Us" />
            </div>
          </div>
          <div class="col-md-4 mb-5">
            <h5 class="font-weight-bold text-dark mb-4">Quick Links</h5>
            <div class="d-flex flex-column justify-content-start">
              <FooterQuickLink text="Home" />
              <FooterQuickLink text="Our Shop" />
              <FooterQuickLink text="Shop Detail" />
              <FooterQuickLink text="Shopping Cart" />
              <FooterQuickLink text="Checkout" />
              <FooterQuickLink text="Contact Us" />
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="row border-top border-light mx-xl-5 py-4">
      <div class="col-md-6 px-xl-0">
        <p class="mb-md-0 text-center text-md-left text-dark">
          &copy; <a class="text-dark font-weight-semi-bold" href="#">Your Site Name</a>. All Rights
          Reserved. Designed by
          <a class="text-dark font-weight-semi-bold" href="https://htmlcodex.com">HTML Codex</a
          ><br />
          Distributed By <a href="https://themewagon.com" target="_blank">ThemeWagon</a>
        </p>
      </div>
    </div>
  </div>
</template>

<style lang=""></style>
