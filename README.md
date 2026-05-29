# starter

React 19 + TypeScript + Vite 기반 프로젝트 스타터.

## 시작하기

이 레포는 **template repository**다. 새 프로젝트는 클론하지 말고 아래 방법으로 시작한다 (둘 다 깃 히스토리 없이 깨끗하게 출발한다).

- **GitHub** — 레포 상단의 **"Use this template"** 버튼으로 새 레포 생성
- **CLI** — `npx degit leetaesk/starter my-app`

가져온 뒤:

```bash
pnpm install
pnpm dev
```

나머지 스크립트(`build`·`preview`·`lint`)는 `package.json` 참고. 첫 페이지·라우트 추가나 코드 작성 규칙은 [docs/CONVENTIONS.md](docs/CONVENTIONS.md)를 따른다.

## 구성

`src/` 아래가 역할별 폴더로 나뉘어 있다. 앱 셸(라우팅·공통 레이아웃), 페이지 단위, 공용 컴포넌트, 도메인 기능 모듈, 그리고 훅·상태·스키마·타입·유틸·상수 자리가 미리 잡혀 있다.

React Router 라우팅과 `ENDPOINTS`·`QUERY_KEYS`·`ROUTES` 상수 스캐폴드가 준비돼 있고, 경로 별칭(`@/*` → `src/*`)·ESLint·Prettier(import 자동 정렬) 세팅이 모두 갖춰져 있어 설치 직후 바로 개발에 들어갈 수 있다.

## 더 알아보기

폴더 구조 상세, 네이밍·컴포넌트·타입·상수 작성 규칙은 [docs/CONVENTIONS.md](docs/CONVENTIONS.md)에 정리돼 있다.
