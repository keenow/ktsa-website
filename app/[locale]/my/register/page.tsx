"use client";

import { useLocale } from "next-intl";
import Link from "next/link";
import { useState } from "react";

type MemberType = "ASSOCIATE" | "REGULAR" | "CORPORATE";

const MEMBER_TYPES = [
  {
    code: "ASSOCIATE" as MemberType,
    labelKo: "준회원",
    labelEn: "Associate",
    fee: "무료",
    feeEn: "Free",
    descKo: "뉴스레터 · 정보 제공",
    descEn: "Newsletter & information",
    badge: "bg-gray-100 text-gray-600",
  },
  {
    code: "REGULAR" as MemberType,
    labelKo: "정회원",
    labelEn: "Regular",
    fee: "150,000원 / 년",
    feeEn: "₩150,000 / year",
    descKo: "대회 참가비 할인 · ITRA 자격 · 보험 가입",
    descEn: "Race discounts · ITRA eligibility · Insurance",
    badge: "bg-[#1e3a6e] text-white",
  },
  {
    code: "CORPORATE" as MemberType,
    labelKo: "기업회원",
    labelEn: "Corporate",
    fee: "무료 (2026 한정)",
    feeEn: "Free (2026 only)",
    descKo: "포토월 · 부스 · 교육 프로그램",
    descEn: "Photo wall · Booth · Training programs",
    badge: "bg-[#dde3f0] text-[#1e3a6e]",
  },
];

export default function RegisterPage() {
  const locale = useLocale();
  const isKo = locale === "ko";
  const [step, setStep] = useState<1 | 2>(1);
  const [memberType, setMemberType] = useState<MemberType>("ASSOCIATE");

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-lg">

        {/* 로고 */}
        <div className="text-center mb-8">
          <Link href={`/${locale}`}>
            <span className="text-2xl font-bold text-[#1e3a6e]">KTSA</span>
          </Link>
          <p className="text-sm text-gray-400 mt-1">
            {isKo ? "회원가입" : "Create Account"}
          </p>
        </div>

        {/* 스텝 인디케이터 */}
        <div className="flex items-center gap-2 mb-6 px-2">
          {[1, 2].map((s) => (
            <div key={s} className="flex items-center gap-2 flex-1">
              <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold shrink-0 ${
                step >= s ? "bg-[#1e3a6e] text-white" : "bg-gray-200 text-gray-400"
              }`}>{s}</div>
              <span className={`text-xs ${step >= s ? "text-[#1e3a6e] font-medium" : "text-gray-400"}`}>
                {s === 1 ? (isKo ? "회원 유형" : "Member Type") : (isKo ? "기본 정보" : "Basic Info")}
              </span>
              {s < 2 && <div className="flex-1 h-px bg-gray-200" />}
            </div>
          ))}
        </div>

        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-8">

          {/* Step 1: 회원 유형 선택 */}
          {step === 1 && (
            <div>
              <h2 className="text-lg font-bold text-gray-900 mb-1">
                {isKo ? "회원 유형을 선택하세요" : "Choose Member Type"}
              </h2>
              <p className="text-sm text-gray-400 mb-5">
                {isKo ? "나중에 등급 업그레이드 신청이 가능합니다." : "You can upgrade later."}
              </p>

              <div className="space-y-3 mb-6">
                {MEMBER_TYPES.map((t) => (
                  <button
                    key={t.code}
                    type="button"
                    onClick={() => setMemberType(t.code)}
                    className={`w-full text-left rounded-xl border-2 p-4 transition-all ${
                      memberType === t.code
                        ? "border-[#1e3a6e] bg-[#f0f3f9]"
                        : "border-gray-200 hover:border-gray-300"
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <div className="flex items-center gap-2">
                        <span className={`text-xs px-2 py-0.5 rounded-full font-semibold ${t.badge}`}>
                          {isKo ? t.labelKo : t.labelEn}
                        </span>
                        <span className="text-sm font-semibold text-gray-700">
                          {isKo ? t.fee : t.feeEn}
                        </span>
                      </div>
                      <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center shrink-0 ${
                        memberType === t.code ? "border-[#1e3a6e]" : "border-gray-300"
                      }`}>
                        {memberType === t.code && <div className="w-2 h-2 rounded-full bg-[#1e3a6e]" />}
                      </div>
                    </div>
                    <p className="text-xs text-gray-500">{isKo ? t.descKo : t.descEn}</p>
                    {t.code === "REGULAR" && (
                      <p className="text-xs text-amber-600 mt-1">
                        {isKo ? "⚠ 협회 인정 대회 참여 경험 필수" : "⚠ Race experience required"}
                      </p>
                    )}
                  </button>
                ))}
              </div>

              <button
                onClick={() => setStep(2)}
                className="w-full bg-[#1e3a6e] text-white rounded-lg py-2.5 text-sm font-semibold hover:bg-[#152d57] transition-colors"
              >
                {isKo ? "다음" : "Next"} →
              </button>
            </div>
          )}

          {/* Step 2: 기본 정보 입력 */}
          {step === 2 && (
            <div>
              <h2 className="text-lg font-bold text-gray-900 mb-5">
                {isKo ? "기본 정보 입력" : "Basic Information"}
              </h2>

              <form className="space-y-4" onSubmit={(e) => e.preventDefault()}>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      {isKo ? "이름" : "Name"}
                    </label>
                    <input type="text" placeholder={isKo ? "홍길동" : "Full Name"}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#1e3a6e]" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      {isKo ? "생년월일" : "Date of Birth"}
                    </label>
                    <input type="date"
                      className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#1e3a6e]" />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    {isKo ? "이메일" : "Email"}
                  </label>
                  <input type="email" placeholder="example@email.com"
                    className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#1e3a6e]" />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    {isKo ? "휴대전화" : "Phone"}
                  </label>
                  <input type="tel" placeholder="010-0000-0000"
                    className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#1e3a6e]" />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    {isKo ? "비밀번호" : "Password"}
                  </label>
                  <input type="password" placeholder="8자 이상"
                    className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#1e3a6e]" />
                </div>

                {memberType === "CORPORATE" && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      {isKo ? "기업·단체명" : "Company Name"}
                    </label>
                    <input type="text"
                      className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#1e3a6e]" />
                  </div>
                )}

                {/* 약관 동의 */}
                <label className="flex items-start gap-2 text-sm text-gray-600 cursor-pointer">
                  <input type="checkbox" className="mt-0.5 accent-[#1e3a6e]" />
                  <span>
                    {isKo ? (
                      <><Link href={`/${locale}/privacy`} className="text-[#1e3a6e] underline">개인정보처리방침</Link>에 동의합니다.</>
                    ) : (
                      <>I agree to the <Link href={`/${locale}/privacy`} className="text-[#1e3a6e] underline">Privacy Policy</Link>.</>
                    )}
                  </span>
                </label>

                <div className="flex gap-3 pt-2">
                  <button type="button" onClick={() => setStep(1)}
                    className="flex-1 border border-gray-300 text-gray-600 rounded-lg py-2.5 text-sm hover:bg-gray-50 transition-colors">
                    {isKo ? "← 이전" : "← Back"}
                  </button>
                  <button type="submit"
                    className="flex-1 bg-[#1e3a6e] text-white rounded-lg py-2.5 text-sm font-semibold hover:bg-[#152d57] transition-colors">
                    {isKo ? "가입 신청" : "Register"}
                  </button>
                </div>
              </form>
            </div>
          )}
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
