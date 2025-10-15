<script setup>
import { ref } from 'vue';

const sections = ref([
  {
    title: '경매/판매 이용 방법',
    icon: 'fa-gavel',
    type: 'ul',
    items: [
      '<strong>로그인</strong>: 경매 입찰 및 즉시 구매는 로그인한 회원만 이용할 수 있습니다.',
      '<strong>즉시 구매 상품</strong>: 일부 상품은 경매 없이 \'즉시 구매\' 가격으로 바로 구매할 수 있습니다.',
      '<strong>입찰 단위</strong>: 입찰 금액은 100원 단위여야 합니다. (10원, 1원 단위는 허용되지 않습니다)',
      '<strong>입찰 한도</strong>: 입찰 금액은 최대 2억원까지 가능합니다.',
      '<strong>첫 입찰</strong>: 입찰자가 없는 상품의 경우, 첫 입찰 금액은 경매 시작가보다 높아야 합니다.',
      '<strong>경쟁 입찰</strong>: 다른 입찰자가 있는 경우, 현재 최고 입찰가보다 최소 1,000원 이상 높은 금액으로 입찰해야 합니다.',
      '<strong>입찰 취소 불가</strong>: <span class="text-danger">한 번 제출한 입찰은 취소하거나 수정할 수 없으니</span> 신중하게 참여해 주시기 바랍니다.',
      '<strong>경매 종료</strong>: 경매 종료 시간이 되면 자동으로 입찰이 마감되며, 최고가로 입찰한 회원에게 자동으로 낙찰됩니다.',
      '<strong>내 입찰금 표시</strong>: 현재 내가 최고 입찰자인 경우, 입찰금액 옆에 "내 입찰금" 문구가 표시됩니다.',
    ]
  },
  {
    title: '낙찰 후 절차 안내',
    icon: 'fa-list-ol',
    type: 'ol',
    items: [
      '<strong>주문 생성</strong>: 상품이 낙찰되면 \'마이페이지 > 주문 내역\'에 자동으로 주문이 생성되며, 주문 상태는 \'결제 대기중\'이 됩니다.',
      '<strong>결제 진행</strong>: 낙찰자는 <strong>7일 이내</strong>에 생성된 주문을 통해 결제를 완료해야 합니다.',
      '<strong>배송 시작</strong>: 결제가 확인되면 판매자가 상품 배송을 준비하며, 배송이 시작되면 \'배송중\'으로 상태가 변경됩니다.',
      '<strong>구매 확정</strong>: 상품을 수령하신 후 \'구매 확정\'을 진행하면 모든 거래 절차가 완료됩니다.',
    ]
  },
  {
    title: '주의사항',
    icon: 'fa-exclamation-triangle',
    type: 'ul',
    items: [
      '<strong>결제 기한</strong>: 낙찰 받은 상품은 <strong>7일 이내</strong>에 결제해야 하며, 기간 내 미결제 시 낙찰이 자동 취소되고 정책에 따라 페널티가 부과될 수 있습니다.',
      '<strong>낙찰 취소</strong>: 낙찰 후 단순 변심으로 인한 취소는 불가능합니다. 부득이한 경우 고객센터로 문의해 주시기 바랍니다.',
      '<strong>입찰 실수</strong>: 입찰 금액을 실수로 잘못 입력한 경우 즉시 고객센터로 문의해 주시기 바랍니다. (의도적인 허위 입찰이 반복될 경우 서비스 이용이 제한될 수 있습니다.)',
      '<strong>서버 시간 기준</strong>: 모든 경매 시작 및 종료 시간은 Fantry의 <strong>서버 시간을 기준</strong>으로 합니다. 사용자의 기기 시간과 오차가 있을 수 있으니 유의하시기 바랍니다.',
    ]
  }
]);

const additionalInfo = {
  title: '추가 안내',
  icon: 'fa-info-circle',
  items: [
    '위 내용은 Fantry의 운영 정책에 따라 변경될 수 있습니다.',
    '경매 관련 문의사항은 고객센터를 이용해주시기 바랍니다.'
  ]
};

</script>

<template>
  <div class="policy-container">
    <div class="text-center mb-4">
      <h1 class="page-title">경매 이용 안내</h1>
      <p class="page-description">Fantry의 경매 시스템을 통해 안전하고 즐거운 거래를 경험하세요.</p>
    </div>

    <div v-for="(section, index) in sections" :key="index" class="card mb-4">
      <div class="card-header">
        <i :class="['fa', section.icon, 'me-2']"></i>
        {{ section.title }}
      </div>
      <div class="card-body">
        <component :is="section.type" class="policy-list">
          <li v-for="(item, itemIndex) in section.items" :key="itemIndex" v-html="item"></li>
        </component>
      </div>
    </div>
    
    <div class="alert alert-light mt-4 small" role="alert">
      <h6 class="alert-heading fw-bold">
        <i :class="['fa', additionalInfo.icon, 'me-2']"></i>
        {{ additionalInfo.title }}
      </h6>
      <ul class="mb-0 ps-3">
        <li v-for="(item, index) in additionalInfo.items" :key="index">{{ item }}</li>
      </ul>
    </div>
  </div>
</template>

<style scoped>
.policy-container {
  padding: 1rem;
  background-color: #fff;
}

.page-title {
  font-size: 1.8rem;
  font-weight: 700;
  color: #212529;
  margin-bottom: 0.5rem;
}

.page-description {
  color: #6c757d;
  font-size: 0.95rem;
  margin-bottom: 0;
}

.card {
  border: 1px solid #dee2e6;
  box-shadow: none;
  border-radius: 0.5rem;
}

.card-header {
  display: flex;
  align-items: center;
  background-color: #f8f9fa;
  font-weight: 600;
  color: #343a40;
  padding: 0.75rem 1.25rem;
  font-size: 1.1rem;
}

.card-header .fa {
  color: #495057;
}

.card-body {
  padding: 1.25rem;
}

.policy-list {
  padding-left: 1.25rem;
  font-size: 0.9rem;
  line-height: 1.8;
  color: #495057;
}

.policy-list li {
  margin-bottom: 0.75rem;
}

.policy-list li:last-child {
  margin-bottom: 0;
}

.alert.alert-light {
  background-color: #f8f9fa;
  border-color: #dee2e6;
  color: #495057;
}

.alert-heading {
  display: flex;
  align-items: center;
  font-size: 1rem;
}

.alert ul {
  font-size: 0.85rem;
  margin-top: 0.5rem;
}

.text-danger {
    font-weight: 600;
}

/* v-html에서 strong 태그 스타일링 */
:deep(strong) {
  font-weight: 600;
  color: #343a40;
}
</style>