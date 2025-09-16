<template>
  <div>
    <div class="d-sm-flex align-items-center justify-content-between mb-4">
        <h1 class="h3 mb-0 text-gray-800">Dashboard</h1>
        <a href="#" class="d-none d-sm-inline-block btn btn-sm btn-primary shadow-sm"><i
                class="fas fa-download fa-sm text-white-50"></i> Generate Report</a>
    </div>

    <div class="row">

        <div class="col-xl-3 col-md-6 mb-4">
            <div class="card border-left-primary shadow h-100 py-2">
                <div class="card-body">
                    <div class="row no-gutters align-items-center">
                        <div class="col mr-2">
                            <div class="text-xs font-weight-bold text-primary text-uppercase mb-1">
                                Earnings (Monthly)</div>
                            <div class="h5 mb-0 font-weight-bold text-gray-800">$40,000</div>
                        </div>
                        <div class="col-auto">
                            <i class="fas fa-calendar fa-2x text-gray-300"></i>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        </div>

    <div class="row">

        <div class="col-xl-8 col-lg-7">
            <div class="card shadow mb-4">
                <div class="card-header py-3">
                    <h6 class="m-0 font-weight-bold text-primary">Earnings Overview</h6>
                </div>
                <div class="card-body">
                    <div class="chart-area">
                        <canvas id="myAreaChart"></canvas>
                    </div>
                </div>
            </div>
        </div>

        </div>
  </div>
</template>

<script setup>
import { onMounted } from 'vue';

onMounted(() => {
  // 이 페이지가 화면에 렌더링된 후, 차트(Chart.js)를 초기화하는 로직이 필요합니다.
  // SB Admin 2 템플릿의 index.html 맨 아래를 보면 chart-area-demo.js 와 
  // chart-pie-demo.js를 불러오는 부분이 있습니다. 
  // 이 스크립트들의 내용을 여기에 맞게 적용하거나, 전역으로 로드된
  // sb-admin-2.min.js가 이 역할을 대신해주는지 확인해야 합니다.
  
  // 지금은 전역 스크립트가 처리해줄 것으로 기대하고 일단 비워둡니다.
  // 만약 차트가 그려지지 않는다면, 이 부분에 차트 초기화 코드를 추가해야 합니다.
});
</script>

<style scoped>
/* 이 대시보드 페이지에서만 사용할 CSS를 여기에 작성할 수 있습니다. */
</style>