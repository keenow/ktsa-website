/**
 * @file 인증 관련 Server Actions
 * @description 이메일/OAuth/전화번호 인증, 비밀번호 재설정 등 인증 흐름 전반을 처리하는 서버 액션 모음
 * @module auth
 */
'use server'

import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import {
  classifyAuthSignUpError,
  classifyPostgrestProfileInsertError,
  type SignUpFailureKind,
  type SignUpWithEmailResult,
  snapshotAuthOrDbError,
  signUpFailureMessageKo,
} from '@/lib/auth-signup-errors'
import { newCorrelationId } from '@/lib/correlation-id'
import { supabaseAdmin } from '@/lib/supabase-admin'
import { isProfileIncomplete } from '@/lib/profile-completion'

/**
 * 이미 profiles에 동일 이메일(대소문자 무시)이 있으면 중복 가입으로 간주
 * @param email - 입력 이메일
 * @returns 기존 행이 있으면 true
 */
async function profileExistsForEmail(email: string): Promise<boolean> {
  const trimmed = email.trim()
  if (!trimmed) return false
  const { data, error } = await supabaseAdmin
    .from('profiles')
    .select('id')
    .ilike('email', trimmed)
    .maybeSingle()
  if (error) return false
  return !!data
}

/**
 * 가입 실패 시 로그 남기고 클라이언트용 진단 객체와 함께 반환
 * @param source - auth | profile
 * @param kind - 분류 결과
 * @param err - 원본 오류
 * @returns error + errorDetail
 */
function signUpFailurePayload(
  source: 'auth' | 'profile',
  kind: SignUpFailureKind,
  err: unknown
): Extract<SignUpWithEmailResult, { error: string }> {
  const correlationId = newCorrelationId()
  const snapshot = snapshotAuthOrDbError(err)
  console.error(
    '[signUpWithEmail]',
    JSON.stringify({
      correlationId,
      source,
      classified: kind,
      snapshot,
    })
  )
  return {
    error: signUpFailureMessageKo(kind),
    errorDetail: { correlationId, source, classified: kind, snapshot },
  }
}

/**
 * Server Action·RSC용 Supabase 클라이언트 (쿠키 연동)
 * @returns Supabase 서버 클라이언트
 */
async function createSupabaseServerClient() {
  const cookieStore = await cookies()
  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll()
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options)
            )
          } catch {}
        },
      },
    }
  )
}

/**
 * 이메일 회원가입 처리 (1단계: 이메일·비밀번호만)
 * @description Supabase Auth 계정 생성 후 profiles에 email만 채운 최소 행 INSERT. 이름·전화·생년월일은 인증 후 `completeProfile`에서 입력
 * @param formData - email, password, locale (선택)
 * @returns 성공 / 진단 포함 실패 / 이미 가입(전용 페이지)
 */
export async function signUpWithEmail(
  formData: FormData
): Promise<SignUpWithEmailResult> {
  try {
    const supabase = await createSupabaseServerClient()
    const correlationId = newCorrelationId()

    const email = (formData.get('email') as string)?.trim() || ''
    const password = formData.get('password') as string

    // NOTE: Auth 오류 문구가 환경마다 달라 redirect만으로는 놓칠 수 있음 — profiles 선조회 + 클라이언트 router.push 병행
    if (await profileExistsForEmail(email)) {
      console.error(
        '[signUpWithEmail]',
        JSON.stringify({
          correlationId,
          source: 'profile',
          reason: 'profile_precheck',
          note: 'redirect_already_registered',
        })
      )
      return {
        alreadyRegistered: true as const,
        email,
        reason: 'profile_precheck',
        correlationId,
      }
    }

    const { data, error } = await supabase.auth.signUp({ email, password })

    if (error) {
      const authKind = classifyAuthSignUpError(error)
      const snapshot = snapshotAuthOrDbError(error)
      if (authKind === 'duplicate_email') {
        console.error(
          '[signUpWithEmail]',
          JSON.stringify({
            correlationId,
            source: 'auth',
            classified: authKind,
            reason: 'auth_duplicate',
            note: 'redirect_already_registered',
            snapshot,
          })
        )
        return {
          alreadyRegistered: true as const,
          email,
          reason: 'auth_duplicate',
          correlationId,
        }
      }
      return signUpFailurePayload('auth', authKind, error)
    }

    if (data.user) {
      // NOTE: supabaseAdmin 사용 — profiles INSERT는 RLS 정책상 일반 클라이언트로 불가
      const { error: profileError } = await supabaseAdmin
        .from('profiles')
        .insert({
          id: data.user.id,
          email,
          name: null,
          phone: null,
          phone_country_code: '+82',
          birth_date: null,
          membership_grade: 'general',
          is_active: true,
        })

      if (profileError) {
        const pgKind = classifyPostgrestProfileInsertError(profileError)
        const snapshot = snapshotAuthOrDbError(profileError)
        if (pgKind === 'profile_duplicate') {
          console.error(
            '[signUpWithEmail]',
            JSON.stringify({
              correlationId,
              source: 'profile',
              classified: pgKind,
              reason: 'profile_insert_duplicate',
              note: 'redirect_already_registered',
              snapshot,
            })
          )
          return {
            alreadyRegistered: true as const,
            email,
            reason: 'profile_insert_duplicate',
            correlationId,
          }
        }
        return signUpFailurePayload('profile', pgKind, profileError)
      }
    }

    return { success: true, message: '이메일 인증 안내가 발송됩니다.' }
  } catch (e: unknown) {
    const correlationId = newCorrelationId()
    const partial = snapshotAuthOrDbError(e)
    const message =
      partial.message ||
      (e instanceof Error
        ? e.message
        : typeof e === 'string'
          ? e
          : '알 수 없는 오류')
    const snapshot = {
      ...partial,
      message,
      name: partial.name ?? (e instanceof Error ? e.name : undefined),
    }
    console.error(
      '[signUpWithEmail][uncaught]',
      JSON.stringify({ correlationId, snapshot })
    )
    return {
      error:
        '회원가입 처리 중 예기치 않은 오류가 발생했습니다. 잠시 후 다시 시도해 주세요.',
      errorDetail: {
        correlationId,
        source: 'server',
        classified: 'unknown',
        snapshot,
      },
    }
  }
}

