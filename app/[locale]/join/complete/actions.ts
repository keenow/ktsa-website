/**
 * @file 온보딩 프로필 저장 Server Action
 * @description 이메일 인증 완료 후 추가 프로필 정보(이름·전화번호·생년월일·성별)를
 *              supabaseAdmin으로 profiles 테이블에 UPDATE 한다.
 * @module auth
 */

"use server"

import { redirect } from "next/navigation"
import { getTranslations } from "next-intl/server"
import { createSupabaseServerClient } from "@/lib/supabase-server"
import { supabaseAdmin } from "@/lib/supabase-admin"

/**
 * 온보딩 프로필 저장
 * @param _prev - 이전 상태 (useActionState 호환)
 * @param formData - 폼 데이터 (locale, name, phone, birth_date, gender)
 * @returns 에러 메시지 문자열, 또는 성공 시 redirect
 */
export async function saveOnboardingProfile(
  _prev: string | null,
  formData: FormData
): Promise<string | null> {
  const locale = (formData.get("locale") as string | null) || "ko"
  const t = await getTranslations({ locale, namespace: "join_complete" })

  // ─── 현재 로그인 유저 확인 ──────────────────────────────
  const supabase = await createSupabaseServerClient()
  const {
    data: { user },
    error: sessionError,
  } = await supabase.auth.getUser()

  if (sessionError || !user) {
    return t("err_no_session")
  }

  // ─── 입력값 추출 및 기본 검증 ───────────────────────────
  const name = (formData.get("name") as string | null)?.trim()
  const phone = (formData.get("phone") as string | null)?.trim()
  const birth_date = (formData.get("birth_date") as string | null)?.trim()
  const gender = (formData.get("gender") as string | null)?.trim()

  if (!name) return t("err_no_name")
  if (!phone) return t("err_no_phone")
  if (!birth_date) return t("err_no_birth")
  if (!gender) return t("err_no_gender")

  // 국제 전화번호 형식 최소 검증: +국가코드 로컬번호
  if (!phone.startsWith("+") || phone.replace(/\D/g, "").length < 7) {
    return t("err_invalid_phone")
  }

  // 날짜 유효성 검증 — 2월 31일 등 존재하지 않는 날짜 방지
  const parsedDate = new Date(birth_date)
  if (
    isNaN(parsedDate.getTime()) ||
    parsedDate.toISOString().slice(0, 10) !== birth_date
  ) {
    return t("err_invalid_date")
  }

  // ─── profiles UPDATE (RLS 우회: supabaseAdmin 필수) ──────
  // NOTE: profiles INSERT/UPDATE는 반드시 supabaseAdmin 사용 (RLS 정책 때문)
  const { error: updateError } = await supabaseAdmin
    .from("profiles")
    .update({ name, phone, birth_date, gender })
    .eq("id", user.id)

  if (updateError) {
    console.error(
      "[join/complete/actions] profiles 업데이트 실패",
      updateError.message
    )
    return t("err_save_failed")
  }

  redirect(`/${locale}/my/dashboard`)
}
