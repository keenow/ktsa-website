"use client";

import { useState, useEffect } from "react";

interface Stats {
  total: number;
  general: number;
  member: number;
  newThisMonth: number;
  recentMembers: {
    id: string;
    name: string;
    email: string;
    membership_grade: string;
    created_at: string;
  }[];
}

const GRADE_LABEL: Record<string, string> = {
  general: "준회원",
  member: "정회원",
  admin: "관리자",
};

export default function AdminDashboard() {
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/admin/stats")
      .then((r) => r.json())
      .then((data) => setStats(data))
      .finally(() => setLoading(false));
  }, []);

  const statCards = [
    { label: "전체 회원",       value: loading ? "—" : String(stats?.total ?? 0),        sub: "명",       color: "bg-[#1e3a6e]" },
    { label: "준회원",          value: loading ? "—" : String(stats?.general ?? 0),      sub: "승인 대기", color: "bg-amber-500" },
    { label: "정회원",          value: loading ? "—" : String(stats?.member ?? 0),       sub: "활성",      color: "bg-teal-600"  },
    { label: "이번 달 신규",    value: loading ? "—" : String(stats?.newThisMonth ?? 0), sub: "명 가입",   color: "bg-blue-500"  },
  ];

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">대시보드</h1>
        <p className="text-sm text-gray-400 mt-1">KTSA 관리자 패널</p>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {statCards.map((s) => (
          <div key={s.label} className="bg-white rounded-xl border border-gray-200 p-5">
            <div className={`w-2 h-2 rounded-full ${s.color} mb-3`} />
            <p className="text-2xl font-bold text-gray-900">{s.value}</p>
            <p className="text-xs text-gray-400 mt-0.5">{s.sub}</p>
            <p className="text-sm font-medium text-gray-600 mt-1">{s.label}</p>
          </div>
        ))}
      </div>

      <div className="bg-white rounded-xl border border-gray-200 p-5">
        <h2 className="text-sm font-bold text-gray-700 mb-4">최근 가입 회원</h2>
        {loading ? (
          <p className="text-sm text-gray-400">불러오는 중...</p>
        ) : !stats?.recentMembers?.length ? (
          <p className="text-sm text-gray-400">가입 회원이 없습니다.</p>
        ) : (
          <div className="divide-y divide-gray-50">
            {stats.recentMembers.map((m) => (
              <div key={m.id} className="flex items-center justify-between py-2.5 text-sm">
                <div className="flex items-center gap-3">
                  <span className="font-medium text-gray-900">{m.name}</span>
                  <span className="text-gray-400 text-xs">{m.email}</span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-xs text-gray-400">
                    {new Date(m.created_at).toLocaleDateString("ko-KR")}
                  </span>
                  <span className="text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full">
                    {GRADE_LABEL[m.membership_grade] ?? m.membership_grade}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
