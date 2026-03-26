/**
 * @file 온보딩 프로필 저장 Server Action
 * @description 이메일 인증 완료 후 추가 프로필 정보(이름·전화번호·생년월일·성별·클럽)를
 *              supabaseAdmin으로 profiles 테이블에 UPDATE 한다.
 * @module auth
 */

"use server"

import { redirect } from "next/navigation"
import { createSupabaseServerClient } from "@/lib/supabase-server"
import { supabaseAdmin } from "@/lib/supabase-admin"

/**
 * 온보딩 프로필 저장
 * @param _prev - 이전 상태 (useActionState 호환)
 * @param formData - 폼 데이터 (name, phone, birth_date, gender, club)
 * @returns 에러 메시지 문자열, 또는 성공 시 redirect
 */
export async function saveOnboardingProfile(
  _prev: string | null,
  formData: FormData
): Promise<string | null> {
  // ─── 현재 로그인 유저 확인 ──────────────────────────────
  const supabase = await createSupabaseServerClient()
  const {
    data: { user },
    error: sessionError,
  } = await supabase.auth.getUser()

  if (sessionError || !user) {
    return "로그인 세션이 없습니다. 다시 로그인해주세요."
  }

  // ─── 입력값 추출 및 기본 검증 ───────────────────────────
  const name = (formData.get("name") as string | null)?.trim()
  const phone = (formData.get("phone") as string | null)?.trim()
  const birth_date = (formData.get("birth_date") as string | null)?.trim()
  const gender = (formData.get("gender") as string | null)?.trim()
  const club = (formData.get("club") as string | null)?.trim() || null

  if (!name) return "이름을 입력해주세요."
  if (!phone) return "전화번호를 입력해주세요."
  if (!birth_date) return "생년월일을 입력해주세요."
  if (!gender) return "성별을 선택해주세요."

  const phoneRegex = /^01[0-9]-\d{3,4}-\d{4}$/
  if (!phoneRegex.test(phone)) {
    return "전화번호 형식이 올바르지 않습니다. (예: 010-0000-0000)"
  }

  // ─── profiles UPDATE (RLS 우회: supabaseAdmin 필수) ──────
  // NOTE: profiles INSERT/UPDATE는 반드시 supabaseAdmin 사용 (RLS 정책 때문)
  const { error: updateError } = await supabaseAdmin
    .from("profiles")
    .update({ name, phone, birth_date, gender, club })
    .eq("id", user.id)

  if (updateError) {
    console.error(
      "[join/complete/actions] profiles 업데이트 실패",
      updateError.message
    )
    return "프로필 저장 중 오류가 발생했습니다. 잠시 후 다시 시도해주세요."
  }

  redirect("/ko/my/dashboard")
}
