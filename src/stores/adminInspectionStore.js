import { defineStore } from 'pinia'

/** 관리자용 검수 관련 Store */
export const useAdminInspectionStore = defineStore('adminInspection', () => {
  // 상태 라벨 매핑
  const statusLabel = new Map([
    ['DRAFT', '작성 중'],
    ['SUBMITTED', '1차 제출'],
    ['FIRST_REVIEWED', '1차 승인'],
    ['FIRST_REJECTED', '1차 반려'],
    ['OFFLINE_INSPECTING', '2차 검수 중'],
    ['COMPLETED', '검수 완료'],
    ['SECOND_REJECTED', '반려'],
  ])

  // 상태 배지 매핑
  const statusBadge = new Map([
    ['SUBMITTED', 'bg-warning text-dark'],
    ['FIRST_REVIEWED', 'bg-success'],
    ['FIRST_REJECTED', 'bg-danger'],
    ['OFFLINE_INSPECTING', 'bg-info'],
    ['COMPLETED', 'bg-primary'],
    ['SECOND_REJECTED', 'bg-danger'],
  ])

  // getter
  const getStatusLabel = (status) => statusLabel.get(status?.toUpperCase()?.trim()) ?? '-'
  const getStatusBadge = (status) => statusBadge.get(status?.toUpperCase()?.trim()) ?? 'bg-secondary'

  return { statusLabel, statusBadge, getStatusLabel, getStatusBadge }
})
