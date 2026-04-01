/**
 * @file 회원 업그레이드 신청 API
 * @description 준회원의 정회원/기업회원 업그레이드 신청을 upgrade_requests 테이블에 저장한다.
 * @module member
 */

import { NextRequest, NextResponse } from 'next/server'
import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'
import { supabaseAdmin } from '@/lib/supabase-admin'

/**
 * POST /api/member/upgrade
 * 회원 업그레이드 신청 저장
 *
 * Body: { request_type, race_name?, race_date?, wants_insurance?, company_name?, biz_number?, manager_name?, phone? }
 * Returns: { id: string } — 생성된 신청 ID
 * Auth: 로그인 필요 (general 등급 이상)
 */
export async function POST(request: NextRequest) {
  const cookieStore = await cookies()

  // ─── 로그인 유저 확인 ─────────────────────────────────
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
  if (userError || !user) {
    return NextResponse.json({ error: '로그인이 필요합니다.' }, { status: 401 })
  }

  // ─── 중복 신청 확인 (pending 상태 신청 이미 존재) ────
  const { data: existing } = await supabaseAdmin
    .from('upgrade_requests')
    .select('id')
    .eq('user_id', user.id)
    .eq('status', 'pending')
    .maybeSingle()

  if (existing) {
    return NextResponse.json({ error: '이미 처리 대기 중인 신청이 있습니다.' }, { status: 409 })
  }

  // ─── 신청 데이터 저장 ─────────────────────────────────
  const body = await request.json()
  const { request_type, race_name, race_date, wants_insurance, company_name, biz_number, manager_name, phone } = body

  if (!request_type || !['regular', 'corporate'].includes(request_type)) {
    return NextResponse.json({ error: '올바른 신청 유형이 필요합니다.' }, { status: 400 })
  }

  // NOTE: supabaseAdmin 사용 — RLS INSERT 정책은 auth.uid() 기반, 서버에서 직접 삽입 시 우회 필요
  const { data, error } = await supabaseAdmin
    .from('upgrade_requests')
    .insert({
      user_id: user.id,
      request_type,
      race_name: race_name || null,
      race_date: race_date || null,
      wants_insurance: wants_insurance ?? false,
      company_name: company_name || null,
      biz_number: biz_number || null,
      manager_name: manager_name || null,
      phone: phone || null,
    })
    .select('id')
    .single()

  if (error) {
    console.error('[api/member/upgrade] insert error:', error.message)
    return NextResponse.json({ error: '신청 저장 중 오류가 발생했습니다.' }, { status: 500 })
  }

  return NextResponse.json({ id: data.id }, { status: 201 })
}
