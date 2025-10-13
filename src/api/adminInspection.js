import { apiClient } from './index'
import { unwrap, rethrow } from './InspectionHelper'

/**
 * 상태별 검수 목록 조회
 * @param {object} params - 페이지네이션, 정렬, 필터링 파라미터
 * @returns
 */
export const getInspectionsByStatus = (params) => {
  const queryParams = {
    statuses: params.statuses,
    page: params.page - 1,
    size: params.size,
    sort: params.sort,
    keyword: params.keyword,
    goodsCategoryId: params.goodsCategoryId,
    artistId: params.artistId,
    startDate: params.startDate,
    endDate: params.endDate,
  }

  const requestPromise = apiClient.get('/admin/inspections', {
    params: queryParams,
    // Axios가 배열을 올바르게 처리하도록 paramsSerializer 옵션 추가
    paramsSerializer: (params) => {
      const qs = new URLSearchParams()
      for (const key in params) {
        if (Array.isArray(params[key])) {
          params[key].forEach((value) => qs.append(key, value))
        } else if (params[key] !== undefined && params[key] !== null && params[key] !== '') {
          qs.append(key, params[key])
        }
      }
      return qs.toString()
    },
  })
  return unwrap(requestPromise).catch(rethrow)
}

/**
 * 1차 검수 상세 조회
 * @param {number} productInspectionId
 * @returns
 */
export const getOnlineInspectionDetail = (productInspectionId) => unwrap(apiClient.get(`/admin/inspections/online/${productInspectionId}`)).catch(rethrow)

/**
 * 1차 검수 승인
 * @param {number} productInspectionId
 */
export const approveOnlineInspection = (productInspectionId) => unwrap(apiClient.post(`/admin/inspections/${productInspectionId}/firstApprove`, null)).catch(rethrow)

/**
 * 1차 검수 반려
 * @param {number} productInspectionId
 * @param {object} body { rejectionReason: string }
 */
export const rejectOnlineInspection = (productInspectionId, body) => unwrap(apiClient.post(`/admin/inspections/${productInspectionId}/firstReject`, body)).catch(rethrow)

/**
 * 2차 검수 상세 조회
 * @param {number} productInspectionId
 * @returns
 */
export const getOfflineInspectionDetail = (productInspectionId) => unwrap(apiClient.get(`/admin/inspections/offline/${productInspectionId}`)).catch(rethrow)

/** 2차 승인 */
export const approveOfflineInspection = (productInspectionId, body) => unwrap(apiClient.post(`/admin/inspections/${productInspectionId}/secondApprove`, body)).catch(rethrow)

/** 2차 검수 반려 */
export const rejectOfflineInspection = (productInspectionId, body) => unwrap(apiClient.post(`/admin/inspections/${productInspectionId}/secondReject`, body)).catch(rethrow)
