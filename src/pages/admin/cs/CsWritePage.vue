<template>
  <div>
    <h1 class="h3 mb-4 text-gray-800">CS 게시글 작성 (Vue-Quill 샘플)</h1>

    <div class="card shadow mb-4">
      <div class="card-header py-3">
        <h6 class="m-0 font-weight-bold text-primary">게시글 제목</h6>
      </div>
      <div class="card-body">
        <input type="text" class="form-control" placeholder="제목을 입력하세요" v-model="title">
      </div>
    </div>

    <div class="card shadow mb-4">
      <div class="card-header py-3">
        <h6 class="m-0 font-weight-bold text-primary">게시글 내용</h6>
      </div>
      <div class="card-body">
        <CommonEditor v-model="content" />
      </div>
    </div>

    <button class="btn btn-primary" @click="submitPost">저장하기</button>

    <hr class="my-4">

    <div class="card shadow mb-4" v-if="submittedContent">
      <div class="card-header py-3">
        <h6 class="m-0 font-weight-bold text-success">저장된 HTML 내용 미리보기</h6>
      </div>
      <div class="card-body">
        <div v-html="submittedContent"></div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import CommonEditor from '@/components/common/organisms/CommonEditor.vue';

const title = ref('');
const content = ref('<h4>초기 내용입니다.</h4><p>여기에 글을 작성하세요.</p>');
const submittedContent = ref('');

const submitPost = () => {
  console.log('제목:', title.value);
  console.log('내용 (HTML):', content.value);
  submittedContent.value = content.value;
  alert('콘솔을 확인하세요. 내용이 저장되었습니다.');
};
</script>
