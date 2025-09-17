# Fantry 프론트엔드 개발 가이드

## ✨ 핵심 아키텍처

Fantry FE는 두 가지 핵심 컨셉을 기반으로 설계되었습니다.

### 1. 레이아웃 기반의 스타일 분리

**사용자 페이지**와 **관리자 페이지**는 완전히 다른 UI/UX를 가집니다. 두 영역의 스타일(CSS)이 서로 충돌하는 것을 원천적으로 방지하기 위해, 각 영역의 최상위 레이아웃 컴포넌트(`UserLayout.vue`, `AdminLayout.vue`)가 마운트될 때 `<body>` 태그에 고유 클래스를 동적으로 추가/제거합니다. 모든 SCSS 코드는 이 고유 클래스 하위에서만 적용되도록 작성되어 있어 스타일 충돌이 발생하지 않습니다.

### 2. 기능(도메인) 중심의 폴더 구조

팀원들이 각자 맡은 기능 개발에 집중하고, 코드 충돌을 최소화하기 위해 **기능(도메인) 중심**으로 폴더를 구조화했습니다. 예를 들어, '정산 관리' 기능과 관련된 모든 페이지와 컴포넌트는 `settlement`라는 폴더 안에 모여있습니다.

---

## 📁 폴더 구조 가이드

프로젝트의 주요 폴더 구조와 각 파일의 역할은 다음과 같습니다.

```
fantry-frontend/
├── public/               # 이미지, 폰트 등 빌드 시 압축되지 않는 정적 파일
│
├── src/
│   ├── pages/            # 라우터에 직접 연결되는 페이지 단위 컴포넌트
│   │   └── admin/
│   │       ├── settlement/ # ✅ [정산] 기능 페이지
│   │       ├── auction/    # ✅ [경매] 기능 페이지
│   │       ├── cs/         # ✅ [CS] 기능 페이지
│   │       └── ... (기타 기능별 폴더)
│   │
│   ├── components/       # 재사용 가능한 UI 컴포넌트
│   │   └── admin/
│   │       ├── common/     # 여러 기능에서 공통으로 사용하는 컴포넌트
│   │       ├── settlement/ # ✅ [정산] 기능 전용 컴포넌트
│   │       ├── auction/    # ✅ [경매] 기능 전용 컴포넌트
│   │       └── ... (기타 기능별 폴더)
│   │
│   ├── router/           # Vue Router 설정
│   │   ├── index.js      # 라우터 전역 설정 및 가드
│   │   ├── userRoutes.js  # 사용자 페이지 경로
│   │   └── adminRoutes.js# ⭐️ 관리자 페이지 경로 (새 페이지 추가 시 수정)
│   │
│   ├── stores/           # Pinia를 사용한 전역 상태 관리 (로그인, UI 상태 등)
│   │
│   ├── styles/           # SCSS 스타일 파일
│   │   └── scss/
│   │       ├── main-admin.scss # 관리자 페이지 전역 스타일
│   │       └── main-user.scss  # 사용자 페이지 전역 스타일
│   │
│   ├── layouts/          # 페이지의 전체적인 뼈대(레이아웃)
│   │
│   ├── App.vue           # Vue 앱 최상위 컴포넌트
│   └── main.js           # 앱 시작점 (라이브러리 초기화)
│
├── package.json          # ⭐️ 모든 라이브러리 의존성 관리
└── vite.config.js        # Vite 빌드 도구 설정
```

---

## 🚀 개발 워크플로우

새로운 페이지나 컴포넌트를 추가하는 일반적인 절차입니다.
(예시: '정산 관리' 기능에 '상세보기 페이지'를 추가하는 경우)

### 1. 페이지 컴포넌트 생성

-   `src/pages/admin/settlement/` 폴더 안에 `SettlementDetailPage.vue` 파일을 생성합니다.

### 2. (선택) 하위 컴포넌트 생성

-   상세보기 페이지 내부에서 재사용될 UI 조각이 있다면, `src/components/admin/settlement/` 폴더 안에 `SettlementDetailCard.vue` 와 같은 컴포넌트를 생성하여 사용합니다.

### 3. 라우터에 페이지 등록 (⭐️ 중요)

-   `src/router/adminRoutes.js` 파일을 엽니다.
-   새로 만든 페이지 컴포넌트를 `import` 합니다.
    ```javascript
    // src/router/adminRoutes.js

    // ... 기존 import 구문 ...
    const SettlementDetailPage = () => import('@/pages/admin/settlement/SettlementDetailPage.vue');
    ```
-   `settlement` 기능의 `children` 배열 안에 새로운 경로를 추가합니다.
    ```javascript
    // ...
    {
      path: 'settlement',
      // ...
      children: [
        { path: 'dashboard', name: 'AdminSettlementDashboard', component: SettlementDashboardPage },
        { path: 'list', name: 'AdminSettlementList', component: SettlementListPage },
        // 👇 새로 추가된 경로
        { path: 'detail/:id', name: 'AdminSettlementDetail', component: SettlementDetailPage },
      ]
    },
    // ...
    ```

### 4. 사이드바 메뉴 자동 생성

-   우리 프로젝트의 관리자 사이드바(`AdminSidebar.vue`)는 **라우터 설정을 기반으로 메뉴를 자동으로 생성**합니다.
-   새로운 기능 그룹(예: '주문 관리')을 사이드바 메뉴에 추가하고 싶다면, `adminRoutes.js`에서 해당 기능의 최상위 라우트 `meta` 객체에 `menu: true` 속성을 추가하면 됩니다.

    ```javascript
    // src/router/adminRoutes.js
    {
      path: 'order', // 새로운 기능의 경로
      redirect: { name: 'AdminOrderDashboard' },
      // 👇 사이드바 메뉴 자동 생성을 위한 meta 정보
      meta: { title: '주문 관리', icon: 'fas fa-fw fa-box', menu: true },
      children: [
        // ...
      ]
    }
    ```
-   `title`은 메뉴의 이름이 되고, `icon`은 Font Awesome 아이콘 클래스가 됩니다.
-   기존 기능의 하위 메뉴(예: '상세보기')는 자동으로 '대시보드', '목록 조회'와 같은 그룹에 포함되므로 별도의 사이드바 수정이 필요 없습니다.

---

## 📦 의존성 관리

-   모든 외부 라이브러리(jQuery, Chart.js, FontAwesome 등)는 `public` 폴더가 아닌 **NPM**을 통해 설치되고 `package.json`에서 관리됩니다.
-   새로운 라이브러리가 필요할 경우, `npm install [라이브러리명]` 명령으로 설치 후 사용하세요.
-   CSS/JS 파일은 `src/main.js` 또는 사용하는 컴포넌트에서 직접 `import`하여 번들링 파이프라인에 포함시켜야 합니다.

---

## ▶️ 프로젝트 실행

1.  **의존성 설치** (최초 한 번)
    ```bash
    npm install
    ```

2.  **개발 서버 실행**
    ```bash
    npm run dev
    ```

이제 브라우저에서 `http://localhost:5173` (또는 터미널에 표시되는 주소)으로 접속하여 개발을 시작할 수 있습니다.