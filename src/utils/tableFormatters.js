// tableFormatters.js
// 공통 포맷 함수 (필요 시 확장)

export function formatCurrency(v) {
  return (v ?? 0).toLocaleString() + '원';
}

export function formatDateTime(v) {
  return v ? new Date(v).toLocaleString() : '-';
}

/**
 * 데이터 테이블 컬럼 정의를 생성하는 헬퍼 함수들
 */

// 기본 컬럼 객체를 생성하는 내부 함수
function createCol(data, title, options = {}) {
  return {
    data,
    title,
    ...options,
  };
}

/**
 * 일반 텍스트 컬럼을 생성합니다.
 * @param {string} data - 데이터 키
 * @param {string} title - 컬럼 제목
 * @param {object} options - 추가 옵션
 */
export function textCol(data, title, options = {}) {
  return createCol(data, title, options);
}

/**
 * 날짜/시간 포맷을 사용하는 컬럼을 생성합니다.
 * @param {string} data - 데이터 키
 * @param {string} title - 컬럼 제목
 * @param {object} options - 추가 옵션
 */
export function dateTimeCol(data, title, options = {}) {
  return createCol(data, title, {
    ...options,
    render: (val) => formatDateTime(val),
  });
}

/**
 * 뱃지 형태로 표시되는 컬럼을 생성합니다.
 * @param {string} data - 데이터 키
 * @param {string} title - 컬럼 제목
 * @param {object} options - 추가 옵션
 */
export function badgeCol(data, title, options = {}) {
  // status 값에 따라 다른 뱃지 스타일을 적용하는 예시
  const render = (val) => {
    let badgeClass = 'badge-secondary'; // 기본값
    if (val === 'PUBLISHED' || val === '답변 완료') {
      badgeClass = 'badge-success';
    } else if (val === 'DRAFT' || val === '접수') {
      badgeClass = 'badge-warning';
    } else if (val === 'ARCHIVED') {
      badgeClass = 'badge-danger';
    }
    return `<span class="badge ${badgeClass}">${val}</span>`;
  };

  return createCol(data, title, {
    ...options,
    render,
  });
}