/**
 * 가입 확인(이메일 인증) 메일 재발송
 * @description Supabase Auth `resend` type `signup`. 미인증 상태에서 확인 메일을 다시 받을 때 사용
 * @param email - 가입에 사용한 주소
 * @param locale - `ko` | `en` (확인 링크의 `emailRedirectTo` 경로)
 * @returns `{ success, message }` 또는 `{ error }` (문구는 locale에 맞춤)
 */
export async function resendSignupVerificationEmail(
  email: string,
  locale: string
): Promise<{ success: true; message: string } | { error: string }> {
  const trimmed = (email ?? '').trim()
  const loc = locale === 'en' ? 'en' : 'ko'
  const msg = {
    invalid:
      loc === 'en'
        ? 'Please enter a valid email address.'
        : '유효한 이메일 주소를 입력해 주세요.',
    success:
      loc === 'en'
        ? 'We sent another verification email. Check your inbox and spam folder.'
        : '인증 메일을 다시 보냈습니다. 받은편지함·스팸함을 확인해 주세요.',
    generic:
      loc === 'en'
        ? 'Could not send the verification email. Please try again later.'
        : '인증 메일 발송 중 오류가 발생했습니다. 잠시 후 다시 시도해 주세요.',
    rate:
      loc === 'en'
        ? 'Too many requests. Please wait and try again.'
        : '요청이 너무 잦습니다. 잠시 후 다시 시도해 주세요.',
  }

  if (!trimmed || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmed)) {
    return { error: msg.invalid }
  }

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://trailkorea.org'

  try {
    const supabase = await createSupabaseServerClient()
    const { error } = await supabase.auth.resend({
      type: 'signup',
      email: trimmed,
      options: {
        emailRedirectTo: `${siteUrl}/${loc}/my/login`,
      },
    })

    if (error) {
      const low = (error.message ?? '').toLowerCase()
      console.error('[resendSignupVerificationEmail]', error.message)
      if (
        low.includes('rate') ||
        low.includes('too many') ||
        error.status === 429
      ) {
        return { error: msg.rate }
      }
      return { error: msg.generic }
    }
    return { success: true, message: msg.success }
  } catch (e: unknown) {
    console.error('[resendSignupVerificationEmail][uncaught]', e)
    return { error: msg.generic }
  }
}

/**
 * 로그인 후 프로필 필수 항목 보완
 * @description 이름·생년월일·휴대전화를 저장한 뒤 마이페이지로 이동 (RLS — 본인 행만 UPDATE)
 * @param formData - name, birth_date, phone, phone_country_code, locale
 * @returns { error: string } 또는 redirect
 */
export async function completeProfile(formData: FormData) {
  const supabase = await createSupabaseServerClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) {
    return { error: '로그인이 필요합니다. 다시 로그인해 주세요.' }
  }

  const locale = (formData.get('locale') as string) || 'ko'
  const name = String(formData.get('name') || '').trim()
  const birth_date = String(formData.get('birth_date') || '').trim()
  const phone = String(formData.get('phone') || '').trim()
  const phone_country_code =
    (formData.get('phone_country_code') as string) || '+82'

  if (!name || !birth_date || !phone) {
    return { error: '이름, 생년월일, 휴대전화를 모두 입력해 주세요.' }
  }

  const { error } = await supabase
    .from('profiles')
    .update({
      name,
      birth_date,
      phone,
      phone_country_code,
    })
    .eq('id', user.id)

  if (error) {
    return { error: '프로필 저장 중 오류가 발생했습니다. 잠시 후 다시 시도해 주세요.' }
  }

  redirect(`/${locale}/my/dashboard`)
}

/**
 * 이메일 로그인 처리
 * @description 이메일/비밀번호로 Supabase 인증 후 프로필 미완성이면 보완 페이지로, 아니면 마이페이지로 리다이렉트
 * @param formData - email, password, locale (선택, 기본 ko)
 * @returns { error: string } 또는 redirect
 */
