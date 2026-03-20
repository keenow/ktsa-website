"use client";

type Locale = "ko" | "en";

interface OrgChartProps {
  locale: Locale;
}

export default function OrgChart({ locale }: OrgChartProps) {
  const isKo = locale === "ko";

  return (
    <div className="w-full font-sans">
      {/* Title */}
      <div className="text-center mb-10">
        <h2 className="text-2xl font-bold text-gray-900">KTSA Organizational Structure</h2>
        <p className="text-sm italic text-gray-500 mt-1">Korea Trail Sports Association</p>
      </div>

      {/* Chart */}
      <div className="relative flex flex-col items-center gap-0">

        {/* 총회 — General Assembly */}
        <OrgBox color="navy" label="General Assembly" sub={isKo ? "총회" : "General Assembly"} />
        <VLine />

        {/* 이사회 + 이사 목록 */}
        <div className="flex items-center gap-4">
          <div className="hidden sm:flex flex-col items-end gap-1 text-sm text-gray-700 pr-2">
            {/* spacer for alignment */}
          </div>
          <OrgBox color="green" label="Board of Directors" sub={isKo ? "이사회 (임원)" : "Board of Directors"} />
          {/* Right: 이사 목록 */}
          <div className="hidden sm:flex flex-col gap-1 pl-3 border-l border-gray-400 ml-2">
            <SideLabel label={isKo ? "이사 김홍일 (재이베노 감독)" : "Director Kim Hong-il"} />
            <SideLabel label={isKo ? "이사 장재훈 (태백회점 대표)" : "Director Jang Jae-hun"} />
            <SideLabel label={isKo ? "이사 최창휴 (길병원 의사)" : "Director Choi Chang-hyu"} />
            <SideLabel label={isKo ? "감사 조상희 (화산악연맹 차장)" : "Auditor Jo Sang-hee"} />
          </div>
        </div>
        <VLine />

        {/* 회장 */}
        <div className="flex items-center gap-2">
          <OrgBox color="orange" label="장지윤 (재이베노 대표)" sub={isKo ? "회장" : "President"} compact />
        </div>
        <VLine />

        {/* 부회장 / 사무처장 / 재무이사 */}
        <div className="flex items-end gap-2 sm:gap-6">
          {/* 부회장 */}
          <div className="flex flex-col items-center gap-1">
            <div className="text-xs text-gray-500 font-medium mb-1">{isKo ? "부회장" : "Vice Presidents"}</div>
            <OrgBox color="orange" label={isKo ? "김영록 (락앤런 대표)" : "Kim Yeong-rok"} compact small />
            <OrgBox color="orange" label={isKo ? "김부경 (러너스후드 대표)" : "Kim Bu-gyeong"} compact small />
          </div>

          {/* 사무처장 (center) */}
          <div className="flex flex-col items-center">
            <OrgBox color="teal" label={isKo ? "김민수 (MS행정사 대표)" : "Kim Min-su"} sub={isKo ? "사무처장" : "Secretary General"} />
          </div>

          {/* 재무이사 */}
          <div className="flex flex-col items-center gap-1">
            <div className="text-xs text-gray-500 font-medium mb-1">{isKo ? "재무이사" : "Treasurer"}</div>
            <OrgBox color="amber" label={isKo ? "이승현 (트레일서비스 대표)" : "Lee Seung-hyeon"} compact small />
          </div>
        </div>
      </div>

      {/* 이사 목록 — mobile only */}
      <div className="sm:hidden mt-6 border-t pt-4">
        <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">{isKo ? "이사회 (임원)" : "Directors & Auditor"}</p>
        <ul className="space-y-1 text-sm text-gray-700">
          <li>이사 김홍일 (재이베노 감독)</li>
          <li>이사 장재훈 (태백회점 대표)</li>
          <li>이사 최창휴 (길병원 의사)</li>
          <li>감사 조상희 (화산악연맹 차장)</li>
        </ul>
      </div>

      {/* Bottom: Governance + Committees */}
      <div className="mt-12 border-t pt-8 grid grid-cols-1 sm:grid-cols-2 gap-8">
        {/* Governance */}
        <div>
          <h3 className="text-base font-bold text-blue-800 underline mb-3">Governance</h3>
          <ul className="space-y-2 text-sm text-gray-700">
            <li className="flex items-center gap-2">
              <span className="text-gray-400">•</span>
              <span className="font-medium">General Assembly</span>
              <span className="text-gray-500">{isKo ? "사무처장" : "Secretary General"}</span>
            </li>
            <li className="flex items-center gap-2">
              <span className="text-gray-400">•</span>
              <span className="font-medium">Board of Directors</span>
              <span className="text-gray-500">{isKo ? "이사회" : "Board of Directors"}</span>
            </li>
          </ul>
        </div>

        {/* Committees */}
        <div>
          <h3 className="text-base font-bold text-gray-800 mb-3">Committees &amp; Operational Bodies</h3>
          <ul className="space-y-2 text-sm text-gray-700">
            <li className="flex items-start gap-2">
              <span className="text-gray-400 mt-0.5">•</span>
              <span className="font-semibold">Race Medic Committee</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-gray-400 mt-0.5">•</span>
              <div>
                <span className="font-semibold">TROF (Trail Running Organiser Forum)</span>
                <p className="text-xs italic text-gray-500 mt-0.5">Forum of Race Organisers in Korea</p>
              </div>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}

/* ── Sub-components ── */

const colorMap = {
  navy:   "bg-[#1e3a6e] text-white border-[#1e3a6e]",
  green:  "bg-[#2d6a4f] text-white border-[#2d6a4f]",
  orange: "bg-[#e07b39] text-white border-[#e07b39]",
  amber:  "bg-[#d4842a] text-white border-[#d4842a]",
  teal:   "bg-[#2a7f7f] text-white border-[#2a7f7f]",
};

function OrgBox({
  color,
  label,
  sub,
  compact = false,
  small = false,
}: {
  color: keyof typeof colorMap;
  label: string;
  sub?: string;
  compact?: boolean;
  small?: boolean;
}) {
  return (
    <div
      className={[
        "rounded-md border-2 text-center font-semibold leading-tight",
        colorMap[color],
        compact ? "px-3 py-2" : "px-6 py-3",
        small ? "text-xs min-w-[120px]" : "text-sm min-w-[180px]",
      ].join(" ")}
    >
      <div>{label}</div>
      {sub && <div className="text-xs font-normal opacity-80 mt-0.5">{sub}</div>}
    </div>
  );
}

function VLine() {
  return <div className="w-px h-6 bg-gray-400 mx-auto" />;
}

function SideLabel({ label }: { label: string }) {
  return <span className="text-xs text-gray-700 whitespace-nowrap">{label}</span>;
}
