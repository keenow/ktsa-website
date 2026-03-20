"use client";

import { useState } from "react";

type MemberType = "ASSOCIATE" | "REGULAR" | "CORPORATE";
type MemberStatus = "PENDING" | "ACTIVE" | "SUSPENDED";

interface Member {
  id: string;
  name: string;
  email: string;
  type: MemberType;
  status: MemberStatus;
  joinedAt: string;
}

const INITIAL_MEMBERS: Member[] = [
  { id: "1", name: "김민준", email: "minjun.kim@example.com", type: "ASSOCIATE",  status: "PENDING",    joinedAt: "2026-03-01" },
  { id: "2", name: "이서연", email: "seoyeon.lee@example.com", type: "REGULAR",   status: "ACTIVE",     joinedAt: "2026-02-14" },
  { id: "3", name: "박지호", email: "jiho.park@example.com",   type: "CORPORATE", status: "ACTIVE",     joinedAt: "2026-01-20" },
  { id: "4", name: "최수아", email: "sua.choi@example.com",    type: "ASSOCIATE", status: "PENDING",    joinedAt: "2026-03-10" },
  { id: "5", name: "정태양", email: "taeyang.jung@example.com",type: "REGULAR",   status: "SUSPENDED",  joinedAt: "2025-11-05" },
  { id: "6", name: "한가을", email: "gaeul.han@example.com",   type: "ASSOCIATE", status: "ACTIVE",     joinedAt: "2026-03-15" },
];

const TYPE_BADGE: Record<MemberType, { label: string; cls: string }> = {
  ASSOCIATE:  { label: "준회원",   cls: "bg-gray-100 text-gray-600" },
  REGULAR:    { label: "정회원",   cls: "bg-blue-100 text-blue-700" },
  CORPORATE:  { label: "기업회원", cls: "bg-purple-100 text-purple-700" },
};

const STATUS_BADGE: Record<MemberStatus, { label: string; cls: string }> = {
  PENDING:   { label: "승인대기", cls: "bg-amber-100 text-amber-700" },
  ACTIVE:    { label: "활성",     cls: "bg-green-100 text-green-700" },
  SUSPENDED: { label: "정지",     cls: "bg-red-100 text-red-700" },
};

const FILTER_TABS: { key: MemberStatus | "ALL"; label: string }[] = [
  { key: "ALL",       label: "전체" },
  { key: "PENDING",   label: "승인대기" },
  { key: "ACTIVE",    label: "활성" },
  { key: "SUSPENDED", label: "정지" },
];

export default function AdminMembersPage() {
  const [members, setMembers] = useState<Member[]>(INITIAL_MEMBERS);
  const [filterStatus, setFilterStatus] = useState<MemberStatus | "ALL">("ALL");
  const [search, setSearch] = useState("");

  const filtered = members.filter((m) => {
    const matchStatus = filterStatus === "ALL" || m.status === filterStatus;
    const q = search.toLowerCase();
    const matchSearch =
      q === "" ||
      m.name.toLowerCase().includes(q) ||
      m.email.toLowerCase().includes(q);
    return matchStatus && matchSearch;
  });

  const approve = (id: string) =>
    setMembers((prev) =>
      prev.map((m) => (m.id === id ? { ...m, status: "ACTIVE" } : m))
    );

  const reject = (id: string) =>
    setMembers((prev) =>
      prev.map((m) => (m.id === id ? { ...m, status: "SUSPENDED" } : m))
    );

  return (
    <div>
      {/* 타이틀 */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">회원 관리</h1>
        <p className="text-sm text-gray-400 mt-1">목업 데이터 — 실제 DB 연동 전</p>
      </div>

      {/* 검색 */}
      <div className="mb-4">
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="이름 또는 이메일로 검색"
          className="w-full max-w-sm border border-gray-300 rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#1e3a6e]/30"
        />
      </div>

      {/* 필터 탭 */}
      <div className="flex gap-1 mb-5">
        {FILTER_TABS.map(({ key, label }) => {
          const count =
            key === "ALL"
              ? members.length
              : members.filter((m) => m.status === key).length;
          return (
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
              <span className="ml-1.5 text-xs opacity-70">{count}</span>
            </button>
          );
        })}
      </div>

      {/* 테이블 */}
      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              {["이름", "이메일", "유형", "상태", "가입일", "액션"].map((h) => (
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
            {filtered.length === 0 ? (
              <tr>
                <td colSpan={6} className="px-5 py-8 text-center text-gray-400 text-sm">
                  검색 결과가 없습니다.
                </td>
              </tr>
            ) : (
              filtered.map((m) => {
                const typeBadge = TYPE_BADGE[m.type];
                const statusBadge = STATUS_BADGE[m.status];
                return (
                  <tr key={m.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-5 py-3 font-medium text-gray-900">{m.name}</td>
                    <td className="px-5 py-3 text-gray-500">{m.email}</td>
                    <td className="px-5 py-3">
                      <span className={`inline-flex px-2.5 py-0.5 rounded-full text-xs font-medium ${typeBadge.cls}`}>
                        {typeBadge.label}
                      </span>
                    </td>
                    <td className="px-5 py-3">
                      <span className={`inline-flex px-2.5 py-0.5 rounded-full text-xs font-medium ${statusBadge.cls}`}>
                        {statusBadge.label}
                      </span>
                    </td>
                    <td className="px-5 py-3 text-gray-400">{m.joinedAt}</td>
                    <td className="px-5 py-3">
                      <div className="flex gap-2">
                        {m.status === "PENDING" && (
                          <>
                            <button
                              onClick={() => approve(m.id)}
                              className="px-3 py-1 bg-[#1e3a6e] text-white text-xs rounded-md hover:bg-[#152d57] transition-colors"
                            >
                              승인
                            </button>
                            <button
                              onClick={() => reject(m.id)}
                              className="px-3 py-1 bg-red-100 text-red-600 text-xs rounded-md hover:bg-red-200 transition-colors"
                            >
                              거절
                            </button>
                          </>
                        )}
                        {m.status === "ACTIVE" && (
                          <button className="px-3 py-1 bg-gray-100 text-gray-600 text-xs rounded-md hover:bg-gray-200 transition-colors">
                            상세보기
                          </button>
                        )}
                        {m.status === "SUSPENDED" && (
                          <span className="text-xs text-gray-300 italic">처리완료</span>
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
