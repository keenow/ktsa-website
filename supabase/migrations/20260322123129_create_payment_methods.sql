-- ============================================================
-- Migration: create_payment_methods
-- Phase: 2 (유료 회원 카드 등록)
-- Description: 토스페이먼츠 빌링키 기반 결제수단 테이블
-- ⚠️  실제 카드번호 절대 저장 금지 — 빌링키만 저장
-- ============================================================

CREATE TABLE IF NOT EXISTS public.payment_methods (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id         UUID NOT NULL REFERENCES public.profiles(id),

  -- 토스페이먼츠 발급 빌링키 (실제 카드번호 대체)
  billing_key     TEXT NOT NULL,
  pg_provider     TEXT NOT NULL DEFAULT 'tosspayments',

  -- 카드 표시 정보 (민감정보 아님)
  card_company    TEXT,           -- 카드사: 신한, 국민, 삼성, 현대 등
  card_last_four  CHAR(4),        -- 끝 4자리 (표시용)
  card_type       TEXT CHECK (card_type IN ('credit', 'debit', 'prepaid')),

  -- 기본 결제수단
  is_default      BOOLEAN NOT NULL DEFAULT FALSE,

  -- 상태 관리
  created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  deleted_at      TIMESTAMPTZ   -- NULL = 유효 / NOT NULL = 삭제된 카드
);

-- 인덱스
CREATE INDEX idx_payment_methods_user_id
  ON public.payment_methods (user_id)
  WHERE deleted_at IS NULL;

-- 기본 카드는 유저당 1개만 허용
CREATE UNIQUE INDEX idx_payment_methods_default
  ON public.payment_methods (user_id)
  WHERE is_default = TRUE AND deleted_at IS NULL;

-- RLS 활성화
ALTER TABLE public.payment_methods ENABLE ROW LEVEL SECURITY;

-- 본인 카드만 조회
CREATE POLICY "payment_methods_select_own"
  ON public.payment_methods
  FOR SELECT
  USING (auth.uid() = user_id);

-- 본인 카드만 등록
CREATE POLICY "payment_methods_insert_own"
  ON public.payment_methods
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- 본인 카드만 수정 (기본 카드 변경 등)
CREATE POLICY "payment_methods_update_own"
  ON public.payment_methods
  FOR UPDATE
  USING (auth.uid() = user_id);

-- 직접 삭제 금지 (soft delete만 허용, 서버 함수 경유)
-- DELETE 정책 없음

-- 코멘트
COMMENT ON TABLE public.payment_methods IS '토스페이먼츠 빌링키 기반 결제수단 — 카드번호 저장 없음';
COMMENT ON COLUMN public.payment_methods.billing_key IS '토스페이먼츠 발급 빌링키 — 정기결제/재결제 시 사용';
COMMENT ON COLUMN public.payment_methods.card_last_four IS '카드 끝 4자리 — UI 표시 전용';
