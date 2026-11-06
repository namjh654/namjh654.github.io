// 사이트 공통 정보. 이름·소개·연락처·기술 스택은 여기서만 수정한다.

export const site = {
  brand: "BONGBONG",
  brandKo: "봉봉",
  /** 서비스를 운영할 때 쓰는 이름. 엄마의 밥상 하단의 "made by" 와 같아야 한다. */
  studio: "봉봉스튜디오",
  /** 경력 표기. 해가 바뀌면 여기만 고친다. */
  experience: "5년 차",
  role: "모바일 · 풀스택 개발자",
  tagline: "모바일 앱부터 웹·백엔드·인프라까지, 서비스 전체를 만드는 5년 차 풀스택 개발자",
  intro:
    "React Native·Expo 와 Android Kotlin 으로 관광, 헬스케어 밴드, 승강기 관제 앱을 만들어 Google Play·App Store 에 출시하고 운영해 왔습니다. 앱에서 그치지 않고 웹 서비스와 관리자 화면, Supabase·Firebase 백엔드, Vercel·GitHub Actions 배포 환경까지 직접 구성합니다.",
  /** 회사 밖 활동. 소개 페이지에서 intro 다음에 보인다. */
  studioIntro: "회사 밖에서는 웹 서비스와 게임을 직접 기획해 봉봉스튜디오라는 이름으로 운영합니다.",
  email: "namjh654@gmail.com",
  github: "https://github.com/namjh654",
  /** 문의 양식을 받는 서버 함수 주소 (contact-api 를 Vercel 에 배포한 주소 + /api/contact) */
  contactEndpoint: process.env.REACT_APP_CONTACT_ENDPOINT || "",
  /** 검색·공유용 사이트 주소. 다른 주소로 배포하면 빌드 환경변수 REACT_APP_SITE_URL 로 바꾼다. */
  url: (process.env.REACT_APP_SITE_URL || "https://namjh654.github.io").replace(/\/$/, ""),
  keywords:
    "모바일 개발자 포트폴리오, 풀스택 개발자, 5년 차 개발자, React Native, Expo, Android Kotlin, BLE, Kotlin Multiplatform, Next.js, Supabase, Firebase, 앱 스토어 출시, 봉봉, 봉봉스튜디오",
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

/** post.json 의 "topic". 블로그 "주제별" 보기에 이 순서로 보인다. */
export const topics = {
  mobile: "모바일 앱",
  product: "서비스 만들기",
  infra: "배포 · 인프라",
  portfolio: "포트폴리오 제작",
} as const;

export type TopicKey = keyof typeof topics;

/** project.json 의 "stage" */
export const stages = {
  live: "운영 중",
  dev: "개발 중",
  archived: "종료",
} as const;

export type StageKey = keyof typeof stages;

/**
 * 프로젝트 화면 구분. project.json 의 platforms 값으로 자동 분류한다.
 * 프로젝트 목록의 "웹 · 앱 · 데스크탑" 필터가 이 순서로 보인다.
 */
export const platformGroups = {
  app: { label: "앱", match: ["Android", "iOS"] },
  web: { label: "웹", match: ["Web", "PWA", "Admin"] },
  desktop: { label: "데스크탑", match: ["Windows", "macOS", "Linux"] },
} as const;

export type PlatformGroupKey = keyof typeof platformGroups;

/**
 * 기술 스택 카탈로그. 홈·소개의 "기술 스택" 과 프로젝트 목록의 기술 필터가 함께 쓴다.
 * 각 항목은 project.json 의 stack 값 중 match 에 맞는 것을 모아 "쓴 프로젝트 수" 를 센다.
 * 새 기술을 프로젝트에 적었다면 여기에도 항목(또는 match)을 추가한다. 맞는 프로젝트가 없는 항목은 숨긴다.
 */
export const stackCatalog: { area: string; items: { name: string; match: RegExp }[] }[] = [
  {
    area: "Mobile",
    items: [
      { name: "React Native", match: /^React Native$/ },
      { name: "Expo", match: /^Expo$/ },
      { name: "Android · Kotlin", match: /^(Kotlin|Android)$/ },
      { name: "Kotlin Multiplatform", match: /^Kotlin Multiplatform$/ },
      { name: "Jetpack Compose", match: /^Jetpack Compose$/ },
      { name: "SwiftUI", match: /^SwiftUI$/ },
      { name: "Ktor · Koin", match: /^(Ktor|Koin)$/ },
      { name: "SQLDelight", match: /^SQLDelight$/ },
      { name: "BLE 기기 연동", match: /^(BLE|Band SDK)$/ },
    ],
  },
  {
    area: "Web",
    items: [
      { name: "TypeScript", match: /^TypeScript$/ },
      { name: "React", match: /^React( \d+)?( · Vite)?$/ },
      { name: "Next.js", match: /^Next\.js/ },
      { name: "Vite", match: /Vite/ },
      { name: "Tailwind CSS", match: /^Tailwind CSS/ },
      { name: "TanStack Query", match: /^TanStack Query$/ },
      { name: "Zustand", match: /^Zustand$/ },
      { name: "PWA · 웹 푸시", match: /^FCM 웹 푸시$/ },
    ],
  },
  {
    area: "Desktop",
    items: [
      { name: "Tauri", match: /^Tauri/ },
      { name: "Rust", match: /^Rust$/ },
    ],
  },
  {
    area: "Backend",
    items: [
      { name: "Supabase", match: /^Supabase/ },
      { name: "PostgreSQL · RLS", match: /^PostgreSQL/ },
      { name: "Edge Functions · pg_cron", match: /^(Edge Functions|pg_cron)/ },
      { name: "Firebase", match: /^(Firebase|Firestore)/ },
      { name: "REST API", match: /^REST API$/ },
    ],
  },
  {
    area: "Infra · DevOps",
    items: [
      { name: "Vercel", match: /^Vercel$/ },
      { name: "GitHub Actions", match: /^GitHub Actions$/ },
      { name: "Firebase Hosting", match: /^Firebase Hosting$/ },
    ],
  },
  {
    area: "Quality",
    items: [
      { name: "Playwright", match: /^Playwright$/ },
      { name: "Vitest", match: /^Vitest$/ },
    ],
  },
];
