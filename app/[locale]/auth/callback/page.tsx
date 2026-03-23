"use client"
import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { createClient } from "@supabase/supabase-js"

export default function AuthCallbackPage() {
  const router = useRouter()

  useEffect(() => {
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    )

    const code = new URLSearchParams(window.location.search).get("code")

    if (code) {
      // localStorage에 PKCE 검증값이 있으므로 동일 클라이언트로 교환 가능
      supabase.auth.exchangeCodeForSession(code)
        .then(({ error }) => {
          if (error) {
            router.replace(`/ko/my/login?error=${encodeURIComponent(error.message)}`)
          } else {
            router.replace("/ko/my/dashboard")
          }
        })
    } else {
      // code가 없으면 auth state 변화 감지 (비밀번호 재설정 등)
      const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
        if (event === "SIGNED_IN" && session) {
          subscription.unsubscribe()
          router.replace("/ko/my/dashboard")
        } else if (event === "PASSWORD_RECOVERY") {
          subscription.unsubscribe()
          router.replace("/ko/my/reset-password")
        }
      })
      const timer = setTimeout(() => {
        subscription.unsubscribe()
        router.replace("/ko/my/login?error=timeout")
      }, 5000)
      return () => { subscription.unsubscribe(); clearTimeout(timer) }
    }
  }, [router])

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <div className="w-8 h-8 border-2 border-[#1e3a6e] border-t-transparent rounded-full animate-spin mx-auto mb-3"></div>
        <p className="text-sm text-gray-500">로그인 처리 중...</p>
      </div>
    </div>
  )
}
