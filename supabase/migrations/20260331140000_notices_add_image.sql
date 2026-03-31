-- ============================================================
-- Migration: notices_add_image
-- Description: notices 테이블에 image_url 컬럼 추가
--              + Supabase Storage notice-images 버킷 생성
-- ============================================================

-- 이미지 URL 컬럼 추가
ALTER TABLE public.notices ADD COLUMN IF NOT EXISTS image_url TEXT;

-- Storage 버킷 생성 (공개 읽기)
INSERT INTO storage.buckets (id, name, public)
VALUES ('notice-images', 'notice-images', TRUE)
ON CONFLICT (id) DO NOTHING;

-- Storage RLS: 공개 읽기
CREATE POLICY "notice_images_public_read"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'notice-images');

-- Storage RLS: 관리자만 업로드/삭제
CREATE POLICY "notice_images_admin_insert"
  ON storage.objects FOR INSERT
  WITH CHECK (
    bucket_id = 'notice-images'
    AND EXISTS (
      SELECT 1 FROM public.profiles p
      WHERE p.id = auth.uid()
        AND p.membership_grade = 'admin'
        AND p.deleted_at IS NULL
    )
  );

CREATE POLICY "notice_images_admin_delete"
  ON storage.objects FOR DELETE
  USING (
    bucket_id = 'notice-images'
    AND EXISTS (
      SELECT 1 FROM public.profiles p
      WHERE p.id = auth.uid()
        AND p.membership_grade = 'admin'
        AND p.deleted_at IS NULL
    )
  );
