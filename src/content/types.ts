import type { KindKey, StageKey, TopicKey } from "./site";

export type Visibility = "published" | "draft";

export interface GalleryImage {
  src: string;
  caption?: string;
  /** true 면 갤러리에서 한 줄 전체 폭으로 보여준다. */
  wide?: boolean;
}

export interface Screenshot {
  src: string;
  /** desktop: 브라우저 틀, mobile: 폰 틀 */
  device?: "desktop" | "mobile";
  caption?: string;
}

export interface Section {
  heading?: string;
  body: string;
}

export interface Metric {
  label: string;
  value: string;
}

export interface Links {
  /** 운영 중인 서비스 주소 */
  live?: string;
  /** 공개 저장소 주소 */
  github?: string;
  /** 스토어 주소 */
  store?: string;
}

/** src/content/projects/<slug>/project.json 의 형태 */
export interface ProjectSource {
  kind: KindKey;
  title: string;
  titleEn?: string;
  /** 한두 문장 소개. 카드와 상세 상단에 쓰인다. */
  summary: string;
  /** 정렬 기준일 (YYYY-MM-DD, 최근 작업일) */
  date: string;
  /** 화면에 보일 기간. 예) "2026.07 – 현재" */
  period?: string;
  role?: string;
  /** 운영 주체·형태. 예) "봉봉스튜디오 · 무료 서비스 (상업화 전)" */
  operator?: string;
  /** career 일 때 companies.json 의 key */
  company?: string;
  platforms: string[];
  stack: string[];
  stage?: StageKey;
  links?: Links;
  /** 저장소가 비공개면 true ("비공개 저장소" 로 표시) */
  privateRepo?: boolean;
  metrics?: Metric[];
  sections?: Section[];
  /** 대표 사진 (선택). 없으면 첫 데스크톱 스크린샷을 쓴다. */
  cover?: string;
  /**
   * 서비스 화면 (선택). 비워 두면 폴더의 auto-desktop.jpg / auto-mobile.jpg
   * (npm run screenshots 로 운영 주소를 찍은 파일)를 자동으로 쓴다.
   */
  screenshots?: Screenshot[];
  gallery?: GalleryImage[];
  featured?: boolean;
  status?: Visibility;
}

export interface Project extends Omit<ProjectSource, "status"> {
  slug: string;
}

export type PostBlock =
  | { type: "text"; heading?: string; body: string }
  | { type: "code"; lang?: string; body: string }
  | { type: "image"; src: string; caption?: string }
  | { type: "quote"; body: string; by?: string };

/** src/content/blog/<slug>/post.json 의 형태 */
export interface PostSource {
  title: string;
  date: string;
  excerpt: string;
  /** 대표 사진 (선택) */
  cover?: string;
  /** 연결할 프로젝트 폴더 이름(slug) */
  project?: string;
  tags?: string[];
  /** 주제 (site.ts 의 topics 키). 블로그의 "주제별" 보기에서 묶는다. */
  topic?: TopicKey;
  /** 시리즈 (series.json 의 slug)와 그 안의 순서(1부터) */
  series?: string;
  seriesOrder?: number;
  status?: Visibility;
  blocks: PostBlock[];
}

/** src/content/series.json 의 한 항목 */
export interface Series {
  slug: string;
  title: string;
  /** 시리즈 소개 한두 문장 */
  description: string;
}

export interface Post extends Omit<PostSource, "status"> {
  slug: string;
}

/** src/content/companies.json 의 한 항목 (위에서부터 시간순, 오래된 회사 먼저) */
export interface Company {
  key: string;
  name: string;
  nameEn?: string;
  period?: string;
  role?: string;
  summary?: string;
  /** 재직 중 참여한 프로젝트. 상세 글이 있으면 slug 로 연결한다. */
  projects: {
    name: string;
    summary?: string;
    slug?: string;
    /** 스토어·서비스 링크 */
    links?: { label: string; url: string }[];
  }[];
}
