<script setup>
import { useRouter } from 'vue-router'
import { ref } from 'vue'

// bootstrap js 가져오기
import * as bootstrap from 'bootstrap'

// 상태 관리 (Pinia)
import { useInspectionStore } from '@/stores/inspectionStore'
import { storeToRefs } from 'pinia'

const router = useRouter()
const inspectionStore = useInspectionStore()
const selectedImage = ref(null)

// Store 값
const { uploadedFiles, address, addressDetail, bank, accountNumber } = storeToRefs(inspectionStore)

const onFileChange = (event) => {
  const files = Array.from(event.target.files)
  if(files.length === 0) return;

  uploadedFiles.value = files.map(file=>({
    file,
    previewUrl: URL.createObjectURL(file),
    name: file.name
  }))
}

const openModal = (url) => {
  selectedImage.value = url
  const modal = new bootstrap.Modal(document.getElementById("imageModal"))
  modal.show()
}

const removeFile = (index) => {
  if(index < 0 || index >= uploadedFiles.value.length) return;
  URL.revokeObjectURL(uploadedFiles.value[index].previewUrl)
  uploadedFiles.value.splice(index, 1)
}

const goNext = () => router.push('/inspection/step3')
const goPrev = () => router.push('/inspection/step1')
</script>

<template>
  <main class="bg-light py-5 inspection">
    <div class="container">
      <!-- 제목 -->
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
                <label for="file-upload" class="text-primary font-weight-bold cursor-pointer">파일 선택</label>
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

              <!-- 썸네일 -->
              <div class="d-flex gap-3 flex-wrap">
                <div v-for="(f, idx) in uploadedFiles" :key="f.name" class="thumbnail-wrapper">
                  <img 
                    :src="f.previewUrl" 
                    class="img-thumbnail rounded" 
                    :alt="f.name"
                    @click="openModal(f.previewUrl)"
                  />
                  <button type="button" class="delete-btn" @click="removeFile(idx)">×</button>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- 배송지 + 계좌 정보 -->
        <div class="col-lg-5 d-flex flex-column">
          <div class="card shadow-sm mb-4 flex-fill">
            <div class="card-body">
              <h5 class="font-weight-bold">배송지 정보</h5>
              <div class="form-group">
                <label>주소</label>
                <input type="text" class="form-control" v-model="address" placeholder="도로명 주소"/>
              </div>
              <div class="form-group">
                <label>상세주소</label>
                <input type="text" class="form-control" v-model="addressDetail" placeholder="상세 주소"/>
              </div>
            </div>
          </div>

          <div class="card shadow-sm flex-fill">
            <div class="card-body">
              <h5 class="font-weight-bold">계좌 정보</h5>
              <div class="form-group">
                <label>은행명</label>
                <input type="text" class="form-control" v-model="bank" placeholder="은행 선택"/>
              </div>
              <div class="form-group">
                <label>계좌번호</label>
                <input type="text" class="form-control" v-model="accountNumber" placeholder="'-' 없이 숫자만 입력"/>
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

  <!-- 모달 -->
  <div class="modal fade" id="imageModal" tabindex="-1" aria-hidden="true">
    <div class="modal-dialog modal-dialog-centered">
      <div class="modal-content">
        <div class="modal-body text-center">
          <img :src="selectedImage" class="img-fluid rounded" alt="preview" />
        </div>
      </div>
    </div>
  </div>
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

  .delete-btn {
    position: absolute;
    top: 2px;
    right: 2px;
    background: rgba(0,0,0,0.6);
    color: #fff;
    border: none;
    border-radius: 50%;
    width: 20px;
    height: 20px;
    font-size: 14px;
    line-height: 18px;
    cursor: pointer;
  }
}
</style>
