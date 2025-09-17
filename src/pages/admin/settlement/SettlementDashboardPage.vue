<template>
  <div>
    <!-- 페이지 제목 -->
    <div class="d-sm-flex align-items-center justify-content-between mb-4">
      <h1 class="h3 mb-0 text-gray-800">정산관리 요약</h1>
      <a href="#" class="d-none d-sm-inline-block btn btn-sm btn-primary shadow-sm">
        <i class="fas fa-download fa-sm text-white-50"></i> 정산 보고서 생성
      </a>
    </div>

    <!-- 요약 카드 섹션 -->
    <div class="row">
      <SummaryCard 
        title="이번 달 정산액" 
        value="₩40,000,000" 
        icon="fa-won-sign" 
        border-color="primary" 
      />
      <SummaryCard 
        title="정산 대기 건수" 
        value="18" 
        icon="fa-comments-dollar" 
        border-color="warning" 
      />
    </div>

    <!-- 차트 섹션 -->
    <div class="row">
      <div class="col-lg-7">
        <div class="card shadow mb-4">
          <div class="card-header py-3">
            <h6 class="m-0 font-weight-bold text-primary">주별 정산 현황</h6>
          </div>
          <div class="card-body">
            <div class="chart-bar" style="height: 320px;">
              <canvas ref="settlementChart"></canvas>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { onMounted, ref } from 'vue';
import { Chart, registerables } from 'chart.js';
import SummaryCard from '@/components/common/molecules/admin/SummaryCard.vue';

Chart.register(...registerables);

const settlementChart = ref(null);

onMounted(() => {
  if (settlementChart.value) {
    const ctx = settlementChart.value.getContext('2d');
    new Chart(ctx, {
      type: 'bar', // 막대 차트로 변경
      data: {
        labels: ["1주차", "2주차", "3주차", "4주차"],
        datasets: [{
          label: "주간 정산액",
          backgroundColor: "#4e73df",
          hoverBackgroundColor: "#2e59d9",
          borderColor: "#4e73df",
          data: [4215000, 5312000, 7825000, 9253000],
        }],
      },
      options: {
        maintainAspectRatio: false,
        layout: {
          padding: { left: 10, right: 25, top: 25, bottom: 0 }
        },
        scales: {
          y: {
            ticks: {
              callback: function(value) {
                return '₩' + new Intl.NumberFormat('ko-KR').format(value);
              }
            }
          }
        },
        plugins: {
          legend: { display: false }
        }
      }
    });
  }
});
</script>
