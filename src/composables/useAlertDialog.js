import { ref } from 'vue';

// 애플리케이션 전체에서 공유될 상태
const isVisible = ref(false);
const title = ref('');
const message = ref('');

const showAlert = (newTitle, newMessage) => {
  title.value = newTitle;
  message.value = newMessage;
  isVisible.value = true;
};

export function useAlertDialog() {
  return {
    isVisible,
    title,
    message,
    showAlert,
  };
}