/**
 * @file 관리자용 개별 회원 상태 변경 API
 * @description 회원의 등급 또는 활성 상태를 변경한다. admin 등급 인증 필요.
 * @module admin
 */

import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase-admin";
import { requireAdmin } from "@/lib/admin-auth";

/**
 * PATCH /api/admin/members/[id]
 * 개별 회원 등급·활성 상태 변경 (관리자 전용)
 *
 * Body: { membership_grade?: string, is_active?: boolean }
 * Returns: { member: Profile }
 * Auth: admin 등급 필요
 */
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  // ─── 인증 검증 ────────────────────────────────────────────
  const authError = await requireAdmin();
  if (authError) return authError;

  try {
    const { id } = await params;
    const body = await request.json();
    const { membership_grade, is_active } = body as {
      membership_grade?: string;
      is_active?: boolean;
    };

    const updates: Record<string, unknown> = {};
    if (membership_grade !== undefined) updates.membership_grade = membership_grade;
    if (is_active !== undefined) updates.is_active = is_active;

    if (Object.keys(updates).length === 0) {
      return NextResponse.json({ error: "No fields to update" }, { status: 400 });
    }

    const { data, error } = await supabaseAdmin
      .from("profiles")
      .update(updates)
      .eq("id", id)
      .select()
      .single();

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ member: data });
  } catch (err) {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
