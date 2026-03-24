# CLAUDE.md — KTSA 웹사이트 개발 가이드

> Claude Code가 이 프로젝트에서 작업할 때 반드시 따르는 규칙.

---

## 프로젝트 개요

- **서비스명**: KTSA 한국트레일스포츠협회
- **도메인**: https://trailkorea.org (운영), https://github.com/keenow/ktsa-website (소스)
- **스택**: Next.js 14 App Router + TypeScript + Supabase + Tailwind CSS + next-intl (ko/en)

---

## 핵심 규칙

### 배포
- 반드시 `trailkorea.org` 기준으로 테스트
- 모든 작업 완료 후: `git add -A && git commit -m "..." && git push origin main && vercel deploy --prod`
- `k-tsa.org`는 Vercel alias일 뿐 — 코드/문서에 언급 금지

### Supabase
- `profiles` INSERT/UPDATE는 반드시 `supabaseAdmin` 사용 (RLS 우회 필수)
- 일반 사용자 조회는 `createServerClient` 또는 `createBrowserClient` 사용
- 환경변수: `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`, `SUPABASE_SECRET_KEY`

### 에러 처리
- 사용자에게 노출되는 에러 메시지는 반드시 **한국어**
- 영어 DB/API 에러를 그대로 노출 금지

### 인증
- OAuth: `createBrowserClient`(@supabase/ssr)로 시작 → `/api/auth/callback` 서버 라우트에서 처리
- 콜백 라우트: `app/api/auth/callback/route.ts`
- 회원 등급: `general`(준회원) / `member`(정회원) / `admin`(관리자)

### 국제화 (i18n)
- `next-intl` 사용, 로케일: `ko` (기본), `en`
- 사용자 노출 문자열은 반드시 `messages/ko.json`, `messages/en.json`에 추가

---

## 코드 주석 규격

> 전체 규격: `docs/comment-standard.md` 참조

### 파일 헤더 (역할이 명확한 파일에 필수)
```typescript
/**
 * @file 파일의 역할을 한 줄로
 * @description 자세한 설명 (필요 시)
 * @module 모듈 분류 (auth | admin | member | ui | api)
 */
```

### 함수 / 컴포넌트 (Public 함수, Server Action, API 핸들러에 필수)
```typescript
/**
 * 구글 OAuth 로그인 처리
 * @param provider - 'google' | 'kakao'
 * @returns void (signInWithOAuth가 리다이렉트 처리)
 */
async function handleOAuth(provider: Provider) { ... }
```

### API 라우트 (모든 핸들러에 필수)
```typescript
/**
 * GET /api/admin/members
 * 회원 목록 조회 (관리자 전용)
 * Auth: admin 등급 필요
 * Returns: { members: Profile[], total: number }
 */
```

### 인라인 태그
```typescript
// TODO: 나중에 할 작업
// FIXME: 알려진 버그
// NOTE: 중요한 맥락 (예: supabaseAdmin 사용 이유)
// HACK: 임시 처리, 추후 개선 필요
```

### 섹션 구분
```typescript
// ─── 상태 관리 ─────────────────────────────────────
// ─── 이벤트 핸들러 ──────────────────────────────────
// ─── 렌더링 ─────────────────────────────────────────
```

### 주석 언어
- 파일 헤더, 함수 설명, 인라인: **한국어**
- `@param`, `@returns` 타입 값: 영어 (TypeScript 타입 그대로)
- 한 파일 내 혼용 금지

### 금지
- 코드를 그대로 읽어주는 주석 ❌
- 비활성화 코드를 주석으로 장기 보관 ❌ (삭제 후 Git으로 관리)
- 코드 변경 후 주석 미업데이트 ❌

---

## 디렉토리 구조 주요 파일

```
app/
  [locale]/
    my/
      login/page.tsx       # 로그인 페이지
      register/page.tsx    # 회원가입 페이지
      dashboard/page.tsx   # 마이페이지 대시보드
    admin/                 # 관리자 콘솔
  api/
    auth/callback/route.ts # OAuth 콜백 (PKCE 처리)
    admin/                 # 관리자 API
lib/
  supabase.ts              # Supabase 클라이언트 (브라우저/서버)
  supabase-admin.ts        # Supabase 서비스롤 클라이언트
messages/
  ko.json                  # 한국어 번역
  en.json                  # 영어 번역
docs/
  comment-standard.md      # 주석 규격 전문
```

---

_최초 작성: 2026-03-24_
