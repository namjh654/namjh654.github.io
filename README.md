# BONGBONG STUDIO — 포트폴리오 사이트

건축·리모델링·인테리어·공간 브랜딩 스튜디오의 포트폴리오 사이트입니다.
프로젝트 결과물(Projects)과 작업 뒷이야기(Behind)를 폴더 단위로 올리면 자동으로 페이지가 만들어집니다.

https://namjh654.github.io/

| 영역   | 기술                                                 |
| ------ | ---------------------------------------------------- |
| 기반   | React 18 + TypeScript + CRA (CSR SPA)                |
| 라우팅 | React Router 6 (`createBrowserRouter`)               |
| 상태   | zustand (테마만)                                     |
| 배포   | GitHub Actions → GitHub Pages (`master` push 시)     |

## 메뉴

| 경로               | 화면                                                   |
| ------------------ | ------------------------------------------------------ |
| `/`                | 홈: 대표 이미지, 최근 프로젝트, 하는 일, 비하인드, 문의 |
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
npm run build                      # build/ (+ 404.html, .nojekyll)
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
├── components/            # SiteLayout(헤더·모바일 메뉴·푸터), 카드
├── pages/                 # 화면
└── router/AppRouter.tsx
content-templates/         # new:project / new:behind 가 복사하는 템플릿
scripts/                   # postbuild(404.html), new-content
docs/                      # 운영 문서
```

## 문서

- [docs/CONTENT_GUIDE.md](docs/CONTENT_GUIDE.md) — 프로젝트·비하인드 올리는 방법
- [docs/BRANCH_AND_DEPLOY.md](docs/BRANCH_AND_DEPLOY.md) — 브랜치 전략, 배포 자동화
- [docs/ADMIN_REVIEW.md](docs/ADMIN_REVIEW.md) — 공통 관리자(CSR admin) 적용 검토

> 지금 들어 있는 프로젝트 4개·비하인드 3개와 이미지(SVG)는 **샘플**입니다. 실제 작업물로 바꾼 뒤 지워 주세요.
