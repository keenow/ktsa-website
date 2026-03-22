-- ============================================================
-- Migration: update_profiles_verification
-- Phase: 2
-- Description: 전화번호 국제 형식 + 인증 필드 추가
-- ============================================================

-- 전화번호 국제 형식 (E.164)
ALTER TABLE public.profiles
  ADD COLUMN IF NOT EXISTS phone_country_code TEXT DEFAULT '+82',  -- 국가 코드
  ADD COLUMN IF NOT EXISTS phone_verified      BOOLEAN NOT NULL DEFAULT FALSE,
  ADD COLUMN IF NOT EXISTS email_verified      BOOLEAN NOT NULL DEFAULT FALSE;

-- 코멘트
COMMENT ON COLUMN public.profiles.phone IS 'E.164 형식 — 예: 01012345678 (국가코드 제외 로컬 번호)';
COMMENT ON COLUMN public.profiles.phone_country_code IS '국가 코드 — 예: +82(한국), +1(미국)';
COMMENT ON COLUMN public.profiles.phone_verified IS '전화번호 OTP 인증 완료 여부';
COMMENT ON COLUMN public.profiles.email_verified IS '이메일 인증 완료 여부';
