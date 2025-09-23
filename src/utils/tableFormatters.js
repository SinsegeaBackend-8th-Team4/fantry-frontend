// tableFormatters.js
// 공통 포맷 함수 (필요 시 확장)

export function formatCurrency(v) {
  return (v ?? 0).toLocaleString() + '원';
}

export function formatDateTime(v) {
  return v ? new Date(v).toLocaleString() : '-';
}
