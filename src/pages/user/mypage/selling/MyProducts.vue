<script setup>
  import ServerDataTable from '@/components/common/datatable/ServerDataTable.vue';
  import { ref, nextTick, onMounted } from 'vue';
  import { useRouter } from 'vue-router';

  const router = useRouter();
  const keyword = ref('');
  const isLoading = ref(false);

  //테이블 컬럼 정의 -- DTO에 맞게 수정 필요
  const columns = [
    {
      data: 'auctionId',
      title: '등록상품 ID',
      sortable: true
    },
    {
      data: 'auctionName',
      title: '상품명',
      sortable: false,
      render: (data, type, row) => {
        //긴 상품 이름은 10자 이내로 요약하여 보여지기
        const summary = data.length > 10 ? data.substring(0,10) + '...': data;
        return `<span class="auction-link" data-auction-id="${row.auctionId}" style=""color: blue; cursor: pointer; text-decoration: underline;">${summary}</span>`;
      }
    }
  ].map(col => ({...col,
    className: 'text-center',
  }));

  //테이블 랜더링 후 이벤트 바인딩 (클릭 핸들러)
  function attachClickHandlers() {
    nextTick(() => {
      //제목 클릭 시 상세 페이지로 이동
      const auctionIdElements = document.querySelectorAll('.auction-link');

      auctionIdElements.forEach(el => {
        //중복 바인딩 방지
        if (el.dataset.bound) return;
        el.dataset.bound = 'true';

        el.addEventListener('click', (e) => {
          const auctionId = e.target.dataset.auctionId;
          //상세 페이지로 이동
          //router.push({params: {auctionId}});
        });
      });
    });
  }

  //패치
  async function fetchAuction({page, size, sort, keyword}) {
    //여기에 모든 경매 리스트 요청
    //const res = await getAllAcutions();
    // let allAuctions = res.data.auctionList;
    let allAuctions = null;

    //검색 필터링
    if(keyword) {
      allAuctions = allAuctions.filter(m => 
      //컬럼에 맞게 수정 필요!!
        m.name.includes(keyword) ||
        m.auctionTitle.includes(keyword)
      );
    }

    //정렬
    if(sort) {
      const [column, dir] = sort.split(',');
      allAuctions.sort((a, b) => {
        const aValue = getNestedValue(a, column);
        const bValue = getNestedValue(b, column);
        const compare = aValue > bValue ? 1: -1;
        return dir === 'asc' ? compare : -compare;
      });
    }

    //페이징
    const start = (page - 1) * size;
    const rows = allAuctions.slice(start, start + size);

    return {
      rows,
      total: allAuctions.length
    };
  }

  // 중첩된 속성 접근 유틸
  function getNestedValue(obj, path) {
    return path.split('.').reduce((o, p) => o?.[p], obj);
  } 

  onMounted(() => {
    setTimeout(attachClickHandlers, 500);
  })


</script>
<template>
  <div class="content-page">
    <h1 class="page-title">
      <i class="fa-solid fa-store"></i> 등록 상품 내역
    </h1>
    <p class="page-description">내가 등록한 상품을 여기서 확인할 수 있습니다.</p>

    <div>
      <ServerDataTable
        v-model:keyword="keyword"
        :columns="columns"
        :fetcher="fetchAuction"
        :page-size="10"
        @loaded="attachClickHandlers"
      >

      <!-- 데이터가 없을 때 -->
      <template #empty>등록한 상품이 없습니다.</template>

      </ServerDataTable>
    </div>

  </div>
</template>
<style scoped>
  .content-page {
  max-width: 900px;
  margin: 20px auto;
  padding: 24px;
  background: #fff;
  border-radius: 10px;
  box-shadow: 0 4px 12px rgba(0,0,0,0.04);
}

.page-title {
    font-size: 1.8rem;
    font-weight: 700;
    color: #333;
    border-bottom: 3px solid #f0f0f0;
    padding-bottom: 10px;
    margin-bottom: 10px;
}

.page-description {
    color: #666;
    margin-bottom: 30px;
    font-size: 0.95rem;
}

</style>