<script setup>
  import ServerDataTable from '@/components/common/datatable/ServerDataTable.vue';
  import { ref, nextTick, onMounted } from 'vue';
  import { useRouter } from 'vue-router';

  const router = useRouter();
  const keyword = ref('');
  const isLoading = ref(false);

  //테이블 컬럼 정의 --DTO 맞게 수정 필요
  const columns = [
    {
      data: 'orderId',
      title: '주문 ID',
      sortable: true
    },
    {
      data: 'orderName',
      title: '주문명',
      sortable: false,
      render: (data, type, row) => {
        return `<span class="order-link" data-order-id="${row.orderId}" style=""color: blue; cursor: pointer; text-decoration: underline;">${data}</span>`;
      }
    }
  ].map(cole => ({...cole,
    className: 'text-center',
  }));

  //테이블 랜더링 후 이벤트 바인딩 (클릭 핸들러)
  function attachClickHandlers() {
    nextTick(() => {
      //제목 클릭 시 상세 페이지로 이동
      const orderIdElements = document.querySelectorAll('.order-link');

      orderIdElements.forEach(el => {
        //중복 바인딩 방지
        if(el.dataset.bound) return;
        el.dataset.bound = 'true';

        el.addEventListener('click', (e) => {
          const orderId = e.target.dataset.orderId;
          //상세 페이지로 이동
          //router.push({params: {orderId}});
        });
      });
    });
  }

  //패치
  async function fetchOrder(page, size, sort, keyword) {
    //여기에 모든 주문 리스트 요청
    let allOrders = null;

    //검색 필터링
    if(keyword) {
      allOrders = allOrders.filter(m => 
      //컬럼에 맞게 수정
        m.name.includes(keyword) ||
        m.orderTitle.includes(keyword)
      );
    }

    //정렬
    if(sort) {
      const [column, dir] = sort.split(',');
      allOrders.sort((a, b) => {
        const aValue = getNestedValue(a, column);
        const bValue = getNestedValue(b, column);
        const compare = aValue > bValue ? 1: -1;
        return dir === 'asc' ? compare : -compare;
      });
    }

    //페이징
    const start = (page - 1) * size;
    const rows = allOrders.slice(start, start + size);

    return {
      rows,
      total: allOrders.length
    };
  }
  //중첩된 속성 접근 유틸
  function getNestedValue(obj, path) {
    return path.split('.').reduce((o, p) => o?.[p], obj);
  }

  onMounted(() => {
    setTimeout(attachClickHandlers, 500);
  });

</script>
<template>
  <div class="content-page">
    <h1 class="page-title">
    <i class="fa-solid fa-money-check-dollar"></i> 판매 완료 내역</h1>
    <p class="page-description">판매 완료 내역을 확인해보세요.</p>

    <div>
      <ServerDataTable
        v-model:keyword="keyword"
        :columns="columns"
        :fetcher="fetchAuction"
        :page-size="10"
        @loaded="attachClickHandlers"
      >

      <!-- 데이터가 없을 때 -->
      <template #empty>등록한 주문 내역이 없습니다.</template>

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