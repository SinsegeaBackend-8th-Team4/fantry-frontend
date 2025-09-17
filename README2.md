# Fantry FE 개발 핵심 가이드 (내부용)

이 문서는 Fantry 프론트엔드 프로젝트의 핵심 구조와 개발 워크플로우를 안내합니다.

---

## 1. 핵심 아키텍처

-   **폴더 구조**: **기능(도메인) 중심**입니다. `pages/admin/settlement`, `components/admin/settlement` 와 같이 각자 맡은 기능 폴더 내에서 작업하세요.
-   **API 관리**: **`src/api` 폴더에서 기능별로 모듈화**하여 관리합니다. 컴포넌트에서 `axios`를 직접 사용하지 마세요.
-   **상태 관리**: **`Pinia`**를 사용합니다. (`stores/userStore.js`, `stores/uiStore.js`)
-   **스타일**: `UserLayout`과 `AdminLayout`에 의해 자동으로 분리되므로 신경 쓸 필요 없습니다.

---

## 2. 주요 개발 워크플로우 (관리자 페이지 추가)

1.  **페이지 생성**: `src/pages/admin/[기능명]/MyNewPage.vue` 파일을 생성합니다.
2.  **라우터 등록**: `src/router/adminRoutes.js`를 열고, 생성한 페이지를 `import` 한 뒤 `children` 배열에 경로를 추가합니다.
3.  **사이드바 메뉴**: 라우터 등록 시 `meta` 객체에 `{ menu: true, title: '메뉴명', icon: '...' }`을 추가하면 사이드바 메뉴가 **자동으로 생성**됩니다. `AdminSidebar.vue`를 직접 수정할 필요 없습니다.

---

## 3. 자주 수정하는 파일

-   **라우팅 & 사이드바**: `src/router/adminRoutes.js`
-   **페이지 컴포넌트**: `src/pages/admin/[기능명]/`
-   **재사용 컴포넌트**: `src/components/admin/[기능명]/` 또는 `src/components/common/`
-   **API 요청 함수**: `src/api/[기능명].js`
-   **공통 에디터**: `src/components/common/organisms/CommonEditor.vue`

---

## 4. 프로젝트 실행

```bash
# 1. 의존성 설치 (최초 한 번)
npm install

# 2. 개발 서버 실행
npm run dev
```

---

## 5. 기술 스택 및 주요 라이브러리

### 프레임워크 및 빌드 도구

-   **Vue 3**: Composition API (`<script setup>`) 기반으로 작성되었습니다.
-   **Vite**: 빠르고 효율적인 개발 및 빌드 환경을 제공합니다.
-   **Pinia**: Vue의 공식 상태 관리 라이브러리입니다.
-   **Vue Router**: 페이지 라우팅을 관리합니다.

### 주요 UI 라이브러리

-   **DataTables (`datatables.net-vue3`)**: 관리자 페이지의 모든 목록 페이지에서 사용되는 강력한 테이블 라이브러리입니다. 정렬, 검색, 페이징 기능이 기본 제공됩니다.
-   **Chart.js**: 대시보드 등에서 데이터를 시각화하기 위한 차트 라이브러리입니다.
-   **Vue-Quill (`@vueup/vue-quill`)**: 상품 설명, CS 답변 등 서식이 필요한 텍스트 입력을 위한 스마트 에디터입니다.
-   **Bootstrap 5 & SB Admin 2**: 관리자 페이지의 전체적인 UI 템플릿으로 사용됩니다.

### API 통신

-   **Axios**: 백엔드 서버와의 모든 HTTP 통신을 담당합니다. `src/api` 폴더에서 중앙 관리됩니다.

---

## 6. 스타일링 가이드라인 (SCSS)

**모든 스타일은 SCSS 문법으로 작성하는 것을 원칙으로 합니다.** 스타일을 추가할 때는 다음 **"2단계 원칙"**을 우선순위대로 따라주세요.

### 1순위: 특정 페이지/컴포넌트에서만 쓰이는 '한정 스타일'

-   **목적**: 가장 일반적이고 안전한 방법입니다. 스타일 충돌을 원천적으로 방지합니다.
-   **작성 위치**: 해당 `.vue` 파일 내부의 `<style scoped lang="scss">` 블록
-   **예시**: '정산 목록 페이지' 테이블의 특정 컬럼 색상, 'CS 글쓰기 페이지'의 레이아웃 등

```vue
<style scoped lang="scss">
/* 이 스타일은 이 컴포넌트 안에서만 적용됩니다. */
.my-component-wrapper {
  padding: 20px;
}
</style>
```

### 2순위: 특정 영역 전반에서 쓰이는 '영역별 공통 스타일'

-   **목적**: **관리자 페이지 전체** 또는 **사용자 페이지 전체**에서 공통으로 재사용되는 스타일을 정의합니다.
-   **작성 위치**:
    -   관리자용: `src/styles/scss/main-admin.scss` 파일 하단
    -   사용자용: `src/styles/scss/main-user.scss` 파일 하단
-   **예시**: 관리자 페이지의 모든 카드 헤더 디자인, 사용자 페이지의 공통 섹션 제목 디자인 등

> **참고**: `style.scss` 파일은 사용자/관리자 양쪽에 모두 적용되므로, 정말 필요한 경우가 아니면 수정하지 않는 것을 권장합니다.

---

## 7. 터미널 경고 메시지에 대하여

`npm run dev` 실행 시, 터미널에 Sass와 관련된 **"Deprecation Warning"** 메시지가 많이 나타날 수 있습니다.

-   **이것은 에러가 아니며, 프로젝트 실행에 아무런 문제가 없습니다.**
-   **원인**: 우리가 사용하는 `Bootstrap`과 `SB Admin 2` 라이브러리가 내부적으로 오래된 `@import` 문법을 사용하기 때문에 나타나는 단순 **알림**입니다.
-   **결론**: 이 경고들은 외부 라이브러리에서 발생하는 것이므로, **안심하고 무시하셔도 괜찮습니다.**