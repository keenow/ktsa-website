/**
 * @file 비밀번호 재설정 페이지
 * @description 이메일 링크를 통해 접근한 사용자가 새 비밀번호를 설정하는 페이지
 * @module member
 */

'use client'

import { useLocale } from 'next-intl'
import Link from 'next/link'
import { useState } from 'react'
import { updatePassword } from '../actions'

/**
 * 비밀번호 재설정 페이지 컴포넌트
 * @description 새 비밀번호 입력 및 확인 후 updatePassword Server Action 호출
 * @returns 비밀번호 재설정 폼 JSX
 */
export default function ResetPasswordPage() {
  const locale = useLocale()
  const isKo = locale === 'ko'

  // ─── 상태 관리 ─────────────────────────────────────
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  // ─── 이벤트 핸들러 ──────────────────────────────────

  /**
   * 비밀번호 변경 폼 제출 처리
   * @param e - React.FormEvent<HTMLFormElement>
   * @returns void (유효성 검사 실패 시 조기 반환, 성공 시 updatePassword 호출)
   */
  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setError(null)

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
    // NOTE: updatePassword는 Server Action — Supabase 세션 기반으로 비밀번호 변경
    const result = await updatePassword(formData)
    if (result?.error) {
      setError(result.error)
      setLoading(false)
    }
  }

  // ─── 렌더링 ─────────────────────────────────────────
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

        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-8">
          <h1 className="text-xl font-bold text-gray-900 mb-2">
            {isKo ? '새 비밀번호 설정' : 'Set New Password'}
          </h1>
          <p className="text-sm text-gray-500 mb-6">
            {isKo ? '새로 사용할 비밀번호를 입력해주세요.' : 'Enter your new password below.'}
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
                placeholder={isKo ? '동일하게 입력' : 'Re-enter password'}
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
              className="w-full bg-[#1e3a6e] text-white rounded-lg py-2.5 text-sm font-semibold hover:bg-[#152d57] transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
            >
              {loading ? '...' : isKo ? '비밀번호 변경' : 'Change Password'}
            </button>
          </form>
        </div>

        <p className="text-center text-sm text-gray-500 mt-4">
          <Link href={`/${locale}/my/login`} className="text-[#1e3a6e] font-semibold hover:underline">
            {isKo ? '← 로그인으로 돌아가기' : '← Back to sign in'}
          </Link>
        </p>
      </div>
    </div>
  )
}
