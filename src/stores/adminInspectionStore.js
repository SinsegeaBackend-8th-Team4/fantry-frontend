import { defineStore } from 'pinia'

/** 관리자용 검수 관련 Store */
export const useAdminInspectionStore = defineStore('adminInspection', () => {
  // 상태 라벨 매핑
  const statusLabel = new Map([
    ['DRAFT', '작성 중'],
    ['SUBMITTED', '온라인 제출'],
    ['ONLINE_APPROVED', '1차 승인'],
    ['ONLINE_REJECTED', '1차 반려'],
    ['OFFLINE_INSPECTING', '2차 진행'],
    ['OFFLINE_REJECTED', '최종 반려'],
    ['COMPLETED', '최종 승인'],
  ])

  // 상태 배지 매핑
  const statusBadge = new Map([
    ['SUBMITTED', 'bg-warning text-dark'],
    ['ONLINE_APPROVED', 'bg-success'],
    ['ONLINE_REJECTED', 'bg-danger'],
    ['OFFLINE_INSPECTING', 'bg-info'],
    ['OFFLINE_REJECTED', 'bg-danger'],
    ['COMPLETED', 'bg-primary'],
  ])

  // getter
  const getStatusLabel = (status) => statusLabel.get(status?.toUpperCase()?.trim()) ?? '-'
  const getStatusBadge = (status) => statusBadge.get(status?.toUpperCase()?.trim()) ?? 'bg-secondary'

  return { statusLabel, statusBadge, getStatusLabel, getStatusBadge }
})
