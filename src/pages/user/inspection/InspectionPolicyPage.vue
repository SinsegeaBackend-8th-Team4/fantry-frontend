<script setup>
import { ref } from 'vue';

const activeTab = ref('common'); // 기본 탭 변경

// Fantry_Inspection_DB_and_Rules_v1.md 문서 기반 데이터 상세화
const standards = {
  common: {
    name: '공통 기준',
    description: '모든 카테고리의 상품에 공통으로 적용되는 포장, 구성품, 상품 상태에 대한 기준입니다.',
    groups: [
      {
        title: '패키지 및 구성품',
        items: [
          { item: '박스 상태', criteria: '모서리 눌림, 경미한 긁힘, 일부 변색 등 사용감이 느껴지는 경우', decision: '감가 대상' },
          { item: '박스 상태', criteria: '찢어짐, 파손, 큰 구멍 등 심각한 손상이 있는 경우', decision: '감가 대상' },
          { item: '구성품 누락', criteria: '스티커, 접지 포스터 등 일부 구성품이 누락된 경우', decision: '감가 대상' },
          { item: '구성품 누락', criteria: '포토카드, CD 등 거래에 치명적인 주요 구성품이 누락된 경우', decision: '감가 대상' },
          { item: '비공식 굿즈', criteria: '공식 제작사가 아닌 곳에서 제작한 비공식 상품(자체제작 등)', decision: '검수 불가/반려' },
        ]
      },
      {
        title: '상품 컨디션',
        items: [
          { item: '보관 상태', criteria: '슬리브, 탑로더, OPP 봉투 등으로 개별 보호 포장이 완료된 경우', decision: '가산점 대상' },
          { item: '오염/얼룩', criteria: '쉽게 제거되지 않는 얼룩이나 눈에 띄는 오염이 있는 경우', decision: '감가 대상' },
          { item: '냄새', criteria: '담배, 향수, 방향제 등 상품 본연의 향이 아닌 강한 냄새가 배어있는 경우', decision: '감가 대상' },
          { item: '색바램', criteria: '햇빛, 조명 등에 장시간 노출되어 상품 일부 또는 전체의 색이 변한 경우', decision: '감가 대상' },
        ]
      }
    ]
  },
  pc: {
    name: '포토카드',
    description: '포토카드, 트레이딩 카드 등 종이 재질의 카드류에 적용되는 기준입니다.',
    groups: [
      {
        title: '카드 상태',
        items: [
          { item: '모서리 손상', criteria: '경미한 눌림, 마모 또는 미세한 까짐이 발견된 경우', decision: '감가 대상' },
          { item: '모서리 손상', criteria: '눈에 띄는 구겨짐, 접힘, 벗겨짐이 있는 경우', decision: '감가 대상' },
          { item: '표면', criteria: '빛에 비추었을 때 보이는 미세한 스크래치 또는 자국', decision: '감가 대상' },
          { item: '표면', criteria: '일반 조명에서도 보이는 깊은 스크래치, 찍힘 자국', decision: '감가 대상' },
          { item: '휘어짐', criteria: '습기나 보관 상태로 인해 카드가 평평하지 않고 휘어진 경우', decision: '감가 대상' },
          { item: '인쇄 하자', criteria: '인쇄 밀림, 잉크 튐 등 제작 공정상 발생한 하자', decision: '감가 대상' },
        ]
      },
      {
        title: '가치 평가',
        items: [
          { item: '희소성', criteria: '앨범에 포함되지 않은 미공개 포토카드(미공포), 팬사인회 특전 등', decision: '가산점 대상' },
          { item: '서명', criteria: '공식적으로 인증된 아티스트의 친필 서명이 포함된 경우', decision: '가산점 대상' },
        ]
      }
    ]
  },
  album: {
    name: '앨범',
    description: 'CD, 포토북 등이 포함된 앨범 패키지에 적용되는 기준입니다.',
    groups: [
      {
        title: '앨범 사양 및 상태',
        items: [
          { item: '에디션', criteria: '한정판(Limited Edition) 또는 초판(First Press)', decision: '가산점 대상' },
          { item: '개봉 여부', criteria: '최초 비닐 포장이 개봉된 상품', decision: '감가 대상' },
          { item: '정품 스티커', criteria: '정품 인증 스티커(KOMCA 등)가 없거나 훼손된 경우', decision: '감가 대상' },
        ]
      },
      {
        title: '디스크 상태',
        items: [
          { item: '디스크 표면', criteria: '재생에 영향이 없는 경미한 스크래치', decision: '감가 대상' },
          { item: '디스크 표면', criteria: '재생에 영향을 줄 수 있는 깊은 스크래치', decision: '감가 대상' },
          { item: '재생 테스트', criteria: '실제 재생 시 튀거나 멈추는 현상 발생', decision: '검수 불가/반려' },
        ]
      }
    ]
  },
  dvd: {
    name: 'DVD/Blu-ray',
    description: 'DVD, Blu-ray 등 영상 미디어 패키지에 적용되는 기준입니다.',
    groups: [
       {
        title: '패키지 및 디스크 상태',
        items: [
          { item: '정품 스티커', criteria: '정품 인증 스티커가 없거나 훼손된 경우', decision: '감가 대상' },
          { item: '디스크 스크래치', criteria: '재생에 영향 없는 경미한 스크래치', decision: '감가 대상' },
          { item: '디스크 스크래치', criteria: '눈에 띄는 깊은 스크래치 및 손상', decision: '감가 대상' },
          { item: '재생 테스트', criteria: '실제 재생 시 튀거나 멈추는 현상 발생', decision: '검수 불가/반려' },
        ]
      }
    ]
  },
  seasonGreeting: {
    name: '시즌 그리팅',
    description: '캘린더, 다이어리 등이 포함된 시즌 그리팅 패키지에 적용됩니다.',
    groups: [
      {
        title: '패키지 상태',
        items: [
          { item: '정품 스티커', criteria: '정품 인증 스티커가 없거나 훼손된 경우', decision: '감가 대상' },
          { item: '개봉 여부', criteria: '최초 비닐 포장이 개봉된 상품', decision: '감가 대상' },
          { item: '구성품 사용 흔적', criteria: '다이어리, 캘린더 등에 필기, 스티커 부착 등 사용 흔적이 있는 경우', decision: '감가 대상' },
        ]
      }
    ]
  },
  lightstick: {
    name: '응원봉',
    description: '공식 응원봉 및 관련 액세서리에 적용되는 기준입니다.',
    groups: [
       {
        title: '외관 및 패키지',
        items: [
          { item: '정품 스티커', criteria: '정품 인증 스티커가 없거나 훼손된 경우', decision: '감가 대상' },
          { item: '본체 스크래치', criteria: '눈에 띄는 스크래치, 찍힘, 변색 등이 있는 경우', decision: '감가 대상' },
        ]
      },
      {
        title: '기능 및 작동',
        items: [
          { item: '전원 작동', criteria: '배터리를 넣어도 전원이 켜지지 않는 경우', decision: '검수 불가/반려' },
          { item: 'LED 작동', criteria: 'LED 조명이 정상적으로 점등되지 않는 경우', decision: '감가 대상' },
          { item: '블루투스 연결', criteria: '공식 앱과의 페어링(연동)에 실패하는 경우', decision: '감가 대상' },
        ]
      }
    ]
  }
};
</script>

