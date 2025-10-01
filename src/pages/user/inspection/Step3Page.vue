<script setup>
import { useRouter } from 'vue-router'


const router = useRouter()
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
              <dt class="col-sm-3 text-muted">아티스트</dt>
              <dd class="col-sm-9">Stellaris</dd>


              <dt class="col-sm-3 text-muted">앨범</dt>
              <dd class="col-sm-9">'Cosmic Echoes'</dd>


              <dt class="col-sm-3 text-muted">상품명</dt>
              <dd class="col-sm-9">Limited Edition Album Set</dd>


              <dt class="col-sm-3 text-muted">설명/해시태그</dt>
              <dd class="col-sm-9">#Stellaris #CosmicEchoes #LimitedEdition #KpopMerch</dd>
            </dl>
          </div>


          <!-- 상세 체크리스트 -->
          <div class="border-top pt-3 mb-4">
            <h6 class="font-weight-bold">상세 체크리스트</h6>
            <dl class="row mt-3">
              <dt class="col-sm-3 text-muted">정품 스티커</dt>
              <dd class="col-sm-9">있음</dd>


              <dt class="col-sm-3 text-muted">박스 상태</dt>
              <dd class="col-sm-9">최상</dd>


              <dt class="col-sm-3 text-muted">앨범 구성품</dt>
              <dd class="col-sm-9">완비</dd>


              <dt class="col-sm-3 text-muted">포토카드</dt>
              <dd class="col-sm-9">포함</dd>


              <dt class="col-sm-3 text-muted">추가 구성품</dt>
              <dd class="col-sm-9">없음</dd>
            </dl>
          </div>


          <!-- 가격 정보 -->
          <div class="border-top pt-3 mb-4">
            <h6 class="font-weight-bold">가격 정보</h6>
            <dl class="row mt-3">
              <dt class="col-sm-3 text-muted">시스템 추정가</dt>
              <dd class="col-sm-9">₩120,000</dd>


              <dt class="col-sm-3 text-muted">평균 시세</dt>
              <dd class="col-sm-9">₩135,000</dd>


              <dt class="col-sm-3 text-muted">판매 희망가</dt>
              <dd class="col-sm-9 text-primary font-weight-bold">₩130,000</dd>
            </dl>
          </div>


          <!-- 배송 및 정산 정보 -->
          <div class="border-top pt-3 mb-4">
            <h6 class="font-weight-bold">배송 및 정산 정보</h6>
            <dl class="row mt-3">
              <dt class="col-sm-3 text-muted">배송 주소</dt>
              <dd class="col-sm-9">서울특별시 하모니로 123</dd>


              <dt class="col-sm-3 text-muted">정산 계좌</dt>
              <dd class="col-sm-9">케이뱅크 123-456-7890 (박민지)</dd>
            </dl>
          </div>


          <!-- 업로드된 사진 -->
          <div class="border-top pt-3 mb-4">
            <h6 class="font-weight-bold">업로드된 사진</h6>
            <div class="d-flex gap-2 mt-3">
              <img src="https://via.placeholder.com/120" class="img-thumbnail" alt="uploaded 1" />
              <img src="https://via.placeholder.com/120" class="img-thumbnail" alt="uploaded 2" />
              <img src="https://via.placeholder.com/120" class="img-thumbnail" alt="uploaded 3" />
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





