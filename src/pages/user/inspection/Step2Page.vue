<script setup>
import { useRouter } from 'vue-router'
import { ref } from 'vue'
import { uploadFiles } from '@/api/inspections'

const router = useRouter()
const uploadedFiles = ref([])

const onFileChange = async (event) => {
  const files = Array.from(event.target.files)
  if(files.length === 0) return;

  try {
    const res = await uploadFiles(files)
    console.log('업로드 성공:', res.data)
    uploadedFiles.value = res.data // 업로드된 파일 정보 저장
    console.log(uploadedFiles.value)
  } catch (error) {
    console.error('파일 업로드 실패:', error)
    alert('파일 업로드에 실패했습니다. 다시 시도해주세요.')
  }
}

const goNext = () => {
  router.push('/inspection/step3')
}

const goPrev = () => {
  router.push('/inspection/step1')
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
        <p class="text-primary font-weight-bold mb-1">[2 / 3] 이미지 및 배송계좌 입력</p>
        <div class="progress" style="height: 6px">
          <div class="progress-bar bg-primary" style="width: 66%"></div>
        </div>
      </div>

      <div class="row align-items-stretch">
        <!-- 이미지 등록 -->
        <div class="col-lg-7 d-flex">
          <div class="card shadow-sm flex-fill">
            <div class="card-body">
              <h5 class="font-weight-bold mb-3">이미지 등록</h5>
              <div
                class="border border-dashed p-5 text-center mb-4"
                style="border: 2px dashed #ddd; border-radius: 8px"
              >
                <i class="fa fa-cloud-upload-alt fa-2x text-muted mb-2"></i>
                <p class="text-muted mb-1">드래그 앤 드롭 또는</p>
                <label for="file-upload" class="text-primary font-weight-bold cursor-pointer"
                  >파일 선택</label
                >
                <input id="file-upload" type="file" multiple hidden @change="onFileChange" />
              </div>

              <p class="text-muted small mb-2">
                상품 상태가 잘 보이도록 앞/뒤 필수 사진을 등록해주세요.
              </p>
              <ul class="text-muted small mb-4">
                <li>- 최소 2장 (앞/뒤)</li>
                <li>- JPG/PNG 형식</li>
                <li>- 최대 10MB</li>
              </ul>

              <!-- 업로드된 이미지 썸네일 예시 -->
              <div class="d-flex gap-2">
                <img v-for="f in uploadedFiles"
                :key="f.filemetaId" 
                :src="f.fileUrl"
                class="img-thumbnail"
                :alt="f.originalFileName" />
              </div>
            </div>
          </div>
        </div>

        <!-- 배송지 + 계좌 정보 -->
        <div class="col-lg-5 d-flex flex-column">
          <!-- 배송지 정보 -->
          <div class="card shadow-sm mb-4 flex-fill">
            <div class="card-body">
              <div class="d-flex justify-content-between align-items-center mb-3">
                <h5 class="font-weight-bold">배송지 정보</h5>
                <a href="#" class="small text-primary">내 정보 불러오기</a>
              </div>

              <div class="form-group">
                <label class="font-weight-medium">주소</label>
                <input type="text" class="form-control" placeholder="도로명 주소" />
              </div>
              <div class="form-group">
                <label class="font-weight-medium">상세주소</label>
                <input type="text" class="form-control" placeholder="상세 주소" />
              </div>
            </div>
          </div>

          <!-- 계좌 정보 -->
          <div class="card shadow-sm flex-fill">
            <div class="card-body">
              <div class="d-flex justify-content-between align-items-center mb-3">
                <h5 class="font-weight-bold">계좌 정보</h5>
                <a href="#" class="small text-primary">내 정보 불러오기</a>
              </div>

              <div class="form-group">
                <label class="font-weight-medium">은행명</label>
                <input type="text" class="form-control" placeholder="은행 선택" />
              </div>
              <div class="form-group">
                <label class="font-weight-medium">계좌번호</label>
                <input type="text" class="form-control" placeholder="'-' 없이 숫자만 입력" />
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- 이전/다음 버튼 -->
      <div class="d-flex justify-content-between mt-4">
        <button class="btn btn-secondary px-5" @click="goPrev">이전 단계</button>
        <button class="btn btn-primary px-5" @click="goNext">다음 단계</button>
      </div>
    </div>
  </main>
</template>
<style lang="scss" scoped>
.img-thumbnail {
  width: 120px;
  height: 120px;
  object-fit: cover;
  cursor: pointer;
  position: relative;
}

.img-thumbnail:hover {
  transform: scale(1.8);
  z-index: 10;
  transition: transform 0.3s ease;
}
</style>