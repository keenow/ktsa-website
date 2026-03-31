/**
 * POST /api/auth/login-debug
 * 로그인 흐름 서버 사이드 디버깅용 — 배포 후 제거 예정
 * Auth: 불필요
 */
import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'
import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase-admin'

export async function POST(request: NextRequest) {
  const cookieStore = await cookies()
  const allCookies = cookieStore.getAll()

  // 세션 쿠키 이름만 추출 (값은 제외)
  const cookieNames = allCookies.map(c => c.name)

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() { return cookieStore.getAll() },
        setAll() {},
      },
    }
  )

  const { data: { user }, error: userError } = await supabase.auth.getUser()

  console.log('[login-debug] cookieNames:', JSON.stringify(cookieNames))
  console.log('[login-debug] user:', user?.id ?? 'null', 'error:', userError?.message)

  let profile = null
  let profileError = null
  if (user) {
    const res = await supabaseAdmin
      .from('profiles')
      .select('id, email, name, birth_date, phone, membership_grade')
      .eq('id', user.id)
      .maybeSingle()
    profile = res.data
    profileError = res.error?.message
    console.log('[login-debug] profile:', JSON.stringify(profile), 'error:', profileError)
  }

  return NextResponse.json({
    cookieNames,
    userId: user?.id ?? null,
    userError: userError?.message ?? null,
    profile,
    profileError,
  })
}
