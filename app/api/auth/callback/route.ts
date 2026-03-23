import { createServerClient } from "@supabase/ssr"
import { cookies } from "next/headers"
import { NextRequest, NextResponse } from "next/server"
import { supabaseAdmin } from "@/lib/supabase-admin"

export async function GET(request: NextRequest) {
  const { searchParams, origin } = new URL(request.url)
  const code = searchParams.get("code")

  if (!code) {
    return NextResponse.redirect(`${origin}/ko/my/login?error=no_code`)
  }

  const cookieStore = await cookies()
  const response = NextResponse.redirect(`${origin}/ko/my/dashboard`)

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() { return cookieStore.getAll() },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) => {
            response.cookies.set(name, value, options)
          })
        },
      },
    }
  )

  const { data, error } = await supabase.auth.exchangeCodeForSession(code)

  if (error) {
    return NextResponse.redirect(`${origin}/ko/my/login?error=${encodeURIComponent(error.message)}`)
  }

  // 신규 사용자 profiles 생성
  if (data.user) {
    const { data: existing } = await supabase.from("profiles").select("id").eq("id", data.user.id).single()
    if (!existing) {
      await supabaseAdmin.from("profiles").insert({
        id: data.user.id,
        email: data.user.email,
        name: data.user.user_metadata?.full_name || data.user.user_metadata?.name || "",
        membership_grade: "general",
        is_active: true,
      })
    }
  }

  return response
}
