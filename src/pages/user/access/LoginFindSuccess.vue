<script setup>
  import { useRoute, useRouter } from 'vue-router';
  import { ref, onMounted } from 'vue';

  const route = useRoute();
  const router = useRouter();
  const foundEmail = ref('');

  onMounted(()=>{
    if(route.params.foundEmail){
      foundEmail.value = route.params.foundEmail;
    }
  });

  const goLogin = ()=>{
    router.push('/login');
  }
</script>
<template>
  <div class="content-page">
    <!--Login Header Start-->
    <div class="login-header">
      <h1>WELCOME! FANTRY</h1>
      <h4>팬들끼리 만드는 굿즈 유니버스! 팬트리에 오신 걸 환영합니다.</h4>
    </div>
    <!--Login Header End-->
    
    <!--Content Start-->
    <div class="login-find-result-content">
      <div class="result-box">
        <p class="result-message">회원님의 아이디는 다음과 같습니다.</p>
        <div class="found-id-display">
          <span>{{foundEmail}}</span>
        </div>
        <button class="login-button" @click="goLogin">로그인</button>
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

  /* 전체 컨텐츠 영역 */
  .login-find-result-content {
    background: #fff;
    width: 100%;
    max-width: 400px;
    margin: 0 auto;
    padding: 40px 20px;
    border-radius: 0 0 8px 8px;
    display: flex;
    flex-direction: column;
    gap: 20px;
  }

  .result-box {
    background-color: #f7f9fc;
    border: 1px solid #e0e6ed;
    border-radius: 8px;
    padding: 40px 20px;
    width: 100%;
    text-align: center;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
  }

  .result-message {
    font-size: 16px;
    color: #555;
    margin-bottom: 20px;
    font-weight: 500;
  }

  .found-id-display {
    background-color: #fff;
    border: 1px solid #dcdfe6;
    border-radius: 4px;
    padding: 15px 10px;
    font-size: 20px;
    font-weight: 700;
    color: #333;
    letter-spacing: 1px;
    margin-bottom: 30px;
  }

  .login-button {
    width: 100%;
    padding: 15px;
    border: none;
    border-radius: 5px;
    background-color: #5c7bff;
    color: #fff;
    font-size: 16px;
    font-weight: 600;
    cursor: pointer;
    transition: background-color 0.3s ease;
  }

  .login-button:hover {
    background-color: #4b67ff;
  }

  .login-button:active {
    background-color: #3c52e0;
  }
</style>