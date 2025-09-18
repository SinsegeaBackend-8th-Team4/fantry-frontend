# SCSS Parts Directory

이 폴더는 관리자/사용자 레이아웃 내 여러 페이지에서 반복되는 '스타일 유틸/레이아웃 패턴'을 partial로 분리해 import 하기 위한 위치입니다.

사용 가이드:
1. 한 페이지에서만 쓰는 스타일은 여기로 옮기지 않습니다 (해당 Page.vue의 <style scoped>). 
2. 2개 이상 페이지에서 동일하게 유지/동시에 바꿔야 하는 블록일 때만 partial 생성.
3. 파일명 규칙:
   - 관리자용: `_admin-<모듈명>.scss` (예: `_admin-settlement-summary.scss`)
   - 사용자용: `_user-<모듈명>.scss`
4. 내용은 반드시 해당 레이아웃 body 네임스페이스 내부에 작성:
   - 관리자: `body.admin-layout-active { ... }`
   - 사용자: `body.user-layout-active { ... }`
5. 변수/팔레트/spacing 등 토큰은 절대 여기에 두지 말고 `_variables-*.scss` 로 이동.
6. main-admin.scss 또는 main-user.scss 하단에 `@import './parts/<파일명에서_첫_언더바_제외>';` 방식으로 추가.
7. 컴포넌트화가 가능한 경우(반복 UI 구조 + 로직)라면 Vue 컴포넌트 우선 고려 후, 불필요할 때만 partial.

예시:
```scss
// _admin-settlement-summary.scss
body.admin-layout-active {
  .settlement-summary-grid { display:grid; gap:1rem; grid-template-columns:repeat(auto-fill,minmax(220px,1fr)); }
  .settlement-summary-card { background:#fff; border:1px solid #e5e7ec; border-radius:6px; padding:1rem; }
}
```

main-admin.scss 에서:
```scss
@import './parts/admin-settlement-summary';
```
