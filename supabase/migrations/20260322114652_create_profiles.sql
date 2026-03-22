-- ============================================================
-- Migration: create_profiles
-- Phase: 2
-- Description: KTSA 회원 프로필 테이블 생성
-- ============================================================

CREATE TABLE IF NOT EXISTS public.profiles (
  -- 기본 식별자 (auth.users.id 와 동일한 UUID)
  id              UUID PRIMARY KEY,

  -- 개인정보 (탈퇴 시 소각 대상)
  email           TEXT,
  name            TEXT,
  phone           TEXT,
  birth_date      DATE,
  gender          TEXT CHECK (gender IN ('M', 'F', 'OTHER')),

  -- KTSA 고유 정보
  club            TEXT,                                  -- 소속 클럽
  membership_grade TEXT NOT NULL DEFAULT 'general'
                    CHECK (membership_grade IN ('general', 'member', 'admin')),

  -- 상태 관리
  is_active       BOOLEAN NOT NULL DEFAULT TRUE,
  deleted_at      TIMESTAMPTZ,                          -- NULL = 활성 회원

  -- 타임스탬프
  created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- updated_at 자동 갱신 트리거
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER profiles_updated_at
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- 인덱스
CREATE INDEX idx_profiles_email ON public.profiles (email) WHERE deleted_at IS NULL;
CREATE INDEX idx_profiles_deleted_at ON public.profiles (deleted_at);

-- 코멘트
COMMENT ON TABLE public.profiles IS 'KTSA 회원 프로필 — PII 소각 방식 탈퇴 처리';
COMMENT ON COLUMN public.profiles.deleted_at IS 'NULL = 활성 회원 / NOT NULL = 탈퇴 처리됨';
COMMENT ON COLUMN public.profiles.email IS '탈퇴 시 deleted_{uuid}@deleted.ktsa.or.kr 으로 대체';
