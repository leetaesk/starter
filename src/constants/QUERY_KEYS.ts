export const QUERY_KEYS = {
  // 예시 — 계층형 factory 패턴
  // users: {
  //   all: ['users'] as const,
  //   lists: () => [...QUERY_KEYS.users.all, 'list'] as const,
  //   detail: (id: string) => [...QUERY_KEYS.users.all, 'detail', id] as const,
  // },
} as const;
