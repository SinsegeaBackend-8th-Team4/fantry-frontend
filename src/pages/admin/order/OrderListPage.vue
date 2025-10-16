<template>
  <div ref="tableContainer">
    <h1 class="h3 mb-2 text-gray-800">주문 목록 조회</h1>
    <p class="mb-4">전체 주문 내역을 테이블 형태로 조회하고 관리하는 페이지입니다.</p>
    <ServerDataTable
      v-model:keyword="keyword"
      :columns="columns"
      :fetcher="fetchOrders"
    >
      <template #empty>주문 내역이 없습니다.</template>
    </ServerDataTable>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import ServerDataTable from '@/components/common/datatable/ServerDataTable.vue';
import { getOrders } from '@/api/order';

const router = useRouter();
const keyword = ref('');
const tableContainer = ref(null);

const columns = [
  {
    data: 'ordersId',
    title: '주문번호',
    sortable: true,
    render: (data, type, row) => {
      return `<span class="order-link" data-order-id="${row.ordersId}" style="color: blue; cursor: pointer; text-decoration: underline;">${data}</span>`;
    }
  },
  { data: 'itemName', title: '상품명', sortable: true },
  { data: 'buyerName', title: '구매자명', sortable: true },
  {
    data: 'price',
    title: '주문금액',
    sortable: true,
    render: (data) => `${(data || 0).toLocaleString()}원`
  },
  {
    data: 'orderStatus',
    title: '주문상태',
    sortable: true,
    render: (data) => {
      return `<span class="${getStatusBadge(data)}">${translateOrderStatus(data)}</span>`;
    }
  },
  {
    data: 'orderedAt',
    title: '주문일시',
    sortable: true,
    render: (data) => {
      const dateObj = parseJavaLocalDateTime(data);
      return dateObj ? dateObj.toLocaleString('ko-KR') : '-';
    }
  },
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

    return {
      rows: data.content,
      total: data.totalElements,
    };
  } catch (error) {
    console.error('주문 목록 조회 실패:', error);
    return { rows: [], total: 0 };
  }
}

onMounted(() => {
  if (tableContainer.value) {
    tableContainer.value.addEventListener('click', (e) => {
      const link = e.target.closest('.order-link');

      if (link) {
        const orderId = link.dataset.orderId;
        if (orderId) {
          router.push({ name: 'AdminOrderDetail', params: { orderId } });
        }
      }
    });
  }
});

const parseJavaLocalDateTime = (dt) => {
    if (!Array.isArray(dt) || dt.length < 5) {
        return null; 
    }
    const [year, month, day, hour, minute, second = 0] = dt;
    return new Date(year, month - 1, day, hour, minute, second);
};

const orderStatusMap = {
  'PENDING_PAYMENT': '결제대기',
  'PAID': '결제완료',
  'SHIPPED': '배송중',
  'DELIVERED': '배송완료',
  'CONFIRMED': '구매확정',
  'CANCELLED': '취소완료',
  'REFUNDED': '환불완료',
  'PREPARE_SHIPMENT': '배송 준비중',
  'CANCEL_REQUESTED': '취소 요청',
  'REFUND_REQUESTED': '환불 요청'
};

function translateOrderStatus(status) {
    return orderStatusMap[status] || status;
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
  :deep(table td) {
    pointer-events: none;
  }

  :deep(table td .order-link) {
    pointer-events: auto;
  }

  :deep(table tbody tr:hover) {
    background-color: transparent; /* 배경색 변경 없음 */
    cursor: default; /* 기본 커서 유지 */
  }

  :deep(.order-link:hover) {
    font-weight: bold;
    filter: brightness(1.1);
  }
</style>
