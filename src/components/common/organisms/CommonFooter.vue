<script setup>
import BrandLogo from '../atoms/BrandLogo.vue'
import FooterQuickLink from '../molecules/FooterQuickLink.vue'
import { useRouter } from 'vue-router'

const router = useRouter()
</script>

<template>
  <div class="container-fluid app-footer text-dark mt-5 pt-5">
    <div class="row px-xl-5 pt-5">
      <div class="col-lg-4 col-md-12 mb-5 pr-3 pr-xl-5">
        <BrandLogo />
        <p class="mt-4">팬들이 만들어가는 새로운 굿즈 유니버스, Fantry에서 안전하고 즐거운 거래를 경험하세요. </p>
        <p class="mb-2"><i class="fa fa-envelope text-primary mr-3"></i>support@fantry.co.kr</p>
        <p class="mb-0"><i class="fa fa-phone-alt text-primary mr-3"></i>02-1234-5678</p>
      </div>
      <div class="col-lg-8 col-md-12">
        <div class="row">
          <div class="col-md-4 mb-5">
            <h5 class="font-weight-bold text-dark mb-4">이용 안내</h5>
            <div class="d-flex flex-column justify-content-start">
              <FooterQuickLink text="경매 이용 방법" @click="router.push('/product/auction-policy')" />
              <FooterQuickLink text="검수 기준 안내" @click="router.push('/inspection/policy')" />
              <FooterQuickLink text="공지사항" @click="router.push('/')" />
            </div>
          </div>
          <div class="col-md-4 mb-5">
            <h5 class="font-weight-bold text-dark mb-4">고객 센터</h5>
            <div class="d-flex flex-column justify-content-start">
              <FooterQuickLink text="자주 묻는 질문 (FAQ)" @click="router.push('/')" />
              <FooterQuickLink text="1:1 문의하기" @click="router.push('/')" />
              <p class="text-dark mt-2 mb-0 small">운영시간: 평일 10:00 - 18:00</p>
              <p class="text-dark small">(주말, 공휴일 제외)</p>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="row footer-bottom-bar mx-xl-5 py-4">
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
}
.app-footer a:hover {
  color: #D19C97; /* Primary color */
}
.footer-bottom-bar {
  border-top: 1px solid #eceff2;
}
</style>
