'use client'

import { useLocale } from 'next-intl'
import Link from 'next/link'
import { useState } from 'react'
import { updatePassword } from '../actions'

export default function ResetPasswordPage() {
  const locale = useLocale()
  const isKo = locale === 'ko'
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    const formData = new FormData(e.currentTarget)
    const password = formData.get('password') as string
    const confirm = formData.get('confirm') as string

    if (password.length < 8) {
      setError(isKo ? '비밀번호는 8자 이상이어야 합니다.' : 'Password must be at least 8 characters.')
      return
    }
    if (password !== confirm) {
      setError(isKo ? '비밀번호가 일치하지 않습니다.' : 'Passwords do not match.')
      return
    }

    setLoading(true)
    setError(null)
    const result = await updatePassword(formData)
    if (result?.error) setError(result.error)
    setLoading(false)
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <div className="w-full max-w-sm">

        <div className="text-center mb-8">
          <Link href={`/${locale}`}>
            <span className="text-2xl font-bold text-[#1e3a6e]">KTSA</span>
          </Link>
          <p className="text-sm text-gray-400 mt-1">
            {isKo ? '대한트레일스포츠협회' : 'Korea Trail Sports Association'}
          </p>
        </div>

        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-8">
          <h1 className="text-xl font-bold text-gray-900 mb-2">
            {isKo ? '새 비밀번호 설정' : 'Set New Password'}
          </h1>
          <p className="text-sm text-gray-500 mb-6">
            {isKo ? '새로운 비밀번호를 입력해주세요.' : 'Enter your new password below.'}
          </p>

          <form className="space-y-4" onSubmit={handleSubmit}>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                {isKo ? '새 비밀번호' : 'New Password'} <span className="text-red-400">*</span>
              </label>
              <input
                name="password"
                type="password"
                required
                placeholder={isKo ? '8자 이상' : '8+ characters'}
                className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#1e3a6e] focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                {isKo ? '비밀번호 확인' : 'Confirm Password'} <span className="text-red-400">*</span>
              </label>
              <input
                name="confirm"
                type="password"
                required
                placeholder={isKo ? '동일하게 입력' : 'Repeat password'}
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
              className="w-full bg-[#1e3a6e] text-white rounded-lg py-2.5 text-sm font-semibold hover:bg-[#152d57] transition-colors disabled:opacity-40 disabled:cursor-not-allowed mt-1"
            >
              {loading ? '...' : isKo ? '비밀번호 변경' : 'Update Password'}
            </button>
          </form>
        </div>

        <p className="text-center text-sm text-gray-500 mt-4">
          <Link href={`/${locale}/my/login`} className="text-[#1e3a6e] font-semibold hover:underline">
            {isKo ? '← 로그인으로 돌아가기' : '← Back to login'}
          </Link>
        </p>
      </div>
    </div>
  )
}
