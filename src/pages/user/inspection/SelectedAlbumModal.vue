<script setup>
import { ref, computed } from 'vue'
/**
 * SelectedAlbumModal.vue
 * - 앨범 선택 모달
 * - 부모에서 albums 데이터 주입
 * - 선택/닫기 이벤트 전달
 */

const props = defineProps({
  show: { type: Boolean, required: true }, // 모달 열림 여부
  albums: { type: Array, default: () => [] }, // 아티스트 목록
})

const emit = defineEmits([
  'update:show', // v-modal:show 용
  'select', // 앨범 선택 이벤트
])

// 검색 상태
const search = ref('')

// 필터링된 앨범 리스트
const filteredAlbums = computed(() => {
  const keyword = search.value.trim().toLowerCase()
  if (!keyword) return props.albums

  return props.albums.filter((album) => album.title.includes(keyword))
})

// 모달 닫기
function hide() {
  emit('update:show', false)
}

// 앨범 선택
const selectedAlbum = (album) => {
  emit('select', album) // 부모에 선택 결과 전달
  emit('update:show', false) // 동시에 모달 닫기
}
</script>

<template>
  <div v-if="show" class="inspection-modal">
    <div class="inspection-modal-dialog">
      <!-- Header -->
      <div class="inspection-modal-header"><h2>앨범 선택</h2></div>

      <!-- Content -->
      <div class="inspection-modal-body">
        <input v-model="search" class="form-control mb-3" placeholder="이름을 검색하세요." />

        <div class="inspection-list">
          <div
            v-for="album in filteredAlbums"
            :key="album.albumId"
            class="inspection-list-item"
            @click="selectedAlbum(album)"
          >
            {{ album.title }} ({{ album.releaseDate }})
          </div>
        </div>
      </div>

      <!-- Footer -->
      <div class="inspection-modal-footer">
        <button class="btn btn-primary w-100" @click="hide">닫기</button>
      </div>
    </div>
  </div>
</template>
<style scoped lang="scss">
.inspection-modal {
  position: fixed;
  inset: 0;
  z-index: 2000;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(0, 0, 0, 0.5);
}

.inspection-modal-dialog {
  width: 100%;
  max-width: 500px;
  background: #fff;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 5px 20px rgba(0, 0, 0, 0.2);
}

.inspection-modal-header {
  padding: 1rem;
  border-bottom: 1px solid #eee;
  text-align: center;
  font-weight: bold;
}

.inspection-modal-body {
  padding: 1rem;
  max-height: 400px;
  overflow-y: auto;
}

.inspection-list {
  border: 1px solid #ddd;
  border-radius: 6px;
  overflow: hidden;

  &-item {
    // &-item은 .inspection-list-item을 의미
    padding: 0.75rem 1rem;
    cursor: pointer;

    &:hover {
      background: #f5f5f5;
    }
  }
}

.inspection-modal-footer {
  padding: 1rem;
  border-top: 1px solid #eee;
}
</style>
