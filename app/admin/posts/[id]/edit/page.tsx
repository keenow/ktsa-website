"use client";

/**
 * @file 관리자 공지 수정 페이지
 * @module admin
 */

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import NoticeForm, { type NoticeFormData } from "../../_components/NoticeForm";

type NoticeRow = {
  id: string;
  category: string;
  title_ko: string;
  title_en: string;
  body_ko: string;
  body_en: string;
  badge_ko: string | null;
  badge_en: string | null;
  url: string | null;
  image_url: string | null;
  is_published: boolean;
  pinned: boolean;
};

export default function EditNoticePage() {
  const router = useRouter();
  const { id } = useParams<{ id: string }>();
  const [notice, setNotice] = useState<NoticeRow | null>(null);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    fetch(`/api/admin/notices/${id}`)
      .then(r => r.json())
      .then(data => setNotice(data));
  }, [id]);

  async function handleSubmit(data: NoticeFormData) {
    setSaving(true);
    setError("");

    try {
      // ─── 이미지 업로드 (서버 API → supabaseAdmin RLS 우회) ─
      let imageUrl = notice?.image_url ?? null;
      if (data.imageFile) {
        const imgForm = new FormData();
        imgForm.append("file", data.imageFile);
        const imgRes = await fetch("/api/admin/notices/upload-image", { method: "POST", body: imgForm });
        if (!imgRes.ok) {
          const e = await imgRes.json().catch(() => ({}));
          throw new Error("이미지 업로드 실패: " + (e.error ?? imgRes.statusText));
        }
        const { url } = await imgRes.json();
        imageUrl = url;
      }
      if (data.removeImage) imageUrl = null;

      // ─── DB 업데이트 (API 라우트 → supabaseAdmin) ─────────
      const res = await fetch(`/api/admin/notices/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          category:     data.category,
          title_ko:     data.title_ko,
          title_en:     data.title_en,
          body_ko:      data.body_ko,
          body_en:      data.body_en,
          badge_ko:     data.badge_ko || null,
          badge_en:     data.badge_en || null,
          url:          data.url || null,
          is_published: data.is_published,
          pinned:       data.pinned,
          image_url:    imageUrl,
        }),
      });

      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error("저장 실패: " + (err.error ?? res.statusText));
      }

      router.push("/admin/posts");

    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : "알 수 없는 오류가 발생했습니다.");
      setSaving(false);
    }
  }

  if (!notice) return <div className="text-sm text-gray-400 p-8">불러오는 중...</div>;

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">공지 수정</h1>
        <p className="text-sm text-gray-400 mt-1">저장 즉시 홈페이지에 반영됩니다</p>
      </div>
      {error && <p className="mb-4 text-sm text-red-500 bg-red-50 px-4 py-2 rounded-lg">{error}</p>}
      <NoticeForm
        saving={saving}
        initialData={notice}
        onSubmit={handleSubmit}
        onCancel={() => router.push("/admin/posts")}
      />
    </div>
  );
}