export async function signInWithEmail(formData: FormData) {
  const supabase = await createSupabaseServerClient()
  const locale = (formData.get('locale') as string) || 'ko'

  const email = formData.get('email') as string
  const password = formData.get('password') as string

  const { error } = await supabase.auth.signInWithPassword({ email, password })

  if (error) {
    return { error: '이메일 또는 비밀번호가 올바르지 않습니다.' }
  }

  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) {
    redirect(`/${locale}/my/login`)
  }

  const { data: profile } = await supabase
    .from('profiles')
    .select('name, birth_date, phone')
    .eq('id', user.id)
    .maybeSingle()

  if (isProfileIncomplete(profile)) {
    redirect(`/${locale}/my/complete-profile`)
  }

  redirect(`/${locale}/my/dashboard`)
}

/**
 * 로그아웃 처리
 * @description 세션 종료 후 메인 페이지로 리다이렉트
 */
export async function signOut() {
  const supabase = await createSupabaseServerClient()
  await supabase.auth.signOut()
  redirect('/ko')
}

/**
 * 비밀번호 재설정 이메일 발송
 * @description profiles 테이블에서 이메일 존재 여부 확인 후 Supabase 비밀번호 재설정 링크 전송
 * @param formData - email 포함
 * @returns { success: true } 또는 { error: string }
 */
export async function resetPasswordWithEmail(formData: FormData) {
  const supabase = await createSupabaseServerClient()
  const email = formData.get('email') as string
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://trailkorea.org'

  // 이메일 존재 여부 먼저 확인 (profiles 테이블)
  const { data: profile, error: profileError } = await supabase
    .from('profiles')
    .select('id')
    .eq('email', email)
    .maybeSingle()

  if (profileError) return { error: '비밀번호 재설정 중 오류가 발생했습니다. 잠시 후 다시 시도해주세요.' }
  if (!profile) {
    return { error: '가입되지 않은 이메일입니다. 이메일 주소를 다시 확인해주세요.' }
  }

  const { error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: `${siteUrl}/ko/auth/callback`,
  })

  if (error) return { error: '비밀번호 재설정 링크 전송 중 오류가 발생했습니다. 잠시 후 다시 시도해주세요.' }
  return { success: true }
}

/**
 * 비밀번호 변경 처리
 * @description 새 비밀번호로 Supabase 사용자 정보 업데이트 후 로그인 페이지로 리다이렉트
 * @param formData - password 포함
 * @returns { error: string } 또는 redirect
 */
export async function updatePassword(formData: FormData) {
  const supabase = await createSupabaseServerClient()
  const password = formData.get('password') as string

  const { error } = await supabase.auth.updateUser({ password })
  if (error) return { error: '비밀번호 변경 중 오류가 발생했습니다. 잠시 후 다시 시도해주세요.' }

  redirect('/ko/my/login?reset=done')
}

/**
 * 전화번호 OTP 인증번호 발송
 * @description Supabase SMS OTP 전송 요청
 * @param phone - 국제 형식 전화번호 (예: +821012345678)
 * @returns { success: true } 또는 { error: string }
 */
export async function signInWithPhone(phone: string) {
  const supabase = await createSupabaseServerClient()
  const { error } = await supabase.auth.signInWithOtp({ phone })
  if (error) return { error: '인증번호 전송 중 오류가 발생했습니다. 잠시 후 다시 시도해주세요.' }
  return { success: true }
}

/**
 * 전화번호 OTP 검증 및 로그인 처리
 * @description OTP 확인 후 profiles upsert. 프로필 필수 항목이 부족하면 보완 페이지로 이동
 * @param phone - 국제 형식 전화번호
 * @param token - SMS로 수신한 OTP 코드
 * @param locale - 리다이렉트용 로케일 (기본 ko)
 * @returns { error: string } 또는 redirect
 */
export async function verifyPhoneOtp(
  phone: string,
  token: string,
  locale: string = 'ko'
) {
  const supabase = await createSupabaseServerClient()
  const { data, error } = await supabase.auth.verifyOtp({
    phone,
    token,
    type: 'sms',
  })
  if (error) return { error: '인증번호가 올바르지 않습니다. 다시 확인해주세요.' }

  if (data.user) {
    const countryCode = phone.match(/^\+\d+/)?.[0] || '+82'
    await supabase.from('profiles').upsert(
      {
        id: data.user.id,
        phone,
        phone_country_code: countryCode,
        phone_verified: true,
        membership_grade: 'general',
        is_active: true,
      },
      { onConflict: 'id' }
    )
  }

  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) {
    redirect(`/${locale}/my/login`)
  }

  const { data: profile } = await supabase
    .from('profiles')
    .select('name, birth_date, phone')
    .eq('id', user.id)
    .maybeSingle()

  if (isProfileIncomplete(profile)) {
    redirect(`/${locale}/my/complete-profile`)
  }

  redirect(`/${locale}/my/dashboard`)
}
