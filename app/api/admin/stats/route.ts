/**
 * @file 관리자 대시보드 통계 API
 * @description 회원 수 통계(전체·준회원·정회원·이번달 신규)와 최근 가입자 목록을 반환한다.
 * @module admin
 */

import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase-admin";
import { requireAdmin } from "@/lib/admin-auth";

/**
 * GET /api/admin/stats
 * 관리자 대시보드용 회원 통계 집계 (관리자 전용)
 *
 * Returns: { total, general, member, newThisMonth, recentMembers }
 * Auth: admin 등급 필요
 */
export async function GET() {
  // ─── 인증 검증 ────────────────────────────────────────────
  const authError = await requireAdmin();
  if (authError) return authError;

  try {
    const now = new Date();
    const firstOfMonth = new Date(now.getFullYear(), now.getMonth(), 1).toISOString();

    // ─── 5개 쿼리 병렬 실행 ──────────────────────────────────
    const [totalRes, generalRes, memberRes, newThisMonthRes, recentRes] = await Promise.all([
      supabaseAdmin
        .from("profiles")
        .select("id", { count: "exact", head: true })
        .is("deleted_at", null),
      supabaseAdmin
        .from("profiles")
        .select("id", { count: "exact", head: true })
        .is("deleted_at", null)
        .eq("membership_grade", "general"),
      supabaseAdmin
        .from("profiles")
        .select("id", { count: "exact", head: true })
        .is("deleted_at", null)
        .eq("membership_grade", "member"),
      supabaseAdmin
        .from("profiles")
        .select("id", { count: "exact", head: true })
        .is("deleted_at", null)
        .gte("created_at", firstOfMonth),
      supabaseAdmin
        .from("profiles")
        .select("id, name, email, membership_grade, created_at")
        .is("deleted_at", null)
        .order("created_at", { ascending: false })
        .limit(5),
    ]);

    if (totalRes.error || generalRes.error || memberRes.error || newThisMonthRes.error || recentRes.error) {
      const err = totalRes.error ?? generalRes.error ?? memberRes.error ?? newThisMonthRes.error ?? recentRes.error;
      return NextResponse.json({ error: err?.message }, { status: 500 });
    }

    return NextResponse.json({
      total: totalRes.count ?? 0,
      general: generalRes.count ?? 0,
      member: memberRes.count ?? 0,
      newThisMonth: newThisMonthRes.count ?? 0,
      recentMembers: recentRes.data ?? [],
    });
  } catch (err) {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
