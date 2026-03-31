-- ============================================================
-- Migration: create_notices
-- Description: KTSA 공지사항 테이블 생성
-- ============================================================

CREATE TABLE IF NOT EXISTS public.notices (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),

  -- 분류
  category      TEXT NOT NULL DEFAULT 'notice'
                  CHECK (category IN ('notice', 'news', 'result')),

  -- 내용 (한/영)
  title_ko      TEXT NOT NULL,
  title_en      TEXT NOT NULL DEFAULT '',
  body_ko       TEXT NOT NULL,
  body_en       TEXT NOT NULL DEFAULT '',

  -- 배지 (선택)
  badge_ko      TEXT,
  badge_en      TEXT,

  -- 외부 링크 (선택)
  url           TEXT,

  -- 상태
  is_published  BOOLEAN NOT NULL DEFAULT TRUE,
  pinned        BOOLEAN NOT NULL DEFAULT FALSE,

  -- 작성자
  created_by    UUID REFERENCES public.profiles(id),

  -- 타임스탬프
  created_at    TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at    TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- updated_at 자동 갱신 트리거
CREATE TRIGGER notices_updated_at
  BEFORE UPDATE ON public.notices
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- 인덱스
CREATE INDEX idx_notices_published ON public.notices (is_published, created_at DESC);
CREATE INDEX idx_notices_pinned ON public.notices (pinned, created_at DESC);

-- RLS
ALTER TABLE public.notices ENABLE ROW LEVEL SECURITY;

-- 공개 조회: 누구나 published 공지 읽기 가능
CREATE POLICY "notices_select_published"
  ON public.notices
  FOR SELECT
  USING (is_published = TRUE);

-- 관리자만 INSERT/UPDATE/DELETE 가능
CREATE POLICY "notices_admin_insert"
  ON public.notices
  FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.profiles p
      WHERE p.id = auth.uid()
        AND p.membership_grade = 'admin'
        AND p.deleted_at IS NULL
    )
  );

CREATE POLICY "notices_admin_update"
  ON public.notices
  FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles p
      WHERE p.id = auth.uid()
        AND p.membership_grade = 'admin'
        AND p.deleted_at IS NULL
    )
  );

CREATE POLICY "notices_admin_delete"
  ON public.notices
  FOR DELETE
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles p
      WHERE p.id = auth.uid()
        AND p.membership_grade = 'admin'
        AND p.deleted_at IS NULL
    )
  );

-- 코멘트
COMMENT ON TABLE public.notices IS 'KTSA 공지사항 — 관리자 패널에서 관리';
