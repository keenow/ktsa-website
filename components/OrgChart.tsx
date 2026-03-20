"use client";

import {
  generalAssembly,
  boardOfDirectors,
  boardMembers,
  president,
  vicePresidents,
  secretaryGeneral,
  treasurer,
  committees,
  type OrgMember,
  type OrgColor,
  type Committee,
} from "@/content/org-structure";

// ─── 타입 ──────────────────────────────────────

type Locale = "ko" | "en";

interface OrgChartProps {
  locale: Locale;
}

// ─── 색상 맵 ───────────────────────────────────

const colorMap: Record<OrgColor, string> = {
  navy:  "bg-[#1e3a6e] text-white border-[#1e3a6e]",
  green: "bg-[#2d6a4f] text-white border-[#2d6a4f]",
  orange:"bg-[#e07b39] text-white border-[#e07b39]",
  amber: "bg-[#d4842a] text-white border-[#d4842a]",
  teal:  "bg-[#2a7f7f] text-white border-[#2a7f7f]",
  slate: "bg-slate-600  text-white border-slate-600",
};

// ─── 헬퍼 ──────────────────────────────────────

function memberLabel(m: OrgMember, locale: Locale): string {
  const name = locale === "en" && m.nameEn ? m.nameEn : m.name;
  const org  = m.org[locale];
  return `${name} (${org})`;
}

function roleLabel(m: OrgMember, locale: Locale): string {
  return m.role[locale];
}

// ─── 메인 컴포넌트 ─────────────────────────────

export default function OrgChart({ locale }: OrgChartProps) {
  return (
    <div className="w-full font-sans select-none">

      {/* 헤더 */}
      <div className="text-center mb-10">
        <h2 className="text-2xl font-bold text-gray-900">KTSA Organizational Structure</h2>
        <p className="text-sm italic text-gray-500 mt-1">Korea Trail Sports Association</p>
      </div>

      {/* 차트 본체 */}
      <div className="flex flex-col items-center">

        {/* 1단: 총회 */}
        <OrgBox
          label={generalAssembly[locale]}
          color="navy"
          wide
        />
        <VLine />

        {/* 2단: 이사회 + 이사·감사 목록 */}
        <div className="flex items-center gap-4 w-full max-w-2xl">
          <div className="flex-1 flex justify-end">
            {/* (왼쪽 여백 확보용) */}
          </div>
          <OrgBox
            label={boardOfDirectors[locale]}
            color="green"
            wide
          />
          {/* 이사·감사 — 오른쪽 세로 목록 */}
          <div className="flex-1 hidden sm:flex flex-col gap-1 pl-4 border-l-2 border-gray-300">
            {boardMembers.map((m, i) => (
              <BoardMemberTag key={i} member={m} locale={locale} />
            ))}
          </div>
        </div>
        <VLine />

        {/* 3단: 회장 */}
        <OrgBox
          label={memberLabel(president, locale)}
          sub={roleLabel(president, locale)}
          color={president.color ?? "orange"}
          wide
        />
        <VLine />

        {/* 4단: 부회장 | 사무처장 | 재무이사 */}
        <div className="flex items-start justify-center gap-4 sm:gap-8 flex-wrap">

          {/* 부회장 그룹 */}
          <div className="flex flex-col items-center gap-1">
            <span className="text-xs font-semibold text-gray-500 mb-1 uppercase tracking-wide">
              {vicePresidents[0]?.role[locale]}
            </span>
            {vicePresidents.map((vp, i) => (
              <OrgBox
                key={i}
                label={memberLabel(vp, locale)}
                color={vp.color ?? "orange"}
                compact
              />
            ))}
          </div>

          {/* 사무처장 */}
          <div className="flex flex-col items-center">
            <OrgBox
              label={memberLabel(secretaryGeneral, locale)}
              sub={roleLabel(secretaryGeneral, locale)}
              color={secretaryGeneral.color ?? "teal"}
            />
          </div>

          {/* 재무이사 */}
          <div className="flex flex-col items-center">
            <span className="text-xs font-semibold text-gray-500 mb-1 uppercase tracking-wide">
              {roleLabel(treasurer, locale)}
            </span>
            <OrgBox
              label={memberLabel(treasurer, locale)}
              color={treasurer.color ?? "amber"}
              compact
            />
          </div>
        </div>

        {/* 이사·감사 — 모바일 전용 */}
        <div className="sm:hidden mt-6 w-full border-t pt-4">
          <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">
            {boardOfDirectors[locale]}
          </p>
          <ul className="space-y-1">
            {boardMembers.map((m, i) => (
              <li key={i} className="text-sm text-gray-700">
                <span className="font-medium text-green-700">{roleLabel(m, locale)}</span>{" "}
                {memberLabel(m, locale)}
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* 하단: Governance + Committees */}
      <div className="mt-12 border-t pt-8 grid grid-cols-1 sm:grid-cols-2 gap-8">

        {/* Governance */}
        <div>
          <h3 className="text-base font-bold text-blue-900 underline mb-3">Governance</h3>
          <ul className="space-y-2 text-sm text-gray-700">
            <li>
              <span className="font-medium">{generalAssembly[locale]}</span>
              {" — "}
              <span className="text-gray-500">{roleLabel(secretaryGeneral, locale)}</span>
            </li>
            <li>
              <span className="font-medium">{boardOfDirectors[locale]}</span>
            </li>
          </ul>
        </div>

        {/* Committees */}
        <div>
          <h3 className="text-base font-bold text-gray-800 mb-3">
            {locale === "ko" ? "위원회 및 운영 기구" : "Committees & Operational Bodies"}
          </h3>
          <ul className="space-y-3 text-sm text-gray-700">
            {committees.map((c, i) => (
              <CommitteeItem key={i} committee={c} locale={locale} />
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}

// ─── 서브 컴포넌트 ──────────────────────────────

function OrgBox({
  label,
  sub,
  color,
  wide = false,
  compact = false,
}: {
  label: string;
  sub?: string;
  color: OrgColor;
  wide?: boolean;
  compact?: boolean;
}) {
  return (
    <div
      className={[
        "rounded-md border-2 text-center font-semibold leading-tight",
        colorMap[color],
        wide    ? "w-full max-w-sm px-6 py-3 text-sm"  : "",
        compact ? "px-3 py-2 text-xs min-w-[140px]"    : "px-5 py-3 text-sm min-w-[180px]",
        !wide && !compact ? "text-sm" : "",
      ].join(" ")}
    >
      <div>{label}</div>
      {sub && <div className="text-xs font-normal opacity-80 mt-0.5">{sub}</div>}
    </div>
  );
}

function VLine() {
  return <div className="w-px h-6 bg-gray-400" />;
}

function BoardMemberTag({ member, locale }: { member: OrgMember; locale: Locale }) {
  return (
    <div className="text-xs text-gray-700 leading-snug">
      <span className="font-semibold text-green-700">{roleLabel(member, locale)}</span>{" "}
      {memberLabel(member, locale)}
    </div>
  );
}

function CommitteeItem({ committee, locale }: { committee: Committee; locale: Locale }) {
  return (
    <li className="flex items-start gap-2">
      <span className="text-gray-400 mt-0.5">•</span>
      <div>
        <span className="font-semibold">{committee.name[locale]}</span>
        {committee.description && (
          <p className="text-xs italic text-gray-500 mt-0.5">{committee.description[locale]}</p>
        )}
      </div>
    </li>
  );
}
