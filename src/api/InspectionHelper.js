/**  검수 파트 API 유틸리티 JS */

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
  const e = new Error(r?.message || r?.error || err?.response?.statusText || err?.message || '요청 처리 중 오류가 발생했습니다.')
  e.code = r?.code
  e.status = err?.response?.status
  e.details = r?.details || null
  throw e
}
