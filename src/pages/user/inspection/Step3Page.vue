<script setup>
import { useRouter } from 'vue-router'
import { ref } from 'vue'

// 상태 관리 (Pinia)
import { useInspectionStore } from '@/stores/inspectionStore'
import { storeToRefs } from 'pinia'

const router = useRouter()
const inspectionStore = useInspectionStore()

// Store 값 가져오기
const { 
  selectedCategory, selectedArtist, selectedAlbum, itemName,
  description, hashtags, checklists, answers, expectedPrice, 
  marketAveragePrice, hopePrice, uploadedFiles, address,
  addressDetail, bank, accountNumber
} = storeToRefs(inspectionStore)

const goPrev = () => {
  router.push('/inspection/step2')
}
const finish = () => {
  alert('신청이 완료되었습니다!')
  // router.push('/mypage') 완료 후 페이지
}
</script>

<template>
  <main class="bg-light py-5 inspection">
    <div class="container">
      <!-- 페이지 제목 -->
      <div class="mb-4 text-center">
        <h2 class="font-weight-bold">온라인 1차 검수 신청</h2>
      </div>

      <!-- 진행 바 -->
      <div class="mb-5">
        <p class="text-primary font-weight-bold mb-1">[3 / 3] 신청 내용 확인</p>
        <div class="progress" style="height: 6px">
          <div class="progress-bar bg-primary" style="width: 100%"></div>
        </div>
      </div>

      <!-- 신청 정보 요약 -->
      <div class="card shadow-sm mb-4">
        <div class="card-body">
          <h5 class="font-weight-bold mb-4">신청 정보 요약</h5>

          <!-- 상품 정보 -->
          <div class="mb-4">
            <h6 class="font-weight-bold">상품 정보</h6>
            <dl class="row mt-3">
              <dt class="col-sm-3 text-muted">카테고리</dt>
              <dd class="col-sm-9">{{ selectedCategoryValue }}</dd>

              <dt class="col-sm-3 text-muted">아티스트</dt>
              <dd class="col-sm-9">{{ selectedArtist.nameKo }}</dd>

              <dt class="col-sm-3 text-muted">앨범</dt>
              <dd class="col-sm-9">{{ selectedAlbum.title }}</dd>

              <dt class="col-sm-3 text-muted">상품명</dt>
              <dd class="col-sm-9">{{ itemName }}</dd>

              <dt class="col-sm-3 text-muted">설명</dt>
              <dd class="col-sm-9">{{ description }}</dd>
              
              <dt class="col-sm-3 text-muted">해시태그</dt>
              <dd class="col-sm-9">{{ hashtags }}</dd>
            </dl>
          </div>

          <!-- 상세 체크리스트 -->
          <div class="border-top pt-3 mb-4">
            <h6 class="font-weight-bold">상세 체크리스트</h6>
            <dl class="row mt-3" v-for="c in checklists">
              <dt class="col-sm-3 text-muted">{{ c.label }}</dt>
              <dd class="col-sm-9">{{ answers[c.itemKey] }}</dd>
            </dl>
          </div>

          <!-- 가격 정보 -->
          <div class="border-top pt-3 mb-4">
            <h6 class="font-weight-bold">가격 정보</h6>
            <dl class="row mt-3">
              <dt class="col-sm-3 text-muted">시스템 추정가</dt>
              <dd class="col-sm-9">{{ expectedPrice ? expectedPrice.toLocaleString() + '원' : '데이터 없음' }}</dd>

              <dt class="col-sm-3 text-muted">평균 시세</dt>
              <dd class="col-sm-9">{{ marketAveragePrice ? marketAveragePrice.toLocaleString() + '원' : '데이터 없음' }}</dd>

              <dt class="col-sm-3 text-muted">판매 희망가</dt>
              <dd class="col-sm-9">{{ hopePrice ? hopePrice.toLocaleString() + '원' : '데이터 없음' }}</dd>
            </dl>
          </div>

          <!-- 배송 및 정산 정보 -->
          <div class="border-top pt-3 mb-4">
            <h6 class="font-weight-bold">배송 및 정산 정보</h6>
            <dl class="row mt-3">
              <dt class="col-sm-3 text-muted">배송 주소</dt>
              <dd class="col-sm-9">{{ address }} {{ addressDetail }}</dd>

              <dt class="col-sm-3 text-muted">정산 계좌</dt>
              <dd class="col-sm-9">[{{ bank }}] {{ accountNumber }}</dd>
            </dl>
          </div>

          <!-- 업로드된 사진 -->
          <div class="border-top pt-3 mb-4">
            <h6 class="font-weight-bold">업로드된 사진</h6>
            <div class="d-flex gap-2 mt-3">
              <div v-for="f in uploadedFiles" :key="f.name" class="thumbnail-wrapper">
                <img 
                  :src="f.previewUrl" 
                  class="img-thumbnail rounded" 
                  :alt="f.name"
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- 동의 및 버튼 -->
      <div class="mb-3 form-check">
        <input class="form-check-input" type="checkbox" id="agree" />
        <label class="form-check-label" for="agree">검수 및 판매 정책에 동의합니다.</label>
      </div>
      <!-- 이전/다음 버튼 -->
      <div class="d-flex justify-content-between">
        <button class="btn btn-secondary px-5" @click="goPrev">이전 단계</button>
        <button class="btn btn-primary px-5" @click="finish">신청 완료</button>
      </div>
    </div>
  </main>
</template>
<style lang="scss" scoped>
.thumbnail-wrapper {
  position: relative;
  display: inline-block;

  img {
    width: 120px;
    height: 120px;
    object-fit: cover;
    border-radius: 6px;
    cursor: pointer;
  }
}
</style>




