# 브랜치 · 배포 · SEO

## 1. 브랜치 흐름

`community_wall` · `community_wall_admin` 과 같은 흐름입니다. 이 저장소의 운영 브랜치 이름만 `main` 이 아니라 `master` 입니다.

```
namjh654/<작업>  ──PR──▶  dev  ──PR──▶  master
   (작업 브랜치)        (검사·미리보기)    (운영 배포)
```

| 브랜치       | GitHub Pages 모드 (현재) | Cloudflare 모드              |
| ------------ | ------------------------ | ---------------------------- |
| `namjh654/*` | PR 빌드 검사             | PR 빌드 검사                 |
| `dev`        | 빌드 검사                | 미리보기 배포 `dev.<프로젝트>.pages.dev` |
| `master`     | 운영 배포                | 운영 배포                     |

빌드는 `CI=true` 로 돌아서 ESLint 경고·깨진 JSON·없는 이미지 경로가 모두 실패로 처리됩니다.

## 2. 빌드 과정 (`npm run build:site`)

1. `react-scripts build` — 앱 번들
2. `scripts/postbuild.js` — `sitemap.xml`, `robots.txt`, (GitHub Pages 일 때) `404.html`
3. `scripts/prerender.js` — 헤드리스 브라우저로 모든 페이지를 열어 **완성된 HTML** 을 `build/<경로>/index.html` 로 저장

로컬에서 prerender 를 처음 돌릴 때: `npx playwright install chromium --only-shell`

## 3. 호스팅 비교 (2026-10 기준)

| 항목 | GitHub Pages (현재) | Cloudflare Pages | Firebase Hosting (Spark) |
| --- | --- | --- | --- |
| 비용 | 무료 | 무료 | 무료 한도 후 종량제 |
| 전송량 | 월 100GB (권장 한도) | 정적 파일 무제한 | **하루 360MB** (사진 많은 사이트는 부족) |
| 상업적 이용 | 온라인 비즈니스·커머스 목적은 약관상 제한 | 허용 | 허용 |
| 모르는 경로 처리 | `404.html` 을 **404 상태로** 응답 | SPA 모드로 **200** 응답 | rewrite 로 200 |
| 브랜치 미리보기 | 없음 (저장소당 사이트 1개) | 브랜치별 주소 자동 | 프리뷰 채널 (별도 설정) |
| 헤더·캐시 제어 | 불가 | `_headers` 파일 | `firebase.json` |
| 국내 속도 | 보통 | 서울 PoP, 빠름 | 보통 |
| 커스텀 도메인 | 가능 | 가능 (DNS 도 Cloudflare 면 가장 간단) | 가능 |

**권장: Cloudflare Pages + 커스텀 도메인.**
홍보용 회사 사이트라서 상업적 이용이 허용되어야 하고, 사진이 많아 전송량이 커지며, `dev` 미리보기가 브랜치 전략과 그대로 맞습니다.
Firebase 는 Firestore·Auth 를 같이 쓰는 앱(예: mealflow)에는 좋지만, 정적 포트폴리오에는 하루 전송 한도가 부담입니다.

## 4. Cloudflare 로 전환하기

1. Cloudflare 가입 → My Profile → API Tokens → **Create Token** → 템플릿 *Edit Cloudflare Workers* 또는 권한 `Account · Cloudflare Pages · Edit` 만 부여
2. 대시보드 오른쪽의 **Account ID** 복사
3. GitHub 저장소 → Settings → Secrets and variables → Actions
   - Secrets: `CLOUDFLARE_API_TOKEN`, `CLOUDFLARE_ACCOUNT_ID`
   - Variables: `DEPLOY_TARGET=cloudflare`, `CF_PAGES_PROJECT=bongbong-studio`, `SITE_URL=https://bongbong-studio.pages.dev` (도메인 연결 후에는 그 주소)
