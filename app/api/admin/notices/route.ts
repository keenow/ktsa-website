/**
 * GET /api/admin/notices
 * 공지 전체 목록 조회 (관리자 전용, supabaseAdmin 사용)
 * Auth: admin 등급 필요
 */
import { NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase-admin'

export async function GET() {
  const { data, error } = await supabaseAdmin
    .from('notices')
    .select('id, category, title_ko, badge_ko, is_published, pinned, created_at')
    .order('pinned', { ascending: false })
    .order('created_at', { ascending: false })

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json(data)
}
