import apiClient from './index'
// 응답 언래핑: {success, data} -> data 만 반환
const unwrap = (p) => {
  return p.then((res) => {
    const body = res?.data
    if (body && body.success === true && Object.prototype.hasOwnProperty.call(body, 'data')) {
      return body.data
    }
    return body
  })
}

// 에러 정규화: common ErrorResponse -> Error(message) with extras
const rethrow = (err) => {
  const r = err?.response?.data
  const e = new Error(
    r?.message ||
      r?.error ||
      err?.response?.statusText ||
      err?.message ||
      '요청 처리 중 오류가 발생했습니다.',
  )
  e.code = r?.code
  e.status = err?.response?.status
  e.details = r?.details || null
  throw e
}

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
  const requestPromise = apiClient.post('/inspection', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  })

  return unwrap(requestPromise).catch(rethrow)
}
