// 사이트의 모든 공개 페이지 목록. prerender·sitemap 이 함께 쓴다.
const fs = require("fs");
const path = require("path");

const contentDir = path.join(__dirname, "..", "src", "content");

function readEntries(kind, file) {
  const dir = path.join(contentDir, kind);
  if (!fs.existsSync(dir)) return [];
  return fs
    .readdirSync(dir, { withFileTypes: true })
    .filter((d) => d.isDirectory() && fs.existsSync(path.join(dir, d.name, file)))
    .map((d) => ({ slug: d.name, ...JSON.parse(fs.readFileSync(path.join(dir, d.name, file), "utf8")) }))
    .filter((e) => e.status !== "draft");
}

function getRoutes() {
  const projects = readEntries("projects", "project.json");
  const posts = readEntries("blog", "post.json");
  const newest = (list) => list.map((e) => e.date).sort().pop();
  const games = projects.filter((p) => p.kind === "game");
  return [
    { path: "/", lastmod: newest([...projects, ...posts]), priority: "1.0" },
    { path: "/projects", lastmod: newest(projects.filter((p) => p.kind !== "game")), priority: "0.9" },
    ...(games.length ? [{ path: "/games", lastmod: newest(games), priority: "0.8" }] : []),
    ...projects.map((p) => ({ path: `/projects/${p.slug}`, lastmod: p.date, priority: "0.8" })),
    { path: "/career", priority: "0.7" },
    { path: "/blog", lastmod: newest(posts), priority: "0.7" },
    ...posts.map((p) => ({ path: `/blog/${p.slug}`, lastmod: p.date, priority: "0.6" })),
    { path: "/about", priority: "0.6" },
  ];
}

const siteUrl = () => (process.env.REACT_APP_SITE_URL || "https://namjh654.github.io").replace(/\/$/, "");
const isCloudflare = () => process.env.REACT_APP_DEPLOY_TARGET === "cloudflare";

/** GitHub Pages 는 디렉터리 주소를 /a/b/ 로 정규화하므로 정식 주소도 맞춘다. (src/lib/seo.ts 와 같은 규칙) */
const pageUrl = (p) => siteUrl() + (p === "/" || isCloudflare() ? p : `${p}/`);

module.exports = { getRoutes, siteUrl, pageUrl, isCloudflare };
