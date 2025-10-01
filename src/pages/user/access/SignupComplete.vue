<script setup>
  import { useRouter } from 'vue-router'

    const router = useRouter()

    const goMain = () => {
        router.push('/')
    }

    const goLogin = () => {
        router.push('/login')
    }
</script>
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
        <label>가입 완료</label>
      </div>
    </div>
    <!--Header End-->

    <!-- 안내문 -->
    <h1>가입완료</h1>
    
    <!--Content Start-->
    <div class="content">
        <div class="info">
            <img src="../../../../public/images/signup_complete_icon.png"/>
            <h1>회원가입이 완료되었습니다.</h1>
            <h4>FANTRY 포털사이트에 회원가입이 정상적으로 처리되었습니다.</h4>
        </div>
        <div class="group-btn">
            <button type="button" @click="goMain">메인으로 이동하기</button>
            <button type="button" @click="goLogin">로그인하기</button>
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
    color: #2f4dca;
    font-weight: bold;
    }

    /* 기본 레이아웃 */
    .content-page {
    display: flex;
    flex-direction: column;
    align-items: center;
    font-family: 'Pretendard', sans-serif;
    background-color: #f9faff;
    min-height: 100vh;
    padding: 0;
    margin: 0;
    }

    /* 배너 */
    .banner {
    width: 100%;
    background-color: #eef0fc;
    display: flex;
    justify-content: center;
    align-items: center;
    padding: 40px 0;
    border-bottom: 1px solid #d6dfff;
    }
    .banner img {
    height: 70px;
    }

    /* 헤더 (단계 표시) */
    .header {
    display: flex;
    justify-content: center;
    align-items: center;
    margin: 32px 0;
    font-size: 15px;
    font-weight: 500;
    gap: 24px;
    }
    .header div {
    display: flex;
    flex-direction: column;
    align-items: center;
    color: #bbb;
    transition: color 0.3s;
    }
    .header div label:first-child {
    font-weight: bold;
    margin-bottom: 4px;
    }
    .header-done.active,
    .header-form.active,
    .header-term.active {
    color: #2f4dca;
    }
    .header > label {
    color: #ccc;
    font-size: 18px;
    margin: 0 4px;
    }

    /* 안내문 */
    .content h1:first-of-type {
    font-size: 28px;
    color: #333;
    margin-bottom: 16px;
    }

    /* Content */
    .content {
    display: flex;
    flex-direction: column;
    align-items: center;
    text-align: center;
    max-width: 500px;
    padding: 24px;
    background: #ffffff;
    border-radius: 12px;
    box-shadow: 0 4px 16px rgba(0, 0, 0, 0.05);
    }

    .content .info img {
    width: 80px;
    margin-bottom: 20px;
    }

    .content .info h1 {
    font-size: 22px;
    color: #2f4dca;
    margin-bottom: 12px;
    }

    .content .info h4 {
    font-size: 15px;
    color: #555;
    font-weight: 400;
    line-height: 1.5;
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
    background-color: #2f4dca;
    color: #fff;
    font-size: 15px;
    font-weight: 500;
    cursor: pointer;
    transition: background-color 0.3s, transform 0.2s;
    }

    .group-btn button:hover {
    background-color: #233ab4;
    transform: translateY(-2px);
    }

    .group-btn button:nth-child(2) {
    background-color: #fff;
    color: #2f4dca;
    border: 1px solid #2f4dca;
    }

    .group-btn button:nth-child(2):hover {
    background-color: #f1f3ff;
    }
</style>