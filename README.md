# BONGBONG STUDIO — 포트폴리오 사이트

건축·리모델링·인테리어·공간 브랜딩 스튜디오의 포트폴리오 사이트입니다.
프로젝트 결과물(Projects)과 작업 뒷이야기(Behind)를 폴더 단위로 올리면 자동으로 페이지가 만들어집니다.

https://namjh654.github.io/

| 영역   | 기술                                                 |
| ------ | ---------------------------------------------------- |
| 기반   | React 18 + TypeScript + CRA (CSR SPA)                |
| 라우팅 | React Router 6 (`createBrowserRouter`)               |
| SEO    | 페이지별 프리렌더링(Playwright), sitemap, JSON-LD     |
| 배포   | GitHub Actions → GitHub Pages 또는 Cloudflare Pages  |

## 메뉴

| 경로               | 화면                                                   |
| ------------------ | ------------------------------------------------------ |
| `/`                | 홈: 소개, 숫자 요약, 최근 프로젝트, 하는 일, 비하인드, 문의 |
| `/projects`        | 프로젝트 목록 (카테고리 필터 `?category=remodeling`)    |
| `/projects/:slug`  | 프로젝트 상세: 개요표, 설명, 갤러리, 크레딧, 관련 비하인드 |
| `/behind`          | 비하인드 목록                                          |
| `/behind/:slug`    | 비하인드 상세: 글·사진·인용 블록, 관련 프로젝트 링크    |
| `/studio`          | 스튜디오 소개, 서비스, 진행 과정                        |
| `/contact`         | 연락처, 메일 문의 (양식이 채워진 mailto)                |

## 빠른 시작

```bash
npm ci
npm start                          # http://localhost:3000
npm run new:project -- my-project  # 새 프로젝트 폴더 만들기
npm run new:behind -- my-story     # 새 비하인드 폴더 만들기
npm run build:site                 # 빌드 + sitemap + 페이지별 HTML 프리렌더링
                                   # (처음 한 번: npx playwright install chromium --only-shell)
```

## 구조

```
src/
├── content/
│   ├── site.ts            # 브랜드명·연락처·카테고리·서비스·진행 과정
│   ├── projects/<slug>/   # project.json + 이미지  → /projects/<slug>
│   ├── behind/<slug>/     # post.json + 이미지     → /behind/<slug>
│   ├── index.ts           # 폴더 자동 인식 로더
│   └── types.ts           # JSON 형식 정의
├── components/            # SiteLayout(헤더·모바일 메뉴·푸터·등장 효과), 카드
├── lib/seo.ts             # 페이지별 title·description·OG·canonical·JSON-LD
├── pages/                 # 화면
└── router/AppRouter.tsx
content-templates/         # new:project / new:behind 가 복사하는 템플릿
scripts/                   # postbuild(sitemap·robots·404), prerender, new-content
docs/                      # 운영 문서
```

## 문서

- [docs/CONTENT_GUIDE.md](docs/CONTENT_GUIDE.md) — 프로젝트·비하인드 올리는 방법
- [docs/BRANCH_AND_DEPLOY.md](docs/BRANCH_AND_DEPLOY.md) — 브랜치 전략, 배포 자동화, 호스팅 비교, SEO
- [docs/ADMIN_REVIEW.md](docs/ADMIN_REVIEW.md) — 공통 관리자(CSR admin) 적용 검토

> 지금 들어 있는 프로젝트 4개·비하인드 3개는 **샘플 글**입니다. 실제 작업물로 바꾼 뒤 지워 주세요.
> 사진은 선택입니다. `cover` 를 적으면 카드·상세에 사진이 붙고, 없으면 글자만으로 보입니다.
