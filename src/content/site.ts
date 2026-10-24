// 사이트 공통 정보. 이름·소개·연락처·기술 스택은 여기서만 수정한다.

export const site = {
  brand: "BONGBONG",
  brandKo: "봉봉",
  tagline: "기획부터 배포와 운영까지, 끝까지 만드는 개발자",
  intro:
    "웹 서비스와 관리자, 모바일 앱과 게임을 직접 기획하고 만들어 운영합니다. 다음 프로젝트를 더 빨리 시작하도록 관리자·KMP 템플릿도 만들어 씁니다.",
  email: "namjh654@gmail.com",
  github: "https://github.com/namjh654",
  /** 문의 양식을 받는 서버 함수 주소 (contact-api 를 Vercel 에 배포한 주소 + /api/contact) */
  contactEndpoint: process.env.REACT_APP_CONTACT_ENDPOINT || "",
  /** 검색·공유용 사이트 주소. 다른 주소로 배포하면 빌드 환경변수 REACT_APP_SITE_URL 로 바꾼다. */
  url: (process.env.REACT_APP_SITE_URL || "https://namjh654.github.io").replace(/\/$/, ""),
  keywords: "개발자 포트폴리오, 풀스택 개발자, React, Next.js, Kotlin Multiplatform, Supabase, 게임 개발, 봉봉",
  /** 검색 엔진 소유 확인 코드 (Google Search Console / 네이버 서치어드바이저 의 content 값) */
  verification: {
    google: "",
    naver: "",
  },
};

/** project.json 의 "kind" */
export const kinds = {
  product: "서비스",
  template: "템플릿",
  game: "게임",
  career: "회사 프로젝트",
} as const;

export type KindKey = keyof typeof kinds;

/** project.json 의 "stage" */
export const stages = {
  live: "운영 중",
  dev: "개발 중",
  archived: "종료",
} as const;

export type StageKey = keyof typeof stages;

/** 소개 페이지의 기술 스택 (실제 프로젝트에서 쓰는 것만) */
export const skills = [
  { area: "Web", items: ["TypeScript", "React", "Next.js", "Vite", "Tailwind CSS", "TanStack Query"] },
  { area: "App · Game", items: ["React Native · Expo", "Android Kotlin", "Kotlin Multiplatform", "Jetpack Compose", "SwiftUI", "BLE"] },
  { area: "Backend · Infra", items: ["Supabase", "PostgreSQL · RLS", "Firebase", "Vercel", "GitHub Actions"] },
  { area: "Quality", items: ["Vitest", "Playwright", "ESLint · Prettier", "Kover · Turbine"] },
];
