"use client";

import { useLocale } from "next-intl";
import { useSearchParams } from "next/navigation";
import { useState } from "react";

export default function UpgradePage() {
  const locale = useLocale();
  const searchParams = useSearchParams();
  const isKo = locale === "ko";

  const initialTab = searchParams.get("type") === "corporate" ? "corporate" : "regular";
  const [tab, setTab] = useState<"regular" | "corporate">(initialTab);

  // 정회원 폼
  const [raceName, setRaceName] = useState("");
  const [raceDate, setRaceDate] = useState("");
  const [wantsInsurance, setWantsInsurance] = useState(false);

  // 기업회원 폼
  const [companyName, setCompanyName] = useState("");
  const [bizNumber, setBizNumber] = useState("");
  const [managerName, setManagerName] = useState("");
  const [phone, setPhone] = useState("");

  const [submitted, setSubmitted] = useState(false);

  const t = {
    title: isKo ? "회원 업그레이드 신청" : "Membership Upgrade",
    tabRegular: isKo ? "정회원" : "Regular",
    tabCorporate: isKo ? "기업회원" : "Corporate",

    regularFee: isKo ? "연회비 150,000원" : "Annual Fee ₩150,000",
    regularBenefits: isKo
      ? [
          "대회 참가비 10% 할인",
          "ITRA 가입 자격 부여",
          "보험 가입 대행 서비스",
          "스탭·심판 교육 참여 자격",
          "3사 공동 사전예매 혜택",
        ]
      : [
          "10% race entry fee discount",
          "ITRA membership eligibility",
          "Insurance enrollment service",
          "Staff & referee training access",
          "Priority pre-registration (3 partners)",
        ],
    raceNameLabel: isKo ? "참여 대회명" : "Race Name",
    raceNamePlaceholder: isKo ? "예) 서울 트레일 마스터즈 2026" : "e.g. Seoul Trail Masters 2026",
    raceDateLabel: isKo ? "참여 날짜" : "Race Date",
    insuranceLabel: isKo ? "보험 가입 신청" : "Request insurance enrollment",
    regularBtn: isKo ? "정회원 신청" : "Apply for Regular Membership",

    corporateFee: isKo ? "2026년 무료" : "Free in 2026",
    corporateDesc: isKo
      ? "대회장 포토월, 홍보 부스, 교육 프로그램 지원"
      : "Photo wall at race venues, promotional booths, training programs",
    companyNameLabel: isKo ? "기업명" : "Company Name",
    bizNumberLabel: isKo ? "사업자등록번호" : "Business Registration No.",
    managerNameLabel: isKo ? "담당자명" : "Contact Person",
    phoneLabel: isKo ? "연락처" : "Phone Number",
    corporateBtn: isKo ? "기업회원 신청" : "Apply for Corporate Membership",

    submittedMsg: isKo
      ? "✅ 신청이 접수되었습니다. 검토 후 연락드리겠습니다."
      : "✅ Application submitted. We will contact you after review.",
    required: isKo ? "(필수)" : "(required)",
    notice: isKo
      ? "⚠ 협회 인정 대회 참여 경험이 있는 분만 신청 가능합니다."
      : "⚠ Applicants must have prior experience at a recognized KTSA race.",
  };

  if (submitted) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
        <div className="bg-white rounded-2xl shadow p-8 max-w-sm w-full text-center">
          <div className="text-4xl mb-4">🎉</div>
          <p className="text-gray-700 font-medium">{t.submittedMsg}</p>
          <button
            onClick={() => setSubmitted(false)}
            className="mt-6 text-sm text-[#1e3a6e] hover:underline"
          >
            {isKo ? "다시 입력" : "Go back"}
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* 헤더 */}
      <div className="bg-[#1e3a6e] text-white px-4 py-8">
        <div className="max-w-xl mx-auto">
          <h1 className="text-xl font-bold">{t.title}</h1>
        </div>
      </div>

      <div className="max-w-xl mx-auto px-4 py-8">
        {/* 탭 */}
        <div className="flex bg-white rounded-xl border border-gray-200 overflow-hidden mb-6">
          {(["regular", "corporate"] as const).map((key) => (
            <button
              key={key}
              onClick={() => setTab(key)}
              className={`flex-1 py-3 text-sm font-semibold transition-colors ${
                tab === key
                  ? "bg-[#1e3a6e] text-white"
                  : "text-gray-500 hover:bg-gray-50"
              }`}
            >
              {key === "regular" ? t.tabRegular : t.tabCorporate}
            </button>
          ))}
        </div>

        {/* ── 정회원 탭 ── */}
        {tab === "regular" && (
          <form
            onSubmit={(e) => {
              e.preventDefault();
              setSubmitted(true);
            }}
            className="space-y-5"
          >
            {/* 연회비 배너 */}
            <div className="bg-[#1e3a6e] text-white rounded-xl p-5 flex items-center justify-between">
              <div>
                <p className="text-xs text-blue-200 mb-1">{isKo ? "연회비" : "Annual Fee"}</p>
                <p className="text-2xl font-bold">150,000<span className="text-base font-normal ml-1">원</span></p>
              </div>
              <span className="text-3xl">🏅</span>
            </div>

            {/* 혜택 */}
            <div className="bg-white rounded-xl border border-gray-200 p-5">
              <p className="text-sm font-semibold text-gray-700 mb-3">
                {isKo ? "정회원 혜택" : "Benefits"}
              </p>
              <ul className="space-y-2">
                {t.regularBenefits.map((b) => (
                  <li key={b} className="flex items-center gap-2 text-sm text-gray-600">
                    <span className="text-[#1e3a6e] text-xs font-bold">✓</span>
                    {b}
                  </li>
                ))}
              </ul>
            </div>

            {/* 주의 사항 */}
            <p className="text-xs text-amber-600 bg-amber-50 border border-amber-200 rounded-lg px-3 py-2">
              {t.notice}
            </p>

            {/* 입력 필드 */}
            <div className="bg-white rounded-xl border border-gray-200 p-5 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  {t.raceNameLabel} <span className="text-red-500 text-xs">{t.required}</span>
                </label>
                <input
                  type="text"
                  required
                  value={raceName}
                  onChange={(e) => setRaceName(e.target.value)}
                  placeholder={t.raceNamePlaceholder}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#1e3a6e]/30"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  {t.raceDateLabel}
                </label>
                <input
                  type="date"
                  value={raceDate}
                  onChange={(e) => setRaceDate(e.target.value)}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#1e3a6e]/30"
                />
              </div>
              <label className="flex items-center gap-3 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={wantsInsurance}
                  onChange={(e) => setWantsInsurance(e.target.checked)}
                  className="w-4 h-4 accent-[#1e3a6e]"
                />
                <span className="text-sm text-gray-700">{t.insuranceLabel}</span>
              </label>
            </div>

            <button
              type="submit"
              className="w-full bg-[#1e3a6e] text-white rounded-xl py-3 text-sm font-semibold hover:bg-[#152d57] transition-colors"
            >
              {t.regularBtn}
            </button>
          </form>
        )}

        {/* ── 기업회원 탭 ── */}
        {tab === "corporate" && (
          <form
            onSubmit={(e) => {
              e.preventDefault();
              setSubmitted(true);
            }}
            className="space-y-5"
          >
            {/* 연회비 배너 */}
            <div className="bg-gradient-to-r from-[#1e3a6e] to-[#2a5298] text-white rounded-xl p-5 flex items-center justify-between">
              <div>
                <p className="text-xs text-blue-200 mb-1">{isKo ? "연회비" : "Annual Fee"}</p>
                <p className="text-2xl font-bold">{t.corporateFee}</p>
              </div>
              <span className="text-3xl">🏢</span>
            </div>

            <p className="text-sm text-gray-500 bg-white border border-gray-200 rounded-xl px-4 py-3">
              {t.corporateDesc}
            </p>

            {/* 입력 필드 */}
            <div className="bg-white rounded-xl border border-gray-200 p-5 space-y-4">
              {[
                { label: t.companyNameLabel, value: companyName, setter: setCompanyName, placeholder: isKo ? "주식회사 예시" : "Example Corp" },
                { label: t.bizNumberLabel, value: bizNumber, setter: setBizNumber, placeholder: "000-00-00000" },
                { label: t.managerNameLabel, value: managerName, setter: setManagerName, placeholder: isKo ? "홍길동" : "John Doe" },
                { label: t.phoneLabel, value: phone, setter: setPhone, placeholder: "010-0000-0000" },
              ].map(({ label, value, setter, placeholder }) => (
                <div key={label}>
                  <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
                  <input
                    type="text"
                    value={value}
                    onChange={(e) => setter(e.target.value)}
                    placeholder={placeholder}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#1e3a6e]/30"
                  />
                </div>
              ))}
            </div>

            <button
              type="submit"
              className="w-full bg-[#1e3a6e] text-white rounded-xl py-3 text-sm font-semibold hover:bg-[#152d57] transition-colors"
            >
              {t.corporateBtn}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
