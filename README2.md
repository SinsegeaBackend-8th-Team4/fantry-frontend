## Fantry FE 개발 핵심 가이드 (내부)

팀원이 처음 들어와도 아래 순서만 보면 바로 기능 페이지를 추가하고 스타일/공통 컴포넌트를 활용할 수 있도록 최소·실전 위주로 정리했습니다.

---

### 1. 가장 먼저 이해할 3가지
1) 도메인 중심 구조 (settlement, member, inventory 등)
2) 페이지 = `pages/**` 단일 책임, 재사용 UI = `components/**`
3) 서버 통신은 반드시 `src/api/**` 모듈을 통해서만 (컴포넌트에서 axios 직접 호출 금지)

---

### 2. 새 관리자 페이지 추가 절차 (90% 작업 패턴)
1. 파일 생성: `src/pages/admin/<도메인>/<Something>Page.vue`
2. 라우트 등록: `src/router/adminRoutes.js` → children에 `{ path:'...', name:'...', component: ..., meta:{ menu:true, title:'메뉴명', icon:'fa-...' } }`
3. 사이드바 자동 노출: meta.menu=true + title 필수 (숨기려면 menu 생략 또는 meta.hidden=true)
4. 스타일: 우선 `<style scoped lang="scss">` 로 작성 (중복 생기면 아래 스타일 가이드에 따라 승격)
5. 데이터 조회 필요: `src/api/<도메인>.js` 에 함수 추가 후 페이지에서 import 사용
6. 목록/검색 필요: 바로 `<ServerDataTable />` 사용 (더미 fetcher로 시작 가능)
7. 차트 필요: `<BaseChart />` + `useChartPalette`, `makeLineDataset` 활용

---

### 3. 폴더 구조 한눈에
| 영역 | 설명 | 예시 |
|------|------|------|
| `src/pages/**` | 페이지 컴포넌트(라우터 직접 연결) | `pages/admin/settlement/SettlementListPage.vue` |
| `src/components/common/**` | 전역/다도메인 재사용 UI | `common/chart/BaseChart.vue` |
| `src/components/admin/<도메인>/**` | 해당 도메인 재사용 전용 | `components/admin/settlement/SettlementSummaryCard.vue` |
| `src/api/**` | 백엔드 API 래퍼 | `api/settlement.js` |
| `src/stores/**` | Pinia 스토어 | `stores/uiStore.js` |
| `src/router/**` | 라우터 구성 | `router/adminRoutes.js` |
| `src/styles/scss/**` | 전역 SCSS 엔트리 및 변수 | `main-admin.scss` |

---

### 4. 스타일 & SCSS 최소 규칙
| 상황 | 어디에 작성? | 비고 |
|------|--------------|------|
| 단일 페이지 한정 | 해당 `Page.vue` 의 `<style scoped lang="scss">` | 가장 기본 |
| 같은 레이아웃 다수 페이지 반복 | `main-admin.scss` 또는 `main-user.scss` 하단에 분리 import | 네이밍 prefix 권장 |
| 전역 토큰(색/폰트/spacing) | `_variables-admin.scss`, `_variables-user.scss` | 변수만 정의 |
| 관리자 공통 패턴 | `_admin-custom.scss` (body.admin-layout-active 내부) | 범위 강제 |
| 사용자 공통 패턴 | `_user-custom.scss` (body.user-layout-active 내부) | |
| 실험/임시 스타일 | 먼저 scoped로 → 재사용 시 승격 | 과최적화 금지 |

금지/주의:
1) `legacy style.scss` 사용 금지
2) User/Admin 스타일 교차 import 금지
3) Bootstrap 유틸 억지 override 하지 말고 새 클래스 작성

레이아웃 전환 시 body 클래스:
`user-layout-active` / `admin-layout-active`
→ 전역 SCSS 는 반드시 이 body 범위 안에서만 영향 주도록 작성

예시:
```scss
body.admin-layout-active .settlement-card { /* ... */ }
```

#### 4.1 "같은 레이아웃 다수 페이지 반복" 구체 예시
반복되는 스타일을 어디에 두어야 할지 애매한 부분에 대한 상세 패턴입니다.

1) 우선 페이지들에 scoped로 작성 (중복 생기기 전까진 그대로 둠)
2) 2개 이상 페이지에서 동일/매우 유사 블록이 반복되면 추출 결심
3) Vue 컴포넌트로 추출 가능한 UI(카드, 블록 등)라면 우선 컴포넌트화 후 그 컴포넌트의 scoped 스타일 유지 → 재사용 즉시 해결
4) 구조가 단순하거나 "클래스 유틸 모음" 수준이라 컴포넌트화 할 가치가 낮다면 SCSS partial로 분리

Partial 작성 절차 (Admin 예시):
1. `src/styles/scss/parts/` 폴더 생성(없다면)
2. `_admin-settlement-summary.scss` 파일 생성
3. 내부에 반드시 레이아웃 네임스페이스를 유지
```scss
// _admin-settlement-summary.scss
body.admin-layout-active {
  .settlement-summary-grid { display:grid; gap:1rem; grid-template-columns:repeat(auto-fill,minmax(220px,1fr)); }
  .settlement-summary-card { background:#fff; border:1px solid #e5e7ec; border-radius:6px; padding:1rem; }
  .settlement-summary-card h4 { font-size:0.95rem; margin:0 0 .5rem; font-weight:600; }
}
```
4. `main-admin.scss` 하단(기존 import 뒤)에 추가:
```scss
@import './parts/admin-settlement-summary';
```
5. 이후 각 페이지에서는 해당 클래스를 바로 사용 (별도 scoped 스타일 불필요)

