// 콘텐츠 로더.
// projects/<slug>/project.json, blog/<slug>/post.json 폴더와 companies.json 을 빌드 시 자동으로 읽는다.
// 사진은 선택이다. 쓸 때는 JSON 파일이 있는 폴더 기준 상대 경로("cover.png", "images/01.png")로 적는다.
// status 가 "draft" 인 글은 로컬 개발 서버(npm start)에서만 보이고 배포본에는 빠진다.

import companyList from "./companies.json";
import seriesList from "./series.json";
import { kinds } from "./site";
import type { Company, Post, PostSource, Project, ProjectSource, Screenshot, Series } from "./types";

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

/** npm run screenshots 가 만든 기본 스크린샷 */
const autoScreenshots = (slug: string): Screenshot[] =>
  (
    [
      ["auto-desktop.jpg", "desktop"],
      ["auto-mobile.jpg", "mobile"],
    ] as const
  )
    .filter(([file]) => projectImages.keys().includes(`./${slug}/${file}`))
    .map(([file, device]) => ({ src: file, device }));

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
    const screenshots = (src.screenshots ?? autoScreenshots(slug)).map((s) => ({
      ...s,
      src: projectImage(slug, s.src),
    }));
    list.push({
      ...src,
      slug,
      platforms: src.platforms ?? [],
      stack: src.stack ?? [],
      screenshots,
      cover: src.cover
        ? projectImage(slug, src.cover)
        : screenshots.find((s) => s.device !== "mobile")?.src,
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

/** 공개된 글이 한 편 이상 있는 시리즈만 */
export const series = (seriesList as Series[]).filter((s) => posts.some((p) => p.series === s.slug));
export const getSeries = (slug?: string) => series.find((s) => s.slug === slug);
/** 시리즈 글을 순서대로 (seriesOrder, 없으면 날짜순) */
export const getSeriesPosts = (slug: string) =>
  posts
    .filter((p) => p.series === slug)
    .sort((a, b) => (a.seriesOrder ?? 0) - (b.seriesOrder ?? 0) || a.date.localeCompare(b.date));

/** 자체 프로젝트: 직접 만든 서비스·템플릿·게임 */
export const selfProjects = projects.filter((p) => p.kind !== "career");
/** 커리어 프로젝트: 회사에서 만든 것 */
export const careerProjects = projects.filter((p) => p.kind === "career");
export const games = projects.filter((p) => p.kind === "game");

/** "2023.06 – 2024.12" → "1년 7개월" ("현재"는 오늘 기준). 형식이 다르면 undefined */
export const tenure = (period?: string) => {
  const m = period?.match(/(\d{4})\.(\d{2})\s*[–-]\s*(?:(\d{4})\.(\d{2})|현재)/);
  if (!m) return undefined;
  const now = new Date();
  const [y2, m2] = m[3] ? [Number(m[3]), Number(m[4])] : [now.getFullYear(), now.getMonth() + 1];
  const months = (y2 - Number(m[1])) * 12 + (m2 - Number(m[2])) + 1;
  const y = Math.floor(months / 12);
  const r = months % 12;
  return [y && `${y}년`, r && `${r}개월`].filter(Boolean).join(" ");
};

/** 홈에 보일 4개: featured 를 먼저, 모자라면 최신순으로 채운다. */
export const featuredProjects = () =>
  [...projects.filter((p) => p.featured), ...projects.filter((p) => !p.featured)].slice(0, 4);
