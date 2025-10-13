import { apiClient } from './index'
import { unwrap, rethrow } from './InspectionHelper'

// 카테고리별 체크리스트 조회
export const getChecklistsByCategory = (goodsCategoryId) => unwrap(apiClient.get('/checklists', { params: { goodsCategoryId } })).catch(rethrow)

// 카테고리별 가격 기준가 조회
export const getPriceBaselineByCategory = (goodsCategoryId) => unwrap(apiClient.get('/pricing/baseline', { params: { goodsCategoryId } })).catch(rethrow)

// 예상가 계산
export const estimatePrice = (goodsCategoryId, selections) => unwrap(apiClient.post('/pricing/estimate', selections ?? {}, { params: { goodsCategoryId } })).catch(rethrow)

// 평균가 계산
export const getMarketAvgPrice = (goodsCategoryId, artistId, albumId) => {
  const params = { goodsCategoryId, artistId, albumId }
  return unwrap(apiClient.get('/pricing/marketAverage', { params })).catch(rethrow)
}
