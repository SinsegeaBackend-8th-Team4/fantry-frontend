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

// 카테고리별 체크리스트 조회
export const getChecklistsByCategory = (goodsCategoryId) =>
  unwrap(apiClient.get('/checklists', { params: { goodsCategoryId } })).catch(rethrow)

// 카테고리별 가격 기준가 조회
export const getPriceBaselineByCategory = (goodsCategoryId) =>
  unwrap(apiClient.get('/checklists/pricing/baseline', { params: { goodsCategoryId } })).catch(
    rethrow,
  )

// 예상가 계산
export const estimatePrice = (goodsCategoryId, selections) =>
  unwrap(
    apiClient.post('/checklists/pricing/estimate', selections ?? {}, {
      params: { goodsCategoryId },
    }),
  ).catch(rethrow)
