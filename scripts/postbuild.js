// 빌드 후처리: sitemap.xml, robots.txt, (GitHub Pages 일 때) 404.html
const fs = require("fs");
const path = require("path");
const { getRoutes, siteUrl, pageUrl, isCloudflare } = require("./routes");

const build = path.join(__dirname, "..", "build");

const urls = getRoutes()
  .map(
    (r) =>
      `  <url><loc>${pageUrl(r.path)}</loc>${r.lastmod ? `<lastmod>${r.lastmod}</lastmod>` : ""}<priority>${r.priority}</priority></url>`
  )
  .join("\n");
fs.writeFileSync(
  path.join(build, "sitemap.xml"),
  `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls}\n</urlset>\n`
);
fs.writeFileSync(path.join(build, "robots.txt"), `User-agent: *\nAllow: /\n\nSitemap: ${siteUrl()}/sitemap.xml\n`);

if (isCloudflare()) {
  // Cloudflare Pages 는 404.html 이 없으면 모르는 경로에 index.html 을 200 으로 준다(SPA 모드).
  fs.rmSync(path.join(build, "404.html"), { force: true });
} else {
  // GitHub Pages 는 rewrite 가 없어 모르는 경로(?category= 등 포함)는 404.html 로 앱을 띄운다.
  fs.copyFileSync(path.join(build, "index.html"), path.join(build, "404.html"));
  fs.writeFileSync(path.join(build, ".nojekyll"), "");
}
console.log(`postbuild: sitemap(${getRoutes().length}), robots.txt${isCloudflare() ? "" : ", 404.html"}`);
