// 사이트 공통 정보. 이름·소개·연락처·기술 스택은 여기서만 수정한다.

export const site = {
  brand: "BONGBONG",
  brandKo: "봉봉",
  /** 서비스를 운영할 때 쓰는 이름. 엄마의 밥상 하단의 "made by" 와 같아야 한다. */
  studio: "봉봉스튜디오",
  /** 경력 표기. 해가 바뀌면 여기만 고친다. */
  experience: "5년 차",
  role: "모바일 개발자",
  tagline: "스토어 출시부터 운영까지, 앱을 끝까지 책임지는 5년 차 모바일 개발자",
  intro:
    "React Native·Expo 와 Android Kotlin 으로 관광, 헬스케어 밴드, 승강기 관제 앱을 만들어 Google Play·App Store 에 출시하고 운영해 왔습니다. 회사 밖에서는 웹 서비스와 게임을 직접 기획해 봉봉스튜디오라는 이름으로 운영합니다.",
  email: "namjh654@gmail.com",
  github: "https://github.com/namjh654",
  /** 문의 양식을 받는 서버 함수 주소 (contact-api 를 Vercel 에 배포한 주소 + /api/contact) */
  contactEndpoint: process.env.REACT_APP_CONTACT_ENDPOINT || "",
  /** 검색·공유용 사이트 주소. 다른 주소로 배포하면 빌드 환경변수 REACT_APP_SITE_URL 로 바꾼다. */
  url: (process.env.REACT_APP_SITE_URL || "https://namjh654.github.io").replace(/\/$/, ""),
  keywords:
    "모바일 개발자 포트폴리오, 5년 차 개발자, React Native, Expo, Android Kotlin, BLE, Kotlin Multiplatform, 앱 스토어 출시, 봉봉, 봉봉스튜디오",
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

/** 소개 페이지의 기술 스택 (실제 프로젝트에서 쓰는 것만) */
export const skills = [
  { area: "Mobile", items: ["React Native · Expo", "Android Kotlin", "Jetpack Compose", "Kotlin Multiplatform", "SwiftUI", "BLE", "FCM 푸시", "스토어 배포"] },
  { area: "Web", items: ["TypeScript", "React", "Next.js", "Vite", "Tailwind CSS", "TanStack Query"] },
  { area: "Backend · Infra", items: ["Supabase", "PostgreSQL · RLS", "Firebase", "Vercel", "GitHub Actions"] },
  { area: "Quality", items: ["Vitest", "Playwright", "ESLint · Prettier", "Kover · Turbine"] },
];
