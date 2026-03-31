"use client";

/**
 * @file 관리자 공지 작성 페이지
 * @module admin
 */

import { useState } from "react";
import { useRouter } from "next/navigation";
import NoticeForm, { type NoticeFormData } from "../_components/NoticeForm";

export default function NewNoticePage() {
  const router = useRouter();
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(data: NoticeFormData) {
    setSaving(true);
    setError("");

    // ─── 이미지 업로드 (서버 API → supabaseAdmin RLS 우회) ─
    let imageUrl: string | null = null;
    if (data.imageFile) {
      const imgForm = new FormData();
      imgForm.append("file", data.imageFile);
      const imgRes = await fetch("/api/admin/notices/upload-image", { method: "POST", body: imgForm });
      if (!imgRes.ok) { const e = await imgRes.json().catch(() => ({})); setError("이미지 업로드 실패: " + (e.error ?? "unknown")); setSaving(false); return; }
      const { url } = await imgRes.json();
      imageUrl = url;
    }

    // ─── DB 저장 (API 라우트 → supabaseAdmin) ─────────────
    const res = await fetch("/api/admin/notices", {
      method: "POST",
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
      setError("저장 실패: " + (err.error ?? res.statusText));
      setSaving(false);
      return;
    }

    router.push("/admin/posts");
  }

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">새 공지 작성</h1>
        <p className="text-sm text-gray-400 mt-1">작성 후 즉시 홈페이지에 반영됩니다</p>
      </div>
      {error && <p className="mb-4 text-sm text-red-500 bg-red-50 px-4 py-2 rounded-lg">{error}</p>}
      <NoticeForm saving={saving} onSubmit={handleSubmit} onCancel={() => router.push("/admin/posts")} />
    </div>
  );
}
