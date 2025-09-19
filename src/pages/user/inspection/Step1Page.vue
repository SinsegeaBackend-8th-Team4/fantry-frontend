<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { getGoodsCategories, getArtists, getAlbumsByArtist } from '@/api/catalog.js'
import SelectedArtistModal from '@/pages/user/inspection/SelectedArtistModal.vue'
import SelectedAlbumModal from '@/pages/user/inspection/SelectedAlbumModal.vue'

const router = useRouter()

// 상태
const categories = ref([]) // 굿즈 카테고리
const artists = ref([]) // 아티스트
const albums = ref([]) // 앨범
const selectedCategory = ref('') // 카테고리 코드
const selectedArtist = ref(null) // 아티스트
const selectedAlbum = ref(null) // 앨범
const itemName = ref('') // 상품명
const description = ref('') // 상품 설명
const hashtags = ref('') // 해시태그 입력

// 모달
const showArtistModal = ref(false)
const showAlbumModal = ref(false)

// 로딩/에러
const loadingInitial = ref(false) // 최초 로딩(카테고리/아티스트)
const loadingAlbums = ref(false) // 앨범 로딩
const error = ref(null)

// fetchers : 카테고리/아티스트 조회
async function fetchCategoriesAndArtists() {
  const [catRes, artRes] = await Promise.all([getGoodsCategories(), getArtists()])
  return {
    categories: catRes.data ?? [], // null이나 undefined면 []
    artists: artRes.data ?? [],
  }
}

// fetchers : 앨범 조회
async function fetchAlbumsByArtistId(artistId) {
  const res = await getAlbumsByArtist(artistId)
  return res.data ?? []
}

onMounted(async () => {
  loadingInitial.value = true
  error.value = null
  try {
    const { categories: cats, artists: arts } = await fetchCategoriesAndArtists()
    categories.value = cats
    artists.value = arts
  } catch (err) {
    error.value = err?.message || '초기 데이터(카테고리/아티스트) 조회 중 오류가 발생했습니다.'
  } finally {
    loadingInitial.value = false
  }
})

// 아티스트 선택 후 앨범 조회
const onSelectArtist = async (artist) => {
  selectedArtist.value = artist
  selectedAlbum.value = null // 아티스트 바뀌면 앨범 초기화
  showArtistModal.value = false

  error.value = null

  try {
    albums.value = await fetchAlbumsByArtistId(artist.artistId)
  } catch (err) {
    error.value = err?.message || '앨범 데이터 조회 중 오류가 발생했습니다.'
  } finally {
    loadingAlbums.value = false
  }
}

// 앨범 선택
const onSelectAlbum = (album) => {
  selectedAlbum.value = album
  showAlbumModal.value = false
}

// 다음 단계 이동
const goNext = () => {
  // TODO: validate
  router.push('/inspection/step2')
}

// 제목 미리보기
const previewText = computed(() => {
  const ak = selectedArtist.value?.nameKo || '[아티스트]'
  const at = selectedAlbum.value?.title || '[앨범]'
  const nm = itemName.value || '[상품명]'
  return `${ak} ${at} ${nm}`
})

