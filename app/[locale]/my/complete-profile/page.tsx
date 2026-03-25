/**
 * @file 프로필 보완 페이지
 * @description 이메일 인증·로그인 후 이름·생년월일·휴대전화를 수집하는 2단계 폼
 * @module member
 */
'use client'

import { useLocale } from 'next-intl'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import { completeProfile } from '../actions'

/**
 * 필수 프로필 미입력 시 표시되는 보완 폼
 * @returns JSX.Element
 */
export default function CompleteProfilePage() {
  const locale = useLocale()
  const router = useRouter()
  const isKo = locale === 'ko'
  const [countryCode, setCountryCode] = useState('+82')
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    void (async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser()
      if (!user) {
        router.replace(`/${locale}/my/login`)
      }
    })()
  }, [router, locale])

  /**
   * 이름·생년월일·전화 제출
   * @param e - 폼 제출 이벤트
   * @returns void
   */
  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setLoading(true)
    setError(null)
    const formData = new FormData(e.currentTarget)
    formData.set('phone_country_code', countryCode)
    const result = await completeProfile(formData)
    if (result?.error) {
      setError(result.error)
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4 py-12">
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
          <h1 className="text-xl font-bold text-gray-900 mb-1">
            {isKo ? '추가 정보 입력' : 'Complete your profile'}
          </h1>
          <p className="text-sm text-gray-500 mb-6">
            {isKo
              ? '서비스 이용을 위해 아래 정보를 입력해 주세요.'
              : 'Please provide the following to finish setting up your account.'}
          </p>

          <form className="space-y-4" onSubmit={handleSubmit}>
            <input type="hidden" name="locale" value={locale} />

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                {isKo ? '이름' : 'Name'} <span className="text-red-400">*</span>
              </label>
              <input
                name="name"
                type="text"
                required
                placeholder={isKo ? '홍길동' : 'Full name'}
                className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#1e3a6e]"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                {isKo ? '생년월일' : 'Birth date'} <span className="text-red-400">*</span>
              </label>
              <input
                name="birth_date"
                type="date"
                required
                className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#1e3a6e]"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                {isKo ? '휴대전화' : 'Phone'} <span className="text-red-400">*</span>
              </label>
              <div className="flex gap-2">
                <select
                  value={countryCode}
                  onChange={(e) => setCountryCode(e.target.value)}
                  className="w-28 shrink-0 border border-gray-300 rounded-lg px-2 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#1e3a6e] bg-white"
                >
                  <option value="+82">🇰🇷 +82</option>
                  <option value="+1">🇺🇸 +1</option>
                  <option value="+81">🇯🇵 +81</option>
                  <option value="+86">🇨🇳 +86</option>
                  <option value="+44">🇬🇧 +44</option>
                  <option value="+49">🇩🇪 +49</option>
                  <option value="+33">🇫🇷 +33</option>
                  <option value="+61">🇦🇺 +61</option>
                </select>
                <input
                  name="phone"
                  type="tel"
                  required
                  placeholder={countryCode === '+82' ? '010-0000-0000' : '555-0000'}
                  className="flex-1 border border-gray-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#1e3a6e]"
                />
              </div>
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
              {loading ? '...' : isKo ? '저장하고 계속하기' : 'Save and continue'}
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}
