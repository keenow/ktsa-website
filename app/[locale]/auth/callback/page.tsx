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

    return () => {
      subscription.unsubscribe()
      clearTimeout(timer)
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
