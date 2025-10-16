import { ref } from 'vue';

const alertMessage = ref('');
const alertType = ref('info'); // 'info', 'success', 'warning', 'danger'
const isVisible = ref(false);

export function useAlert() {
  const showAlert = (message, type = 'info', duration = 3000) => {
    alertMessage.value = message;
    alertType.value = type;
    isVisible.value = true;

    // For demonstration, we'll just log to console.
    // In a real app, this would trigger a UI alert component.
    console.log(`Alert (${type}): ${message}`);

    setTimeout(() => {
      isVisible.value = false;
    }, duration);
  };

  const hideAlert = () => {
    isVisible.value = false;
  };

  return {
    alertMessage,
    alertType,
    isVisible,
    showAlert,
    hideAlert,
  };
}