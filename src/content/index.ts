// 콘텐츠 로더.
// projects/<slug>/project.json, blog/<slug>/post.json 폴더와 companies.json 을 빌드 시 자동으로 읽는다.
// 사진은 선택이다. 쓸 때는 JSON 파일이 있는 폴더 기준 상대 경로("cover.png", "images/01.png")로 적는다.
// status 가 "draft" 인 글은 로컬 개발 서버(npm start)에서만 보이고 배포본에는 빠진다.

import companyList from "./companies.json";
import { kinds } from "./site";
import type { Company, Post, PostSource, Project, ProjectSource } from "./types";

const SHOW_DRAFTS = process.env.NODE_ENV !== "production";

const projectFiles = require.context("./projects", true, /project\.json$/);
const projectImages = require.context("./projects", true, /\.(jpe?g|png|webp|gif|svg|avif)$/i);
const postFiles = require.context("./blog", true, /post\.json$/);
const postImages = require.context("./blog", true, /\.(jpe?g|png|webp|gif|svg|avif)$/i);

/** "./hannam-house/project.json" → "hannam-house" */
const slugOf = (key: string) => key.split("/")[1];

const imageResolver =
  (ctx: WebpackRequireContext, where: string) =>
  (slug: string, file: string): string => {
    if (/^https?:\/\//.test(file)) return file;
    const key = `./${slug}/${file.replace(/^\.\//, "")}`;
    if (!ctx.keys().includes(key)) {
      console.warn(`[content] ${where}/${slug}: 이미지 없음 → ${file}`);
      return "";
    }
    const mod = ctx(key);
    return typeof mod === "string" ? mod : mod.default;
  };

const projectImage = imageResolver(projectImages, "projects");
const postImage = imageResolver(postImages, "blog");

const byDateDesc = (a: { date: string }, b: { date: string }) => b.date.localeCompare(a.date);

function loadProjects(): Project[] {
  const list: Project[] = [];
  for (const key of projectFiles.keys()) {
    const slug = slugOf(key);
    const { status, ...src } = projectFiles(key) as ProjectSource;
    if (status === "draft" && !SHOW_DRAFTS) continue;
    if (!src.title || !src.date || !(src.kind in kinds)) {
      console.warn(`[content] projects/${slug}: title·date·kind 를 확인하세요.`);
      continue;
    }
    list.push({
      ...src,
      slug,
      platforms: src.platforms ?? [],
      stack: src.stack ?? [],
      cover: src.cover ? projectImage(slug, src.cover) : undefined,
      gallery: (src.gallery ?? []).map((img) => ({ ...img, src: projectImage(slug, img.src) })),
    });
  }
  return list.sort(byDateDesc);
}

function loadPosts(): Post[] {
  const list: Post[] = [];
  for (const key of postFiles.keys()) {
    const slug = slugOf(key);
    const { status, ...src } = postFiles(key) as PostSource;
    if (status === "draft" && !SHOW_DRAFTS) continue;
    if (!src.title || !src.date) {
      console.warn(`[content] blog/${slug}: title·date 를 확인하세요.`);
      continue;
    }
    list.push({
      ...src,
      slug,
      cover: src.cover ? postImage(slug, src.cover) : undefined,
      blocks: (src.blocks ?? []).map((b) =>
        b.type === "image" ? { ...b, src: postImage(slug, b.src) } : b
      ),
    });
  }
  return list.sort(byDateDesc);
}

export const projects = loadProjects();
export const posts = loadPosts();
export const companies = companyList as Company[];

export const getProject = (slug: string) => projects.find((p) => p.slug === slug);
export const getPost = (slug: string) => posts.find((p) => p.slug === slug);
export const getPostsForProject = (slug: string) => posts.filter((p) => p.project === slug);
export const getCompany = (key?: string) => companies.find((c) => c.key === key);

/** 게임·회사 프로젝트를 뺀 개인 작업 (서비스·템플릿) */
export const workProjects = projects.filter((p) => p.kind === "product" || p.kind === "template");
export const games = projects.filter((p) => p.kind === "game");

/** 홈에 보일 4개: featured 를 먼저, 모자라면 최신순으로 채운다. */
export const featuredProjects = () =>
  [...projects.filter((p) => p.featured), ...projects.filter((p) => !p.featured)].slice(0, 4);

/** 목록 필터용: 사용된 플랫폼 태그 (많이 쓴 순) */
export const platformsOf = (list: Project[]) => {
  const count = new Map<string, number>();
  list.forEach((p) => p.platforms.forEach((t) => count.set(t, (count.get(t) ?? 0) + 1)));
  return Array.from(count.entries()).sort((a, b) => b[1] - a[1]);
};
