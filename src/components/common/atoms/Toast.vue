<template>
  <div class="custom-toast" @click="onClick">
    <h4>{{ title }}</h4>
    <p>{{ message }}</p>
  </div>
</template>

<script setup>
/**
 * 커스텀 토스트 알림 컴포넌트
 * vue-toastification 라이브러리와 함께 사용됩니다.
 */

defineProps({
  /**
   * 토스트 제목
   */
  title: {
    type: String,
    required: true,
  },
  /**
   * 토스트 메시지 본문
   */
  message: {
    type: String,
    required: true,
  },
  /**
   * 토스트 클릭 시 실행될 콜백 함수
   */
  onClick: {
    type: Function,
    required: false,
    default: () => {},
  },
})
</script>

<style scoped>
.custom-toast {
  padding: 1rem;
}

h4 {
  margin: 0 0 0.5rem 0;
  color: #ffffff;
  font-weight: 600;
}

p {
  margin: 0;
  color: #ffffff;
  opacity: 0.9;
}
</style>
