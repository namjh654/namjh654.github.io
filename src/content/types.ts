import type { CategoryKey } from "./site";

export type ContentStatus = "published" | "draft";

export interface GalleryImage {
  src: string;
  caption?: string;
  /** true 면 갤러리에서 한 줄 전체 폭으로 보여준다. */
  wide?: boolean;
}

export interface ProjectSection {
  heading?: string;
  body: string;
}

export interface Credit {
  role: string;
  name: string;
}

/** src/content/projects/<slug>/project.json 의 형태 */
export interface ProjectSource {
  title: string;
  titleEn?: string;
  category: CategoryKey;
  date: string;
  location?: string;
  area?: string;
  client?: string;
  scope?: string[];
  summary: string;
  cover: string;
  featured?: boolean;
  status?: ContentStatus;
  sections?: ProjectSection[];
  gallery?: GalleryImage[];
  credits?: Credit[];
}

export interface Project extends Omit<ProjectSource, "status"> {
  slug: string;
  year: number;
}

export type BehindBlock =
  | { type: "text"; heading?: string; body: string }
  | { type: "image"; src: string; caption?: string }
  | { type: "quote"; body: string; by?: string };

/** src/content/behind/<slug>/post.json 의 형태 */
export interface BehindSource {
  title: string;
  date: string;
  excerpt: string;
  cover: string;
  /** 연결할 프로젝트 폴더 이름(slug). 없으면 스튜디오 일반 이야기. */
  project?: string;
  tags?: string[];
  status?: ContentStatus;
  blocks: BehindBlock[];
}

export interface BehindPost extends Omit<BehindSource, "status"> {
  slug: string;
}
