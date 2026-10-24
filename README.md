# BONGBONG — 개발 포트폴리오

직접 기획·개발·운영하는 서비스, 게임, 회사 프로젝트, 개발 글을 모은 개인 브랜딩 사이트입니다.
폴더 하나를 추가하면 페이지가 자동으로 만들어지고, master 에 반영되면 자동 배포됩니다.

https://namjh654.github.io/

| 영역   | 기술                                                 |
| ------ | ---------------------------------------------------- |
| 기반   | React 18 + TypeScript + CRA                          |
| 라우팅 | React Router 6 (`createBrowserRouter`)               |
| SEO    | 페이지별 프리렌더링(Playwright), sitemap, JSON-LD     |
| 배포   | GitHub Actions → GitHub Pages                        |

## 메뉴

| 경로               | 화면                                                     |
| ------------------ | -------------------------------------------------------- |
| `/`                | 소개, 숫자 요약, 대표 프로젝트, 커리어, 블로그, 연락       |
| `/projects`        | 자체 프로젝트 · 커리어 프로젝트 묶음 (`?group=self` / `career`) |
| `/games`           | 게임 목록 (플랫폼 필터)                                   |
| `/projects/:slug`  | 상세: 상태, 링크, 지표, 기간·역할·플랫폼·기술, 본문, 관련 글 |
| `/career`          | 회사별 시간순 타임라인, 재직 기간, 프로젝트 세부 페이지 연결 |
| `/blog`, `/blog/:slug` | 개발 글                                              |
| `/about`           | 일하는 방식, 기술 스택, 경력, 연락처                       |

## 빠른 시작

```bash
npm ci
npm start                          # http://localhost:3000
npm run new:project -- my-project  # 새 프로젝트/게임 폴더
npm run new:post -- my-post        # 새 블로그 글 폴더
npm run build:site                 # 빌드 + sitemap + 페이지별 HTML 프리렌더링
                                   # (처음 한 번: npx playwright install chromium --only-shell)
```

## 구조

```
src/
├── content/
│   ├── site.ts            # 이름·소개·연락처·기술 스택·분류(kind)·상태(stage)
│   ├── companies.json     # 재직 회사와 회사 프로젝트 (시간순)
│   ├── projects/<slug>/   # project.json (+ 선택 사진) → /projects/<slug>
│   ├── blog/<slug>/       # post.json (+ 선택 사진)    → /blog/<slug>
│   ├── index.ts           # 폴더 자동 인식 로더
│   └── types.ts           # JSON 형식 정의
├── components/            # SiteLayout(헤더·모바일 메뉴·푸터), 카드·태그·상태 뱃지
├── lib/seo.ts             # 페이지별 title·description·OG·canonical·JSON-LD
├── pages/                 # 화면
└── router/AppRouter.tsx
content-templates/         # new:project / new:post 가 복사하는 템플릿
scripts/                   # postbuild(sitemap·robots·404), prerender, new-content
docs/                      # 운영 문서
```

## 문서

- [docs/CONTENT_GUIDE.md](docs/CONTENT_GUIDE.md) — 프로젝트·게임·회사·글 올리는 방법
- [docs/BRANCH_AND_DEPLOY.md](docs/BRANCH_AND_DEPLOY.md) — 브랜치 전략, 배포 자동화, 호스팅 비교, SEO
- [docs/ADMIN_REVIEW.md](docs/ADMIN_REVIEW.md) — 공통 관리자(CSR admin) 적용 검토
