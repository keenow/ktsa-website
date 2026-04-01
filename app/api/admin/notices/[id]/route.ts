/**
 * @file 관리자용 공지 단건 조회·수정·삭제 API
 * @description 공지 단건 조회(GET), 부분 업데이트(PATCH), 삭제(DELETE). admin 등급 인증 필요.
 * @module admin
 */

import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase-admin'
import { requireAdmin } from '@/lib/admin-auth'

/**
 * GET /api/admin/notices/[id]
 * 공지 단건 전체 필드 조회 (관리자 전용)
 * Auth: admin 등급 필요
 */
export async function GET(_: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  // ─── 인증 검증 ────────────────────────────────────────────
  const authError = await requireAdmin()
  if (authError) return authError

  const { id } = await params
  const { data, error } = await supabaseAdmin.from('notices').select('*').eq('id', id).single()
  if (error) return NextResponse.json({ error: error.message }, { status: 404 })
  return NextResponse.json(data)
}

/**
 * PATCH /api/admin/notices/[id]
 * 공지 부분 업데이트 — 공개 토글, 고정 토글, 전체 수정 모두 동일 엔드포인트 사용
 * Auth: admin 등급 필요
 */
export async function PATCH(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  // ─── 인증 검증 ────────────────────────────────────────────
  const authError = await requireAdmin()
  if (authError) return authError

  const { id } = await params
  const body = await request.json()
  const { error } = await supabaseAdmin.from('notices').update(body).eq('id', id)
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ ok: true })
}

/**
 * DELETE /api/admin/notices/[id]
 * 공지 삭제 — 하드 삭제 (복구 불가)
 * Auth: admin 등급 필요
 */
export async function DELETE(_: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  // ─── 인증 검증 ────────────────────────────────────────────
  const authError = await requireAdmin()
  if (authError) return authError

  const { id } = await params
  const { error } = await supabaseAdmin.from('notices').delete().eq('id', id)
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ ok: true })
}
