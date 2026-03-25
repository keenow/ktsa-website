/**
 * @file OAuth 콜백 라우트 핸들러
 * @description Google OAuth PKCE 코드 교환 및 신규 사용자 프로필 자동 생성
 * @module auth
 */
import { createServerClient } from "@supabase/ssr"
import { cookies } from "next/headers"
import { NextRequest, NextResponse } from "next/server"
import { supabaseAdmin } from "@/lib/supabase-admin"
import { isProfileIncomplete } from "@/lib/profile-completion"

/**
 * GET /api/auth/callback
 * Google OAuth 콜백 처리 (PKCE 코드 교환)
 *
 * Query params:
 *   - code: Supabase에서 전달하는 OAuth 인증 코드
 *
 * 처리 흐름:
 *   1. code 파라미터로 exchangeCodeForSession 실행
 *   2. 신규 사용자면 profiles 자동 생성 (supabaseAdmin 사용)
 *   3. 프로필 필수 항목 미완성 시 /ko/my/complete-profile, 아니면 /ko/my/dashboard로 리다이렉트
 *
 * Auth: 불필요 (OAuth 완료 후 세션 생성)
 */
export async function GET(request: NextRequest) {
  const { searchParams, origin } = new URL(request.url)
  const code = searchParams.get("code")

  if (!code) {
    return NextResponse.redirect(`${origin}/ko/my/login?error=no_code`)
  }

  // NOTE: createServerClient 사용 — 쿠키 기반 PKCE 검증을 위해 @supabase/ssr 필수
  const cookieStore = await cookies()
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() { return cookieStore.getAll() },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) => {
            cookieStore.set(name, value, options)
          })
        },
      },
    }
  )

  const { data, error } = await supabase.auth.exchangeCodeForSession(code)

  if (error) {
    return NextResponse.redirect(`${origin}/ko/my/login?error=${encodeURIComponent(error.message)}`)
  }

  if (data.user) {
    const { data: existing } = await supabase
      .from("profiles")
      .select("id")
      .eq("id", data.user.id)
      .maybeSingle()
    if (!existing) {
      // NOTE: supabaseAdmin 사용 — 신규 소셜 가입자 profiles 생성 시 RLS 우회 필요
      const metaName =
        data.user.user_metadata?.full_name || data.user.user_metadata?.name
      await supabaseAdmin.from("profiles").insert({
        id: data.user.id,
        email: data.user.email,
        name: metaName ? String(metaName) : null,
        membership_grade: "general",
        is_active: true,
      })
    }
  }

  if (data.user) {
    const { data: profile } = await supabase
      .from("profiles")
      .select("name, birth_date, phone")
      .eq("id", data.user.id)
      .maybeSingle()
    if (isProfileIncomplete(profile)) {
      return NextResponse.redirect(`${origin}/ko/my/complete-profile`)
    }
  }

  return NextResponse.redirect(`${origin}/ko/my/dashboard`)
}
