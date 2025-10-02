import {apiClient} from './index'

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
