// useDataTableColumns.js
// DataTables 컬럼 헬퍼 (포맷 공통화)

export const currencyCol = (data, title = '금액') => ({
  data,
  title,
  className: 'text-end',
  render: (v) => (v ?? 0).toLocaleString() + '원',
})

export const dateTimeCol = (data, title = '일시') => ({
  data,
  title,
  render: (v) => (v ? new Date(v).toLocaleString() : '-'),
})

export const dateCol = (data, title = '일자') => ({
  data,
  title,
  render: (v) => (v ? v.split('T')[0] : '-'),
})

export const textCol = (data, title) => ({ data, title })
