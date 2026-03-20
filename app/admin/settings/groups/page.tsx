"use client";

import { useState } from "react";
import { MENU_PERMISSIONS, DATA_PERMISSIONS, PRESET_GROUPS, type Permission } from "@/lib/admin-permissions";

// ── 메뉴 권한 목록 (9개) ──
const MENU_ITEMS: { label: string; value: Permission }[] = [
  { label: "대시보드",   value: MENU_PERMISSIONS.DASHBOARD },
  { label: "회원 관리",  value: MENU_PERMISSIONS.MEMBERS },
  { label: "결제·재무",  value: MENU_PERMISSIONS.PAYMENTS },
  { label: "보험 관리",  value: MENU_PERMISSIONS.INSURANCE },
  { label: "자격 인증",  value: MENU_PERMISSIONS.CERTIFICATIONS },
  { label: "공지·뉴스",  value: MENU_PERMISSIONS.POSTS },
  { label: "대회 일정",  value: MENU_PERMISSIONS.RACES },
  { label: "로그 열람",  value: MENU_PERMISSIONS.LOGS },
  { label: "설정",       value: MENU_PERMISSIONS.SETTINGS },
];

// ── 데이터 권한 매트릭스 ──
type DataAction = "READ" | "CREATE" | "UPDATE" | "DELETE" | "EXPORT";
const DATA_ACTIONS: DataAction[] = ["READ", "CREATE", "UPDATE", "DELETE", "EXPORT"];

interface DataRow {
  resource: string;
  label: string;
  keys: Partial<Record<DataAction, Permission>>;
}

const DATA_MATRIX: DataRow[] = [
  {
    resource: "members", label: "회원",
    keys: {
      READ:   DATA_PERMISSIONS.MEMBERS_READ,
      UPDATE: DATA_PERMISSIONS.MEMBERS_UPDATE,
      DELETE: DATA_PERMISSIONS.MEMBERS_DELETE,
      EXPORT: DATA_PERMISSIONS.MEMBERS_EXPORT,
    },
  },
  {
    resource: "memberships", label: "회원 자격",
    keys: {
      READ:   DATA_PERMISSIONS.MEMBERSHIPS_READ,
      CREATE: DATA_PERMISSIONS.MEMBERSHIPS_CREATE,
      UPDATE: DATA_PERMISSIONS.MEMBERSHIPS_UPDATE,
      DELETE: DATA_PERMISSIONS.MEMBERSHIPS_DELETE,
    },
  },
  {
    resource: "payments", label: "결제",
    keys: {
      READ:   DATA_PERMISSIONS.PAYMENTS_READ,
      EXPORT: DATA_PERMISSIONS.PAYMENTS_EXPORT,
    },
  },
  {
    resource: "refunds", label: "환불",
    keys: {
      READ:   DATA_PERMISSIONS.REFUNDS_READ,
      CREATE: DATA_PERMISSIONS.REFUNDS_CREATE,
    },
  },
  {
    resource: "insurance", label: "보험",
    keys: {
      READ:   DATA_PERMISSIONS.INSURANCE_READ,
      CREATE: DATA_PERMISSIONS.INSURANCE_CREATE,
      UPDATE: DATA_PERMISSIONS.INSURANCE_UPDATE,
      DELETE: DATA_PERMISSIONS.INSURANCE_DELETE,
    },
  },
  {
    resource: "posts", label: "콘텐츠",
    keys: {
      READ:   DATA_PERMISSIONS.POSTS_READ,
      CREATE: DATA_PERMISSIONS.POSTS_CREATE,
      UPDATE: DATA_PERMISSIONS.POSTS_UPDATE,
      DELETE: DATA_PERMISSIONS.POSTS_DELETE,
    },
  },
  {
    resource: "races", label: "대회",
    keys: {
      READ:   DATA_PERMISSIONS.RACES_READ,
      CREATE: DATA_PERMISSIONS.RACES_CREATE,
      UPDATE: DATA_PERMISSIONS.RACES_UPDATE,
      DELETE: DATA_PERMISSIONS.RACES_DELETE,
    },
  },
];

// ── 그룹 타입 ──
interface Group {
  id: string;
  name: string;
  permissions: Permission[];
}

const buildInitial = (): Group[] =>
  Object.entries(PRESET_GROUPS).map(([key, { label, permissions }]) => ({
    id: key,
    name: label,
    permissions,
  }));

