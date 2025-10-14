<template>
  <!-- 안정적인 이벤트 처리를 위해 최상단 div에 ref를 추가합니다. -->
  <div ref="tableContainer">
    <h1 class="h3 mb-2 text-gray-800">주문 목록 조회</h1>
    <p class="mb-4">전체 주문 내역을 테이블 형태로 조회하고 관리하는 페이지입니다.</p>
    <ServerDataTable
      v-model:keyword="keyword"
      :columns="columns"
      :fetcher="fetchOrders"
    >
      <template #cell-orderStatus="{ row }">
        <span :class="getStatusBadge(row.orderStatus)">{{ row.orderStatus }}</span>
      </template>
      <template #cell-price="{ row }">
        {{ (row.price || 0).toLocaleString() }}원
      </template>
      <template #cell-orderedAt="{ row }">
        {{ formatDate(row.orderedAt) }}
      </template>
      <template #empty>주문 내역이 없습니다.</template>
    </ServerDataTable>
  </div>
</template>

<script setup>
// onMounted를 import합니다.
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import ServerDataTable from '@/components/common/datatable/ServerDataTable.vue';
import { getOrders } from '@/api/order';

const router = useRouter();
const keyword = ref('');
// 템플릿의 ref와 연결할 변수를 선언합니다.
const tableContainer = ref(null);

const columns = [
  {
    data: 'ordersId',
    title: '주문번호',
    sortable: true,
    render: (data, type, row) => {
      // 클릭 가능한 요소에 명확한 클래스(order-link)와 데이터 속성을 부여합니다.
      return `<span class="order-link" data-order-id="${row.ordersId}" style="color: blue; cursor: pointer; text-decoration: underline;">${data}</span>`;
    }
  },
  { data: 'itemName', title: '상품명', sortable: true },
  { data: 'buyerName', title: '구매자명', sortable: true },
  { data: 'price', title: '주문금액', sortable: true },
  { data: 'orderStatus', title: '주문상태', sortable: true },
  { data: 'orderedAt', title: '주문일시', sortable: true },
].map(col => ({ ...col, className: 'text-center' }));

async function fetchOrders({ page, size, sort, keyword }) {
  try {
    const params = {
      pageable: { 
        page: page - 1, 
        size, 
        sort 
      },
    };
    const response = await getOrders(params);
    const data = response.data; 

    // 여기서 더 이상 attachClickHandlers를 호출하지 않습니다.
    return {
      rows: data.content,
      total: data.totalElements,
    };
  } catch (error) {
    console.error('주문 목록 조회 실패:', error);
    return { rows: [], total: 0 };
  }
}

// 컴포넌트가 마운트되었을 때 단 한 번만 실행됩니다.
onMounted(() => {
  // tableContainer ref를 통해 DOM 요소에 접근합니다.
  if (tableContainer.value) {
    // 컨테이너에 단 하나의 클릭 이벤트 리스너를 등록합니다. (이벤트 위임)
    tableContainer.value.addEventListener('click', (e) => {
      // 클릭된 요소(e.target)에서 가장 가까운 .order-link 클래스를 가진 부모/자신을 찾습니다.
      const link = e.target.closest('.order-link');

      // .order-link 요소를 클릭한 경우에만 아래 로직을 실행합니다.
      if (link) {
        const orderId = link.dataset.orderId;
        if (orderId) {
          router.push({ name: 'AdminOrderDetail', params: { orderId } });
        }
      }
    });
  }
});


function formatDate(dateString) {
  if (!dateString) return '-';
  const date = new Date(dateString);
  return date.toLocaleString('ko-KR');
}

function getStatusBadge(status) {
  const baseClass = 'badge';
  switch (status) {
    case 'PAID': return `${baseClass} badge-primary`;
    case 'SHIPPED': return `${baseClass} badge-info`;
    case 'DELIVERED': return `${baseClass} badge-success`;
    case 'CONFIRMED': return `${baseClass} badge-dark`;
    case 'CANCELLED':
    case 'REFUNDED':
      return `${baseClass} badge-danger`;
    default:
      return `${baseClass} badge-secondary`;
  }
}
</script>

<style scoped>
  :deep(table th),
  :deep(table td) {
    text-align: center;
  }
  /*
    pointer-events 관련 스타일을 제거하여 이벤트 버블링이 정상적으로 동작하도록 합니다.
    이벤트 위임 패턴에서는 이벤트가 자식 요소에서 부모 요소로 전달(버블링)되어야 하기 때문입니다.
  */
</style>
