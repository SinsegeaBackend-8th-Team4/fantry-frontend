import { defineStore } from 'pinia'

/** 관리자용 검수 관련 Store */
export const useAdminInspectionStore = defineStore('adminInspection', () => {
  // 상태 라벨 매핑
  const statusLabel = {
    DRAFT: '작성 중',
    SUBMITTED: '1차 제출',
    FIRST_REVIEWED: '1차 승인',
    OFFLINE_INSPECTING: '2차 검수 중',
    COMPLETED: '검수 완료',
    REJECTED: '반려',
  }

  // 상태 라벨 getter
  const getStatusLabel = (status) => {
    if (!status) return '-'
    const key = status.toUpperCase().trim()
    console.log(key + ' : ' + statusLabel[key])

    return statusLabel[key] || key
  }

  return {
    statusLabel,
    getStatusLabel,
  }
})
