<script setup>
import BrandLogo from '../atoms/BrandLogo.vue'
import FooterQuickLink from '../molecules/FooterQuickLink.vue'
import { useRouter } from 'vue-router'

const router = useRouter()
</script>

<template>
  <div class="container-fluid app-footer text-dark pt-3">
    <div class="row px-xl-5 pt-3">
      <div class="col-lg-3 col-md-12 mb-3 pr-3 pr-xl-5">
        <BrandLogo />
      </div>
      <div class="col-lg-9 col-md-12">
        <div class="row">
          <div class="col-md-6 mb-4">
            <h5 class="font-weight-bold text-dark mb-2">이용 안내</h5>
            <div class="d-flex flex-column justify-content-start">
              <FooterQuickLink text="경매 이용 방법" @click="router.push('/product/auction-policy')" />
              <FooterQuickLink text="검수 기준 안내" @click="router.push('/inspection/policy')" />
            </div>
          </div>
          <div class="col-md-6 mb-4">
            <h5 class="font-weight-bold text-dark mb-2">고객 센터</h5>
            <div class="d-flex flex-column justify-content-start">
              <FooterQuickLink text="고객센터 홈" @click="router.push('/cs')" />
              <p class="mb-2"><i class="fa fa-envelope text-primary mr-3"></i>support@fantry.co.kr</p>
              <p class="mb-0"><i class="fa fa-phone-alt text-primary mr-3"></i>02-1234-5678</p>
              <p class="text-dark mt-2 mb-0 small">운영시간: 평일 10:00 - 18:00</p>
              <p class="text-dark small">(주말, 공휴일 제외)</p>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="row footer-bottom-bar mx-xl-5 py-2">
      <div class="col-md-6 px-xl-0">
        <p class="mb-md-0 text-center text-md-left text-dark">
          &copy; <a class="text-dark font-weight-semi-bold" href="#">Fantry Corp.</a> All Rights Reserved.
        </p>
      </div>
    </div>
  </div>
</template>
<style scoped>
.app-footer {
  background: #ffffff;
  border-top: 1px solid #e5e7ea;
}
.app-footer p, .app-footer a {
  color: #343a40; /* 다크 계열로 가독성 확보 */
  font-size: 0.85rem; /* Reduced font size */
}
.app-footer a:hover {
  color: #D19C97; /* Primary color */
}
.footer-bottom-bar {
  border-top: 1px solid #eceff2;
}
</style>