<template>
  <div class="customer-service-home-page">
    <h1 class="h3 mb-4 text-gray-800">고객센터</h1>

    <div class="row">
      <div class="col-md-4 mb-4">
        <div class="card shadow-sm h-100">
          <div class="card-body text-center">
            <i class="fas fa-bullhorn fa-3x text-primary mb-3"></i>
            <h5 class="card-title">공지사항</h5>
            <p class="card-text">Fantry의 새로운 소식과 중요 공지를 확인하세요.</p>
            <router-link :to="{ name: 'UserNoticeList' }" class="btn btn-primary">바로가기</router-link>
          </div>
        </div>
      </div>

      <div class="col-md-4 mb-4">
        <div class="card shadow-sm h-100">
          <div class="card-body text-center">
            <i class="fas fa-question-circle fa-3x text-success mb-3"></i>
            <h5 class="card-title">자주 묻는 질문</h5>
            <p class="card-text">궁금한 점이 있다면 FAQ에서 찾아보세요.</p>
            <router-link :to="{ name: 'UserFaqList' }" class="btn btn-success">바로가기</router-link>
          </div>
        </div>
      </div>

      <div class="col-md-4 mb-4">
        <div class="card shadow-sm h-100">
          <div class="card-body text-center">
            <i class="fas fa-headset fa-3x text-info mb-3"></i>
            <h5 class="card-title">1:1 문의</h5>
            <p class="card-text">해결되지 않는 문제는 1:1 문의를 이용해주세요.</p>
            <router-link :to="{ name: 'UserInquiryCreate' }" class="btn btn-info">바로가기</router-link>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
// No script needed for this simple landing page
</script>

<style scoped>
.customer-service-home-page {
  padding: 20px;
}
.card {
  border: none;
  border-radius: 10px;
  transition: transform 0.2s ease-in-out;
}
.card:hover {
  transform: translateY(-5px);
}
.card-title {
  font-weight: bold;
  margin-bottom: 15px;
}
.card-text {
  color: #6c757d;
  margin-bottom: 20px;
}
.btn {
  width: 100%;
}
</style>