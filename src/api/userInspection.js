import apiClient from './index'
import { unwrap, rethrow } from './InspectionHelper'

// 1차 온라인 검수 파일 업로드
export const uploadFiles = (files) => {
  const formData = new FormData()
  files.forEach((file) => {
    formData.append('files', file)
  })
  return apiClient.post('/inspection/files', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  })
}

// 1차 온라인 검수 신청
export const submitInspection = (inspectionData) => {
  // Form 객체 생성
  const formData = new FormData()

  // JSON 데이터 추가
  const jsonData = {
    goodsCategoryId: inspectionData.selectedCategory,
    artistId: inspectionData.selectedArtist.artistId,
    albumId: inspectionData.selectedAlbum?.albumId,
    itemName: inspectionData.itemName,
    itemDescription: inspectionData.itemDescription,
    hashtags: inspectionData.hashtags,
    answers: inspectionData.answers,
    expectedPrice: inspectionData.expectedPrice,
    marketAvgPrice: inspectionData.marketAvgPrice,
    sellerHopePrice: inspectionData.sellerHopePrice,
    shippingAddress: inspectionData.shippingAddress,
    shippingAddressDetail: inspectionData.shippingAddressDetail,
    bankName: inspectionData.bankName,
    bankAccount: inspectionData.bankAccount,
  }

  // request로 JSON 데이터 문자열화하여 추가
  formData.append('request', new Blob([JSON.stringify(jsonData)], { type: 'application/json' }))

  // 파일 데이터 추가
  inspectionData.uploadedFiles.forEach((fileWrapper) => {
    formData.append('files', fileWrapper.file)
  })

  // API 호출
  const requestPromise = apiClient.post('/inspections', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  })

  return unwrap(requestPromise).catch(rethrow)
}
