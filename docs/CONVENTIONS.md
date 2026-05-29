# 컨벤션

이 프로젝트의 코드 작성 규칙을 정리한 문서다. 폴더 구조·경로 별칭·Prettier 설정 등 개요는 [README](../README.md)를 참고하고, 이 문서는 실제 코드를 작성할 때의 세부 규칙을 다룬다.

---

## 1. 네이밍 규칙

| 대상            | 규칙                            | 예시                                         |
| --------------- | ------------------------------- | -------------------------------------------- |
| 컴포넌트 파일   | `PascalCase.tsx`                | `HomePage.tsx`, `Layout.tsx`                 |
| 컴포넌트 이름   | 파일명과 동일하게 `PascalCase`  | `function HomePage()`                        |
| 페이지 폴더     | `kebab-case`                    | `ui/home/`, `ui/user-detail/`                |
| 일반 폴더       | `kebab-case`                    | `apps/layout/`                               |
| 훅 파일         | `useXxx.ts` (camelCase)         | `useAuth.ts`                                 |
| 유틸 파일       | `camelCase.ts`                  | `formatDate.ts`                              |
| 상수 파일       | **export 상수명 그대로 대문자** | `ENDPOINTS.ts`, `QUERY_KEYS.ts`, `ROUTES.ts` |
| 상수 객체/키    | `UPPER_SNAKE_CASE`              | `ENDPOINTS.USER_DETAIL`                      |
| 타입/인터페이스 | `PascalCase`                    | `RoutePath`, `UserProfile`                   |

- 상수 파일명은 그 안에서 export 하는 상수 이름을 그대로 따른다. 예: `export const ROUTES`를 담은 파일은 `ROUTES.ts`.
- 한 파일에서 여러 상수를 export 하지 않는다. 상수 묶음 하나당 파일 하나.

---

## 2. 폴더 / 파일 구조

```
src/
├── apps/         # 앱 셸 — 라우팅, 공통 레이아웃
├── ui/           # 페이지 단위 (페이지별 폴더)
├── components/   # 여러 페이지에서 공유하는 재사용 컴포넌트
├── features/     # 도메인별 기능 모듈
├── hooks/        # 공용 커스텀 훅
├── store/        # 전역 상태
├── schemas/      # 검증 스키마 (zod 등)
├── types/        # 공용 타입
├── utils/        # 유틸 함수
├── constants/    # 상수
└── assets/       # 정적 자산 (icons/, images/)
```

### 배치 기준

- 도메인에 의존하지 않는 범용 UI(버튼·인풋·모달 등)는 `components/`.
- 특정 페이지에서만 의미 있는 화면·섹션은 `ui/<page>/`.

### 페이지 추가 흐름

1. `src/ui/<page-name>/` 폴더 생성 (`kebab-case`)
2. 페이지 컴포넌트 + 그 페이지에서만 쓰는 하위 컴포넌트를 같이 둠
3. [src/apps/router.tsx](../src/apps/router.tsx)의 `children`에 라우트 등록
4. 경로 문자열은 [src/constants/ROUTES.ts](../src/constants/ROUTES.ts)에 추가하고 참조

---

## 3. 컴포넌트 작성 패턴

### 기본형

arrow 함수 + named export(`export const`). default export는 쓰지 않는다.

```tsx
export const HomePage = () => {
  return <div>Home</div>;
};
```

- 한 파일에 컴포넌트 하나, 컴포넌트 이름은 파일명과 일치시킨다.
- named export로 통일한다 — import 시 이름이 고정돼 rename·auto-import가 안전하고, React Router v7 `lazy` 라우트(`Component` named export)와도 맞는다.

### Props

```tsx
interface UserCardProps {
  id: string;
  name: string;
  onSelect?: (id: string) => void;
}

export const UserCard = ({ id, name, onSelect }: UserCardProps) => {
  return <button onClick={() => onSelect?.(id)}>{name}</button>;
};
```

- props 타입은 `interface`로 정의하고 이름은 `<컴포넌트명>Props`.
- props는 구조 분해해서 받는다.
- HTML 요소를 감싸는 컴포넌트면 `extends`로 기본 props를 물려받는다.

```tsx
interface ButtonProps extends ComponentProps<'button'> {
  variant?: 'primary' | 'ghost';
}
```

### HOC로 감쌀 때

`memo`·`forwardRef` 등 HOC로 감싸면 안쪽 arrow 함수가 익명이 돼 DevTools에서 이름을 잃는다. 안쪽 함수에 이름을 주거나 `displayName`을 지정한다.

```tsx
export const Button = memo(function Button(props: ButtonProps) {
  return <button {...props} />;
});
```

---

## 4. 상수 / 타입 / 스키마

### 상수 객체

`as const`로 고정한다. 파라미터가 필요한 값은 factory 함수로 정의한다.

```ts
// ENDPOINTS.ts
export const ENDPOINTS = {
  USERS: '/users',
  USER_DETAIL: (id: string) => `/users/${id}`,
} as const;
```

```ts
// QUERY_KEYS.ts — 계층형 factory 패턴
export const QUERY_KEYS = {
  users: {
    all: ['users'] as const,
    lists: () => [...QUERY_KEYS.users.all, 'list'] as const,
    detail: (id: string) => [...QUERY_KEYS.users.all, 'detail', id] as const,
  },
} as const;
```

### 상수에서 타입 파생

값과 타입을 따로 선언하지 말고 상수 객체에서 타입을 파생시킨다.

```ts
// ROUTES.ts
export const ROUTES = {
  HOME: '/',
} as const;

export type RoutePath = (typeof ROUTES)[keyof typeof ROUTES];
```

### 타입

- 공용 타입은 `types/`에, 특정 컴포넌트/기능 전용 타입은 그 파일 안에 둔다.
- **컴포넌트 props는 `interface`.** 평탄한 객체이고 HTML 요소·다른 컴포넌트 props를 `extends`로 확장하는 일이 잦은데, `interface extends`가 확장 문법도 깔끔하고 인터섹션(`&`)보다 타입체크 성능이 좋다.
- **그 외 데이터 타입(DTO·응답·파생 타입)은 `type`.** 판별 유니온·`Pick`/`Omit` 등 유틸리티·zod 파생(`z.infer`)이 흔해 자연히 `type`이 맞고, hover 시 실제 형태가 펼쳐져 가독성도 좋다.
- 예외: 전역/서드파티 타입을 augment 하는 선언 병합(declaration merging)이 필요할 때만 그 대상에 `interface`.

### 스키마

- zod 등 검증 스키마는 `schemas/`에 둔다.
- 스키마에서 타입을 파생시켜 한 곳에서 관리한다.

```ts
import { z } from 'zod';

export const userSchema = z.object({
  id: z.string(),
  name: z.string(),
});

export type User = z.infer<typeof userSchema>;
```

---

## 5. import

Prettier 플러그인이 자동 정렬한다. 그룹 사이는 빈 줄로 구분된다.

```ts
import { useState } from 'react';

// 1. react

import { createBrowserRouter } from 'react-router-dom';

// 2. 외부 패키지

import Layout from '@/apps/layout/Layout';

// 3. @/* (절대 경로)

import { helper } from './helper';

// 4. 상대 경로
```

- 같은 디렉터리 내부 참조 외에는 `@/*` 절대 경로를 쓴다.
- 순서는 직접 맞추지 않아도 저장/포맷 시 정렬된다.
