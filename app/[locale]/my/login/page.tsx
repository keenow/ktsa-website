'use client'

import { useLocale } from 'next-intl'
import Link from 'next/link'
import { useState } from 'react'
import { signInWithEmail, signInWithOAuth } from '../actions'

export default function LoginPage() {
  const locale = useLocale()
  const isKo = locale === 'ko'
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setLoading(true)
    setError(null)
    const formData = new FormData(e.currentTarget)
    const result = await signInWithEmail(formData)
    if (result?.error) setError(result.error)
    setLoading(false)
  }

  async function handleOAuth(provider: 'google' | 'kakao') {
    setLoading(true)
    await signInWithOAuth(provider)
    setLoading(false)
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <div className="w-full max-w-sm">

        {/* 로고 */}
        <div className="text-center mb-8">
          <Link href={`/${locale}`}>
            <span className="text-2xl font-bold text-[#1e3a6e]">KTSA</span>
          </Link>
          <p className="text-sm text-gray-400 mt-1">
            {isKo ? '대한트레일스포츠협회' : 'Korea Trail Sports Association'}
          </p>
        </div>

        {/* 카드 */}
        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-8">
          <h1 className="text-xl font-bold text-gray-900 mb-6">
            {isKo ? '로그인' : 'Sign In'}
          </h1>

          <form className="space-y-4" onSubmit={handleSubmit}>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                {isKo ? '이메일' : 'Email'}
              </label>
              <input
                name="email"
                type="email"
                required
                placeholder="example@email.com"
                className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#1e3a6e] focus:border-transparent"
              />
            </div>

            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="block text-sm font-medium text-gray-700">
                  {isKo ? '비밀번호' : 'Password'}
                </label>
                <button type="button" className="text-xs text-[#1e3a6e] hover:underline">
                  {isKo ? '비밀번호 찾기' : 'Forgot password?'}
                </button>
              </div>
              <input
                name="password"
                type="password"
                required
                placeholder="••••••••"
                className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#1e3a6e] focus:border-transparent"
              />
            </div>

            {error && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-3">
                <p className="text-red-600 text-xs">{error}</p>
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-[#1e3a6e] text-white rounded-lg py-2.5 text-sm font-semibold hover:bg-[#152d57] transition-colors mt-2 disabled:opacity-50"
            >
              {loading ? '...' : isKo ? '로그인' : 'Sign In'}
            </button>
          </form>

          {/* 구분선 */}
          <div className="flex items-center gap-3 my-5">
            <div className="flex-1 h-px bg-gray-200" />
            <span className="text-xs text-gray-400">{isKo ? '또는' : 'or'}</span>
            <div className="flex-1 h-px bg-gray-200" />
          </div>

          {/* 소셜 로그인 */}
          <div className="flex flex-col gap-2">
            <button
              type="button"
              onClick={() => handleOAuth('google')}
              disabled={loading}
              className="w-full border border-gray-200 rounded-lg py-2.5 text-sm text-gray-700 flex items-center justify-center gap-2 hover:bg-gray-50 transition disabled:opacity-50"
            >
              <svg className="w-4 h-4" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
              </svg>
              Google로 로그인
            </button>
            <button
              type="button"
              onClick={() => handleOAuth('kakao')}
              disabled={loading}
              className="w-full bg-[#FEE500] rounded-lg py-2.5 text-sm text-[#191919] font-medium flex items-center justify-center gap-2 hover:bg-[#F5DC00] transition disabled:opacity-50"
            >
              <svg className="w-4 h-4" viewBox="0 0 24 24" fill="#191919">
                <path d="M12 3C6.477 3 2 6.477 2 10.8c0 2.7 1.7 5.1 4.3 6.5l-1.1 4 4.5-2.9c.7.1 1.5.2 2.3.2 5.523 0 10-3.477 10-7.8S17.523 3 12 3z"/>
              </svg>
              카카오로 로그인
            </button>
          </div>

          {/* 회원가입 링크 */}
          <p className="text-center text-sm text-gray-500 mt-6">
            {isKo ? '계정이 없으신가요?' : "Don't have an account?"}{' '}
            <Link href={`/${locale}/my/register`} className="text-[#1e3a6e] font-semibold hover:underline">
              {isKo ? '회원가입' : 'Sign up'}
            </Link>
          </p>
        </div>

        <p className="text-center text-xs text-gray-400 mt-6">
          {isKo ? '로그인 시 개인정보처리방침에 동의하게 됩니다.' : 'By signing in, you agree to our Privacy Policy.'}
          {' '}
          <Link href={`/${locale}/privacy`} className="underline">{isKo ? '확인' : 'View'}</Link>
        </p>
      </div>
    </div>
  )
}
