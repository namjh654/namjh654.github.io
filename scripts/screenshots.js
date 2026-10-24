// 운영 중인 서비스(links.live)의 기본 스크린샷을 찍어 프로젝트 폴더에 저장한다.
//   npm run screenshots                 # live 주소가 있는 모든 프로젝트
//   npm run screenshots -- sosazang     # 하나만
// 결과: src/content/projects/<slug>/auto-desktop.jpg, auto-mobile.jpg
// project.json 에 screenshots 를 직접 적으면 그쪽이 우선이고, 이 파일들은 쓰이지 않는다.
// 로그인이 필요한 화면이나 앱 화면은 직접 캡처해서 screenshots 에 적는다.
const fs = require("fs");
const path = require("path");
const { chromium } = require("playwright");

const dir = path.join(__dirname, "..", "src", "content", "projects");
const only = process.argv[2];

const targets = fs
  .readdirSync(dir, { withFileTypes: true })
  .filter((d) => d.isDirectory() && (!only || d.name === only))
  .map((d) => {
    const file = path.join(dir, d.name, "project.json");
    if (!fs.existsSync(file)) return null;
    const p = JSON.parse(fs.readFileSync(file, "utf8"));
    return p.links?.live ? { slug: d.name, url: p.links.live } : null;
  })
  .filter(Boolean);

const devices = [
  { name: "desktop", viewport: { width: 1440, height: 900 }, deviceScaleFactor: 1 },
  { name: "mobile", viewport: { width: 390, height: 844 }, deviceScaleFactor: 2, isMobile: true, hasTouch: true },
];

(async () => {
  if (!targets.length) return console.log("screenshots: links.live 가 있는 프로젝트가 없습니다.");
  const browser = await chromium.launch();
  for (const { slug, url } of targets) {
    for (const d of devices) {
      const { name, ...options } = d;
      const page = await browser.newPage({ ...options, locale: "ko-KR", colorScheme: "light" });
      await page.goto(url, { waitUntil: "networkidle", timeout: 45000 }).catch(() => {});
      await page.waitForTimeout(1500); // 폰트·이미지 로딩
      const out = path.join(dir, slug, `auto-${name}.jpg`);
      await page.screenshot({ path: out, type: "jpeg", quality: 80 });
      await page.close();
      console.log(`screenshots: ${slug} ${name} → ${path.relative(process.cwd(), out)}`);
    }
  }
  await browser.close();
})().catch((e) => {
  console.error(e);
  process.exit(1);
});
