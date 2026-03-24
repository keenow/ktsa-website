/**
 * @file 인증 관련 Server Actions
 * @description 이메일/OAuth/전화번호 인증, 비밀번호 재설정 등 인증 흐름 전반을 처리하는 서버 액션 모음
 * @module auth
 */
'use server'

import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import { supabaseAdmin } from '@/lib/supabase-admin'

/**
 * 서버 컴포넌트 및 Server Action용 Supabase 클라이언트 생성
 * @returns Supabase 서버 클라이언트 인스턴스
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
 * 이메일 회원가입 처리
 * @description Supabase Auth 계정 생성 후 profiles 테이블에 사용자 정보 INSERT
 * @param formData - email, password, name, phone, phone_country_code, birth_date 포함
 * @returns { success: true } 또는 { error: string }
 */
export async function signUpWithEmail(formData: FormData) {
  const supabase = await createSupabaseServerClient()

  const email = formData.get('email') as string
  const password = formData.get('password') as string
  const name = formData.get('name') as string
  const phone = formData.get('phone') as string | null
  const phone_country_code = formData.get('phone_country_code') as string | null
  const birth_date = formData.get('birth_date') as string | null

  const { data, error } = await supabase.auth.signUp({ email, password })

  if (error) {
    if (error.message.includes('already registered')) {
      return { error: '이미 가입된 이메일입니다.' }
    }
    return { error: '회원가입 처리 중 오류가 발생했습니다. 잠시 후 다시 시도해주세요.' }
  }

  if (data.user) {
    // NOTE: supabaseAdmin 사용 — profiles INSERT는 RLS 정책상 일반 클라이언트로 불가
    const { error: profileError } = await supabaseAdmin
      .from('profiles')
      .insert({
        id: data.user.id,
        email,
        name,
        phone: phone || null,
        phone_country_code: phone_country_code || '+82',
        birth_date: birth_date || null,
        membership_grade: 'general',
        is_active: true,
      })

    if (profileError) {
      return { error: '회원가입 처리 중 오류가 발생했습니다. 잠시 후 다시 시도해주세요.' }
    }
  }

  return { success: true, message: '이메일 인증 링크를 확인해주세요.' }
}

/**
 * 이메일 로그인 처리
 * @description 이메일/비밀번호로 Supabase 인증 후 메인 페이지로 리다이렉트
 * @param formData - email, password 포함
 * @returns { error: string } 또는 redirect
 */
export async function signInWithEmail(formData: FormData) {
  const supabase = await createSupabaseServerClient()

  const email = formData.get('email') as string
  const password = formData.get('password') as string

  const { error } = await supabase.auth.signInWithPassword({ email, password })

  if (error) {
    return { error: '이메일 또는 비밀번호가 올바르지 않습니다.' }
  }

  redirect('/ko')
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
 * @description OTP 확인 후 profiles 테이블 upsert (신규 가입 또는 phone_verified 업데이트) 후 메인 페이지로 리다이렉트
 * @param phone - 국제 형식 전화번호
 * @param token - SMS로 수신한 OTP 코드
 * @returns { error: string } 또는 redirect
 */
export async function verifyPhoneOtp(phone: string, token: string) {
  const supabase = await createSupabaseServerClient()
  const { data, error } = await supabase.auth.verifyOtp({ phone, token, type: 'sms' })
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

  redirect('/ko')
}
