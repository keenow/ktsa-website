"use client";

/**
 * @file 공지 작성/수정 공통 폼
 * @module admin
 */

import { useState, useRef } from "react";
import Image from "next/image";

export type NoticeFormData = {
  category: string;
  title_ko: string;
  title_en: string;
  body_ko: string;
  body_en: string;
  badge_ko: string;
  badge_en: string;
  url: string;
  is_published: boolean;
  pinned: boolean;
  imageFile: File | null;
  removeImage: boolean;
};

type Props = {
  saving: boolean;
  initialData?: {
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
  onSubmit: (data: NoticeFormData) => void;
  onCancel: () => void;
};

export default function NoticeForm({ saving, initialData, onSubmit, onCancel }: Props) {
  const [form, setForm] = useState<NoticeFormData>({
    category:     initialData?.category     ?? "notice",
    title_ko:     initialData?.title_ko     ?? "",
    title_en:     initialData?.title_en     ?? "",
    body_ko:      initialData?.body_ko      ?? "",
    body_en:      initialData?.body_en      ?? "",
    badge_ko:     initialData?.badge_ko     ?? "",
    badge_en:     initialData?.badge_en     ?? "",
    url:          initialData?.url          ?? "",
    is_published: initialData?.is_published ?? true,
    pinned:       initialData?.pinned       ?? false,
    imageFile:    null,
    removeImage:  false,
  });

  const [previewUrl, setPreviewUrl] = useState<string | null>(initialData?.image_url ?? null);
  const fileRef = useRef<HTMLInputElement>(null);

  function set(key: keyof NoticeFormData, value: string | boolean | File | null) {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  function handleImageChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0] ?? null;
    set("imageFile", file);
    set("removeImage", false);
    if (file) setPreviewUrl(URL.createObjectURL(file));
  }

  function handleRemoveImage() {
    set("imageFile", null);
    set("removeImage", true);
    setPreviewUrl(null);
    if (fileRef.current) fileRef.current.value = "";
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!form.title_ko.trim()) { alert("제목(한국어)을 입력해주세요."); return; }
    if (!form.body_ko.trim())  { alert("내용(한국어)을 입력해주세요."); return; }
    onSubmit(form);
  }

  const inputCls = "w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#1e3a6e] focus:border-transparent";
  const labelCls = "block text-xs font-semibold text-gray-600 mb-1";

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

        {/* ─── 왼쪽 ─── */}
        <div className="space-y-5">

          {/* 분류 + 상태 */}
          <div className="bg-white rounded-xl border border-gray-200 p-5 space-y-4">
            <div>
              <label className={labelCls}>분류</label>
              <select className={inputCls} value={form.category} onChange={e => set("category", e.target.value)}>
                <option value="notice">공지</option>
                <option value="news">뉴스</option>
                <option value="result">결과</option>
              </select>
            </div>
            <div className="flex gap-6">
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" checked={form.is_published} onChange={e => set("is_published", e.target.checked)}
                  className="w-4 h-4 rounded accent-[#1e3a6e]" />
                <span className="text-sm text-gray-700">공개</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" checked={form.pinned} onChange={e => set("pinned", e.target.checked)}
                  className="w-4 h-4 rounded accent-[#1e3a6e]" />
                <span className="text-sm text-gray-700">상단 고정</span>
              </label>
            </div>
          </div>

          {/* 한국어 */}
          <div className="bg-white rounded-xl border border-gray-200 p-5 space-y-4">
            <h3 className="text-sm font-bold text-gray-700">🇰🇷 한국어</h3>
            <div>
              <label className={labelCls}>제목 *</label>
              <input className={inputCls} value={form.title_ko} onChange={e => set("title_ko", e.target.value)} placeholder="제목을 입력하세요" />
            </div>
            <div>
              <label className={labelCls}>내용 *</label>
              <textarea className={`${inputCls} min-h-[280px] resize-y`} value={form.body_ko}
                onChange={e => set("body_ko", e.target.value)} placeholder="내용을 입력하세요" />
            </div>
            <div>
              <label className={labelCls}>배지 (선택 · 예: 마감임박)</label>
              <input className={inputCls} value={form.badge_ko} onChange={e => set("badge_ko", e.target.value)} placeholder="배지 텍스트" />
            </div>
          </div>
        </div>

        {/* ─── 오른쪽 ─── */}
        <div className="space-y-5">

          {/* 링크 */}
          <div className="bg-white rounded-xl border border-gray-200 p-5">
            <label className={labelCls}>외부 링크 (선택)</label>
            <input className={inputCls} type="url" value={form.url} onChange={e => set("url", e.target.value)} placeholder="https://example.com" />
          </div>

          {/* 이미지 */}
          <div className="bg-white rounded-xl border border-gray-200 p-5 space-y-3">
            <h3 className="text-sm font-bold text-gray-700">이미지 (선택)</h3>
            {previewUrl && (
              <div className="relative">
                <Image src={previewUrl} alt="미리보기" width={600} height={300}
                  className="w-full rounded-lg object-cover max-h-48" unoptimized />
                <button type="button" onClick={handleRemoveImage}
                  className="absolute top-2 right-2 bg-red-500 text-white text-xs px-2 py-1 rounded-lg hover:bg-red-600">
                  삭제
                </button>
              </div>
            )}
            <input ref={fileRef} type="file" accept="image/*" onChange={handleImageChange}
              className="text-sm text-gray-500 file:mr-3 file:py-1.5 file:px-3 file:rounded-lg file:border-0 file:text-xs file:font-semibold file:bg-[#1e3a6e] file:text-white hover:file:bg-[#152d57] cursor-pointer" />
            <p className="text-xs text-gray-400">JPG, PNG, WebP 권장 · 최대 5MB</p>
          </div>

          {/* 영문 */}
          <div className="bg-white rounded-xl border border-gray-200 p-5 space-y-4">
            <h3 className="text-sm font-bold text-gray-700">🇺🇸 English (선택)</h3>
            <div>
              <label className={labelCls}>Title</label>
              <input className={inputCls} value={form.title_en} onChange={e => set("title_en", e.target.value)} placeholder="Title" />
            </div>
            <div>
              <label className={labelCls}>Body</label>
              <textarea className={`${inputCls} min-h-[200px] resize-y`} value={form.body_en}
                onChange={e => set("body_en", e.target.value)} placeholder="Body text" />
            </div>
            <div>
              <label className={labelCls}>Badge</label>
              <input className={inputCls} value={form.badge_en} onChange={e => set("badge_en", e.target.value)} placeholder="e.g. Closing Soon" />
            </div>
          </div>
        </div>
      </div>

      {/* ─── 버튼 ─── */}
      <div className="flex gap-3 justify-end pt-2">
        <button type="button" onClick={onCancel}
          className="px-5 py-2 text-sm border border-gray-200 rounded-lg text-gray-600 hover:bg-gray-50 transition-colors">
          취소
        </button>
        <button type="submit" disabled={saving}
          className="px-6 py-2 text-sm bg-[#1e3a6e] text-white rounded-lg hover:bg-[#152d57] disabled:opacity-50 transition-colors">
          {saving ? "저장 중..." : "저장"}
        </button>
      </div>
    </form>
  );
}
