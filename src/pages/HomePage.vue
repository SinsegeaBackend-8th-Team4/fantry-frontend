<script setup>
import CarouselItemHolder from '@/components/common/atoms/CarouselItemHolder.vue'
import MainBannerCarousel from '@/components/common/molecules/MainBannerCarousel.vue'
</script>

<template>
  <div class="content-page px-xl-5">
    <h1>홈페이지</h1>
    <MainBannerCarousel>
      <CarouselItemHolder :isActive="true">
        <img
          class="img-fluid"
          src="https://images.pexels.com/photos/247600/pexels-photo-247600.jpeg"
          alt="Image"
          loading="lazy"
        />
        <div class="carousel-caption d-flex flex-column align-items-center justify-content-center">
          <div class="p-3" style="max-width: 700px">
            <h4 class="text-light text-uppercase font-weight-medium mb-3">
              10% Off Your First Order
            </h4>
            <h3 class="display-4 text-white font-weight-semi-bold mb-4">Fashionable Dress</h3>
            <a href="" class="btn btn-light py-2 px-3">Shop Now</a>
          </div>
        </div>
      </CarouselItemHolder>
      <CarouselItemHolder>
        <img
          class="img-fluid"
          src="https://images.pexels.com/photos/417074/pexels-photo-417074.jpeg"
          alt="Image"
          loading="lazy"
        />
        <div class="carousel-caption d-flex flex-column align-items-center justify-content-center">
          <div class="p-3" style="max-width: 700px">
            <h4 class="text-light text-uppercase font-weight-medium mb-3">
              10% Off Your First Order
            </h4>
            <h3 class="display-4 text-white font-weight-semi-bold mb-4">Fashionable Dress</h3>
            <a href="" class="btn btn-light py-2 px-3">Shop Now</a>
          </div>
        </div>
      </CarouselItemHolder>
      <CarouselItemHolder>
        <img
          class="img-fluid"
          src="https://images.pexels.com/photos/1227513/pexels-photo-1227513.jpeg"
          alt="Image"
          loading="lazy"
        />
        <div class="carousel-caption d-flex flex-column align-items-center justify-content-center">
          <div class="p-3" style="max-width: 700px">
            <h4 class="text-light text-uppercase font-weight-medium mb-3">
              10% Off Your First Order
            </h4>
            <h3 class="display-4 text-white font-weight-semi-bold mb-4">Reasonable Price</h3>
            <a href="" class="btn btn-light py-2 px-3">Shop Now</a>
          </div>
        </div>
      </CarouselItemHolder>
    </MainBannerCarousel>
  </div>
</template>
