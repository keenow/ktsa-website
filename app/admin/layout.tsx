"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { MENU_PERMISSIONS, type Permission } from "@/lib/admin-permissions";

// ── 목업: 실제 연동 전까지 운영자 전체 권한 부여 ──
const MOCK_PERMISSIONS: Permission[] = Object.values(MENU_PERMISSIONS);

const NAV_ITEMS = [
  { label: "대시보드",  href: "/admin",                  perm: MENU_PERMISSIONS.DASHBOARD,      icon: "▦" },
  { label: "회원 관리", href: "/admin/members",           perm: MENU_PERMISSIONS.MEMBERS,        icon: "👤" },
  { label: "결제·재무", href: "/admin/payments",          perm: MENU_PERMISSIONS.PAYMENTS,       icon: "₩" },
  { label: "보험 관리", href: "/admin/insurance",         perm: MENU_PERMISSIONS.INSURANCE,      icon: "🛡" },
  { label: "자격 인증", href: "/admin/certifications",    perm: MENU_PERMISSIONS.CERTIFICATIONS, icon: "🏅" },
  { label: "공지·뉴스", href: "/admin/posts",             perm: MENU_PERMISSIONS.POSTS,          icon: "📢" },
  { label: "대회 일정", href: "/admin/races",             perm: MENU_PERMISSIONS.RACES,          icon: "🏔" },
  { label: "로그 열람", href: "/admin/logs",              perm: MENU_PERMISSIONS.LOGS,           icon: "📋" },
  { label: "설정",      href: "/admin/settings",          perm: MENU_PERMISSIONS.SETTINGS,       icon: "⚙" },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [collapsed, setCollapsed] = useState(false);

  const visibleNav = NAV_ITEMS.filter((item) =>
    MOCK_PERMISSIONS.includes(item.perm)
  );

  return (
    <div className="flex h-screen bg-gray-50 font-sans text-gray-900 overflow-hidden">

        {/* ── 사이드바 ── */}
        <aside className={`flex flex-col bg-[#152d57] text-white transition-all duration-200 shrink-0 ${collapsed ? "w-14" : "w-56"}`}>

          {/* 로고 영역 */}
          <div className="flex items-center gap-2 px-4 py-4 border-b border-[#1e3a6e]">
            {!collapsed && (
              <span className="text-sm font-bold tracking-wide">KTSA Admin</span>
            )}
            <button
              onClick={() => setCollapsed(!collapsed)}
              className="ml-auto text-gray-400 hover:text-white text-lg leading-none"
            >
              {collapsed ? "▶" : "◀"}
            </button>
          </div>

          {/* 네비게이션 */}
          <nav className="flex-1 py-4 overflow-y-auto">
            {visibleNav.map((item) => {
              const active = pathname === item.href || (item.href !== "/admin" && pathname.startsWith(item.href));
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex items-center gap-3 px-4 py-2.5 text-sm transition-colors ${
                    active
                      ? "bg-[#1e3a6e] text-white font-semibold"
                      : "text-gray-300 hover:bg-[#1e3a6e]/60 hover:text-white"
                  }`}
                >
                  <span className="text-base w-5 text-center shrink-0">{item.icon}</span>
                  {!collapsed && <span>{item.label}</span>}
                </Link>
              );
            })}
          </nav>

          {/* 하단 유저 */}
          <div className="border-t border-[#1e3a6e] px-4 py-3 text-xs text-gray-400">
            {!collapsed ? (
              <div>
                <p className="font-semibold text-white text-sm">운영자</p>
                <p className="truncate">operator@ktsa.org</p>
                <Link href="/" className="mt-2 block text-gray-400 hover:text-white">← 사이트 보기</Link>
              </div>
            ) : (
              <span className="text-base">👤</span>
            )}
          </div>
        </aside>

        {/* ── 메인 콘텐츠 ── */}
        <div className="flex-1 flex flex-col overflow-hidden">
          {/* 상단 헤더 */}
          <header className="bg-white border-b border-gray-200 px-6 py-3 flex items-center justify-between shrink-0">
            <div className="text-xs text-gray-400">
              {pathname.split("/").filter(Boolean).join(" / ")}
            </div>
            <div className="flex items-center gap-3 text-sm text-gray-500">
              <span className="bg-[#1e3a6e] text-white text-xs px-2 py-0.5 rounded-full">운영자</span>
              <button className="hover:text-red-500 transition-colors">로그아웃</button>
            </div>
          </header>

          {/* 페이지 본문 */}
          <main className="flex-1 overflow-y-auto p-6">
            {children}
          </main>
        </div>
      </div>
  );
}
