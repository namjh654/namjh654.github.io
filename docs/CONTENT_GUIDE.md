# 콘텐츠 올리는 방법

DB 나 관리자 화면 없이 **폴더 하나 = 글 하나** 입니다. 폴더를 추가하고 `master` 에 반영되면 자동 배포됩니다.

## 1. 프로젝트 · 게임 · 템플릿

```bash
npm run new:project -- galaxy-factory
```

`src/content/projects/galaxy-factory/project.json` 이 만들어집니다. 폴더 이름이 주소가 됩니다 → `/projects/galaxy-factory`

| 항목 | 필수 | 설명 |
| --- | --- | --- |
| `kind` | ✔ | `product`(서비스) `template`(템플릿) `game`(게임 → /games 에 표시) `career`(회사 프로젝트) |
| `title`, `summary`, `date` | ✔ | 이름, 한두 문장 소개, 정렬 기준일(최근 작업일, `YYYY-MM-DD`) |
| `platforms` | ✔ | 플랫폼 태그 `["Web", "Admin", "PWA", "Android", "iOS"]` — 목록 필터가 이 값으로 만들어짐 |
| `stack` | ✔ | 기술 태그 |
| `period`, `role` | | 화면에 보일 기간(`2026.07 – 현재`), 역할 |
| `stage` | | `live`(운영 중) `dev`(개발 중) `archived`(종료). 템플릿처럼 상태가 의미 없으면 생략 |
| `links` | | `live`(서비스 주소) `github`(공개 저장소) `store`(스토어) |
| `privateRepo` | | 저장소가 비공개면 `true` → "비공개 저장소" 로 표시 |
| `metrics` | | 상세 상단 숫자 카드 `[{ "label": "UI 테스트", "value": "29개" }]` (3개 권장) |
| `sections` | | 본문 `[{ "heading": "문제", "body": "..." }]`. `
` 으로 문단 구분. 문제 → 해결 → 결과 순서 권장 |
| `company` | | `kind: career` 일 때 `companies.json` 의 `key` |
| `screenshots` | | 서비스 화면 `[{ "src": "app.png", "device": "mobile", "caption": "..." }]`. `desktop` 은 브라우저 틀, `mobile` 은 폰 틀로 보임. 비워 두면 기본 스크린샷(아래) 사용 |
| `cover`, `gallery` | | 대표 사진·추가 사진(선택). `cover` 가 없으면 첫 데스크톱 스크린샷이 카드 이미지가 됨 |
| `featured` | | `true` 면 홈 "대표 프로젝트" 에 먼저 노출 (최대 4개) |
| `status` | | `draft` 는 `npm start` 에서만 보임. 공개는 `published` |

### 스크린샷

- **기본 스크린샷(자동):** `links.live` 가 있는 프로젝트는 `npm run screenshots` (하나만: `npm run screenshots -- sosazang`) 로
  운영 화면을 데스크톱·모바일로 찍어 `auto-desktop.jpg`, `auto-mobile.jpg` 로 저장합니다. `screenshots` 를 비워 두면 이 파일이 쓰입니다.
- **직접 첨부:** 로그인 뒤 화면, 관리자 화면, 앱·게임 화면은 직접 캡처해 폴더에 넣고 `screenshots` 에 적습니다.
  앱 화면은 세로 캡처(예: 1080×2340)를 `"device": "mobile"` 로 적으면 폰 틀 안에 들어갑니다.
- 실제 이용자 글·개인정보가 보이는 화면은 가리거나 테스트 계정 화면을 쓰세요.

## 2. 커리어 (`src/content/companies.json`)

위에서부터 **시간순(오래된 회사 먼저)** 입니다. `period` 가 `YYYY.MM – YYYY.MM` 또는 `YYYY.MM – 현재` 형식이면 재직 기간(예: 1년 7개월)이 자동으로 붙습니다.

```json
{
  "key": "nepirity",
  "name": "네피리티",
  "period": "2025.01 – 현재",
  "role": "프론트엔드 개발",
  "summary": "한 줄 소개",
  "projects": [{ "name": "RT", "summary": "한 줄 설명", "slug": "nepirity-rt" }]
}
```

회사 프로젝트를 자세히 쓰려면 `kind: "career"`, `"company": "nepirity"` 인 project.json 을 만들고 `slug` 로 연결합니다.
그러면 커리어 화면의 프로젝트 이름이 세부 페이지로 연결되고, `/projects` 의 **커리어 프로젝트** 묶음과 홈 숫자 요약에도 자동으로 포함됩니다.
스토어 스크린샷처럼 외부 이미지 주소도 `screenshots` 의 `src` 에 그대로 쓸 수 있습니다.
회사 이름·내부 화면·수치는 공개해도 되는 범위만 적으세요.

## 3. 블로그

```bash
npm run new:post -- my-post
```

`post.json` 의 `blocks` 에 순서대로 쌓습니다.

```json
"blocks": [
  { "type": "text", "heading": "소제목(선택)", "body": "본문" },
  { "type": "code", "lang": "ts", "body": "const a = 1;" },
  { "type": "image", "src": "01.png", "caption": "설명" },
  { "type": "quote", "body": "인용", "by": "말한 사람" }
]
```

`"project": "community-wall"` 처럼 프로젝트 폴더 이름을 적으면 프로젝트 상세의 "관련 글" 에 연결됩니다.

## 4. 사이트 공통 정보

`src/content/site.ts` 에서 이름, 소개 문구, 이메일, GitHub, 기술 스택을 바꿉니다.

## 5. 이미지 규칙

- 형식: `png`, `jpg`, `webp` (그 외 `svg`, `gif`, `avif`). 가로 1600~2000px, 300KB 안팎 권장
- `caption` 은 검색엔진이 사진 설명(alt)으로 읽습니다.
- 파일 이름은 영문·숫자로. 빌드 시 파일 이름에 해시가 붙어 캐시 문제 없이 교체됩니다.

## 6. 올리기

```bash
git switch dev && git pull
git switch -c namjh654/content-xxx
# 폴더 추가, npm start 로 확인 (draft 도 보임)
git add src/content && git commit -m "content: ..."
git push -u origin namjh654/content-xxx
# PR → dev (빌드 검사) → master 로 PR/merge 하면 자동 배포
```

## 7. 문제 해결

| 증상 | 확인 |
| --- | --- |
| 목록에 안 보임 | `status` 가 `draft` 인지, `title`/`date`/`kind` 가 맞는지 (개발자도구 콘솔에 `[content]` 경고) |
| 이미지가 비어 있음 | 파일 이름 대소문자, 확장자 |
| 빌드 실패 `Unexpected token` | JSON 문법 (마지막 쉼표, 따옴표) |
