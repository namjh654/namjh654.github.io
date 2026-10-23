# 브랜치 전략과 배포 자동화

`community_wall` · `community_wall_admin` 과 같은 흐름을 씁니다. 이 저장소의 운영 브랜치 이름만 `main` 이 아니라 `master` 입니다.

```
namjh654/<작업>  ──PR──▶  dev  ──PR──▶  master
   (작업 브랜치)        (빌드 검사)      (GitHub Pages 자동 배포)
```

| 브랜치            | 역할                         | Actions (`.github/workflows/deploy.yaml`) |
| ----------------- | ---------------------------- | ----------------------------------------- |
| `namjh654/*`      | 기능·콘텐츠 작업             | PR 을 열면 빌드 검사                       |
| `dev`             | 통합·확인                     | push 시 빌드 검사 (배포 없음)              |
| `master`          | 운영 (https://namjh654.github.io/) | push 시 빌드 → Pages 배포                |

- 빌드는 `CI=true` 로 돌기 때문에 ESLint 경고 하나도 실패로 처리됩니다. 깨진 JSON·이미지 경로도 빌드에서 걸립니다.
- 같은 브랜치에 연달아 push 하면 이전 실행은 취소됩니다(`concurrency`).
- GitHub Pages 는 저장소당 사이트가 하나라서 `dev` 미리보기 배포는 없습니다. dev 확인은 로컬 `npm start` 또는 PR 빌드 결과로 합니다.
  미리보기 주소가 꼭 필요해지면 Vercel/Cloudflare Pages 에 `dev` 브랜치만 연결하는 방법을 권장합니다 (`vercel.json` 에 SPA rewrite 필요).

## 배포 구성 점검 결과 (2026-10-24)

| 항목 | 상태 | 조치 |
| --- | --- | --- |
| Pages 소스 | `build_type: workflow` (Actions 배포) | 유지 |
| 직접 URL 접근·새로고침 (`/projects/xxx`) | Pages 는 SPA rewrite 미지원 → 404 | `scripts/postbuild.js` 가 `build/404.html` 생성 |
| `package.json` `homepage` | `namjeonghyeok.github.io` (다른 계정 주소) | `https://namjh654.github.io/` 로 수정 |
| `npm run deploy` (gh-pages 패키지) | Pages 소스가 Actions 라서 `gh-pages` 브랜치는 더 이상 서빙되지 않음 | 스크립트·패키지 제거 (중복 배포 경로 정리) |
| 워크플로 environment URL | 프로젝트 사이트 형식(`/<repo>/`)으로 잘못 표기 | `deploy-pages` 출력값 사용 |
| `dev` 브랜치 | 원격에 없음 | 처음 한 번 생성 필요 (아래) |
| `master` 보호 규칙 | 없음 | 권장: PR 필수 + 빌드 체크 통과 필수 |
| 남은 옛 브랜치 | `gh-pages`, `gh-pages-2.2.1`, `gh-pages-3.1.6`, `flexbox-sticky-footer`, `navbar-menu` (2015~2024 Jekyll 테마 잔재) | 확인 후 정리 권장 (자동 삭제하지 않음) |

## 처음 한 번 설정

```bash
# dev 브랜치 만들기
git switch master && git pull
git switch -c dev && git push -u origin dev
```

GitHub → Settings:

1. **Pages** → Source: *GitHub Actions* (현재 설정됨)
2. **Environments → github-pages** → Deployment branches: `master` 만 허용 (기본값)
3. **Branches → Add rule `master`** (선택): Require a pull request, Require status checks → `build`

## SPA 404 처리 주의

GitHub Pages 는 없는 경로에 `404.html` 을 **HTTP 404 상태로** 보여줍니다. 화면은 정상이지만 검색 엔진은 상세 페이지를 404 로 볼 수 있습니다.
검색 노출이 중요해지면 (1) 커스텀 도메인 + Cloudflare Pages/Vercel 의 rewrite, 또는 (2) 빌드 시 경로별 `index.html` 을 생성하는 방식으로 바꾸세요.
