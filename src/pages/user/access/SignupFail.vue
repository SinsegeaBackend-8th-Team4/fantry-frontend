<script setup></script>
<template>
  <div class="content-page">
    <!--Banner Start-->
    <div class="banner">
      <img src="../../../../public/images/fantry_logo.png" />
    </div>
    <!--Banner End-->
    
    <!--Header Start-->
    <div class="header">
      <div class="header-term">
        <label>01</label>
        <label>약관 동의</label>
      </div>
      <label>></label>
      <div class="header-form">
        <label>02</label>
        <label>회원 가입</label>
      </div>
      <label>></label>
      <div class="header-done active">
        <label>03</label>
        <label>가입 실패</label>
      </div>
    </div>
    <!--Header End-->

    <!-- 안내문 -->
    <h1>가입실패</h1>
    
    <!--Content Start-->
    <div class="content">
        <div class="info">
            <img src="../../../../public/images/signup_fail_icon.png"/>
            <h1>회원가입시 오류가 발생하였습니다.</h1>
            <h4>앗, 회원가입이 완료되지 않았어요. 다시 한 번 시도해주세요.</h4>
            <h4>계속 문제가 발생하면 고객센터로 문의해주세요.</h4>

            <h5>고객센터: 010-1234-5678 | 담당자: 홍길동</h5>
        </div>
        <div class="group-btn">
            <button type="button">메인으로 이동하기</button>
            <button type="button">회원가입</button>
        </div>
    </div>
    <!--Content End-->
  </div>
</template>
<style scoped>
  /* 기본 레이아웃 */
  .content-page {
    display: flex;
    flex-direction: column;
    align-items: center;
    font-family: 'Pretendard', sans-serif;
    background-color: #fff;
    min-height: 100vh;
    padding: 0;
    margin: 0;
  }

  /* 배너 */
  .banner {
    width: 100%;
    background-color: #f2f3fb;
    display: flex;
    justify-content: center;
    align-items: center;
    padding: 32px 0;
    border-radius: 0 0 12px 12px;
  }
  .banner img {
    height: 80px;
  }

  /* 헤더 (단계 표시) */
  .header {
    display: flex;
    justify-content: center;
    align-items: center;
    margin: 24px 0;
    font-size: 16px;
    font-weight: 500;
    gap: 16px;
  }
  .header div {
    display: flex;
    flex-direction: column;
    align-items: center;
    color: #999;
  }
  .header div label:first-child {
    font-weight: bold;
  }
  .header-done.active {
    color: #d32f2f;
    font-weight: bold;
  }

  /* 안내문 타이틀 */
  .content h1:first-of-type {
    font-size: 28px;
    color: #d32f2f;
    margin-bottom: 16px;
  }

  /* Content 본문 */
  .content {
    display: flex;
    flex-direction: column;
    align-items: center;
    text-align: center;
    max-width: 560px;
    padding: 24px;
    background: #ffffff;
    border-radius: 12px;
    box-shadow: 0 4px 16px rgba(211, 47, 47, 0.1);
  }

  .content .info img {
    width: 80px;
    margin-bottom: 20px;
  }

  .content .info h1 {
    font-size: 22px;
    color: #b71c1c;
    margin-bottom: 12px;
  }

  .content .info h4 {
    font-size: 15px;
    color: #555;
    font-weight: 400;
    margin: 4px 0;
    line-height: 1.5;
  }

  .content .info h5 {
    font-size: 14px;
    color: #888;
    margin-top: 16px;
    font-weight: 400;
  }

  /* 버튼 그룹 */
  .group-btn {
    display: flex;
    gap: 16px;
    margin-top: 32px;
    flex-wrap: wrap;
    justify-content: center;
  }

  .group-btn button {
    padding: 12px 24px;
    border: none;
    border-radius: 8px;
    background-color: #d32f2f;
    color: #fff;
    font-size: 15px;
    font-weight: 500;
    cursor: pointer;
    transition: background-color 0.3s, transform 0.2s;
  }

  .group-btn button:hover {
    background-color: #b71c1c;
    transform: translateY(-2px);
  }

  .group-btn button:nth-child(2) {
    background-color: #fff;
    color: #d32f2f;
    border: 1px solid #d32f2f;
  }

  .group-btn button:nth-child(2):hover {
    background-color: #fff0f0;
  }
</style>