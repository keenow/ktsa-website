/**
 * POST /api/admin/notices/upload-image
 * 이미지를 Supabase Storage에 업로드 (supabaseAdmin 사용 — RLS 우회)
 * Auth: admin 전용
 */
import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase-admin'

export async function POST(request: NextRequest) {
  const formData = await request.formData()
  const file = formData.get('file') as File | null

  if (!file) return NextResponse.json({ error: '파일이 없습니다.' }, { status: 400 })

  const ext = file.name.split('.').pop()
  const path = `${Date.now()}.${ext}`
  const buffer = Buffer.from(await file.arrayBuffer())

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
