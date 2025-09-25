<template>
  <div class="common-editor">
    <QuillEditor
      ref="quillEditorRef"
      v-model:content="content"
      :options="editorOptions"
      content-type="html"
      theme="snow"
      toolbar="full"
    />
  </div>
</template>

<script setup>
import { ref, watch, onMounted } from 'vue';
import { QuillEditor } from '@vueup/vue-quill';
import '@vueup/vue-quill/dist/vue-quill.snow.css';

// v-model을 위한 props와 emit 정의
const props = defineProps({
  modelValue: {
    type: String,
    default: '',
  },
});
const emit = defineEmits(['update:modelValue']);

const quillEditorRef = ref(null);
const content = ref(props.modelValue);

// 내부 content의 변경을 감지하여 부모 컴포넌트로 emit
watch(content, (newContent) => {
  emit('update:modelValue', newContent);
});

// 부모로부터 내려오는 modelValue의 변경을 감지하여 내부 content에 반영
watch(() => props.modelValue, (newModelValue) => {
  if (newModelValue !== content.value) {
    content.value = newModelValue;
  }
});

// 에디터 옵션 설정
const editorOptions = {
  modules: {
    toolbar: [
      [{ 'header': [1, 2, 3, 4, 5, 6, false] }],
      ['bold', 'italic', 'underline', 'strike'],
      ['blockquote', 'code-block'],
      [{ 'list': 'ordered'}, { 'list': 'bullet' }],
      [{ 'script': 'sub'}, { 'script': 'super' }],
      [{ 'indent': '-1'}, { 'indent': '+1' }],
      [{ 'direction': 'rtl' }],
      [{ 'size': ['small', false, 'large', 'huge'] }],
      [{ 'color': [] }, { 'background': [] }],
      [{ 'font': [] }],
      [{ 'align': [] }],
      ['clean'],
      ['link', 'image', 'video']
    ],
    // TODO: 이미지 업로드 핸들러 추가
    // handlers: {
    //   image: imageHandler,
    // },
  },
  placeholder: '내용을 입력해주세요...',
  readOnly: false,
};

// onMounted(() => {
//   if (quillEditorRef.value) {
//     const quill = quillEditorRef.value.getQuill();
//     // Quill 인스턴스에 직접 접근해야 할 때 사용
//   }
// });
</script>

<style>
/* Quill Editor의 높이 및 스타일 조정 */
.common-editor .ql-editor {
  min-height: 300px;
}
</style>
