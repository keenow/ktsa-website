/**
 * @file 글로벌 헤더 컴포넌트
 * @description 내비게이션, 언어 전환, 로그인/로그아웃, 사용자 드롭다운을 포함하는 최상단 헤더
 * @module ui
 */
"use client";

import { useTranslations, useLocale } from "next-intl";
import { useRouter, usePathname } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { useState, useEffect, useRef } from "react";
import { supabase } from "@/lib/supabase";
import type { User } from "@supabase/supabase-js";

export default function Header() {
  const t = useTranslations("nav");
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();

  // ─── 상태 관리 ─────────────────────────────────────
  const [menuOpen, setMenuOpen] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // ─── 사이드 이펙트 ──────────────────────────────────

  useEffect(() => {
    // getSession reads locally — no network round-trip, so auth state is
    // available immediately on first render.
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    return () => subscription.unsubscribe();
  }, []);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const navLinks = [
    { href: `/${locale}`, label: t("home") },
    { href: `/${locale}/about`, label: t("about") },
    { href: `/${locale}/races`, label: t("races") },
    { href: `/${locale}/news`, label: t("news") },
    { href: `/${locale}/contact`, label: t("contact") },
  ];

  // ─── 이벤트 핸들러 ──────────────────────────────────

  /**
   * 언어 전환 — 현재 경로의 로케일 세그먼트를 교체해 이동
   * @param newLocale - 'ko' | 'en'
   */
  const switchLocale = (newLocale: string) => {
    const segments = pathname.split("/");
    segments[1] = newLocale;
    router.push(segments.join("/"));
  };

  /**
   * 로그아웃 처리 — Supabase 세션 종료 후 홈으로 리다이렉트
   */
  const handleLogout = async () => {
    await supabase.auth.signOut();
    setDropdownOpen(false);
    setMenuOpen(false);
    router.push(`/${locale}`);
  };

  // Derive avatar display info
  const avatarUrl = user?.user_metadata?.avatar_url as string | undefined;
  const fullName = (user?.user_metadata?.full_name ?? user?.user_metadata?.name ?? user?.email ?? "") as string;
  const initials = fullName.trim().charAt(0).toUpperCase() || "U";

  const AvatarButton = ({ onClick }: { onClick: () => void }) => (
    <button
      onClick={onClick}
      className="flex items-center justify-center w-8 h-8 rounded-full bg-[#1e3a6e] text-white text-sm font-semibold overflow-hidden focus:outline-none focus:ring-2 focus:ring-[#1e3a6e] focus:ring-offset-1"
      aria-label="User menu"
    >
      {avatarUrl ? (
        <Image src={avatarUrl} alt={fullName} width={32} height={32} className="w-full h-full object-cover" />
      ) : (
        initials
      )}
    </button>
  );

  return (
    <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href={`/${locale}`} className="flex items-center">
            <Image
              src="/ktsa-logo.jpg"
              alt="KTSA — Korea Trail Sports Association"
              width={120}
              height={48}
              className="h-10 w-auto object-contain"
              priority
            />
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-6">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-sm text-gray-600 hover:text-[#1e3a6e] transition-colors"
              >
                {link.label}
              </Link>
            ))}
          </nav>

          {/* Language Toggle + Auth */}
          <div className="flex items-center gap-2">
            <div className="flex rounded-lg border border-gray-200 overflow-hidden text-xs">
              <button
                onClick={() => switchLocale("ko")}
                className={`px-3 py-1.5 transition-colors ${
                  locale === "ko"
                    ? "bg-[#1e3a6e] text-white"
                    : "text-gray-600 hover:bg-gray-50"
                }`}
              >
                KO
              </button>
              <button
                onClick={() => switchLocale("en")}
                className={`px-3 py-1.5 transition-colors ${
                  locale === "en"
                    ? "bg-[#1e3a6e] text-white"
                    : "text-gray-600 hover:bg-gray-50"
                }`}
              >
                EN
              </button>
            </div>

            {user ? (
              /* Logged in: avatar + dropdown (desktop) */
              <div className="relative hidden md:block" ref={dropdownRef}>
                <AvatarButton onClick={() => setDropdownOpen(!dropdownOpen)} />
                {dropdownOpen && (
                  <div className="absolute right-0 mt-2 w-40 bg-white border border-gray-200 rounded-lg shadow-lg py-1 z-50">
                    <Link
                      href={`/${locale}/my/dashboard`}
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 hover:text-[#1e3a6e]"
                      onClick={() => setDropdownOpen(false)}
                    >
                      {t("mypage")}
                    </Link>
                    <button
                      onClick={handleLogout}
                      className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 hover:text-red-600"
                    >
                      {t("logout")}
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <>
                {/* 회원가입 버튼 */}
                <Link
                  href={`/${locale}/my/register`}
                  className="hidden md:inline-block text-xs bg-[#1e3a6e] text-white px-3 py-1.5 rounded-lg hover:bg-[#16305c] transition-colors"
                >
                  {t("register")}
                </Link>

                {/* 로그인 버튼 */}
                <Link
                  href={`/${locale}/my/login`}
                  className="hidden md:inline-block text-xs border border-[#1e3a6e] text-[#1e3a6e] px-3 py-1.5 rounded-lg hover:bg-[#1e3a6e] hover:text-white transition-colors"
                >
                  {t("login")}
                </Link>
              </>
            )}

            {/* Mobile menu toggle */}
            <button
              className="md:hidden p-2 text-gray-600"
              onClick={() => setMenuOpen(!menuOpen)}
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                {menuOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>
        </div>

        {/* Mobile Nav */}
        {menuOpen && (
          <nav className="md:hidden border-t border-gray-100 py-3 flex flex-col gap-1">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="px-2 py-2 text-sm text-gray-700 hover:text-[#1e3a6e] hover:bg-gray-50 rounded"
                onClick={() => setMenuOpen(false)}
              >
                {link.label}
              </Link>
            ))}
            <div className="border-t border-gray-100 mt-2 pt-2 flex flex-col gap-1">
              {user ? (
                <>
                  {/* Mobile: avatar info row */}
                  <div className="flex items-center gap-2 px-2 py-2">
                    <div className="flex items-center justify-center w-8 h-8 rounded-full bg-[#1e3a6e] text-white text-sm font-semibold overflow-hidden shrink-0">
                      {avatarUrl ? (
                        <Image src={avatarUrl} alt={fullName} width={32} height={32} className="w-full h-full object-cover" />
                      ) : (
                        initials
                      )}
                    </div>
                    <span className="text-sm text-gray-700 truncate">{fullName || user.email}</span>
                  </div>
                  <Link
                    href={`/${locale}/my/dashboard`}
                    className="px-2 py-2 text-sm font-medium text-[#1e3a6e] border border-[#1e3a6e] rounded text-center"
                    onClick={() => setMenuOpen(false)}
                  >
                    {t("mypage")}
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="px-2 py-2 text-sm text-red-600 border border-red-200 rounded text-center"
                  >
                    {t("logout")}
                  </button>
                </>
              ) : (
                <>
                  <Link
                    href={`/${locale}/my/register`}
                    className="px-2 py-2 text-sm font-medium text-white bg-[#1e3a6e] rounded text-center"
                    onClick={() => setMenuOpen(false)}
                  >
                    {t("register")}
                  </Link>
                  <Link
                    href={`/${locale}/my/login`}
                    className="px-2 py-2 text-sm text-[#1e3a6e] border border-[#1e3a6e] rounded text-center"
                    onClick={() => setMenuOpen(false)}
                  >
                    {t("login")}
                  </Link>
                </>
              )}
            </div>
          </nav>
        )}
      </div>
    </header>
  );
}