// UI 상태 편의
const isCategoryDisabled = computed(() => loadingInitial.value)
const isArtistDisabled = computed(() => loadingInitial.value)
const isAlbumDisabled = computed(() => !selectedArtist.value || loadingAlbums.value)
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
        <p class="text-primary font-weight-bold mb-1">[1 / 3] 상품 정보 입력</p>
        <div class="progress" style="height: 6px">
          <div class="progress-bar bg-primary" style="width: 33%"></div>
        </div>
      </div>

      <!-- 오류/알림 -->
      <div v-if="error" class="alert alert-danger" role="alert">
        {{ error }}
      </div>

      <div class="row">
        <!-- 좌측: 상품 정보 -->
        <div class="col-lg-7 d-flex">
          <div class="card shadow-sm flex-fill">
            <div class="card-body">
              <h5 class="font-weight-bold mb-2">상품 정보</h5>
              <p class="text-muted small mb-4">정확한 상품 정보를 입력해주세요.</p>

              <!-- 카테고리 -->
              <div class="form-group">
                <label class="font-weight-medium">카테고리</label>
                <select
                  class="form-control"
                  v-model="selectedCategory"
                  :disabled="isCategoryDisabled"
                >
                  <option value="" disabled>선택하세요</option>
                  <option v-for="c in categories" :key="c.goodsCategoryId" :value="c.code">
                    {{ c.name }}
                  </option>
                </select>
              </div>

              <!-- 아티스트 -->
              <div class="form-group">
                <label class="font-weight-medium">아티스트</label>
                <div class="input-group">
                  <input
                    type="text"
                    class="form-control"
                    :value="
                      selectedArtist ? `${selectedArtist.nameKo} (${selectedArtist.nameEn})` : ''
                    "
                    readonly
                    placeholder="아티스트 선택"
                    :disabled="isArtistDisabled"
                    @click="!isArtistDisabled && (showArtistModal = true)"
                  />
                  <div class="input-group-append">
                    <button
                      class="btn btn-outline-secondary"
                      type="button"
                      :disabled="isArtistDisabled"
                      @click="!isArtistDisabled && (showArtistModal = true)"
                    >
                      <i class="fa fa-search"></i>
                    </button>
                  </div>
                </div>
              </div>

              <!-- 앨범 -->
              <div class="form-group">
                <label class="font-weight-medium">앨범</label>
                <div class="input-group">
                  <input
                    type="text"
                    class="form-control"
                    :value="selectedAlbum ? selectedAlbum.title : ''"
                    readonly
                    :placeholder="selectedArtist ? '앨범 선택' : '먼저 아티스트를 선택하세요'"
                    :disabled="isAlbumDisabled"
                    @click="!isAlbumDisabled && (showAlbumModal = true)"
                  />
                  <div class="input-group-append">
                    <button
                      class="btn btn-outline-secondary"
                      type="button"
                      :disabled="isAlbumDisabled"
                      @click="!isAlbumDisabled && (showAlbumModal = true)"
                    >
                      <i class="fa fa-search"></i>
                    </button>
                  </div>
                </div>
                <small v-if="loadingAlbums" class="text-muted"
                  >앨범 목록을 불러오는 중입니다…</small
                >
              </div>

              <!-- 상품명 -->
              <div class="form-group">
                <label class="font-weight-medium">상품명</label>
                <input
                  type="text"
                  class="form-control"
                  placeholder="예: 한정판 포토카드"
                  v-model="itemName"
                />
              </div>

              <!-- 미리보기 -->
              <div class="form-group">
                <small class="text-muted">미리보기: {{ previewText }}</small>
              </div>

              <!-- 설명 -->
              <div class="form-group">
                <label class="font-weight-medium">상품 설명</label>
                <textarea
                  rows="3"
                  class="form-control"
                  placeholder="상품에 대한 설명을 입력해주세요."
                  v-model="description"
                />
              </div>

              <!-- 해시태그 -->
              <div class="form-group">
                <label class="font-weight-medium">해시태그</label>
                <input
                  type="text"
                  class="form-control"
                  placeholder="#아이브 #포토카드"
                  v-model="hashtags"
                />
              </div>

              <!-- 평균 시세 버튼 -->
              <div class="d-flex align-items-center">
                <button class="btn btn-outline-primary btn-sm mr-3" type="button">
                  평균 시세 계산하기
                </button>
                <span class="text-muted small">데이터 없음</span>
              </div>
            </div>
          </div>
        </div>

        <!-- 우측: 상태/가격 -->
        <div class="col-lg-5 d-flex flex-column">
          <div class="card shadow-sm mb-4 flex-fill">
            <div class="card-body d-flex flex-column">
              <h5 class="font-weight-bold mb-2">상품 상태</h5>
              <p class="text-muted small mb-3">상품의 상태를 꼼꼼히 확인하고 체크해주세요.</p>

              <div class="flex-fill" style="max-height: 320px; overflow-y: auto">
                <!-- TODO: 체크리스트 API 연동 -->
                <div class="form-group">
                  <label class="font-weight-medium">정품 스티커가 있나요?</label>
                  <select class="form-control">
                    <option>예</option>
                    <option>아니오</option>
                  </select>
                </div>

                <div class="form-group">
                  <label class="font-weight-medium">박스 상태</label>
                  <select class="form-control">
                    <option>없음</option>
                    <option>미세</option>
                    <option>중</option>
                    <option>심각</option>
                  </select>
                </div>

                <div class="form-group">
                  <label class="font-weight-medium">구성품 누락</label>
                  <select class="form-control">
                    <option>없음</option>
                    <option>일부 누락</option>
                    <option>많이 누락</option>
                  </select>
                </div>
              </div>
            </div>
          </div>

          <div class="card shadow-sm">
            <div class="card-body">
              <h5 class="font-weight-bold mb-4">가격</h5>
              <div class="d-flex justify-content-between mb-2">
                <span class="text-muted">시스템 예상가</span>
                <strong class="text-primary">15,000원</strong>
              </div>
              <div class="d-flex justify-content-between mb-3">
                <span class="text-muted">평균 시세</span>
                <span>데이터 없음</span>
              </div>
              <div class="form-group">
                <label class="font-weight-medium">판매 희망가</label>
                <input type="number" class="form-control" placeholder="0" />
                <small class="form-text text-muted">
                  희망가와 예상가가 다를 수 있으며, 최종 가격은 검수 후 확정됩니다.
                </small>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- 다음 단계 -->
      <div class="text-right mt-4">
        <button class="btn btn-primary px-5" type="button" @click="goNext">다음 단계</button>
      </div>
    </div>
  </main>

  <!-- 아티스트 모달 -->
  <SelectedArtistModal v-model:show="showArtistModal" :artists="artists" @select="onSelectArtist" />
  <!-- 앨범 모달 -->
  <SelectedAlbumModal v-model:show="showAlbumModal" :albums="albums" @select="onSelectAlbum" />
</template>

<style lang="scss" scoped>
$primary-color: #0066ff;
$primary-hover: #0052cc;

// 제목/라벨 스타일
h2,
h5,
label {
  color: #222 !important;
  font-weight: 600;
}

// 파란 강조 색상
.text-primary {
  color: $primary-color !important;
}

.progress-bar {
  background-color: $primary-color !important;
}

// 기본 버튼 (중첩 문법 사용)
.btn-primary {
  background-color: $primary-color !important;
  border-color: $primary-color !important;
  color: #fff !important;

  &:hover,
  &:focus {
    background-color: $primary-hover !important;
    border-color: $primary-hover !important;
    color: #fff !important;
  }
}

// 아웃라인 버튼
.btn-outline-primary {
  color: $primary-color !important;
  border-color: $primary-color !important;

  &:hover {
    background-color: $primary-color !important;
    color: #fff !important;
  }
}

// 돋보기 버튼
.input-group-append {
  .btn {
    background-color: #f8f9fa !important;
    border: 1px solid #ddd !important;

    i.fa-search {
      color: $primary-color !important;
    }

    &:hover {
      background-color: $primary-color !important;

      i.fa-search {
        color: #fff !important;
      }
    }
  }
}
</style>
