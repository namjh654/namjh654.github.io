// 새 프로젝트/비하인드 폴더를 템플릿으로 만든다.
//   npm run new:project -- hannam-house
//   npm run new:behind -- hannam-demolition
const fs = require("fs");
const path = require("path");

const [kind, slug] = process.argv.slice(2);
const target = { project: "projects", behind: "behind" }[kind];

if (!target || !slug) {
  console.error("사용법: npm run new:project -- <slug>  또는  npm run new:behind -- <slug>");
  process.exit(1);
}
if (!/^[a-z0-9]+(-[a-z0-9]+)*$/.test(slug)) {
  console.error("slug 는 영문 소문자·숫자·하이픈만 씁니다. 예) hannam-house-2026");
  process.exit(1);
}

const root = path.join(__dirname, "..");
const dir = path.join(root, "src", "content", target, slug);
if (fs.existsSync(dir)) {
  console.error(`이미 있습니다: ${path.relative(root, dir)}`);
  process.exit(1);
}

const templateDir = path.join(root, "content-templates", kind);
const file = kind === "project" ? "project.json" : "post.json";
const now = new Date();
const today = new Date(now.getTime() - now.getTimezoneOffset() * 60000).toISOString().slice(0, 10);
const json = fs
  .readFileSync(path.join(templateDir, file), "utf8")
  .replace(/"date": "[^"]*"/, `"date": "${today}"`);

fs.mkdirSync(dir, { recursive: true });
fs.writeFileSync(path.join(dir, file), json);

console.log(`만들었습니다: ${path.relative(root, dir)}`);
console.log(`- ${file} 내용을 채우세요. 사진은 선택: 같은 폴더에 넣고 "cover"/"gallery" 에 파일 이름을 적습니다.`);
console.log('- 공개할 준비가 되면 "status": "published" 로 바꾸세요. (draft 는 npm start 에서만 보임)');
