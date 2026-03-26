/**
 * @file 마이페이지 대시보드
 * @description 로그인한 회원의 프로필, 등급, 업그레이드 안내를 표시하는 대시보드 페이지
 * @module member
 */

"use client";

import { useEffect, useState } from "react";
import { useLocale, useTranslations } from "next-intl";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { supabase } from "@/lib/supabase";
import { isProfileIncomplete } from "@/lib/profile-completion";

type MembershipGrade = "general" | "member" | "admin";

interface Profile {
  name: string | null;
  email: string | null;
  membership_grade: MembershipGrade | null;
}

/**
 * 마이페이지 대시보드 컴포넌트
 * @description 로그인 여부 확인 후 회원 프로필과 등급별 UI를 렌더링
 * @returns 대시보드 페이지 JSX
 */
export default function MyDashboard() {
  const locale = useLocale();
  const router = useRouter();
  const t = useTranslations("dashboard");

  // ─── 상태 관리 ─────────────────────────────────────
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);

  // ─── 사이드 이펙트 ──────────────────────────────────
  useEffect(() => {
    (async () => {
      // NOTE: 세션 유효성 검증 — 비로그인 사용자는 로그인 페이지로 리다이렉트
      const { data: { user } } = await supabase.auth.getUser();

      if (!user) {
        router.replace("/ko/my/login");
        return;
      }

      // NOTE: createBrowserClient 사용 — 일반 회원 본인 프로필 조회는 RLS 허용 범위
      const { data } = await supabase
        .from("profiles")
        .select("name, email, membership_grade, birth_date, phone")
        .eq("id", user.id)
        .maybeSingle();

      if (
        isProfileIncomplete({
          name: data?.name ?? null,
          birth_date: data?.birth_date ?? null,
          phone: data?.phone ?? null,
        })
      ) {
        router.replace(`/${locale}/my/complete-profile`);
        return;
      }

      setProfile({
        name: data?.name ?? null,
        email: data?.email ?? user.email ?? null,
        membership_grade: (data?.membership_grade as MembershipGrade) ?? "general",
      });
      setLoading(false);
    })();
  }, [router, locale]);

  // ─── 이벤트 핸들러 ──────────────────────────────────

  /**
   * 로그아웃 처리
   * @returns void (로그아웃 후 홈으로 이동)
   */
  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push(`/${locale}`);
  };

  // ─── 렌더링 ─────────────────────────────────────────
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-[#1e3a6e] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  const grade = profile?.membership_grade ?? "general";
  const gradeLabel = t(`grade_${grade}` as "grade_general" | "grade_member" | "grade_admin");
  const isAssociate = grade === "general";

  const benefits = [
    t("upgrade_benefit_1"),
    t("upgrade_benefit_2"),
    t("upgrade_benefit_3"),
    t("upgrade_benefit_4"),
    t("upgrade_benefit_5"),
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* 헤더 */}
      <div className="bg-[#1e3a6e] text-white px-4 py-8">
        <div className="max-w-xl mx-auto">
          <p className="text-blue-200 text-sm mb-1">{t("greeting")}</p>
          <h1 className="text-xl font-bold">{profile?.name ?? profile?.email ?? ""}</h1>
          <span className="mt-2 inline-block text-xs bg-white/20 px-2.5 py-1 rounded-full">
            {gradeLabel}
          </span>
        </div>
      </div>

      <div className="max-w-xl mx-auto px-4 py-8 space-y-4">

        {/* 정회원 업그레이드 카드 */}
        {isAssociate && (
          <div className="bg-white rounded-xl border-2 border-[#1e3a6e]/30 p-5">
            <div className="flex items-start justify-between mb-3">
              <div>
                <h2 className="font-bold text-gray-900">
                  {t("upgrade_title")}
                </h2>
                <p className="text-sm text-gray-500 mt-0.5">
                  {locale === "ko" ? "연 150,000원" : "₩150,000 / year"}
                </p>
              </div>
              <span className="text-2xl">🏅</span>
            </div>
            <ul className="text-sm text-gray-600 space-y-1.5 mb-4">
              {benefits.map((b) => (
                <li key={b} className="flex items-center gap-2">
                  <span className="text-[#1e3a6e] text-xs">✓</span>
                  {b}
                </li>
              ))}
            </ul>
            <p className="text-xs text-amber-600 mb-4">
              {t("upgrade_notice")}
            </p>
            <Link
              href={`/${locale}/my/upgrade`}
              className="block w-full text-center bg-[#1e3a6e] text-white rounded-lg py-2.5 text-sm font-semibold hover:bg-[#152d57] transition-colors"
            >
              {t("upgrade_apply")}
            </Link>
          </div>
        )}

        {/* 내 정보 카드 */}
        <div className="bg-white rounded-xl border border-gray-200 p-5">
          <h2 className="font-bold text-gray-900 mb-3">
            {t("my_profile")}
          </h2>
          <div className="space-y-2 text-sm text-gray-600">
            <div className="flex justify-between">
              <span className="text-gray-400">{t("label_name")}</span>
              <span>{profile?.name ?? "-"}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-400">{t("label_email")}</span>
              <span>{profile?.email ?? "-"}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-400">{t("label_grade")}</span>
              <span className="font-medium text-gray-700">{gradeLabel}</span>
            </div>
          </div>
          <Link
            href={`/${locale}/my/profile`}
            className="mt-4 block text-sm text-[#1e3a6e] hover:underline"
          >
            {t("edit_profile")}
          </Link>
        </div>

        {/* 로그아웃 */}
        <button
          onClick={handleLogout}
          className="w-full text-sm text-gray-400 hover:text-gray-600 py-2"
        >
          {t("sign_out")}
        </button>

      </div>
    </div>
  );
}
