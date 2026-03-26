/**
 * @file 이메일 인증 토큰 교환 라우트
 * @description Supabase가 이메일로 발송한 token_hash를 수신하여
 *              verifyOtp로 세션을 설정하고 next 경로로 리다이렉트한다.
 *              실패 시 /ko/login?error=invalid_token 으로 리다이렉트.
 * @module auth
 */

import { createServerClient } from "@supabase/ssr"
import { cookies } from "next/headers"
import { NextRequest, NextResponse } from "next/server"

/**
 * GET /api/auth/confirm
 * 이메일 인증 링크 처리 — token_hash를 교환하여 세션 설정 후 리다이렉트
 * Auth: 불필요 (인증 완료 전 단계)
 * Returns: 302 Redirect → next (성공) | /ko/login?error=invalid_token (실패)
 */
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const token_hash = searchParams.get("token_hash")
  // NOTE: Supabase EmailOtpType — verifyOtp token_hash 방식에서 허용되는 값
  const type = searchParams.get("type") as
    | "email_change"
    | "recovery"
    | "signup"
    | "invite"
    | "magiclink"
    | "email"
  const next = searchParams.get("next") ?? "/ko/my/dashboard"

  if (token_hash && type) {
    const cookieStore = await cookies()
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          getAll: () => cookieStore.getAll(),
          setAll: (cookiesToSet) => {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options)
            )
          },
        },
      }
    )

    const { error } = await supabase.auth.verifyOtp({ type, token_hash })
    if (!error) {
      return NextResponse.redirect(new URL(next, request.url))
    }

    console.warn(
      "[api/auth/confirm]",
      JSON.stringify({ event: "verify_otp_failed", error: error.message })
    )
  }

  return NextResponse.redirect(
    new URL("/ko/login?error=invalid_token", request.url)
  )
}
