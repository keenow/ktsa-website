/**
 * @file 이미 가입된 이메일 안내 페이지
 * @description 회원가입 시 동일 이메일이 이미 등록된 경우 로그인·인증 안내
 * @module auth
 */
'use client'

import { useLocale } from 'next-intl'
import Link from 'next/link'
import { useSearchParams } from 'next/navigation'
import { Suspense } from 'react'

/**
 * 쿼리 `email`을 표시하고 다음 행동(로그인·다른 이메일)을 안내
 * @returns JSX.Element
 */
function AlreadyRegisteredContent() {
  const locale = useLocale()
  const isKo = locale === 'ko'
  const searchParams = useSearchParams()
  const email = searchParams.get('email')?.trim() || ''

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

        <div className="text-sm text-gray-500 space-y-3 mb-8 leading-relaxed">
          <p>
            {isKo
              ? '로그인 페이지에서 같은 이메일과 비밀번호로 로그인해 주세요. 아직 이메일 인증을 하지 않았다면, 받은편지함·스팸함에서 인증 메일을 확인해 주세요.'
              : 'Sign in with the same email and password on the login page. If you have not verified your email yet, check your inbox and spam folder for the verification message.'}
          </p>
        </div>

        <div className="flex flex-col gap-2">
          <Link
            href={`/${locale}/my/login`}
            className="block w-full text-center bg-[#1e3a6e] text-white rounded-lg py-2.5 text-sm font-semibold hover:bg-[#152d57] transition-colors"
          >
            {isKo ? '로그인하기' : 'Sign in'}
          </Link>
          <Link
            href={`/${locale}/my/register`}
            className="block w-full text-center border border-gray-200 rounded-lg py-2.5 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
          >
            {isKo ? '다른 이메일로 가입하기' : 'Sign up with another email'}
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
