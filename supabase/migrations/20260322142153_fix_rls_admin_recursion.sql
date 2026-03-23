-- ============================================================
-- Migration: fix_rls_admin_recursion
-- 문제: profiles_select_admin 정책이 profiles 테이블을
--       자기 자신에서 조회 → 무한 재귀 발생
-- 해결: SECURITY DEFINER 함수로 RLS 우회하여 관리자 확인
-- ============================================================

-- 기존 순환 정책 제거
DROP POLICY IF EXISTS "profiles_select_admin" ON public.profiles;

-- SECURITY DEFINER 함수 — RLS를 우회하므로 재귀 없음
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.profiles
    WHERE id = auth.uid()
      AND membership_grade = 'admin'
      AND deleted_at IS NULL
  );
$$;

-- 수정된 관리자 정책 — 함수 사용으로 재귀 제거
CREATE POLICY "profiles_select_admin"
  ON public.profiles
  FOR SELECT
  USING (public.is_admin());
