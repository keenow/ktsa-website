"use client";

import { useState, useEffect, useCallback } from "react";

interface Profile {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  membership_grade: "general" | "member" | "admin";
  is_active: boolean;
  created_at: string;
}

type UIStatus = "PENDING" | "ACTIVE" | "SUSPENDED" | "ADMIN";

function getStatus(p: Profile): UIStatus {
  if (p.membership_grade === "admin") return "ADMIN";
  if (!p.is_active) return "SUSPENDED";
  if (p.membership_grade === "general") return "PENDING";
  return "ACTIVE";
}

const GRADE_BADGE: Record<string, { label: string; cls: string }> = {
  general: { label: "준회원",   cls: "bg-gray-100 text-gray-600" },
  member:  { label: "정회원",   cls: "bg-blue-100 text-blue-700" },
  admin:   { label: "관리자",   cls: "bg-purple-100 text-purple-700" },
};

const STATUS_BADGE: Record<UIStatus, { label: string; cls: string }> = {
  PENDING:   { label: "승인대기", cls: "bg-amber-100 text-amber-700" },
  ACTIVE:    { label: "활성",     cls: "bg-green-100 text-green-700" },
  SUSPENDED: { label: "정지",     cls: "bg-red-100 text-red-700" },
  ADMIN:     { label: "관리자",   cls: "bg-purple-100 text-purple-700" },
};

const FILTER_TABS: { key: UIStatus | "ALL"; label: string }[] = [
  { key: "ALL",       label: "전체" },
  { key: "PENDING",   label: "승인대기" },
  { key: "ACTIVE",    label: "활성" },
  { key: "SUSPENDED", label: "정지" },
];

export default function AdminMembersPage() {
  const [members, setMembers] = useState<Profile[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState<UIStatus | "ALL">("ALL");
  const [search, setSearch] = useState("");
  const [actionLoading, setActionLoading] = useState<string | null>(null);

  const fetchMembers = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (search) params.set("search", search);
      const res = await fetch(`/api/admin/members?${params.toString()}`);
      const data = await res.json();
      if (res.ok) {
        setMembers(data.members ?? []);
      }
    } finally {
      setLoading(false);
    }
  }, [search]);

  useEffect(() => {
    const timer = setTimeout(fetchMembers, 300);
    return () => clearTimeout(timer);
  }, [fetchMembers]);

  const patchMember = async (id: string, body: { membership_grade?: string; is_active?: boolean }) => {
    setActionLoading(id);
    try {
      const res = await fetch(`/api/admin/members/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      if (res.ok) {
        const data = await res.json();
        setMembers((prev) => prev.map((m) => (m.id === id ? data.member : m)));
      }
    } finally {
      setActionLoading(null);
    }
  };

  const filtered = members.filter((m) => {
    if (filterStatus === "ALL") return true;
    return getStatus(m) === filterStatus;
  });

  const countByStatus = (key: UIStatus | "ALL") =>
    key === "ALL" ? members.length : members.filter((m) => getStatus(m) === key).length;

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">회원 관리</h1>
        <p className="text-sm text-gray-400 mt-1">실제 DB 연동</p>
      </div>

      <div className="mb-4">
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="이름 또는 이메일로 검색"
          className="w-full max-w-sm border border-gray-300 rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#1e3a6e]/30"
        />
      </div>

      <div className="flex gap-1 mb-5">
        {FILTER_TABS.map(({ key, label }) => (
          <button
            key={key}
            onClick={() => setFilterStatus(key)}
            className={`px-4 py-1.5 rounded-full text-sm font-medium transition-colors ${
              filterStatus === key
                ? "bg-[#1e3a6e] text-white"
                : "bg-gray-100 text-gray-600 hover:bg-gray-200"
            }`}
          >
            {label}
            <span className="ml-1.5 text-xs opacity-70">{countByStatus(key)}</span>
          </button>
        ))}
      </div>

      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              {["이름", "이메일", "등급", "상태", "가입일", "액션"].map((h) => (
                <th
                  key={h}
                  className="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide"
                >
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {loading ? (
              <tr>
                <td colSpan={6} className="px-5 py-8 text-center text-gray-400 text-sm">
                  불러오는 중...
                </td>
              </tr>
            ) : filtered.length === 0 ? (
              <tr>
                <td colSpan={6} className="px-5 py-8 text-center text-gray-400 text-sm">
                  검색 결과가 없습니다.
                </td>
              </tr>
            ) : (
              filtered.map((m) => {
                const gradeBadge = GRADE_BADGE[m.membership_grade] ?? GRADE_BADGE.general;
                const status = getStatus(m);
                const statusBadge = STATUS_BADGE[status];
                const isActioning = actionLoading === m.id;
                return (
                  <tr key={m.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-5 py-3 font-medium text-gray-900">{m.name}</td>
                    <td className="px-5 py-3 text-gray-500">{m.email}</td>
                    <td className="px-5 py-3">
                      <span className={`inline-flex px-2.5 py-0.5 rounded-full text-xs font-medium ${gradeBadge.cls}`}>
                        {gradeBadge.label}
                      </span>
                    </td>
                    <td className="px-5 py-3">
                      <span className={`inline-flex px-2.5 py-0.5 rounded-full text-xs font-medium ${statusBadge.cls}`}>
                        {statusBadge.label}
                      </span>
                    </td>
                    <td className="px-5 py-3 text-gray-400">
                      {m.created_at ? new Date(m.created_at).toLocaleDateString("ko-KR") : "—"}
                    </td>
                    <td className="px-5 py-3">
                      <div className="flex gap-2">
                        {status === "PENDING" && (
                          <button
                            onClick={() => patchMember(m.id, { membership_grade: "member" })}
                            disabled={isActioning}
                            className="px-3 py-1 bg-[#1e3a6e] text-white text-xs rounded-md hover:bg-[#152d57] transition-colors disabled:opacity-50"
                          >
                            {isActioning ? "처리중..." : "승인"}
                          </button>
                        )}
                        {status === "ACTIVE" && (
                          <button
                            onClick={() => patchMember(m.id, { is_active: false })}
                            disabled={isActioning}
                            className="px-3 py-1 bg-red-100 text-red-600 text-xs rounded-md hover:bg-red-200 transition-colors disabled:opacity-50"
                          >
                            {isActioning ? "처리중..." : "정지"}
                          </button>
                        )}
                        {status === "SUSPENDED" && (
                          <button
                            onClick={() => patchMember(m.id, { is_active: true })}
                            disabled={isActioning}
                            className="px-3 py-1 bg-green-100 text-green-600 text-xs rounded-md hover:bg-green-200 transition-colors disabled:opacity-50"
                          >
                            {isActioning ? "처리중..." : "복구"}
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      <p className="mt-3 text-xs text-gray-400">
        총 {filtered.length}명 표시 / 전체 {members.length}명
      </p>
    </div>
  );
}
