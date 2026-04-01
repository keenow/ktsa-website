/**
 * @file 관리자 API 인증 검증 헬퍼
 * @description admin API 라우트에서 현재 요청 유저가 admin 등급인지 확인한다.
 *              인증 실패 시 401 응답을 반환하며, 통과 시 null을 반환한다.
 * @module admin
 */

import { createServerClient } from "@supabase/ssr"
import { cookies } from "next/headers"
import { NextResponse } from "next/server"

/**
 * 현재 요청 유저가 admin 등급인지 검증
 * @returns null이면 인증 통과, NextResponse이면 인증 실패 응답 (401)
 */
export async function requireAdmin(): Promise<NextResponse | null> {
  const cookieStore = await cookies()

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

  // ─── 세션 유저 확인 ───────────────────────────────────────
  const { data: { user }, error: userError } = await supabase.auth.getUser()

  if (userError || !user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  // ─── admin 등급 확인 (supabaseAdmin 없이 anon으로 본인 조회) ─
  const { data: profile, error: profileError } = await supabase
    .from("profiles")
    .select("membership_grade")
    .eq("id", user.id)
    .single()

  if (profileError || !profile || profile.membership_grade !== "admin") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  return null
}
