// 빌드된 앱을 헤드리스 브라우저로 열어 페이지마다 완성된 HTML 을 저장한다.
// 검색 엔진(특히 네이버)과 SNS 미리보기가 JS 실행 없이도 제목·본문·메타 태그를 읽을 수 있게 된다.
//   npm run build && npm run prerender
// 처음 한 번: npx playwright install chromium --only-shell
const fs = require("fs");
const http = require("http");
const path = require("path");
const { chromium } = require("playwright");
const { getRoutes } = require("./routes");

const build = path.join(__dirname, "..", "build");
const shell = fs.readFileSync(path.join(build, "index.html"), "utf8");
const types = { ".js": "text/javascript", ".css": "text/css", ".json": "application/json", ".jpg": "image/jpeg", ".png": "image/png", ".svg": "image/svg+xml", ".ico": "image/x-icon", ".webp": "image/webp" };

// 원본 index.html(빈 껍데기)로 SPA 를 띄우는 작은 정적 서버
const server = http.createServer((req, res) => {
  const file = path.join(build, decodeURIComponent(req.url.split("?")[0]));
  if (file.startsWith(build) && fs.existsSync(file) && fs.statSync(file).isFile()) {
    res.writeHead(200, { "Content-Type": types[path.extname(file)] || "application/octet-stream" });
    return fs.createReadStream(file).pipe(res);
  }
  res.writeHead(200, { "Content-Type": "text/html; charset=utf-8" });
  res.end(shell);
});

(async () => {
  await new Promise((r) => server.listen(0, r));
  const origin = `http://127.0.0.1:${server.address().port}`;
  const browser = await chromium.launch();
  const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
  // 외부 글꼴 등은 기다리지 않는다
  await page.route("**/*", (route) =>
    route.request().url().startsWith(origin) ? route.continue() : route.abort()
  );

  for (const { path: route } of getRoutes()) {
    await page.goto(origin + route, { waitUntil: "networkidle" });
    await page.waitForSelector(".site-main > *");
    const html = await page.evaluate(() => {
      // 스크롤 등장 효과 상태는 저장하지 않는다 (앱이 다시 그린다)
      document.querySelectorAll(".is-in").forEach((el) => el.classList.remove("is-in"));
      document.documentElement.classList.remove("js");
      return "<!DOCTYPE html>\n" + document.documentElement.outerHTML;
    });
    if (html.includes("페이지를 찾을 수 없습니다")) throw new Error(`prerender: ${route} 가 404 화면입니다`);
    const out = route === "/" ? path.join(build, "index.html") : path.join(build, route, "index.html");
    fs.mkdirSync(path.dirname(out), { recursive: true });
    fs.writeFileSync(out, html);
    console.log(`prerender: ${route}`);
  }

  await browser.close();
  server.close();
})().catch((e) => {
  console.error(e);
  process.exit(1);
});