export default function AdminGroupsPage() {
  const [groups, setGroups] = useState<Group[]>(buildInitial());
  const [selectedId, setSelectedId] = useState<string>(groups[0]?.id ?? "");
  const [saved, setSaved] = useState(false);

  const selected = groups.find((g) => g.id === selectedId);

  const togglePerm = (perm: Permission) => {
    setGroups((prev) =>
      prev.map((g) => {
        if (g.id !== selectedId) return g;
        const has = g.permissions.includes(perm);
        return {
          ...g,
          permissions: has
            ? g.permissions.filter((p) => p !== perm)
            : [...g.permissions, perm],
        };
      })
    );
    setSaved(false);
  };

  const setName = (name: string) => {
    setGroups((prev) =>
      prev.map((g) => (g.id === selectedId ? { ...g, name } : g))
    );
    setSaved(false);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setSaved(true);
  };

  const handleNewGroup = (e: React.MouseEvent) => {
    e.preventDefault();
    const id = `group_${Date.now()}`;
    const newGroup: Group = { id, name: "새 그룹", permissions: [] };
    setGroups((prev) => [...prev, newGroup]);
    setSelectedId(id);
    setSaved(false);
  };

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">권한 그룹 관리</h1>
        <p className="text-sm text-gray-400 mt-1">그룹별 메뉴 접근 및 데이터 권한을 설정합니다.</p>
      </div>

      <div className="flex gap-6 h-full">
        {/* ── 좌측: 그룹 목록 ── */}
        <aside className="w-48 shrink-0">
          <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
            <div className="px-4 py-3 border-b border-gray-100 text-xs font-semibold text-gray-500 uppercase tracking-wide">
              그룹 목록
            </div>
            <ul className="divide-y divide-gray-100">
              {groups.map((g) => (
                <li key={g.id}>
                  <button
                    onClick={() => {
                      setSelectedId(g.id);
                      setSaved(false);
                    }}
                    className={`w-full text-left px-4 py-3 text-sm transition-colors ${
                      g.id === selectedId
                        ? "bg-[#1e3a6e] text-white font-semibold"
                        : "text-gray-700 hover:bg-gray-50"
                    }`}
                  >
                    {g.name}
                    <span className={`block text-xs mt-0.5 ${g.id === selectedId ? "text-blue-200" : "text-gray-400"}`}>
                      권한 {g.permissions.length}개
                    </span>
                  </button>
                </li>
              ))}
            </ul>
          </div>
          <button
            onClick={handleNewGroup}
            className="mt-3 w-full py-2 border-2 border-dashed border-[#1e3a6e]/30 text-[#1e3a6e] text-sm rounded-xl hover:border-[#1e3a6e]/60 transition-colors"
          >
            + 새 그룹 만들기
          </button>
        </aside>

        {/* ── 우측: 편집 ── */}
        {selected ? (
          <form onSubmit={handleSave} className="flex-1 space-y-5">
            {/* 그룹명 */}
            <div className="bg-white rounded-xl border border-gray-200 p-5">
              <label className="block text-sm font-semibold text-gray-700 mb-2">그룹명</label>
              <input
                type="text"
                value={selected.name}
                onChange={(e) => setName(e.target.value)}
                className="w-full max-w-sm border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#1e3a6e]/30"
              />
            </div>

            {/* 메뉴 접근 권한 */}
            <div className="bg-white rounded-xl border border-gray-200 p-5">
              <p className="text-sm font-semibold text-gray-700 mb-3">메뉴 접근 권한</p>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                {MENU_ITEMS.map(({ label, value }) => {
                  const checked = selected.permissions.includes(value);
                  return (
                    <label key={value} className="flex items-center gap-2 cursor-pointer select-none">
                      <input
                        type="checkbox"
                        checked={checked}
                        onChange={() => togglePerm(value)}
                        className="w-4 h-4 accent-[#1e3a6e]"
                      />
                      <span className="text-sm text-gray-700">{label}</span>
                    </label>
                  );
                })}
              </div>
            </div>

            {/* 데이터 권한 매트릭스 */}
            <div className="bg-white rounded-xl border border-gray-200 p-5">
              <p className="text-sm font-semibold text-gray-700 mb-3">데이터 권한</p>
              <div className="overflow-x-auto">
                <table className="text-xs w-full">
                  <thead>
                    <tr>
                      <th className="text-left pb-2 pr-4 text-gray-500 font-semibold w-24">리소스</th>
                      {DATA_ACTIONS.map((a) => (
                        <th key={a} className="pb-2 px-2 text-gray-500 font-semibold text-center">{a}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {DATA_MATRIX.map((row) => (
                      <tr key={row.resource}>
                        <td className="py-2 pr-4 text-gray-700 font-medium">{row.label}</td>
                        {DATA_ACTIONS.map((action) => {
                          const perm = row.keys[action];
                          if (!perm) {
                            return <td key={action} className="py-2 px-2 text-center"><span className="text-gray-200">—</span></td>;
                          }
                          const checked = selected.permissions.includes(perm);
                          return (
                            <td key={action} className="py-2 px-2 text-center">
                              <input
                                type="checkbox"
                                checked={checked}
                                onChange={() => togglePerm(perm)}
                                className="w-3.5 h-3.5 accent-[#1e3a6e]"
                              />
                            </td>
                          );
                        })}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* 버튼 */}
            <div className="flex gap-3 items-center">
              <button
                type="submit"
                className="px-6 py-2.5 bg-[#1e3a6e] text-white text-sm font-semibold rounded-lg hover:bg-[#152d57] transition-colors"
              >
                저장
              </button>
              <button
                type="button"
                onClick={handleNewGroup}
                className="px-6 py-2.5 border border-[#1e3a6e] text-[#1e3a6e] text-sm font-semibold rounded-lg hover:bg-[#f0f3f9] transition-colors"
              >
                새 그룹 만들기
              </button>
              {saved && (
                <span className="text-sm text-green-600 font-medium">✓ 저장되었습니다</span>
              )}
            </div>
          </form>
        ) : (
          <div className="flex-1 flex items-center justify-center text-gray-400 text-sm">
            좌측에서 그룹을 선택하세요.
          </div>
        )}
      </div>
    </div>
  );
}
