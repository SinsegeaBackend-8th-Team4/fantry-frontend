# Fantry

## 📖 프로젝트 소개

한정판 중고 굿즈 거래 서비스

## 🛠 기술 스택

### 프레임워크

- **Vue3** - 메인 프레임워크
- **vue-router** - 라우팅
- **Pinia** - 상태 관리

### 빌드 도구

- **[Vite](https://vite.dev/)** - 빌드 도구 ([설정 참고](https://vite.dev/config/))

## 🚀 프로젝트 설정

### 사전 준비

자바스크립트 런타임이 필요합니다:

- **[Node.js](https://nodejs.org/ko/)** (권장)
- **[Bun](https://bun.com/)**

### 모듈 설치

**Node.js 사용시:**

```bash
npm install
```

**Bun 사용시:**

```bash
bun install
```

### 개발 서버 실행

**Node.js 사용시:**

```bash
npm run dev
```

**Bun 사용시:**

```bash
bun dev
```

### 프로덕션 빌드

**Node.js 사용시:**

```bash
npm run build
```

**Bun 사용시:**

```bash
bun run build
```

## 🔑 환경 변수 설정

### 결제 API 키 설정

**방법 1: 환경변수로 실행**

```bash
BOOTPAY_ID=<ApplicationKey> npm run dev
BOOTPAY_ID=<ApplicationKey> npm run build

# 예시
# BOOTPAY_ID=1234132455 npm run dev
```

**방법 2: .env 파일 수정**

1. `.env.`로 시작하는 파일을 열어주세요
2. `VITE_BOOTPAY_APPLICATION_ID` 값을 수정하세요
3. 개발 서버를 재시작하세요

## 📋 Git 및 PR 규칙

### 브랜치 전략

- `develop` - 메인 개발 브랜치
- `feat/*` - 새로운 기능 개발
- `fix/*` - 버그 수정
- `hotfix/*` - 긴급 수정

### 브랜치 명명 규칙

```
feat/기능명
fix/이슈번호-간단한설명
hotfix/긴급수정내용
```

### 커밋 메시지 규칙

```
타입: 간단한 설명

자세한 설명 (선택사항)

- feat: 새로운 기능
- fix: 버그 수정
- docs: 문서 수정
- style: 코드 포맷팅, 세미콜론 누락 등
- refactor: 코드 리팩토링
- test: 테스트 코드
- chore: 빌드 업무, 패키지 매니저 설정 등
```
