'use server'

import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import { supabaseAdmin } from '@/lib/supabase-admin'

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

export async function signOut() {
  const supabase = await createSupabaseServerClient()
  await supabase.auth.signOut()
  redirect('/ko')
}

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
    redirectTo: `${siteUrl}/ko/auth/callback?next=/ko/my/reset-password`,
  })

  if (error) return { error: '비밀번호 재설정 링크 전송 중 오류가 발생했습니다. 잠시 후 다시 시도해주세요.' }
  return { success: true }
}

export async function updatePassword(formData: FormData) {
  const supabase = await createSupabaseServerClient()
  const password = formData.get('password') as string

  const { error } = await supabase.auth.updateUser({ password })
  if (error) return { error: '비밀번호 변경 중 오류가 발생했습니다. 잠시 후 다시 시도해주세요.' }

  redirect('/ko/my/login?reset=done')
}

export async function signInWithPhone(phone: string) {
  const supabase = await createSupabaseServerClient()
  const { error } = await supabase.auth.signInWithOtp({ phone })
  if (error) return { error: '인증번호 전송 중 오류가 발생했습니다. 잠시 후 다시 시도해주세요.' }
  return { success: true }
}

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
