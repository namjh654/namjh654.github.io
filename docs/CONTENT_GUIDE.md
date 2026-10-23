# 콘텐츠 올리는 방법

DB나 관리자 화면 없이 **폴더 하나 = 글 하나** 입니다. 폴더를 추가하고 `master` 에 반영되면 자동 배포됩니다.

## 1. 프로젝트 (결과물)

```bash
npm run new:project -- hannam-house-2026
```

`src/content/projects/hannam-house-2026/` 이 만들어집니다. 폴더 이름이 주소가 됩니다 → `/projects/hannam-house-2026`

```
src/content/projects/hannam-house-2026/
├── project.json
├── cover.jpg        # 대표 이미지 (목록·상세 상단)
├── 01.jpg
└── 02.jpg
```

### project.json 항목

| 항목        | 필수 | 설명                                                                  |
| ----------- | ---- | --------------------------------------------------------------------- |
| `title`     | ✔    | 프로젝트 이름                                                          |
| `titleEn`   |      | 영문 이름 (상세 상단 작은 글씨)                                        |
| `category`  | ✔    | `residential`(주거) `commercial`(상업) `remodeling`(리모델링) `branding`(브랜딩) — `src/content/site.ts` 에서 추가 |
| `date`      | ✔    | `YYYY-MM-DD`. 최신순 정렬, 연도 표시에 사용                             |
| `location`, `area`, `client` | | 개요표                                               |
| `scope`     |      | 작업 범위 배열 `["설계", "인테리어"]`                                  |
| `summary`   | ✔    | 한두 문장 소개                                                         |
| `cover`     | ✔    | 대표 이미지 파일 이름                                                  |
| `featured`  |      | `true` 면 홈 "최근 프로젝트"에 노출 (없으면 최신순 4개)                 |
| `status`    |      | `draft` 는 `npm start` 에서만 보이고 배포본에서 빠짐. 공개는 `published` |
| `sections`  |      | `[{ "heading": "Brief", "body": "..." }]`. `\n` 으로 문단 구분          |
| `gallery`   |      | `[{ "src": "01.jpg", "caption": "...", "wide": true }]`. `wide` 는 한 줄 전체 |
| `credits`   |      | `[{ "role": "Photo", "name": "..." }]`                                |

## 2. 비하인드 (과정·현장·브랜드 이야기)

```bash
npm run new:behind -- hannam-demolition
```

`post.json` 의 `blocks` 에 순서대로 쌓습니다.

```json
"blocks": [
  { "type": "text", "heading": "소제목(선택)", "body": "본문" },
  { "type": "image", "src": "01.jpg", "caption": "사진 설명" },
  { "type": "quote", "body": "인용", "by": "말한 사람" }
]
```

- `"project": "hannam-house-2026"` 처럼 프로젝트 폴더 이름을 적으면, 프로젝트 상세 하단에 "이 프로젝트의 비하인드"로 연결되고 비하인드 글에도 결과물 링크가 붙습니다.
- `tags` 의 첫 번째 값이 목록 카드에 표시됩니다.

## 3. 이미지 규칙

- 형식: `jpg`, `webp`, `png` (그 외 `svg`, `gif`, `avif`)
- 크기: 가로 **2000~2400px**, 파일당 **500KB 이하** 권장. 저장소에 그대로 들어가므로 원본을 올리지 마세요.
  (예: [Squoosh](https://squoosh.app) 에서 WebP 품질 75)
- 파일 이름은 영문·숫자로. 경로는 JSON 파일 기준 상대 경로 (`"images/01.jpg"` 가능)
- 외부 URL(`https://...`)도 쓸 수 있지만, 사진 서비스의 링크는 만료될 수 있습니다.
- 빌드 시 파일 이름에 해시가 붙어 캐시 문제 없이 교체됩니다.

## 4. 사이트 공통 정보

`src/content/site.ts` 에서 브랜드명, 소개 문구, 이메일·전화·인스타그램·주소, 서비스, 진행 과정, 카테고리를 바꿉니다.

## 5. 올리기 (작업 → 배포)

```bash
git switch dev && git pull
git switch -c namjh654/project-hannam    # 작업 브랜치
# 폴더 추가, npm start 로 확인 (draft 도 보임)
git add src/content && git commit -m "content: 한남동 주택 프로젝트 추가"
git push -u origin namjh654/project-hannam
# GitHub 에서 PR → dev (빌드 검사) → master 로 PR/merge 하면 자동 배포
```

자세한 흐름은 [BRANCH_AND_DEPLOY.md](BRANCH_AND_DEPLOY.md).

## 6. 문제 해결

| 증상                         | 확인                                                         |
| ---------------------------- | ------------------------------------------------------------ |
| 글이 목록에 안 보임           | `status` 가 `draft` 인지, `title`/`date`/`category` 가 맞는지 (개발자도구 콘솔에 `[content]` 경고) |
| 이미지가 비어 있음            | 파일 이름 대소문자, 확장자 (`.JPG` vs `.jpg`)                 |
| 빌드 실패 `Unexpected token` | JSON 문법 (마지막 쉼표, 따옴표). VS Code 에서 열면 빨간 줄로 보임 |
