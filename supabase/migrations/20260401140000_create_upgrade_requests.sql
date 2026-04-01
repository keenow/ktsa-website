-- upgrade_requests 테이블
-- 준회원의 정회원/기업회원 업그레이드 신청 데이터 저장

CREATE TABLE upgrade_requests (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id       UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  request_type  TEXT NOT NULL CHECK (request_type IN ('regular', 'corporate')),
  status        TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')),

  -- 정회원 필드
  race_name         TEXT,
  race_date         DATE,
  wants_insurance   BOOLEAN DEFAULT FALSE,

  -- 기업회원 필드
  company_name      TEXT,
  biz_number        TEXT,
  manager_name      TEXT,
  phone             TEXT,

  created_at    TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at    TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- RLS 활성화
ALTER TABLE upgrade_requests ENABLE ROW LEVEL SECURITY;

-- 본인 신청 내역 조회 허용
CREATE POLICY "본인 신청 조회" ON upgrade_requests
  FOR SELECT USING (auth.uid() = user_id);

-- 본인 신청 생성 허용 (pending 상태만)
CREATE POLICY "본인 신청 생성" ON upgrade_requests
  FOR INSERT WITH CHECK (auth.uid() = user_id AND status = 'pending');

-- updated_at 자동 갱신 트리거
CREATE OR REPLACE FUNCTION set_updated_at()
RETURNS TRIGGER LANGUAGE plpgsql AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$;

CREATE TRIGGER upgrade_requests_updated_at
  BEFORE UPDATE ON upgrade_requests
  FOR EACH ROW EXECUTE FUNCTION set_updated_at();
