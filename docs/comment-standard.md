# KTSA 코드 주석 규격

> 모든 코드 작성자(개발자, AI 에이전트)는 이 규격을 따른다.

---

## 1. 파일 헤더

모든 파일 상단에 작성. 역할이 명확한 파일은 필수.

```typescript
/**
 * @file 파일의 역할을 한 줄로
 * @description 자세한 설명 (필요 시)
 * @module 모듈 분류 (auth | admin | member | ui | api)
 */
```

---

## 2. 함수 / 컴포넌트

Public 함수, Server Action, API 핸들러, React 컴포넌트에 작성.

```typescript
/**
 * 구글 OAuth 로그인 처리
 * @param provider - 'google' | 'kakao'
 * @returns void (signInWithOAuth가 리다이렉트 처리)
 * @throws Supabase 인증 오류 시 에러 상태 설정
 */
async function handleOAuth(provider: Provider) { ... }
```

---

## 3. 인라인 주석

한국어 허용. 아래 태그를 일관되게 사용.

```typescript
// TODO: Phase 2에서 카카오 OAuth 추가
// FIXME: PKCE 쿠키 방식 재검토 필요
// NOTE: supabaseAdmin 사용 필수 — RLS 우회 목적
// HACK: Vercel Edge Runtime 제한으로 인한 임시 처리
```

| 태그 | 용도 |
|------|------|
| `TODO` | 나중에 할 작업 |
| `FIXME` | 알려진 버그/문제 |
| `NOTE` | 중요한 맥락 설명 |
| `HACK` | 임시방편, 추후 개선 필요 |

---

## 4. 섹션 구분

컴포넌트 내 코드 블록을 구분할 때 사용.

```typescript
// ─── 상태 관리 ─────────────────────────────────────
const [loading, setLoading] = useState(false)

// ─── 이벤트 핸들러 ──────────────────────────────────
function handleSubmit() { ... }

// ─── 렌더링 ─────────────────────────────────────────
return ( ... )
```

---

## 5. API 라우트

모든 API 라우트 핸들러에 필수 작성.

```typescript
/**
 * GET /api/admin/members
 * 회원 목록 조회 (관리자 전용)
 *
 * Query params:
 *   - page: 페이지 번호 (기본값: 1)
 *   - grade: 회원 등급 필터 (general | member | admin)
 *
 * Returns: { members: Profile[], total: number }
 * Auth: admin 등급 필요
 */
export async function GET(request: NextRequest) { ... }
```

---

## 6. Supabase 관련 필수 주석

RLS 우회, 서비스 롤 사용 시 반드시 이유를 명시.

```typescript
// supabaseAdmin 사용 — profiles INSERT는 RLS 정책상 일반 클라이언트로 불가
const { error } = await supabaseAdmin.from("profiles").insert({ ... })
```

---

## 7. 금지 규칙

- ❌ 코드를 그대로 읽어주는 주석 (`// i를 1 증가시킨다`)
- ❌ 오래된 주석 방치 (코드 변경 시 주석도 함께 수정)
- ❌ 한 파일 내 영어/한국어 혼용 (파일 단위로 통일)
- ❌ 비활성화된 코드를 주석으로 장기 보관 (삭제 후 Git으로 관리)

---

## 8. 언어 기준

| 위치 | 언어 |
|------|------|
| 파일 헤더, 함수 JSDoc | 한국어 |
| 인라인 주석 | 한국어 |
| API 라우트 문서 | 한국어 |
| `@param`, `@returns` 값 타입 | 영어 (TypeScript 타입 그대로) |

---

_최초 작성: 2026-03-24_
