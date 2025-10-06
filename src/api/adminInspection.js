import apiClient from './index'
import { unwrap, rethrow } from './InspectionHelper'

/**
 * 상태별 검수 목록 조회
 * @param {object} params - 페이지네이션, 정렬, 필터링 파라미터
 * @returns
 */
export const getInspectionsByStatus = (params) => {
  const queryParams = {
    status: params.status || 'SUBMITTED',
    page: params.page - 1,
    size: params.size,
    sort: params.sort,
    keyword: params.keyword,
    goodsCategoryId: params.goodsCategoryId,
    artistId: params.artistId,
    startDate: params.startDate,
    endDate: params.endDate,
  }
  const requestPromise = apiClient.get('/admin/inspections', { params: queryParams })
  return unwrap(requestPromise).catch(rethrow)
}
