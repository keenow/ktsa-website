import { createServerClient } from "@supabase/ssr"
import { cookies } from "next/headers"
import { NextResponse } from "next/server"

export async function GET() {
  const cookieStore = await cookies()
  const response = new NextResponse()

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

  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: "google",
    options: {
      redirectTo: "https://trailkorea.org/api/auth/callback",
    },
  })

  if (error || !data.url) {
    return NextResponse.redirect(new URL("/ko/my/login?error=oauth_init_failed", "https://trailkorea.org"))
  }

  // PKCE 쿠키를 응답에 포함시켜 브라우저에 저장
  const redirectResponse = NextResponse.redirect(data.url)
  response.cookies.getAll().forEach(cookie => {
    redirectResponse.cookies.set(cookie.name, cookie.value, { path: "/" })
  })
  return redirectResponse
}
