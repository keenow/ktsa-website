"use client";

import { useLocale } from "next-intl";
import Link from "next/link";

// 목업 — 실제 연동 전
const MOCK_USER = {
  name: "홍길동",
  email: "hong@example.com",
  memberType: "ASSOCIATE" as const,
};

export default function MyDashboard() {
  const locale = useLocale();
  const isKo = locale === "ko";
  const isAssociate = MOCK_USER.memberType === "ASSOCIATE";

  return (
    <div className="min-h-screen bg-gray-50">
      {/* 헤더 */}
      <div className="bg-[#1e3a6e] text-white px-4 py-8">
        <div className="max-w-xl mx-auto">
          <p className="text-blue-200 text-sm mb-1">{isKo ? "안녕하세요" : "Welcome"}</p>
          <h1 className="text-xl font-bold">{MOCK_USER.name}</h1>
          <span className="mt-2 inline-block text-xs bg-white/20 px-2.5 py-1 rounded-full">
            {isKo ? "준회원" : "Associate Member"}
          </span>
        </div>
      </div>

      <div className="max-w-xl mx-auto px-4 py-8 space-y-4">

        {/* 정회원 업그레이드 카드 */}
        {isAssociate && (
          <div className="bg-white rounded-xl border-2 border-[#1e3a6e]/30 p-5">
            <div className="flex items-start justify-between mb-3">
              <div>
                <h2 className="font-bold text-gray-900">
                  {isKo ? "정회원으로 업그레이드" : "Upgrade to Regular Member"}
                </h2>
                <p className="text-sm text-gray-500 mt-0.5">
                  {isKo ? "연 150,000원" : "₩150,000 / year"}
                </p>
              </div>
              <span className="text-2xl">🏅</span>
            </div>
            <ul className="text-sm text-gray-600 space-y-1.5 mb-4">
              {(isKo ? [
                "대회 참가비 10% 할인",
                "ITRA 가입 자격 부여",
                "보험 가입 대행 서비스",
                "스탭·심판 교육 참여 자격",
                "3사 공동 사전예매",
              ] : [
                "10% race entry discount",
                "ITRA membership eligibility",
                "Insurance enrollment service",
                "Staff & referee training access",
                "Priority registration",
              ]).map((b) => (
                <li key={b} className="flex items-center gap-2">
                  <span className="text-[#1e3a6e] text-xs">✓</span>
                  {b}
                </li>
              ))}
            </ul>
            <p className="text-xs text-amber-600 mb-4">
              {isKo
                ? "⚠ 협회 인정 대회 참여 경험이 있는 분만 신청 가능합니다."
                : "⚠ Requires prior experience at a recognized race."}
            </p>
            <Link
              href={`/${locale}/my/upgrade`}
              className="block w-full text-center bg-[#1e3a6e] text-white rounded-lg py-2.5 text-sm font-semibold hover:bg-[#152d57] transition-colors"
            >
              {isKo ? "업그레이드 신청" : "Apply for Upgrade"}
            </Link>
          </div>
        )}

        {/* 기업회원 카드 */}
        {isAssociate && (
          <div className="bg-white rounded-xl border border-gray-200 p-5">
            <div className="flex items-start justify-between mb-2">
              <div>
                <h2 className="font-bold text-gray-900">
                  {isKo ? "기업회원 신청" : "Apply as Corporate Member"}
                </h2>
                <p className="text-sm text-gray-500 mt-0.5">
                  {isKo ? "2026년 무료" : "Free in 2026"}
                </p>
              </div>
              <span className="text-2xl">🏢</span>
            </div>
            <p className="text-sm text-gray-500 mb-4">
              {isKo
                ? "대회장 포토월·홍보 부스·교육 프로그램 지원"
                : "Photo wall, booth, training programs"}
            </p>
            <Link
              href={`/${locale}/my/upgrade?type=corporate`}
              className="block w-full text-center border border-[#1e3a6e] text-[#1e3a6e] rounded-lg py-2.5 text-sm font-semibold hover:bg-[#f0f3f9] transition-colors"
            >
              {isKo ? "기업회원 신청" : "Apply"}
            </Link>
          </div>
        )}

        {/* 내 정보 카드 */}
        <div className="bg-white rounded-xl border border-gray-200 p-5">
          <h2 className="font-bold text-gray-900 mb-3">
            {isKo ? "내 정보" : "My Profile"}
          </h2>
          <div className="space-y-2 text-sm text-gray-600">
            <div className="flex justify-between">
              <span className="text-gray-400">{isKo ? "이름" : "Name"}</span>
              <span>{MOCK_USER.name}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-400">{isKo ? "이메일" : "Email"}</span>
              <span>{MOCK_USER.email}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-400">{isKo ? "회원 등급" : "Grade"}</span>
              <span className="font-medium text-gray-700">{isKo ? "준회원" : "Associate"}</span>
            </div>
          </div>
          <Link
            href={`/${locale}/my/profile`}
            className="mt-4 block text-sm text-[#1e3a6e] hover:underline"
          >
            {isKo ? "정보 수정 →" : "Edit profile →"}
          </Link>
        </div>

        {/* 로그아웃 */}
        <button className="w-full text-sm text-gray-400 hover:text-gray-600 py-2">
          {isKo ? "로그아웃" : "Sign out"}
        </button>

      </div>
    </div>
  );
}
