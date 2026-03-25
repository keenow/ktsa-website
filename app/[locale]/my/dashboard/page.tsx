/**
 * @file 마이페이지 대시보드
 * @description 로그인한 회원의 프로필, 등급, 업그레이드 안내를 표시하는 대시보드 페이지
 * @module member
 */

"use client";

import { useEffect, useState } from "react";
import { useLocale } from "next-intl";
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

const GRADE_LABEL: Record<MembershipGrade, { ko: string; en: string }> = {
  general: { ko: "준회원", en: "Associate Member" },
  member:  { ko: "정회원", en: "Regular Member" },
  admin:   { ko: "관리자", en: "Admin" },
};

/**
 * 마이페이지 대시보드 컴포넌트
 * @description 로그인 여부 확인 후 회원 프로필과 등급별 UI를 렌더링
 * @returns 대시보드 페이지 JSX
 */
export default function MyDashboard() {
  const locale = useLocale();
  const router = useRouter();
  const isKo = locale === "ko";

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
  const gradeLabel = isKo ? GRADE_LABEL[grade].ko : GRADE_LABEL[grade].en;
  const isAssociate = grade === "general";

  return (
    <div className="min-h-screen bg-gray-50">
      {/* 헤더 */}
      <div className="bg-[#1e3a6e] text-white px-4 py-8">
        <div className="max-w-xl mx-auto">
          <p className="text-blue-200 text-sm mb-1">{isKo ? "안녕하세요" : "Welcome"}</p>
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
                  {isKo ? "정회원으로 업그레이드" : "Upgrade to Regular Member"}
                </h2>
                <p className="text-sm text-gray-500 mt-0.5">
                  {isKo ? "연 150,000원" : "₩150,000 / year"}
                </p>
              </div>
              <span className="text-2xl">🏅</span>
            </div>
            <ul className="text-sm text-gray-600 space-y-1.5 mb-4">
              {(isKo ? [
                "대회 참가비 10% 할인",
                "ITRA 가입 자격 부여",
                "보험 가입 대행 서비스",
                "스탭·심판 교육 참여 자격",
                "3사 공동 사전예매",
              ] : [
                "10% race entry discount",
                "ITRA membership eligibility",
                "Insurance enrollment service",
                "Staff & referee training access",
                "Priority registration",
              ]).map((b) => (
                <li key={b} className="flex items-center gap-2">
                  <span className="text-[#1e3a6e] text-xs">✓</span>
                  {b}
                </li>
              ))}
            </ul>
            <p className="text-xs text-amber-600 mb-4">
              {isKo
                ? "⚠ 협회 인정 대회 참여 경험이 있는 분만 신청 가능합니다."
                : "⚠ Requires prior experience at a recognized race."}
            </p>
            <Link
              href={`/${locale}/my/upgrade`}
              className="block w-full text-center bg-[#1e3a6e] text-white rounded-lg py-2.5 text-sm font-semibold hover:bg-[#152d57] transition-colors"
            >
              {isKo ? "업그레이드 신청" : "Apply for Upgrade"}
            </Link>
          </div>
        )}

        {/* 내 정보 카드 */}
        <div className="bg-white rounded-xl border border-gray-200 p-5">
          <h2 className="font-bold text-gray-900 mb-3">
            {isKo ? "내 정보" : "My Profile"}
          </h2>
          <div className="space-y-2 text-sm text-gray-600">
            <div className="flex justify-between">
              <span className="text-gray-400">{isKo ? "이름" : "Name"}</span>
              <span>{profile?.name ?? "-"}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-400">{isKo ? "이메일" : "Email"}</span>
              <span>{profile?.email ?? "-"}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-400">{isKo ? "회원 등급" : "Grade"}</span>
              <span className="font-medium text-gray-700">{gradeLabel}</span>
            </div>
          </div>
          <Link
            href={`/${locale}/my/profile`}
            className="mt-4 block text-sm text-[#1e3a6e] hover:underline"
          >
            {isKo ? "정보 수정 →" : "Edit profile →"}
          </Link>
        </div>

        {/* 로그아웃 */}
        <button
          onClick={handleLogout}
          className="w-full text-sm text-gray-400 hover:text-gray-600 py-2"
        >
          {isKo ? "로그아웃" : "Sign out"}
        </button>

      </div>
    </div>
  );
}
