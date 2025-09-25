<template>
  <div>
    <h3>전체 대시보드 요약</h3>
    <p>이곳에 모든 관리 기능에 대한 핵심 지표들을 요약하여 보여줍니다.</p>
    <!-- 예시: 전체 매출, 신규 가입자 수, 활성 경매 수 등 -->
    <div class="row">
      <div class="col-xl-3 col-md-6 mb-4">
        <div class="card border-left-success shadow h-100 py-2">
          <div class="card-body">
            <div class="row no-gutters align-items-center">
              <div class="col mr-2">
                <div class="text-xs font-weight-bold text-success text-uppercase mb-1">
                  전체 매출 (연간)</div>
                <div class="h5 mb-0 font-weight-bold text-gray-800">$215,000</div>
              </div>
              <div class="col-auto">
                <i class="fas fa-dollar-sign fa-2x text-gray-300"></i>
              </div>
            </div>
          </div>
        </div>
      </div>
      <!-- 추가적인 요약 카드들... -->
    </div>
  </div>
</template>

<script setup>
// 이 컴포넌트에서만 사용할 로직을 여기에 작성합니다.
// 예: 전체 요약 데이터를 API로 가져오는 로직
</script>
