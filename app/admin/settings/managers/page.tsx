"use client";

import { useState } from "react";

type ManagerRole = "OPERATOR" | "MANAGER";

interface Manager {
  id: string;
  name: string;
  email: string;
  role: ManagerRole;
  groups: string[];
}

const ALL_GROUPS = ["재무", "감사", "자격인증", "콘텐츠", "회원관리"];

const INITIAL_MANAGERS: Manager[] = [
  { id: "1", name: "운영자1 (나)",   email: "operator@ktsa.org",  role: "OPERATOR", groups: ["재무", "회원관리"] },
  { id: "2", name: "담당자2 김철수", email: "cs.kim@ktsa.org",    role: "MANAGER",  groups: ["콘텐츠"] },
  { id: "3", name: "담당자3 이영희", email: "yh.lee@ktsa.org",    role: "MANAGER",  groups: ["자격인증", "감사"] },
];

const ROLE_BADGE: Record<ManagerRole, { label: string; cls: string }> = {
  OPERATOR: { label: "운영자", cls: "bg-[#1e3a6e] text-white" },
  MANAGER:  { label: "담당자", cls: "bg-gray-100 text-gray-600" },
};

export default function AdminManagersPage() {
  const [managers, setManagers] = useState<Manager[]>(INITIAL_MANAGERS);

  // 초대 모달
  const [showInviteModal, setShowInviteModal] = useState(false);
  const [inviteEmail, setInviteEmail] = useState("");
  const [inviteGroup, setInviteGroup] = useState("");
  const [inviteMemo, setInviteMemo] = useState("");

  // 권한 수정 사이드패널
  const [editId, setEditId] = useState<string | null>(null);
  const [editGroups, setEditGroups] = useState<string[]>([]);

  const openEdit = (m: Manager) => {
    setEditId(m.id);
    setEditGroups([...m.groups]);
  };

  const closeEdit = () => setEditId(null);

  const toggleEditGroup = (g: string) => {
    setEditGroups((prev) =>
      prev.includes(g) ? prev.filter((x) => x !== g) : [...prev, g]
    );
  };

  const saveEdit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editId) return;
    setManagers((prev) =>
      prev.map((m) => (m.id === editId ? { ...m, groups: editGroups } : m))
    );
    closeEdit();
  };

  const dismiss = (id: string) => {
    if (!confirm("정말 해임하시겠습니까?")) return;
    setManagers((prev) => prev.filter((m) => m.id !== id));
  };

  const handleInviteSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // 목업 — 실제 API 호출 없음
    setShowInviteModal(false);
    setInviteEmail("");
    setInviteGroup("");
    setInviteMemo("");
  };

  return (
    <div className="relative">
      {/* 타이틀 */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">담당자 관리</h1>
          <p className="text-sm text-gray-400 mt-1">관리자 초대·권한 수정·해임</p>
        </div>
        <button
          onClick={() => setShowInviteModal(true)}
          className="px-4 py-2 bg-[#1e3a6e] text-white text-sm font-semibold rounded-lg hover:bg-[#152d57] transition-colors"
        >
          + 담당자 초대
        </button>
      </div>

      {/* 담당자 카드 목록 */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {managers.map((m) => {
          const badge = ROLE_BADGE[m.role];
          return (
            <div
              key={m.id}
              className="bg-white rounded-xl border border-gray-200 p-5 flex flex-col gap-3"
            >
              {/* 상단 */}
              <div className="flex items-start justify-between">
                <div>
                  <p className="font-semibold text-gray-900">{m.name}</p>
                  <p className="text-xs text-gray-400 mt-0.5">{m.email}</p>
                </div>
                <span className={`text-xs px-2.5 py-0.5 rounded-full font-medium ${badge.cls}`}>
                  {badge.label}
                </span>
              </div>

              {/* 그룹 태그 */}
              <div className="flex flex-wrap gap-1.5">
                {m.groups.length === 0 ? (
                  <span className="text-xs text-gray-300 italic">그룹 없음</span>
                ) : (
                  m.groups.map((g) => (
                    <span
                      key={g}
                      className="px-2 py-0.5 bg-blue-50 text-blue-700 text-xs rounded-full"
                    >
                      {g}
                    </span>
                  ))
                )}
              </div>

              {/* 액션 */}
              <div className="flex gap-2 mt-auto pt-2 border-t border-gray-100">
                <button
                  onClick={() => openEdit(m)}
                  className="flex-1 py-1.5 text-xs font-medium border border-[#1e3a6e] text-[#1e3a6e] rounded-lg hover:bg-[#f0f3f9] transition-colors"
                >
                  권한수정
                </button>
                {m.role !== "OPERATOR" && (
                  <button
                    onClick={() => dismiss(m.id)}
                    className="flex-1 py-1.5 text-xs font-medium border border-red-200 text-red-500 rounded-lg hover:bg-red-50 transition-colors"
                  >
                    해임
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* ── 초대 모달 ── */}
      {showInviteModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-6">
            <div className="flex items-center justify-between mb-5">
              <h2 className="text-lg font-bold text-gray-900">담당자 초대</h2>
              <button
                onClick={() => setShowInviteModal(false)}
                className="text-gray-400 hover:text-gray-600 text-xl leading-none"
              >
                ×
              </button>
            </div>
            <form onSubmit={handleInviteSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">이메일</label>
                <input
                  type="email"
                  required
                  value={inviteEmail}
                  onChange={(e) => setInviteEmail(e.target.value)}
                  placeholder="manager@ktsa.org"
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#1e3a6e]/30"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">권한 그룹</label>
                <select
                  value={inviteGroup}
                  onChange={(e) => setInviteGroup(e.target.value)}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#1e3a6e]/30"
                >
                  <option value="">그룹 선택</option>
                  {ALL_GROUPS.map((g) => (
                    <option key={g} value={g}>{g}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">근거 메모</label>
                <textarea
                  value={inviteMemo}
                  onChange={(e) => setInviteMemo(e.target.value)}
                  placeholder="초대 사유를 입력하세요 (선택)"
                  rows={3}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#1e3a6e]/30 resize-none"
                />
              </div>
              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setShowInviteModal(false)}
                  className="flex-1 py-2.5 border border-gray-300 text-gray-600 text-sm font-medium rounded-lg hover:bg-gray-50 transition-colors"
                >
                  취소
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 bg-[#1e3a6e] text-white text-sm font-semibold rounded-lg hover:bg-[#152d57] transition-colors"
                >
                  초대 보내기
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ── 권한수정 사이드패널 ── */}
      {editId && (
        <>
          {/* 오버레이 */}
          <div
            className="fixed inset-0 z-40 bg-black/20"
            onClick={closeEdit}
          />
          {/* 패널 */}
          <div className="fixed right-0 top-0 h-full z-50 w-80 bg-white shadow-2xl flex flex-col">
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
              <h2 className="text-base font-bold text-gray-900">권한 수정</h2>
              <button
                onClick={closeEdit}
                className="text-gray-400 hover:text-gray-600 text-xl leading-none"
              >
                ×
              </button>
            </div>
            <form onSubmit={saveEdit} className="flex-1 flex flex-col p-6">
              <p className="text-sm text-gray-500 mb-4">
                {managers.find((m) => m.id === editId)?.name}의 그룹을 설정합니다.
              </p>
              <div className="space-y-3 flex-1">
                {ALL_GROUPS.map((g) => (
                  <label key={g} className="flex items-center gap-3 cursor-pointer select-none">
                    <input
                      type="checkbox"
                      checked={editGroups.includes(g)}
                      onChange={() => toggleEditGroup(g)}
                      className="w-4 h-4 accent-[#1e3a6e]"
                    />
                    <span className="text-sm text-gray-700">{g}</span>
                  </label>
                ))}
              </div>
              <button
                type="submit"
                className="mt-6 w-full py-3 bg-[#1e3a6e] text-white text-sm font-semibold rounded-xl hover:bg-[#152d57] transition-colors"
              >
                저장
              </button>
            </form>
          </div>
        </>
      )}
    </div>
  );
}
