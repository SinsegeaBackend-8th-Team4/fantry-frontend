import { ref, onUnmounted } from 'vue'
import * as bootstrap from 'bootstrap'

/**
 * Bootstrap 4.x / 5.x 모두 호환되는 모달 composable
 * @param {string} selector - 모달 element ID (예: '#imageModal')
 */
export function useModal(selector) {
  const modalRef = ref(null)

  const initModal = () => {
    const el = document.querySelector(selector)
    if (!el) {
      console.warn(`Modal element not found: ${selector}`)
      return
    }

    try {
      // Bootstrap 5 이상이면 getOrCreateInstance 사용
      if (bootstrap.Modal.getOrCreateInstance) {
        modalRef.value = bootstrap.Modal.getOrCreateInstance(el)
      } else {
        // Bootstrap 4 fallback
        modalRef.value = new bootstrap.Modal(el)
      }
    } catch (e) {
      console.error('Bootstrap modal initialization error:', e)
    }
  }

  const show = () => modalRef.value?.show()
  const hide = () => modalRef.value?.hide()
  const dispose = () => modalRef.value?.dispose()

  onUnmounted(() => dispose())

  return { initModal, show, hide, dispose, modalRef }
}
