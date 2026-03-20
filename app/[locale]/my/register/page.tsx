"use client";

import { useLocale } from "next-intl";
import Link from "next/link";
import { useState } from "react";

export default function RegisterPage() {
  const locale = useLocale();
  const isKo = locale === "ko";
  const [agreed, setAgreed] = useState(false);

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-sm">

        {/* 로고 */}
        <div className="text-center mb-8">
          <Link href={`/${locale}`}>
            <span className="text-2xl font-bold text-[#1e3a6e]">KTSA</span>
          </Link>
          <p className="text-sm text-gray-400 mt-1">
            {isKo ? "대한트레일스포츠협회" : "Korea Trail Sports Association"}
          </p>
        </div>

        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-8">

          {/* 준회원 안내 배지 */}
          <div className="flex items-center gap-2 bg-[#f0f3f9] border border-[#1e3a6e]/20 rounded-lg px-3 py-2.5 mb-6">
            <span className="text-xs font-semibold bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full">
              {isKo ? "준회원" : "Associate"}
            </span>
            <p className="text-xs text-gray-600">
              {isKo
                ? "가입 후 마이페이지에서 정회원·기업회원 업그레이드 가능"
                : "Upgrade to Regular or Corporate after sign-up"}
            </p>
          </div>

          <h1 className="text-xl font-bold text-gray-900 mb-5">
            {isKo ? "회원가입" : "Create Account"}
          </h1>

          <form className="space-y-4" onSubmit={(e) => e.preventDefault()}>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  {isKo ? "이름" : "Name"} <span className="text-red-400">*</span>
                </label>
                <input
                  type="text"
                  placeholder={isKo ? "홍길동" : "Full Name"}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#1e3a6e]"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  {isKo ? "생년월일" : "Birth Date"} <span className="text-red-400">*</span>
                </label>
                <input
                  type="date"
                  className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#1e3a6e]"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                {isKo ? "이메일" : "Email"} <span className="text-red-400">*</span>
              </label>
              <input
                type="email"
                placeholder="example@email.com"
                className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#1e3a6e]"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                {isKo ? "휴대전화" : "Phone"} <span className="text-red-400">*</span>
              </label>
              <input
                type="tel"
                placeholder="010-0000-0000"
                className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#1e3a6e]"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                {isKo ? "비밀번호" : "Password"} <span className="text-red-400">*</span>
              </label>
              <input
                type="password"
                placeholder={isKo ? "8자 이상" : "8+ characters"}
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
                  <>
                    <Link href={`/${locale}/privacy`} className="text-[#1e3a6e] underline">개인정보처리방침</Link>을 확인하였으며 동의합니다.
                  </>
                ) : (
                  <>
                    I agree to the <Link href={`/${locale}/privacy`} className="text-[#1e3a6e] underline">Privacy Policy</Link>.
                  </>
                )}
              </span>
            </label>

            <button
              type="submit"
              disabled={!agreed}
              className="w-full bg-[#1e3a6e] text-white rounded-lg py-2.5 text-sm font-semibold hover:bg-[#152d57] transition-colors disabled:opacity-40 disabled:cursor-not-allowed mt-1"
            >
              {isKo ? "준회원으로 가입" : "Join as Associate"}
            </button>
          </form>
        </div>

        <p className="text-center text-sm text-gray-500 mt-4">
          {isKo ? "이미 계정이 있으신가요?" : "Already have an account?"}{" "}
          <Link href={`/${locale}/my/login`} className="text-[#1e3a6e] font-semibold hover:underline">
            {isKo ? "로그인" : "Sign in"}
          </Link>
        </p>

      </div>
    </div>
  );
}
