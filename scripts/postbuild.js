// GitHub Pages 는 SPA rewrite 를 지원하지 않는다.
// 404.html 을 index.html 과 같게 두어 /projects/xxx 같은 주소로 바로 들어오거나 새로고침해도 앱이 뜨게 한다.
const fs = require("fs");
const path = require("path");

const build = path.join(__dirname, "..", "build");
fs.copyFileSync(path.join(build, "index.html"), path.join(build, "404.html"));
// Jekyll 처리 끄기 (_ 로 시작하는 파일 무시 방지)
fs.writeFileSync(path.join(build, ".nojekyll"), "");
console.log("postbuild: 404.html, .nojekyll 생성");
