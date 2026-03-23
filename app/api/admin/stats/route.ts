import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase-admin";

export async function GET() {
  try {
    const now = new Date();
    const firstOfMonth = new Date(now.getFullYear(), now.getMonth(), 1).toISOString();

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
