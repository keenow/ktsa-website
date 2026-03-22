-- ============================================================
-- Migration: create_rls_policies
-- Phase: 2
-- Description: Row Level Security 정책 설정
-- ============================================================

-- RLS 활성화
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- ① 본인 프로필만 조회 가능
CREATE POLICY "profiles_select_own"
  ON public.profiles
  FOR SELECT
  USING (auth.uid() = id);

-- ② 본인 프로필만 수정 가능
CREATE POLICY "profiles_update_own"
  ON public.profiles
  FOR UPDATE
  USING (auth.uid() = id);

-- ③ 신규 회원 가입 시 본인 레코드 생성 가능
CREATE POLICY "profiles_insert_own"
  ON public.profiles
  FOR INSERT
  WITH CHECK (auth.uid() = id);

-- ④ 삭제는 직접 금지 (탈퇴는 서버 함수로만 처리)
-- DELETE 정책 없음 = 클라이언트에서 직접 삭제 불가

-- ⑤ 관리자는 전체 조회 가능
CREATE POLICY "profiles_select_admin"
  ON public.profiles
  FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles p
      WHERE p.id = auth.uid()
        AND p.membership_grade = 'admin'
        AND p.deleted_at IS NULL
    )
  );
