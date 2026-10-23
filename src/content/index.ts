// 콘텐츠 로더.
// projects/<slug>/project.json, behind/<slug>/post.json 폴더를 빌드 시 자동으로 읽는다.
// 이미지 경로는 각 JSON 파일이 있는 폴더 기준 상대 경로("cover.jpg", "images/01.jpg")로 적는다.
// status 가 "draft" 인 글은 로컬 개발 서버(npm start)에서만 보이고 배포본에는 빠진다.

import { categories } from "./site";
import type {
  BehindPost,
  BehindSource,
  Project,
  ProjectSource,
} from "./types";

const SHOW_DRAFTS = process.env.NODE_ENV !== "production";

const projectFiles = require.context("./projects", true, /project\.json$/);
const projectImages = require.context(
  "./projects",
  true,
  /\.(jpe?g|png|webp|gif|svg|avif)$/i
);
const behindFiles = require.context("./behind", true, /post\.json$/);
const behindImages = require.context(
  "./behind",
  true,
  /\.(jpe?g|png|webp|gif|svg|avif)$/i
);

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
const behindImage = imageResolver(behindImages, "behind");

const byDateDesc = (a: { date: string }, b: { date: string }) =>
  b.date.localeCompare(a.date);

function loadProjects(): Project[] {
  const list: Project[] = [];
  for (const key of projectFiles.keys()) {
    const slug = slugOf(key);
    const { status, ...src } = projectFiles(key) as ProjectSource;
    if (status === "draft" && !SHOW_DRAFTS) continue;
    if (!src.title || !src.date || !(src.category in categories)) {
      console.warn(`[content] projects/${slug}: title·date·category 를 확인하세요.`);
      continue;
    }
    list.push({
      ...src,
      slug,
      year: Number(src.date.slice(0, 4)),
      cover: projectImage(slug, src.cover),
      gallery: (src.gallery ?? []).map((img) => ({
        ...img,
        src: projectImage(slug, img.src),
      })),
    });
  }
  return list.sort(byDateDesc);
}

function loadBehind(): BehindPost[] {
  const list: BehindPost[] = [];
  for (const key of behindFiles.keys()) {
    const slug = slugOf(key);
    const { status, ...src } = behindFiles(key) as BehindSource;
    if (status === "draft" && !SHOW_DRAFTS) continue;
    if (!src.title || !src.date) {
      console.warn(`[content] behind/${slug}: title·date 를 확인하세요.`);
      continue;
    }
    list.push({
      ...src,
      slug,
      cover: behindImage(slug, src.cover),
      blocks: (src.blocks ?? []).map((b) =>
        b.type === "image" ? { ...b, src: behindImage(slug, b.src) } : b
      ),
    });
  }
  return list.sort(byDateDesc);
}

export const projects = loadProjects();
export const behindPosts = loadBehind();

export const getProject = (slug: string) =>
  projects.find((p) => p.slug === slug);

export const getBehindPost = (slug: string) =>
  behindPosts.find((p) => p.slug === slug);

export const getBehindForProject = (slug: string) =>
  behindPosts.filter((p) => p.project === slug);

export const featuredProjects = () => {
  const featured = projects.filter((p) => p.featured);
  return (featured.length ? featured : projects).slice(0, 4);
};
