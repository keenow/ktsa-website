/**
 * @file 이메일 회원가입(auth.signUp) 오류 분류
 * @description Supabase Auth·PostgREST가 주는 code·status를 우선하고, 없을 때만 message 휴리스틱 사용
 * @module auth
 */

/** 클라이언트/서버 액션에서 분기할 가입 실패 종류 */
export type SignUpFailureKind =
  | 'duplicate_email'
  | 'weak_password'
  | 'rate_limited'
  | 'signup_disabled'
  | 'email_invalid'
  | 'profile_duplicate'
  | 'unknown'

type ErrShape = {
  message?: string
  code?: string | number
  status?: number
}

/**
 * 임의 오류 객체에서 문자열 필드만 안전하게 추출
 * @param err - throw/catch 또는 Supabase error
 * @returns message, code, status
 */
function normalizeError(err: unknown): ErrShape {
  if (!err || typeof err !== 'object') return {}
  const e = err as Record<string, unknown>
  const message = typeof e.message === 'string' ? e.message : ''
  const status = typeof e.status === 'number' ? e.status : undefined
  let code: string | number | undefined
  if (typeof e.code === 'string' || typeof e.code === 'number') {
    code = e.code
  }
  return { message, code, status }
}

/** GoTrue에서 문서화되거나 관측되는 code (소문자 정규화 후 비교) */
const AUTH_CODE_DUPLICATE = new Set([
  'user_already_exists',
  'email_exists',
  'identity_already_exists',
])

const AUTH_CODE_WEAK_PASSWORD = new Set(['weak_password', 'same_password'])

const AUTH_CODE_RATE_LIMIT = new Set([
  'over_request_rate_limit',
  'too_many_requests',
  'rate_limit_exceeded',
])

const AUTH_CODE_SIGNUP_DISABLED = new Set([
  'signup_disabled',
  'email_address_not_authorized',
])

const AUTH_CODE_EMAIL_INVALID = new Set(['email_address_invalid'])

/**
 * `auth.signUp` 실패 응답 분류 (code → status → message 순)
 * @param err - Supabase AuthError 유사 객체
 * @returns SignUpFailureKind
 */
export function classifyAuthSignUpError(err: unknown): SignUpFailureKind {
  const { message, code: rawCode, status } = normalizeError(err)
  const code = String(rawCode ?? '')
    .toLowerCase()
    .trim()
  const msg = (message ?? '').toLowerCase()

  if (code && AUTH_CODE_DUPLICATE.has(code)) return 'duplicate_email'
  if (code && AUTH_CODE_WEAK_PASSWORD.has(code)) return 'weak_password'
  if (code && AUTH_CODE_RATE_LIMIT.has(code)) return 'rate_limited'
  if (status === 429) return 'rate_limited'
  if (code && AUTH_CODE_SIGNUP_DISABLED.has(code)) return 'signup_disabled'
  if (code && AUTH_CODE_EMAIL_INVALID.has(code)) return 'email_invalid'

  // HTTP 상태로 보조 (Auth API)
  if (status === 422 || status === 409) {
    if (
      msg.includes('already') ||
      msg.includes('registered') ||
      msg.includes('exists') ||
      msg.includes('duplicate')
    ) {
      return 'duplicate_email'
    }
  }

  // code가 없을 때 message 보조 (로케일·버전 차이 대비)
  if (
    msg.includes('already registered') ||
    msg.includes('already been registered') ||
    msg.includes('user already exists') ||
    (msg.includes('email') && msg.includes('already')) ||
    msg.includes('database error saving new user')
  ) {
    return 'duplicate_email'
  }
  if (msg.includes('weak password') || msg.includes('password')) {
    if (msg.includes('least') || msg.includes('short') || msg.includes('pwned') || msg.includes('weak')) {
      return 'weak_password'
    }
  }
  if (msg.includes('rate limit') || msg.includes('too many')) return 'rate_limited'
  if (msg.includes('signup') && msg.includes('disabled')) return 'signup_disabled'
  if (msg.includes('invalid email') || msg.includes('malformed')) return 'email_invalid'
  if (msg.includes('이미') && (msg.includes('가입') || msg.includes('등록'))) {
    return 'duplicate_email'
  }

  return 'unknown'
}

/**
 * `profiles` INSERT 등 PostgREST 오류 분류
 * @param err - PostgrestError 유사 객체
 * @returns duplicate_email(프로필 중복) 또는 기타
 */
export function classifyPostgrestProfileInsertError(err: unknown): SignUpFailureKind {
  const { message, code: rawCode } = normalizeError(err)
  const code = String(rawCode ?? '')
  const msg = (message || '').toLowerCase()

  // PostgreSQL unique_violation
  if (code === '23505') return 'profile_duplicate'
  if (msg.includes('duplicate key') || msg.includes('unique constraint') || msg.includes('unique violation')) {
    return 'profile_duplicate'
  }

  return 'unknown'
}

/**
 * 가입 실패 종류별 사용자 노출 메시지 (한국어)
 * @param kind - 분류 결과
 * @returns 한국어 안내 문구
 */
export function signUpFailureMessageKo(kind: SignUpFailureKind): string {
  switch (kind) {
    case 'duplicate_email':
    case 'profile_duplicate':
      return '이미 가입된 이메일입니다. 로그인을 이용해 주세요.'
    case 'weak_password':
      return '비밀번호가 보안 정책에 맞지 않습니다. 더 길거나 복잡한 비밀번호를 사용해 주세요.'
    case 'rate_limited':
      return '요청이 너무 잦습니다. 잠시 후 다시 시도해 주세요.'
    case 'signup_disabled':
      return '현재 이메일 가입이 제한되어 있습니다. 관리자에게 문의해 주세요.'
    case 'email_invalid':
      return '이메일 형식을 확인해 주세요.'
    default:
      return '회원가입 처리 중 오류가 발생했습니다. 잠시 후 다시 시도해 주세요.'
  }
}
