// tableFormatters.js
// 공통 포맷 함수 (필요 시 확장)

export function formatCurrency(v) {
  return (v ?? 0).toLocaleString() + '원';
}

export function formatDateTime(v) {
  return v ? new Date(v).toLocaleString() : '-';
}

export function productNameFormatter(value) {
    if (!value) return '-';
    // XSS 방지를 위해 HTML을 이스케이프 처리합니다.
    const escapedValue = value.replace(/[&<>"']/g, function(match) {
        return {
            '&': '&amp;',
            '<': '&lt;',
            '>': '&gt;',
            '"': '&quot;',
            "'": '&#39;'
        }[match];
    });
    return `<div class="text-truncate" title="${escapedValue}">${escapedValue}</div>`;
}
