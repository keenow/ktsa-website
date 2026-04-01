/**
 * @file 관리자용 공지 목록 조회·신규 생성 API
 * @description 공지 전체 목록 조회(GET) 및 신규 공지 생성(POST). admin 등급 인증 필요.
 * @module admin
 */

import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase-admin'
import { requireAdmin } from '@/lib/admin-auth'

/**
 * GET /api/admin/notices
 * 공지 전체 목록 조회 (관리자 전용)
 *
 * Returns: Notice[] (pinned 우선, 최신순)
 * Auth: admin 등급 필요
 */
export async function GET() {
  // ─── 인증 검증 ────────────────────────────────────────────
  const authError = await requireAdmin()
  if (authError) return authError

  const { data, error } = await supabaseAdmin
    .from('notices')
    .select('id, category, title_ko, badge_ko, is_published, pinned, created_at')
    .order('pinned', { ascending: false })
    .order('created_at', { ascending: false })

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json(data)
}

/**
 * POST /api/admin/notices
 * 신규 공지 생성 (관리자 전용)
 *
 * Body: Notice 객체 (title_ko 필수)
 * Returns: 생성된 Notice 단건
 * Auth: admin 등급 필요
 */
export async function POST(request: NextRequest) {
  // ─── 인증 검증 ────────────────────────────────────────────
  const authError = await requireAdmin()
  if (authError) return authError

  const body = await request.json()
  const { data, error } = await supabaseAdmin
    .from('notices')
    .insert(body)
    .select()
    .single()

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json(data, { status: 201 })
}
