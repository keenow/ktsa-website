// 목업 대시보드 — Supabase 연동 전
const stats = [
  { label: "전체 회원",    value: "—",  sub: "준비 중",   color: "bg-[#1e3a6e]" },
  { label: "가입 신청",    value: "—",  sub: "승인 대기", color: "bg-amber-500" },
  { label: "이번 달 결제", value: "—",  sub: "원",        color: "bg-teal-600"  },
  { label: "자격 대기",    value: "—",  sub: "처리 필요", color: "bg-rose-500"  },
];

const recentActivity = [
  { time: "—", action: "데이터베이스 연동 전" },
];

export default function AdminDashboard() {
  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">대시보드</h1>
        <p className="text-sm text-gray-400 mt-1">KTSA 관리자 패널 — 목업 모드</p>
      </div>

      {/* 통계 카드 */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {stats.map((s) => (
          <div key={s.label} className="bg-white rounded-xl border border-gray-200 p-5">
            <div className={`w-2 h-2 rounded-full ${s.color} mb-3`} />
            <p className="text-2xl font-bold text-gray-900">{s.value}</p>
            <p className="text-xs text-gray-400 mt-0.5">{s.sub}</p>
            <p className="text-sm font-medium text-gray-600 mt-1">{s.label}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* 최근 활동 */}
        <div className="bg-white rounded-xl border border-gray-200 p-5">
          <h2 className="text-sm font-bold text-gray-700 mb-4">최근 활동</h2>
          {recentActivity.map((a, i) => (
            <div key={i} className="flex items-center gap-3 py-2 text-sm border-b border-gray-50 last:border-0">
              <span className="text-gray-300 text-xs w-20 shrink-0">{a.time}</span>
              <span className="text-gray-500">{a.action}</span>
            </div>
          ))}
        </div>

        {/* DB 연동 안내 */}
        <div className="bg-white rounded-xl border border-dashed border-[#1e3a6e]/30 p-5">
          <h2 className="text-sm font-bold text-[#1e3a6e] mb-3">🔌 다음 단계</h2>
          <ul className="space-y-2 text-sm text-gray-600">
            {[
              "Supabase 프로젝트 생성",
              "membership-db-design.md 기반 스키마 적용",
              "NextAuth.js 인증 연동",
              "실제 데이터 연결",
            ].map((step, i) => (
              <li key={i} className="flex items-center gap-2">
                <span className="w-5 h-5 rounded-full bg-gray-100 text-gray-400 text-xs flex items-center justify-center shrink-0">{i + 1}</span>
                {step}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
