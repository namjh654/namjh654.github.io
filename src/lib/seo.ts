// 페이지별 검색·공유 메타 태그.
// 빌드 후 scripts/prerender.js 가 각 페이지를 HTML 로 저장하므로, 여기서 넣은 태그가 정적 HTML 에 그대로 남는다.
import { useEffect } from "react";
import { site, skills } from "../content/site";

interface SeoOptions {
  title?: string;
  description?: string;
  image?: string;
  /** 현재 페이지 경로. 예) "/projects/hannam-house" */
  path: string;
  type?: "website" | "article";
  jsonLd?: Record<string, unknown>;
}

// GitHub Pages 는 /a/b 를 /a/b/ 로 보내므로 정식 주소도 슬래시로 끝나게 맞춘다.
const TRAILING_SLASH = process.env.REACT_APP_DEPLOY_TARGET !== "cloudflare";

/** 이미지 등 파일 주소 */
export const absoluteUrl = (path: string) =>
  /^https?:\/\//.test(path) ? path : site.url + path;

/** 페이지 정식 주소 (scripts/routes.js 의 pageUrl 과 같은 규칙) */
export const pageUrl = (path: string) =>
  site.url + (path === "/" || !TRAILING_SLASH || path.endsWith("/") ? path : `${path}/`);

const setMeta = (attr: "name" | "property", key: string, content: string) => {
  let el = document.head.querySelector<HTMLMetaElement>(`meta[${attr}="${key}"]`);
  if (!content) {
    el?.remove();
    return;
  }
  if (!el) {
    el = document.createElement("meta");
    el.setAttribute(attr, key);
    document.head.appendChild(el);
  }
  el.content = content;
};

const setLink = (rel: string, href: string) => {
  let el = document.head.querySelector<HTMLLinkElement>(`link[rel="${rel}"]`);
  if (!el) {
    el = document.createElement("link");
    el.rel = rel;
    document.head.appendChild(el);
  }
  el.href = href;
};

export const personLd = {
  "@context": "https://schema.org",
  "@type": "Person",
  name: site.brandKo,
  alternateName: [site.brand, site.studio],
  jobTitle: "Mobile Developer",
  description: site.intro,
  url: site.url,
  email: `mailto:${site.email}`,
  sameAs: [site.github],
  knowsAbout: skills.flatMap((s) => s.items),
};

export function useSeo({ title, description, image, path, type = "website", jsonLd }: SeoOptions) {
  const ld = jsonLd ? JSON.stringify(jsonLd) : "";

  useEffect(() => {
    const fullTitle = title ? `${title} | ${site.brandKo}` : `${site.brandKo} — ${site.tagline}`;
    const desc = description || site.intro;
    const url = pageUrl(path);

    document.title = fullTitle;
    setMeta("name", "description", desc);
    setMeta("name", "keywords", site.keywords);
    setMeta("property", "og:type", type);
    setMeta("property", "og:site_name", site.brandKo);
    setMeta("property", "og:locale", "ko_KR");
    setMeta("property", "og:title", fullTitle);
    setMeta("property", "og:description", desc);
    setMeta("property", "og:url", url);
    setMeta("property", "og:image", image ? absoluteUrl(image) : "");
    setMeta("name", "twitter:card", image ? "summary_large_image" : "summary");
    setMeta("name", "google-site-verification", site.verification.google);
    setMeta("name", "naver-site-verification", site.verification.naver);
    setLink("canonical", url);

    let script = document.getElementById("ld-json") as HTMLScriptElement | null;
    if (!ld) {
      script?.remove();
      return;
    }
    if (!script) {
      script = document.createElement("script");
      script.id = "ld-json";
      script.type = "application/ld+json";
      document.head.appendChild(script);
    }
    script.textContent = ld;
  }, [title, description, image, path, type, ld]);
}

export const formatDate = (date: string) => date.replace(/-/g, ". ");