<template>
  <div class="container my-5">
    <div class="mb-5">
      <h1 class="page-title">검수 기준 안내</h1>
      <p class="page-description">Fantry는 신뢰할 수 있는 거래를 위해 명확한 기준에 따라 검수를 진행합니다.</p>
    </div>

    <ul class="nav nav-pills mb-4">
      <li class="nav-item" v-for="(cat, key) in standards" :key="key">
        <a class="nav-link" :class="{ active: activeTab === key }" @click.prevent="activeTab = key" href="#">
          {{ cat.name }}
        </a>
      </li>
    </ul>

    <div class="tab-content">
      <div v-for="(cat, key) in standards" :key="`content-${key}`" class="tab-pane fade" :class="{ 'show active': activeTab === key }">
        <p class="text-muted mb-4">{{ cat.description }}</p>
        <div v-for="(group, groupIndex) in cat.groups" :key="`group-${groupIndex}`" class="card mb-4">
          <div class="card-header">
            {{ group.title }}
          </div>
          <div class="card-body">
            <table class="table table-borderless">
              <tbody>
                <tr v-for="(item, itemIndex) in group.items" :key="`item-${itemIndex}`">
                  <td class="col-item">{{ item.item }}</td>
                  <td class="col-criteria">{{ item.criteria }}</td>
                  <td class="col-decision">
                    <span :class="['badge', 
                      item.decision.includes('가산') ? 'badge-success' : 
                      item.decision.includes('불가') ? 'badge-dark' : 'badge-danger']">
                      {{ item.decision }}
                    </span>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
    
    <div class="alert alert-secondary mt-5 small" role="alert">
      <h6 class="alert-heading fw-bold">유의사항</h6>
      <ul class="mb-0">
        <li>위 기준은 검수의 최소 기준으로 활용되며, 언급되지 않은 사항은 검수 과정에서 종합적으로 판단될 수 있습니다.</li>
        <li>최종 판정은 당사 검수센터 책임자의 판단에 따르며, 판정 결과에 따라 거래가 취소될 수 있습니다.</li>
      </ul>
    </div>
  </div>
</template>

<style scoped>
.page-title {
    font-size: 2.2rem;
    font-weight: 700;
    color: #333;
    padding-bottom: 10px;
    margin-bottom: 10px;
}
.page-description {
    color: #666;
    margin-bottom: 30px;
    font-size: 1rem;
}
.nav-pills .nav-link {
  color: #6c757d;
  font-weight: 500;
  padding: 0.5rem 1rem;
  transition: all 0.2s ease-in-out;
}
.nav-pills .nav-link.active {
  background-color: #333;
  color: #fff;
  font-weight: 600;
}
.card {
  border: 1px solid #e9ecef;
  box-shadow: 0 2px 8px rgba(0,0,0,0.05);
  border-radius: 8px;
}
.card-header {
  background-color: #f8f9fa;
  font-weight: 600;
  color: #333;
  border-bottom: 1px solid #e9ecef;
}
.table {
  font-size: 0.9rem;
  margin-bottom: 0;
}
.table td {
  vertical-align: middle;
}
.col-item {
  width: 25%;
  font-weight: 500;
  color: #495057;
}
.col-criteria {
  width: 50%;
  color: #6c757d;
}
.col-decision {
  width: 25%;
  text-align: center;
}
.badge {
  padding: 0.4em 0.7em;
  font-size: 0.75rem;
  font-weight: 600;
}
.badge-success { /* 가산점 */
  background-color: #d1fae5;
  color: #065f46;
}
.badge-danger { /* 감가 */
  background-color: #fee2e2;
  color: #991b1b;
}
.badge-dark { /* 불가/반려 */
  background-color: #e2e8f0;
  color: #334155;
}
</style>