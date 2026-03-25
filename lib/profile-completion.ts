/**
 * @file 프로필 필수 항목 완성 여부 판별
 * @description 회원가입 1단계(이메일·비밀번호) 이후 추가 입력이 필요한지 판단
 * @module member
 */

export type ProfileCompletionFields = {
  name: string | null
  birth_date: string | null
  phone: string | null
}

/**
 * 이름·생년월일·휴대전화 중 하나라도 비어 있으면 추가 입력이 필요함
 * @param p - profiles 행의 일부 필드 (또는 null)
 * @returns true면 `/my/complete-profile` 유도 대상
 */
export function isProfileIncomplete(
  p: ProfileCompletionFields | null | undefined
): boolean {
  if (!p) return true
  const nameOk = !!(p.name && String(p.name).trim())
  const birthOk = !!p.birth_date
  const phoneOk = !!(p.phone && String(p.phone).trim())
  return !(nameOk && birthOk && phoneOk)
}