4. `dev` 또는 `master` 에 push → 첫 실행에서 Pages 프로젝트가 자동 생성되고 배포됨
5. (권장) 도메인 구매 → Cloudflare Pages → Custom domains 연결 → `SITE_URL` 변경 후 재배포
6. 기존 `namjh654.github.io` 는 Settings → Pages 에서 끄거나, 새 주소로 안내하는 페이지만 남깁니다.

되돌리려면 `DEPLOY_TARGET` 변수를 지우면 GitHub Pages 배포로 돌아갑니다.

## 5. SEO 체크리스트

이미 적용된 것:

- [x] 페이지별 정적 HTML (prerender) — 네이버 Yeti 처럼 JS 실행이 약한 크롤러도 본문을 읽음
- [x] 페이지별 `title`, `description`, `canonical`, Open Graph(카카오톡·인스타 공유 미리보기), Twitter 카드
- [x] 구조화 데이터(JSON-LD): 회사 `ProfessionalService`, 프로젝트 `CreativeWork`, 비하인드 `BlogPosting`
- [x] `sitemap.xml` (콘텐츠 폴더에서 자동 생성, 날짜 포함), `robots.txt`
- [x] `lang="ko"`, 이미지 `alt`, 시맨틱 마크업(h1 하나, article/section)

직접 해야 하는 것:

1. **커스텀 도메인** — 검색 신뢰도와 브랜드에 가장 큰 영향. `github.io`·`pages.dev` 하위 주소는 회사 사이트로 약함
2. **Google Search Console** — 속성 추가 → HTML 태그 방식 → `content` 값을 `src/content/site.ts` 의 `verification.google` 에 넣고 배포 → 확인 → sitemap 제출
3. **네이버 서치어드바이저** — 사이트 등록 → HTML 태그 → `verification.naver` → 확인 → 요청 › 사이트맵 제출, RSS(선택). 국내 검색 유입은 네이버 비중이 큼
4. **콘텐츠** — 프로젝트 제목·요약에 지역+공간 키워드를 자연스럽게 (예: "한남동 단독주택 리모델링"), 실제 사진 `caption` 작성
5. **사진 용량** — 가로 1600~2000px, 300KB 안팎 (속도 = 검색 순위 요소)
6. 네이버 플레이스·카카오맵·인스타그램 프로필에 사이트 주소 연결 (외부 링크)

## 6. 문의 양식 (contact-api)

```
/contact 양식 → contact-api (Vercel Function) → Resend → namjh654@gmail.com
```

- 코드: `contact-api/api/contact.js`, 검증·메일 본문: `contact-api/lib/inquiry.js` (테스트: `npm test --prefix contact-api`)
- 첨부: JPG·PNG·WEBP 최대 5장. 브라우저에서 긴 변 1600px JPEG 로 줄여 보냄 (Vercel 요청 한도 4.5MB)
- 스팸 방지: 숨은 입력칸, 3초 이내 제출 차단, 같은 IP 10분 3건, 허용 출처(CORS) 제한
- 답장: 메일의 Reply-To 가 문의자 주소라 Gmail 에서 그대로 답장하면 됩니다.

### Vercel 설정

| 항목 | 값 |
| --- | --- |
| Root Directory | `contact-api` |
| 환경변수 (Production) | `RESEND_API_KEY` (비밀), `CONTACT_TO=namjh654@gmail.com` |
| 선택 | `CONTACT_FROM`, `ALLOWED_ORIGINS` (기본 `https://namjh654.github.io,http://localhost:3000`) |

배포 주소가 정해지면 GitHub 저장소 변수 `CONTACT_ENDPOINT` 에 `https://<프로젝트>.vercel.app/api/contact` 를 넣고 master 를 다시 배포합니다.
변수가 비어 있으면 양식은 "메일로 보내기" 안내로 대신합니다.

Resend 무료 요금제는 월 3,000통·하루 100통이며, 도메인을 인증하기 전에는 **Resend 가입 이메일로만** 받을 수 있습니다.
