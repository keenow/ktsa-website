import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase-admin";

export async function GET(request: NextRequest) {
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
