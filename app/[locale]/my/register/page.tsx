'use client'

import { useLocale } from 'next-intl'
import Link from 'next/link'
import { useState } from 'react'
import { signUpWithEmail, signInWithOAuth } from '../actions'

export default function RegisterPage() {
  const locale = useLocale()
  const isKo = locale === 'ko'
  const [agreed, setAgreed] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [countryCode, setCountryCode] = useState('+82')

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    if (!agreed) return
    setLoading(true)
    setError(null)

    const formData = new FormData(e.currentTarget)
    const password = formData.get('password') as string
    if (password.length < 8) {
      setError(isKo ? '비밀번호는 8자 이상이어야 합니다.' : 'Password must be at least 8 characters.')
      setLoading(false)
      return
    }

    // country code 추가
    formData.set('phone_country_code', countryCode)

    const result = await signUpWithEmail(formData)
    if (result?.error) {
      setError(result.error)
    } else if (result?.success) {
      setSuccess(isKo ? '이메일 인증 링크를 확인해주세요.' : 'Please check your email to verify your account.')
    }
    setLoading(false)
  }

  async function handleOAuth(provider: 'google' | 'kakao') {
    setLoading(true)
    await signInWithOAuth(provider)
    setLoading(false)
  }

  if (success) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
        <div className="w-full max-w-sm bg-white rounded-2xl border border-gray-200 shadow-sm p-8 text-center">
          <div className="text-4xl mb-4">✉️</div>
          <h2 className="text-lg font-bold text-gray-900 mb-2">{isKo ? '가입을 완료해주세요' : 'Verify your email'}</h2>
          <p className="text-sm text-gray-500 mb-6">{success}</p>
          <Link href={`/${locale}/my/login`} className="text-sm text-[#1e3a6e] font-semibold hover:underline">
            {isKo ? '로그인 페이지로 이동' : 'Go to login'}
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4 py-12">
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

        {/* 소셜 가입 */}
        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6 mb-3">
          <p className="text-xs text-gray-400 text-center mb-3">{isKo ? '소셜 계정으로 빠르게 가입' : 'Quick sign up with'}</p>
          <div className="flex flex-col gap-2">
            <button
              type="button"
              onClick={() => handleOAuth('google')}
              disabled={loading}
              className="border border-gray-200 rounded-lg py-2.5 text-sm text-gray-700 flex items-center justify-center gap-2 hover:bg-gray-50 transition disabled:opacity-50"
            >
              <svg className="w-4 h-4" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
              </svg>
              Google
            </button>
            <button
              type="button"
              onClick={() => handleOAuth('kakao')}
              disabled={loading}
              className="bg-[#FEE500] rounded-lg py-2.5 text-sm text-[#191919] font-medium flex items-center justify-center gap-2 hover:bg-[#F5DC00] transition disabled:opacity-50"
            >
              <svg className="w-4 h-4" viewBox="0 0 24 24" fill="#191919">
                <path d="M12 3C6.477 3 2 6.477 2 10.8c0 2.7 1.7 5.1 4.3 6.5l-1.1 4 4.5-2.9c.7.1 1.5.2 2.3.2 5.523 0 10-3.477 10-7.8S17.523 3 12 3z"/>
              </svg>
              카카오
            </button>
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-8">
          {/* 준회원 안내 */}
          <div className="flex items-start gap-2 bg-[#f0f3f9] border border-[#1e3a6e]/20 rounded-lg px-3 py-2.5 mb-6">
            <span className="text-xs font-semibold bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full whitespace-nowrap shrink-0 mt-0.5">
              {isKo ? '준회원' : 'Associate'}
            </span>
            <p className="text-xs text-gray-600 leading-relaxed break-keep">
              {isKo ? '가입 후 마이페이지에서 정회원 업그레이드 가능' : 'Upgrade to Regular after sign-up'}
            </p>
          </div>

          <h1 className="text-xl font-bold text-gray-900 mb-5">
            {isKo ? '이메일로 가입' : 'Sign up with Email'}
          </h1>

          <form className="space-y-4" onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 gap-3">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  {isKo ? '이름' : 'Name'} <span className="text-red-400">*</span>
                </label>
                <input
                  name="name"
                  type="text"
                  required
                  placeholder={isKo ? '홍길동' : 'Full Name'}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#1e3a6e]"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  {isKo ? '생년월일' : 'Birth Date'} <span className="text-red-400">*</span>
                </label>
                <input
                  name="birth_date"
                  type="date"
                  required
                  className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#1e3a6e]"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                {isKo ? '이메일' : 'Email'} <span className="text-red-400">*</span>
              </label>
              <input
                name="email"
                type="email"
                required
                placeholder="example@email.com"
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

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                {isKo ? '비밀번호' : 'Password'} <span className="text-red-400">*</span>
              </label>
              <input
                name="password"
                type="password"
                required
                placeholder={isKo ? '8자 이상' : '8+ characters'}
                className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#1e3a6e]"
              />
            </div>

            {/* 약관 동의 */}
            <label className="flex items-start gap-2 text-sm text-gray-600 cursor-pointer pt-1">
              <input
                type="checkbox"
                checked={agreed}
                onChange={(e) => setAgreed(e.target.checked)}
                className="mt-0.5 accent-[#1e3a6e]"
              />
              <span>
                {isKo ? (
                  <><Link href={`/${locale}/privacy`} className="text-[#1e3a6e] underline">개인정보처리방침</Link>을 확인하였으며 동의합니다.</>
                ) : (
                  <>I agree to the <Link href={`/${locale}/privacy`} className="text-[#1e3a6e] underline">Privacy Policy</Link>.</>
                )}
              </span>
            </label>

            {error && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-3">
                <p className="text-red-600 text-xs">{error}</p>
              </div>
            )}

            <button
              type="submit"
              disabled={!agreed || loading}
              className="w-full bg-[#1e3a6e] text-white rounded-lg py-2.5 text-sm font-semibold hover:bg-[#152d57] transition-colors disabled:opacity-40 disabled:cursor-not-allowed mt-1"
            >
              {loading ? '...' : isKo ? '준회원으로 가입' : 'Join as Associate'}
            </button>
          </form>
        </div>

        <p className="text-center text-sm text-gray-500 mt-4">
          {isKo ? '이미 계정이 있으신가요?' : 'Already have an account?'}{' '}
          <Link href={`/${locale}/my/login`} className="text-[#1e3a6e] font-semibold hover:underline">
            {isKo ? '로그인' : 'Sign in'}
          </Link>
        </p>
      </div>
    </div>
  )
}
