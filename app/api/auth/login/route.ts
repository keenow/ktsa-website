import { createServerClient } from "@supabase/ssr"
import { cookies } from "next/headers"
import { NextResponse } from "next/server"

export async function GET() {
  const cookieStore = await cookies()

  // setAll로 전달되는 쿠키를 먼저 수집
  const pendingCookies: { name: string; value: string; options: Record<string, unknown> }[] = []

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() { return cookieStore.getAll() },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) => {
            pendingCookies.push({ name, value, options })
          })
        },
      },
    }
  )

  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: "google",
    options: {
      redirectTo: "https://trailkorea.org/api/auth/callback",
    },
  })

  if (error || !data.url) {
    return NextResponse.redirect("https://trailkorea.org/ko/my/login?error=oauth_init_failed")
  }

  // PKCE 쿠키를 원본 옵션 그대로 redirect 응답에 첨부
  const redirectResponse = NextResponse.redirect(data.url)
  pendingCookies.forEach(({ name, value, options }) => {
    redirectResponse.cookies.set(name, value, options as Parameters<typeof redirectResponse.cookies.set>[2])
  })

  return redirectResponse
}
