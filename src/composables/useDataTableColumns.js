// useDataTableColumns.js
// DataTables 컬럼 헬퍼 (포맷 공통화)

// currencyCol: 금액 표시용 (천단위 구분 + '원' 단위)
export const currencyCol = (data, title = '금액') => ({
  data,
  title,
  className: 'text-end',
  render: (v) => (v ?? 0).toLocaleString() + '원',
})

// dateTimeCol: 일시 표시 (로컬 기준 시분초 포함)
export const dateTimeCol = (data, title = '일시') => ({
  data,
  title,
  render: (v) => (v ? new Date(v).toLocaleString() : '-'),
})

// dateCol: 일자만 표시 (예: yyyy-mm-dd)
export const dateCol = (data, title = '일자') => ({
  data,
  title,
  render: (v) => (v ? v.split('T')[0] : '-'),
})

// textCol: 기본 텍스트 표시
export const textCol = (data, title) => ({ data, title })
