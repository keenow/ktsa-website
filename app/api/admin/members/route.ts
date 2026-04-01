/**
 * @file 관리자용 회원 목록 조회 API
 * @description 회원 목록을 검색·필터 조건으로 조회한다. admin 등급 인증 필요.
 * @module admin
 */

import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase-admin";
import { requireAdmin } from "@/lib/admin-auth";

/**
 * GET /api/admin/members
 * 회원 목록 조회 (관리자 전용)
 *
 * Query params:
 *   - search: 이름·이메일 부분 검색
 *   - grade: 회원 등급 필터 (general | member | admin | all)
 *   - active: 활성 여부 필터 (true | false | all)
 *
 * Returns: { members: Profile[], total: number }
 * Auth: admin 등급 필요
 */
export async function GET(request: NextRequest) {
  // ─── 인증 검증 ────────────────────────────────────────────
  const authError = await requireAdmin();
  if (authError) return authError;

  try {
    const { searchParams } = new URL(request.url);
    const search = searchParams.get("search") ?? "";
    const grade = searchParams.get("grade") ?? "all";
    const active = searchParams.get("active") ?? "all";

    let query = supabaseAdmin
      .from("profiles")
      .select("*")
      .is("deleted_at", null)
      .order("created_at", { ascending: false });

    if (grade !== "all") {
      query = query.eq("membership_grade", grade);
    }

    if (active === "true") {
      query = query.eq("is_active", true);
    } else if (active === "false") {
      query = query.eq("is_active", false);
    }

    if (search) {
      query = query.or(`name.ilike.%${search}%,email.ilike.%${search}%`);
    }

    const { data, error } = await query;

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ members: data, total: data.length });
  } catch (err) {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
