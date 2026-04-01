/**
 * @file 관리자용 공지 이미지 업로드 API
 * @description 공지 첨부 이미지를 Supabase Storage에 업로드한다. admin 등급 인증 필요.
 * @module admin
 */

import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase-admin'
import { requireAdmin } from '@/lib/admin-auth'

/**
 * POST /api/admin/notices/upload-image
 * 공지 첨부 이미지 업로드 (관리자 전용)
 *
 * Body: FormData { file: File }
 * Returns: { url: string } — Supabase Storage 공개 URL
 * Auth: admin 등급 필요
 */
export async function POST(request: NextRequest) {
  // ─── 인증 검증 ────────────────────────────────────────────
  const authError = await requireAdmin()
  if (authError) return authError

  const formData = await request.formData()
  const file = formData.get('file') as File | null

  if (!file) return NextResponse.json({ error: '파일이 없습니다.' }, { status: 400 })

  const ext = file.name.split('.').pop()
  const path = `${Date.now()}.${ext}`
  const buffer = Buffer.from(await file.arrayBuffer())

  // NOTE: supabaseAdmin 사용 — notice-images 버킷 업로드는 RLS 우회 필수
  const { error } = await supabaseAdmin.storage
    .from('notice-images')
    .upload(path, buffer, {
      contentType: file.type,
      upsert: false,
    })

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })

  const { data } = supabaseAdmin.storage.from('notice-images').getPublicUrl(path)
  return NextResponse.json({ url: data.publicUrl })
}
