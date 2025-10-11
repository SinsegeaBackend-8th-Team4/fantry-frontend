import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useInspectionStore = defineStore('inspection', () => {
  // Step 1: 상품 정보
  const selectedCategory = ref('')
  const selectedCategoryValue = ref(null)
  const selectedArtist = ref(null)
  const selectedAlbum = ref(null)
  const itemName = ref('')
  const itemDescription = ref('')
  const hashtags = ref('')

  // Step 1: 체크리스트
  const checklists = ref([])
  const answers = ref({})
  const templateId = ref(null)
  const templateVersion = ref(null)

  // Step 1: 가격 정보
  const expectedPrice = ref(null)
  const marketAvgPrice = ref(null)
  const sellerHopePrice = ref(0)

  // Step 2: 이미지 및 배송/계좌
  const uploadedFiles = ref([])
  const shippingAddress = ref('')
  const shippingAddressDetail = ref('')
  const bankName = ref('')
  const bankAccount = ref('')

  // 접근 제어를 위한 완료 단계
  const completedStep = ref(0) // 0: 시작 전, 1: 1단계 완료, 2: 2단계 완료

  // Store의 모든 상태를 초기화하는 함수
  function $reset() {
    selectedCategory.value = ''
    selectedCategoryValue.value = null
    selectedArtist.value = null
    selectedAlbum.value = null
    itemName.value = ''
    itemDescription.value = ''
    hashtags.value = ''
    checklists.value = []
    answers.value = {}
    templateId.value = null
    templateVersion.value = null
    expectedPrice.value = null
    marketAvgPrice.value = null
    sellerHopePrice.value = 0
    uploadedFiles.value = []
    shippingAddress.value = ''
    shippingAddressDetail.value = ''
    bankName.value = ''
    bankAccount.value = ''
    completedStep.value = 0
  }

  return {
    selectedCategory,
    selectedCategoryValue,
    selectedArtist,
    selectedAlbum,
    itemName,
    itemDescription,
    hashtags,
    checklists,
    answers,
    templateId,
    templateVersion,
    expectedPrice,
    marketAvgPrice,
    sellerHopePrice,
    uploadedFiles,
    shippingAddress,
    shippingAddressDetail,
    bankName,
    bankAccount,
    completedStep,
    $reset,
  }
})