왜 `main-admin.scss` 하단인가?
- Bootstrap, SB Admin 2, `_admin-custom.scss` 이후에 와야 override/확장이 자연스럽기 때문.

`_variables-*.scss` 에는 절대 클래스/태그 선택자를 넣지 말고 Sass 변수, map, function, mixin 등 "토큰"만 둡니다.

선택 가이드 요약:
| 상황 | 추천 | 이유 |
|------|------|------|
| 재사용 UI + 내부 로직/slot 필요 | Vue 컴포넌트 추출 | 유지보수성/캡슐화 |
| 단순 스타일 유틸 묶음 | SCSS partial + main에 import | 번들 한곳 관리 |
| 단일 페이지 스타일 | 그대로 scoped | 과도한 분리 방지 |

안티 패턴 (지양):
| 패턴 | 문제 |
|------|------|
| `_variables-admin.scss` 에 클래스 정의 | 변수 재정의 시 사이드이펙트 추적 어려움 |
| 페이지마다 동일 블록 copy & paste | 수정 시 누락 위험 증가 |
| `main-admin.scss` 안에 대형 스타일 블록 직접 증가 | 엔트리 파일 비대화, 탐색 어려움 |

Tip: 반복 판단 기준은 '비슷해 보인다'가 아니라 '변경 시 항상 같이 수정해야 한다' 입니다.

---

### 5. 공통 컴포넌트 핵심 사용법

#### DataTable
목록 표준 패턴: `<ServerDataTable />`
필수 props: `:columns="columns" :fetcher="fetchFn" v-model:keyword="keyword"`

컬럼 최소 형태:
```js
const columns = [
  { data:'orderNo', title:'주문번호', sortable:true },
  { data:'amount', title:'정산금액', render:v => (v||0).toLocaleString()+'원' },
  { data:'status', title:'상태', sortable:true }
];
```
fetcher 계약:
```js
async function fetchFn({ page, size, sort, keyword }) {
  // API 호출 후 { rows:[], total: number } 반환
  return { rows: demoData, total: demoData.length };
}
```
슬롯 핵심: `cell-필드명`, `empty`, `error`, `loading`, (Server 전용) `actions`

#### Chart
```vue
<BaseChart :type="'line'" :data="chartData" :options="chartOptions" height="240" />
```
헬퍼 사용:
```js
import { useChartPalette, makeLineDataset } from '@/.../useChartConfig';
const palette = useChartPalette();
const chartData = {
  labels:['1일','2일'],
  datasets:[ makeLineDataset('일별', [10,20], palette.primary) ]
};
```
금지: 페이지에서 `new Chart(...)` 직접 생성

#### 언제 승격?
| 상황 | 조치 |
|------|------|
| 한 페이지만 사용 | 그대로 둠 (scoped) |
| 같은 도메인 2개 이상 | `components/admin/<도메인>/` 로 이동 |
| 전역/여러 도메인 반복 | `components/common/` 승격 |

---

### 6. API 작성 패턴
파일: `src/api/<도메인>.js`
```js
import api from '@/api'; // axios 인스턴스
export async function fetchSettlements(params) {
  const { data } = await api.get('/settlements', { params });
  return data;
}
```
페이지에서는:
```js
import { fetchSettlements } from '@/api/settlement';
```
직접 axios 호출 금지 (테스트/교체 용이성 저하)

---

### 7. 전역 동작 (라우터 & 로딩)
전역 로딩 스피너:
1) `beforeEach` → startLoading
2) `afterEach` → 즉시 stopLoading
3) `router.onError` → stopLoading (고착 방지)
페이지 내부 비동기 로딩은 전역 스피너 사용하지 말고 컴포넌트의 로딩/empty 슬롯으로 표현

---

### 8. 터미널 Sass 경고
`Deprecation Warning` 은 외부 라이브러리 구문(@import) 원인 → 무시 가능

---

### 9. 빠른 체크리스트 (새 페이지 만들 때)
1) 파일 + 라우트 + meta.menu
2) API 있으면 `src/api` 에 함수 추가 후 import
3) 목록이면 `ServerDataTable` 적용 (fetcher 더미 → 백엔드 연동 시 대체)
4) 차트 필요 시 `BaseChart` + palette 헬퍼
5) 스타일은 우선 scoped, 반복되면 승격
6) 콘솔에 `new Chart` or datatables 직접 import 나오면 잘못된 구현
7) 전역 axios 호출 금지 (항상 api 모듈)

---

### 10. 향후 개선 후보 (Backlog)
- DataTable Skeleton 로딩
- 차트 빈 상태 UX
- 공통 컬럼 helper(날짜/상태 Badge 표준화)
- i18n 도입 시 테이블 헤더 분리 구조

---

### 11. 참고 실제 예시
| 목적 | 파일 |
|------|------|
| DataTable + Chart 조합 | `src/pages/admin/settlement/SettlementListPage.vue` |
| 차트 마이그레이션 예 | `src/pages/admin/settlement/SettlementDashboardPage.vue` |

과거 샘플(`SettlementListSamplePage.vue`)은 통합 후 삭제됨.

---

필요 시 이 문서는 짧게 유지하고, 세부 심화 내용은 별도 문서로 분리 예정.


