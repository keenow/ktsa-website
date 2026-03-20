"use client";

import { useLocale } from "next-intl";
import Link from "next/link";
import { useState } from "react";

export default function LoginPage() {
  const locale = useLocale();
  const isKo = locale === "ko";
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
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

        {/* 카드 */}
        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-8">
          <h1 className="text-xl font-bold text-gray-900 mb-6">
            {isKo ? "로그인" : "Sign In"}
          </h1>

          <form className="space-y-4" onSubmit={(e) => e.preventDefault()}>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                {isKo ? "이메일" : "Email"}
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="example@email.com"
                className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#1e3a6e] focus:border-transparent"
              />
            </div>

            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="block text-sm font-medium text-gray-700">
                  {isKo ? "비밀번호" : "Password"}
                </label>
                <button type="button" className="text-xs text-[#1e3a6e] hover:underline">
                  {isKo ? "비밀번호 찾기" : "Forgot password?"}
                </button>
              </div>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#1e3a6e] focus:border-transparent"
              />
            </div>

            <button
              type="submit"
              className="w-full bg-[#1e3a6e] text-white rounded-lg py-2.5 text-sm font-semibold hover:bg-[#152d57] transition-colors mt-2"
            >
              {isKo ? "로그인" : "Sign In"}
            </button>
          </form>

          {/* 구분선 */}
          <div className="flex items-center gap-3 my-5">
            <div className="flex-1 h-px bg-gray-200" />
            <span className="text-xs text-gray-400">{isKo ? "또는" : "or"}</span>
            <div className="flex-1 h-px bg-gray-200" />
          </div>

          {/* 소셜 로그인 (준비 중) */}
          <button
            disabled
            className="w-full border border-gray-200 rounded-lg py-2.5 text-sm text-gray-400 flex items-center justify-center gap-2 cursor-not-allowed"
          >
            <span>G</span>
            {isKo ? "Google로 계속 (준비 중)" : "Continue with Google (coming soon)"}
          </button>

          {/* 회원가입 링크 */}
          <p className="text-center text-sm text-gray-500 mt-6">
            {isKo ? "계정이 없으신가요?" : "Don't have an account?"}{" "}
            <Link href={`/${locale}/my/register`} className="text-[#1e3a6e] font-semibold hover:underline">
              {isKo ? "회원가입" : "Sign up"}
            </Link>
          </p>
        </div>

        <p className="text-center text-xs text-gray-400 mt-6">
          {isKo
            ? "로그인 시 개인정보처리방침에 동의하게 됩니다."
            : "By signing in, you agree to our Privacy Policy."}
          {" "}
          <Link href={`/${locale}/privacy`} className="underline">{isKo ? "확인" : "View"}</Link>
        </p>
      </div>
    </div>
  );
}
