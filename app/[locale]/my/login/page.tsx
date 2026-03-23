'use client'

import { useLocale } from 'next-intl'
import Link from 'next/link'
import { useSearchParams } from 'next/navigation'
import { useState } from 'react'
import { signInWithEmail, resetPasswordWithEmail, signInWithPhone, verifyPhoneOtp } from '../actions'

const COUNTRY_CODES = [
  { code: '+82', label: '🇰🇷 +82' },
  { code: '+1', label: '🇺🇸 +1' },
  { code: '+81', label: '🇯🇵 +81' },
  { code: '+86', label: '🇨🇳 +86' },
  { code: '+44', label: '🇬🇧 +44' },
  { code: '+49', label: '🇩🇪 +49' },
  { code: '+33', label: '🇫🇷 +33' },
  { code: '+61', label: '🇦🇺 +61' },
]

function formatPhoneE164(number: string, countryCode: string): string {
  const digits = number.replace(/\D/g, '')
  if (countryCode === '+82' && digits.startsWith('0')) {
    return countryCode + digits.slice(1)
  }
  return countryCode + digits
}

export default function LoginPage() {
  const locale = useLocale()
  const isKo = locale === 'ko'
  const searchParams = useSearchParams()
  const urlError = searchParams.get('error')
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [mode, setMode] = useState<'login' | 'forgot'>('login')
  const [resetSent, setResetSent] = useState(false)

  // 전화번호 탭 상태
  const [loginTab, setLoginTab] = useState<'email' | 'phone'>('email')
  const [countryCode, setCountryCode] = useState('+82')
  const [phoneNumber, setPhoneNumber] = useState('')
  const [otpSent, setOtpSent] = useState(false)
  const [otp, setOtp] = useState('')

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setLoading(true)
    setError(null)
    const formData = new FormData(e.currentTarget)
    const result = await signInWithEmail(formData)
    if (result?.error) setError(result.error)
    setLoading(false)
  }

  async function handleReset(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setLoading(true)
    setError(null)
    const formData = new FormData(e.currentTarget)
    const result = await resetPasswordWithEmail(formData)
    if (result?.error) {
      setError(result.error)
    } else {
      setResetSent(true)
    }
    setLoading(false)
  }

  async function handleOAuth(provider: 'google') {
    const { createBrowserClient } = await import("@supabase/ssr")
    const supabase = createBrowserClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    )
    await supabase.auth.signInWithOAuth({
      provider,
      options: { redirectTo: "https://trailkorea.org/api/auth/callback" },
    })
  }

  async function handleSendOtp() {
    const phone = formatPhoneE164(phoneNumber, countryCode)
    if (!phoneNumber.trim()) {
      setError(isKo ? '전화번호를 입력해주세요.' : 'Please enter your phone number.')
      return
    }
    setLoading(true)
    setError(null)
    const result = await signInWithPhone(phone)
    if (result?.error) {
      setError(result.error)
    } else {
      setOtpSent(true)
    }
    setLoading(false)
  }

  async function handleVerifyOtp(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    if (!otp.trim() || otp.length !== 6) {
      setError(isKo ? '6자리 인증번호를 입력해주세요.' : 'Please enter the 6-digit code.')
      return
    }
    setLoading(true)
    setError(null)
    const phone = formatPhoneE164(phoneNumber, countryCode)
    const result = await verifyPhoneOtp(phone, otp)
    if (result?.error) {
      setError(result.error)
    }
    setLoading(false)
  }

  function handleTabSwitch(tab: 'email' | 'phone') {
    setLoginTab(tab)
    setError(null)
    setOtpSent(false)
    setOtp('')
    setPhoneNumber('')
  }

  // 비밀번호 찾기 - 전송 완료
  if (mode === 'forgot' && resetSent) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
        <div className="w-full max-w-sm bg-white rounded-2xl border border-gray-200 shadow-sm p-8 text-center">
          <div className="text-4xl mb-4">📧</div>
          <h2 className="text-lg font-bold text-gray-900 mb-2">
            {isKo ? '재설정 링크를 보냈습니다' : 'Reset link sent'}
          </h2>
          <p className="text-sm text-gray-500 mb-6">
            {isKo
              ? '이메일을 확인하고 링크를 클릭해 비밀번호를 재설정하세요.'
              : 'Check your email and click the link to reset your password.'}
          </p>
          <button
            onClick={() => { setMode('login'); setResetSent(false) }}
            className="text-sm text-[#1e3a6e] font-semibold hover:underline"
          >
            {isKo ? '로그인으로 돌아가기' : 'Back to sign in'}
          </button>
        </div>
      </div>
    )
  }

  // 비밀번호 찾기 폼
  if (mode === 'forgot') {
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
              {isKo ? '비밀번호 찾기' : 'Reset Password'}
            </h1>
            <p className="text-sm text-gray-500 mb-6">
              {isKo
                ? '가입한 이메일을 입력하면 재설정 링크를 보내드립니다.'
                : 'Enter your email to receive a password reset link.'}
            </p>

            <form className="space-y-4" onSubmit={handleReset}>
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
                {loading ? '...' : isKo ? '재설정 링크 보내기' : 'Send Reset Link'}
              </button>
            </form>
          </div>

          <p className="text-center text-sm text-gray-500 mt-4">
            <button
              onClick={() => { setMode('login'); setError(null) }}
              className="text-[#1e3a6e] font-semibold hover:underline"
            >
              {isKo ? '← 로그인으로 돌아가기' : '← Back to sign in'}
            </button>
          </p>
        </div>
      </div>
    )
  }

  // 기본 로그인 폼
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

        {/* OAuth 콜백 에러 배너 */}
        {urlError && (
          <div className="mb-4 bg-red-50 border border-red-300 rounded-xl p-4">
            <p className="text-red-700 text-xs font-semibold mb-0.5">로그인 오류 (디버그)</p>
            <p className="text-red-600 text-xs break-all">{urlError}</p>
          </div>
        )}

        {/* 카드 */}
        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-8">
          <h1 className="text-xl font-bold text-gray-900 mb-5">
            {isKo ? '로그인' : 'Sign In'}
          </h1>

          {/* 이메일 / 전화번호 탭 */}
          <div className="flex bg-gray-100 rounded-lg p-0.5 mb-5">
            <button
              type="button"
              onClick={() => handleTabSwitch('email')}
              className={`flex-1 py-1.5 text-sm font-medium rounded-md transition-colors ${
                loginTab === 'email'
                  ? 'bg-white text-gray-900 shadow-sm'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              {isKo ? '이메일' : 'Email'}
            </button>
            <button
              type="button"
              onClick={() => handleTabSwitch('phone')}
              className={`flex-1 py-1.5 text-sm font-medium rounded-md transition-colors ${
                loginTab === 'phone'
                  ? 'bg-white text-gray-900 shadow-sm'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              {isKo ? '전화번호' : 'Phone'}
            </button>
          </div>

          {loginTab === 'email' ? (
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
                  <button
                    type="button"
                    onClick={() => { setMode('forgot'); setError(null) }}
                    className="text-xs text-[#1e3a6e] hover:underline"
                  >
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
          ) : (
            <form className="space-y-4" onSubmit={handleVerifyOtp}>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  {isKo ? '전화번호' : 'Phone Number'}
                </label>
                <div className="flex gap-2">
                  <select
                    value={countryCode}
                    onChange={(e) => setCountryCode(e.target.value)}
                    disabled={otpSent}
                    className="border border-gray-300 rounded-lg px-2 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#1e3a6e] focus:border-transparent disabled:bg-gray-50 disabled:text-gray-400"
                  >
                    {COUNTRY_CODES.map((c) => (
                      <option key={c.code} value={c.code}>{c.label}</option>
                    ))}
                  </select>
                  <input
                    type="tel"
                    value={phoneNumber}
                    onChange={(e) => setPhoneNumber(e.target.value.replace(/\D/g, ''))}
                    disabled={otpSent}
                    placeholder={isKo ? '01012345678' : '01012345678'}
                    maxLength={15}
                    className="flex-1 border border-gray-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#1e3a6e] focus:border-transparent disabled:bg-gray-50 disabled:text-gray-400"
                  />
                </div>
                {!otpSent && (
                  <button
                    type="button"
                    onClick={handleSendOtp}
                    disabled={loading}
                    className="mt-2 w-full border border-[#1e3a6e] text-[#1e3a6e] rounded-lg py-2.5 text-sm font-semibold hover:bg-blue-50 transition-colors disabled:opacity-50"
                  >
                    {loading ? '...' : isKo ? '인증번호 받기' : 'Send Code'}
                  </button>
                )}
                {otpSent && (
                  <p className="mt-1.5 text-xs text-green-600">
                    {isKo ? '인증번호가 발송되었습니다.' : 'Verification code sent.'}
                  </p>
                )}
              </div>

              {otpSent && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    {isKo ? '인증번호 6자리' : '6-digit Code'}
                  </label>
                  <input
                    type="text"
                    value={otp}
                    onChange={(e) => setOtp(e.target.value.replace(/\D/g, ''))}
                    placeholder="123456"
                    maxLength={6}
                    inputMode="numeric"
                    autoFocus
                    className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm tracking-widest text-center focus:outline-none focus:ring-2 focus:ring-[#1e3a6e] focus:border-transparent"
                  />
                  <button
                    type="button"
                    onClick={() => { setOtpSent(false); setOtp(''); setError(null) }}
                    className="mt-1 text-xs text-gray-400 hover:text-gray-600 hover:underline"
                  >
                    {isKo ? '번호 다시 입력' : 'Change number'}
                  </button>
                </div>
              )}

              {error && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-3">
                  <p className="text-red-600 text-xs">{error}</p>
                </div>
              )}

              {otpSent && (
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-[#1e3a6e] text-white rounded-lg py-2.5 text-sm font-semibold hover:bg-[#152d57] transition-colors disabled:opacity-50"
                >
                  {loading ? '...' : isKo ? '로그인' : 'Sign In'}
                </button>
              )}
            </form>
          )}

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
