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
  <div class="login-page">
    <!--Login Header Start-->
    <div class="login-header">
      <h1>WELCOME! FANTRY</h1>
      <h4>팬들끼리 만드는 굿즈 유니버스! 팬트리에 오신 걸 환영합니다.</h4>
    </div>
    <!--Login Header End-->

    <!--Content Start-->
    <div class="content">
      <div class="info">
        <img src="../../../../public/images/signup_fail_icon.png" alt="로그인 실패" class="fail-icon"/>
        <h1>로그인할 수 없습니다.</h1>
        <h4>아이디 또는 비밀번호가 올바르지 않습니다.</h4>
        <h4>같은 문제가 계속된다면 고객센터로 문의해주세요.</h4>

        <h5>고객센터: 010-1234-5678 | 담당자: 홍길동</h5>
      </div>
      <div class="group-btn">
        <button type="button" @click="goMain">메인으로 이동</button>
        <button type="button" @click="goLogin">로그인 다시하기</button>
      </div>
    </div>
    <!--Content End-->
  </div>
</template>
<style scoped>
    /* 페이지 기본 */
    .login-page {
    background: #fff;
    min-height: 100vh;
    display: flex;
    flex-direction: column;
    align-items: center;
    }

    /* 헤더 */
    .login-header {
    width: 100%;
    padding: 40px 20px;
    text-align: center;
    color: #fff;
    background: linear-gradient(52deg, rgba(60, 77, 255, 1) 0%, rgba(92, 123, 255, 1) 50%, rgba(191, 212, 255, 1) 100%);
    }

    .login-header h1 {
    font-size: 28px;
    font-weight: 700;
    margin-bottom: 12px;
    color: #fff;
    }

    .login-header h4 {
    font-size: 14px;
    font-weight: 400;
    color: #fff
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