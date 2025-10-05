<template>
  <div>
    <h1 class="h3 mb-2 text-gray-800">회원 목록 조회</h1>
    <p class="mb-4">회원 관련 데이터를 테이블 형태로 조회하는 페이지입니다.</p>
  </div>
  <div>
    <ServerDataTable
      v-model:keyword="keyword"
      :columns="columns"
      :fetcher="fetchMembers"
      :page-size="10"
    >
      <!-- 커스텀 셀: 가입일 포맷 -->
      <template #cell-createAt="{ row }">
        {{ formatDate(row.createAt) }}
      </template>

      <!-- 데이터가 없을 때 -->
      <template #empty>회원이 없습니다.</template>

    </ServerDataTable>
  </div>
</template>

<script setup>
  import ServerDataTable from '@/components/common/datatable/ServerDataTable.vue';
  import { ref, onMounted, nextTick } from 'vue';
  import { useRouter } from 'vue-router';

  const router = useRouter();
  const keyword = ref('');

  const serverPath = "http://localhost:8080"; // 테스트를 위한 로컬 서버 주소

  //회원 목록 테이블 공통 ServerDataTable 적용
  const columns = [
    { data: 'memberId', title: 'No.', sortable: false,
      render: (data, type, row, meta) => {
        return meta.row + 1 + (meta.settings._iDisplayStart || 0);
      }
     },
    { data: 'name', title: '이름', sortable: true, 
      className: 'text-center clickable-cell',
      render: (data, type, row) => {
        // data 속성에 memberId 저장
        return `<span class="member-name" data-member-id="${row.id}" style="color: blue; cursor: pointer; text-decoration: underline;">${data}</span>`;
    }
    },
    { data: 'createAt', title: '가입일', sortable: true },
    { data: 'isActive', title: '활성화', sortable: true,
      render: (data) => {
      const status = data === 0 ? '활성' : '비활성';
      const badgeClass = data === 0 ? 'badge-success' : 'badge-danger';
      return `<span class="badge ${badgeClass}">${status}</span>`;
    }
     },
    { data: 'roleType', title: '권한', sortable: true },
  ].map(col => ({ ...col, 
    className: 'text-center',
  }));

  // 테이블 렌더링 후 이벤트 바인딩
  function attachClickHandlers() {
    nextTick(() => {
      const nameElements = document.querySelectorAll('.member-name');
      nameElements.forEach(el => {
        // 중복 바인딩 방지
        if (el.dataset.bound) return;
        el.dataset.bound = 'true';
        
        el.addEventListener('click', (e) => {
          const memberId = e.target.dataset.memberId;
          console.log('클릭됨!', memberId);
          router.push({ 
            name: 'AdminMemberDetail', 
            params: { memberId }
          });
        });
      });
    });
  }

  async function fetchMembers({page, size, sort, keyword}){
    const res = await fetch(`${serverPath}/api/member/`);     //이후에 axios 인터셉터로 변경 필요
    const json = await res.json();

    let allMembers = json.memberList;

    // 검색 필터링
    if (keyword) {
      allMembers = allMembers.filter(m => 
        m.name.includes(keyword) || 
        m.memberId.toString().includes(keyword) ||
        m.roleType.includes(keyword)
      );
    }

    // 정렬
    if (sort) {
      const [column, dir] = sort.split(',');
      allMembers.sort((a, b) => {
        const aValue = getNestedValue(a, column);
        const bValue = getNestedValue(b, column);
        const compare = aValue > bValue ? 1: -1;
        return dir === 'asc' ? compare : -compare;
      });
    }

    // 페이징
    const start = (page - 1) * size;
    const rows = allMembers.slice(start, start + size);

    return {
      rows,
      total: allMembers.length
    };
  }

  // 중첩된 속성 접근 유틸
  function getNestedValue(obj, path) {
    return path.split('.').reduce((o, p) => o?.[p], obj);
  } 

  function formatDate(dateString) {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString('ko-KR'); // yyyy.mm.dd 형식 등으로 커스터마이징 가능
  }

  onMounted(() => {
    // 초기 로드 후에도 바인딩
    setTimeout(attachClickHandlers, 500);
  });
</script>
<style scoped>
  :deep(table th),
  :deep(table td) {
    text-align: center;
  }

  :deep(table tbody tr:hover) {
    background-color: #f8f9fa;
    cursor: pointer;
}
</style>