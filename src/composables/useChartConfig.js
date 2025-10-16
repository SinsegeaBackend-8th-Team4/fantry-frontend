// useChartConfig.js
// 차트 색상 팔레트 및 dataset 헬퍼
export function useChartPalette() {
  return {
    primary: '#4e73df',
    success: '#1cc88a',
    warning: '#f6c23e',
    danger: '#e74a3b',
    neutral: '#858796',
    info: '#36b9cc' // 추가: Bootstrap info color
  };
}

export function makeLineDataset(label, data, color) {
  return {
    label,
    data,
    fill: true,
    tension: .35,
    borderColor: color,
    backgroundColor: color + '33',
    pointRadius: 3,
    pointHoverRadius: 5
  };
}
