import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useInspectionStore = defineStore('inspection', () => {
  // Step1 데이터
  const selectedCategory = ref('')
  const selectedArtist = ref(null)
  const selectedAlbum = ref(null)
  const itemName = ref('')
  const description = ref('')
  const hashtags = ref('')

  const checklists = ref([])
  const answers = ref({})

  const expectedPrice = ref(null)
  const marketAveragePrice = ref(null)
  const hopePrice = ref(0)

  // Step2 데이터
  const uploadedFiles = ref([])
  const address = ref('')
  const addressDetail = ref('')
  const bank = ref('')
  const accountNumber = ref('')

  function reset() {
    selectedCategory.value = ''
    selectedArtist.value = null
    selectedAlbum.value = null
    itemName.value = ''
    description.value = ''
    hashtags.value = ''
    checklists.value = []
    answers.value = {}
    expectedPrice.value = null
    marketAveragePrice.value = null
    hopePrice.value = 0
    uploadedFiles.value = []
    address.value = ''
    addressDetail.value = ''
    bank.value = ''
    accountNumber.value = ''
  }

  return {
    selectedCategory,
    selectedArtist,
    selectedAlbum,
    itemName,
    description,
    hashtags,
    checklists,
    answers,
    expectedPrice,
    marketAveragePrice,
    hopePrice,
    uploadedFiles,
    address,
    addressDetail,
    bank,
    accountNumber,
    reset,
  }
})
