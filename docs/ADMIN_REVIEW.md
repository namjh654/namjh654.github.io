# 공통 관리자(CSR admin) 적용 검토

대상: `community_wall_admin` (admin_templates 기반, React 19 + Vite + Supabase + Vercel CSR 관리자)

## 결론

**지금은 붙이지 않고, 파일 기반(Git) 콘텐츠로 운영하는 것을 권장합니다.** 아래 조건 중 하나가 생기면 2단계로 전환합니다.

- 개발자가 아닌 사람(직원·디자이너)이 사진과 글을 직접 올려야 할 때
- 한 달에 올리는 글이 많아져 PR 흐름이 번거로울 때
- 문의 접수(폼)를 DB 로 받아 관리하고 싶을 때

| 기준 | 1단계: 지금 (Git 파일) | 2단계: 관리자 연동 (Supabase) |
| --- | --- | --- |
| 올리는 방법 | 폴더 + JSON + 사진 → PR → master | 관리자 화면에서 입력·사진 업로드 |
| 반영 시간 | Actions 빌드 1~2분 | 즉시 (런타임 조회) |
| 비용 | 0원 (GitHub Pages) | Supabase Free (저장소 1GB, 전송 5GB/월), 관리자 Vercel |
| 이미지 | 저장소에 포함, 빌드 시 해시 | Storage 공개 버킷 |
| 검색 노출 | 빌드 결과에 데이터 포함 | 런타임 조회라 크롤러에 더 불리 |
| 장애 지점 | 없음 (정적) | Supabase 일시정지(7일 무사용)·장애 시 빈 화면 |
| 이력 | Git 커밋 | 관리자 감사 로그 |

## 2단계 설계 (전환 시)

### 관리자 앱

`admin_templates` 로 **새 저장소**(`studio_admin`)를 만드는 것을 권장합니다.
`community_wall_admin` 에 모듈로 넣으면 같은 Supabase(dev/prod)를 공유하게 되어, 담벼락 운영 권한·감사 로그·마이그레이션 소유가 섞입니다.

```
src/features/portfolio/      # FeatureModule: 프로젝트 목록/등록/수정
src/features/behind/         # FeatureModule: 비하인드 목록/등록/수정
src/app/modules.ts           # 두 모듈 등록, demo-items 제거
```

- 권한 키: `portfolio.read` / `portfolio.write`, `behind.read` / `behind.write`
- 공통 기능(관리자 계정·역할, 감사 로그, 시스템 설정)은 템플릿 그대로 사용
- 배포: 템플릿 방식 그대로 Vercel `main`(prod) / `dev`(dev), 작업 브랜치(`namjh654/*`) 배포 끔

### 데이터 (Supabase)

```sql
create table public.portfolio_projects (
  id uuid primary key default gen_random_uuid(),
  slug text unique not null check (slug ~ '^[a-z0-9]+(-[a-z0-9]+)*$'),
  title text not null,
  title_en text,
  category text not null check (category in ('residential','commercial','remodeling','branding')),
  date date not null,
  location text, area text, client text,
  scope text[] default '{}',
  summary text not null,
  cover_url text not null,
  featured boolean default false,
  status text not null default 'draft' check (status in ('draft','published')),
  sections jsonb default '[]',
  gallery jsonb default '[]',
  credits jsonb default '[]',
  updated_at timestamptz default now()
);
-- behind_posts: 같은 방식, project_slug, tags text[], blocks jsonb
```

- RLS: `anon` 은 `status = 'published'` 행만 `select`. 쓰기는 `portfolio.write` 권한 RPC 확인 후에만.
- Storage: 공개 버킷 `portfolio` (이미지 MIME 만, 파일당 2MB 제한), 경로 `projects/<slug>/<uuid>.webp`
- JSON 구조는 지금의 `project.json` / `post.json` 과 같게 맞춰 두었으므로, 기존 파일을 그대로 이관 스크립트로 넣을 수 있습니다.

### 블로그 쪽 변경

`src/content/index.ts` 만 바뀝니다. 화면 컴포넌트는 `Project` / `BehindPost` 타입만 쓰기 때문에 그대로 둡니다.

1. **권장 — 빌드 시 가져오기**: Actions 빌드 전에 Supabase 에서 published 데이터를 JSON 으로 받아 `src/content/` 에 쓰고 빌드. 관리자에서 "배포" 버튼 → `repository_dispatch` 로 워크플로 실행. 정적 사이트 장점(속도·SEO·장애 없음)을 유지.
2. 런타임 조회: `@supabase/supabase-js` + publishable key 로 직접 조회. 즉시 반영되지만 로딩 상태 처리, 키 노출 범위(RLS 필수), Supabase 일시정지 대응이 필요.

### 보안 체크

- 블로그 번들에는 publishable key 만. `service_role`/`sb_secret_` 는 Actions secret 에만 (방식 1 사용 시)
- 관리자 앱은 `noindex`, Google 로그인 + DB 권한(RPC) 확인 — 템플릿 기본값 유지
- 관리자 주소를 블로그 메뉴에 노출하지 않음
