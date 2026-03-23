"use client"
import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { createSupabaseBrowserClient } from "@/lib/supabase"

export default function AuthCallbackPage() {
  const router = useRouter()

  useEffect(() => {
    const supabase = createSupabaseBrowserClient()

    const code = new URLSearchParams(window.location.search).get("code")
    if (code) {
      supabase.auth.exchangeCodeForSession(code).then(({ error }) => {
        if (error) {
          router.replace(`/ko/my/login?error=${encodeURIComponent(error.message)}`)
        } else {
          router.replace("/ko/my/dashboard")
        }
      })
    } else {
      // hash-based flow (implicit)
      supabase.auth.onAuthStateChange((event, session) => {
        if (event === "SIGNED_IN" && session) {
          router.replace("/ko/my/dashboard")
        } else if (event === "PASSWORD_RECOVERY") {
          router.replace("/ko/my/reset-password")
        }
      })
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
