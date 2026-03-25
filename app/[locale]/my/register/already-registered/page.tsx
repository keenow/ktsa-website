/**
 * @file 이미 가입된 이메일 안내 페이지
 * @description 중복 이메일 안내, 인증 메일 재발송, 진단 쿼리(reason·cid) 표시 (재가입 유도 링크 없음)
 * @module auth
 */
'use client'

import { useLocale } from 'next-intl'
import Link from 'next/link'
import { useSearchParams } from 'next/navigation'
import { Suspense, useState } from 'react'
import { resendSignupVerificationEmail } from '../../actions'
import {
  parseSignUpAlreadyRegisteredReason,
  signUpAlreadyRegisteredReasonLabel,
} from '@/lib/auth-signup-errors'

/**
 * 쿼리 `email`을 표시하고 로그인·홈으로 이동을 안내
 * @returns JSX.Element
 */
function AlreadyRegisteredContent() {
  const locale = useLocale()
  const isKo = locale === 'ko'
  const searchParams = useSearchParams()
  const email = searchParams.get('email')?.trim() || ''
  const reasonRaw = searchParams.get('reason')
  const cid = searchParams.get('cid')?.trim() || ''
  const reason = parseSignUpAlreadyRegisteredReason(reasonRaw)

  const [resendLoading, setResendLoading] = useState(false)
  const [resendNotice, setResendNotice] = useState<{
    kind: 'success' | 'error'
    text: string
  } | null>(null)

  /**
   * 가입 확인 메일 재발송 (쿼리의 email 기준)
   * @returns void
   */
  async function handleResendVerification() {
    if (!email || resendLoading) return
    setResendLoading(true)
    setResendNotice(null)
    const result = await resendSignupVerificationEmail(email, locale)
    setResendLoading(false)
    if ('error' in result) {
      setResendNotice({ kind: 'error', text: result.error })
      return
    }
    setResendNotice({ kind: 'success', text: result.message })
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-sm bg-white rounded-2xl border border-gray-200 shadow-sm p-8">
        <div className="text-4xl mb-4 text-center">👤</div>
        <h1 className="text-lg font-bold text-gray-900 text-center mb-2">
          {isKo ? '이미 가입된 이메일입니다' : 'This email is already registered'}
        </h1>

        {email ? (
          <p className="text-sm text-gray-600 text-center break-all mb-4">
            <span className="font-medium text-gray-800">{email}</span>
            {isKo ? ' 은(는) 이미 계정에 등록되어 있습니다.' : ' is already linked to an account.'}
          </p>
        ) : (
          <p className="text-sm text-gray-600 text-center mb-4">
            {isKo
              ? '입력하신 이메일은 이미 가입에 사용된 주소입니다.'
              : 'The email you entered is already used for an account.'}
          </p>
        )}

        <div className="text-sm text-gray-500 space-y-3 mb-6 leading-relaxed">
          <p>
            {isKo
              ? '로그인 페이지에서 같은 이메일과 비밀번호로 로그인해 주세요. 아직 이메일 인증을 하지 않았다면, 받은편지함·스팸함에서 인증 메일을 확인해 주세요.'
              : 'Sign in with the same email and password on the login page. If you have not verified your email yet, check your inbox and spam folder for the verification message.'}
          </p>
        </div>

        <div className="mb-6">
          <button
            type="button"
            disabled={!email || resendLoading}
            onClick={() => void handleResendVerification()}
            className="w-full rounded-lg border border-[#1e3a6e] py-2.5 text-sm font-semibold text-[#1e3a6e] hover:bg-[#f0f3f9] transition-colors disabled:cursor-not-allowed disabled:opacity-40"
          >
            {resendLoading
              ? '...'
              : isKo
                ? '인증 메일 다시 보내기'
                : 'Resend verification email'}
          </button>
          {!email ? (
            <p className="mt-2 text-center text-xs text-gray-400">
              {isKo
                ? '이메일 주소가 URL에 없어 재발송할 수 없습니다. 가입 페이지에서 다시 시도해 주세요.'
                : 'No email in the URL; open this page from the sign-up flow to resend.'}
            </p>
          ) : null}
          {resendNotice ? (
            <p
              className={
                resendNotice.kind === 'success'
                  ? 'mt-2 text-center text-xs text-emerald-700'
                  : 'mt-2 text-center text-xs text-red-600'
              }
            >
              {resendNotice.text}
            </p>
          ) : null}
        </div>

        {(reason || cid || (reasonRaw && !reason)) && (
          <div className="mb-6 rounded-lg border border-gray-200 bg-gray-50 p-3 text-left text-[11px] font-mono leading-relaxed text-gray-700 break-all space-y-1">
            <p className="font-sans text-xs font-semibold text-gray-800">
              {isKo
                ? '가입 시도 진단 (Server Action 리턴·URL 쿼리와 동일)'
                : 'Sign-up attempt diagnostics (matches Server Action return / URL query)'}
            </p>
            {reason ? (
              <p>
                reason: {reason} —{' '}
                {signUpAlreadyRegisteredReasonLabel(reason, isKo ? 'ko' : 'en')}
              </p>
            ) : reasonRaw ? (
              <p>
                reason: {reasonRaw}{' '}
                {isKo ? '(알 수 없는 값)' : '(unknown value)'}
              </p>
            ) : null}
            {cid ? <p>correlationId: {cid}</p> : null}
            <p className="font-sans text-[10px] text-gray-500 pt-1">
              {isKo
                ? 'Vercel 로그에서 [signUpWithEmail]과 correlationId로 대조할 수 있습니다.'
                : 'Match correlationId with [signUpWithEmail] lines in Vercel logs.'}
            </p>
          </div>
        )}

        <div className="flex flex-col gap-2">
          <Link
            href={`/${locale}/my/login`}
            className="block w-full text-center bg-[#1e3a6e] text-white rounded-lg py-2.5 text-sm font-semibold hover:bg-[#152d57] transition-colors"
          >
            {isKo ? '로그인하기' : 'Sign in'}
          </Link>
          <Link
            href={`/${locale}`}
            className="block text-center text-sm text-gray-400 hover:text-gray-600 pt-2"
          >
            {isKo ? '홈으로' : 'Home'}
          </Link>
        </div>
      </div>
    </div>
  )
}

/**
 * searchParams 사용 구역을 Suspense로 감쌈 (Next.js 정적 생성 호환)
 * @returns JSX.Element
 */
export default function AlreadyRegisteredPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
          <div className="w-8 h-8 border-4 border-[#1e3a6e] border-t-transparent rounded-full animate-spin" />
        </div>
      }
    >
      <AlreadyRegisteredContent />
    </Suspense>
  )
}
