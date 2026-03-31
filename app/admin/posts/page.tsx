"use client";

/**
 * @file 관리자 공지·뉴스 목록 페이지
 * @module admin
 */

import { useEffect, useState } from "react";
import Link from "next/link";

type Notice = {
  id: string;
  category: string;
  title_ko: string;
  badge_ko: string | null;
  is_published: boolean;
  pinned: boolean;
  created_at: string;
};

const CATEGORY_LABEL: Record<string, string> = {
  notice: "공지",
  news:   "뉴스",
  result: "결과",
};

export default function AdminPostsPage() {
  const [notices, setNotices] = useState<Notice[]>([]);
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState<string | null>(null);

  async function load() {
    setLoading(true);
    const res = await fetch("/api/admin/notices");
    const data = await res.json();
    setNotices(Array.isArray(data) ? data : []);
    setLoading(false);
  }

  useEffect(() => { load(); }, []);

  async function togglePublish(id: string, current: boolean) {
    await fetch(`/api/admin/notices/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ is_published: !current }),
    });
    load();
  }

  async function togglePin(id: string, current: boolean) {
    await fetch(`/api/admin/notices/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ pinned: !current }),
    });
    load();
  }

  async function deleteNotice(id: string) {
    if (!confirm("삭제하시겠습니까?")) return;
    setDeleting(id);
    await fetch(`/api/admin/notices/${id}`, { method: "DELETE" });
    setDeleting(null);
    load();
  }

  return (
    <div>
      {/* ─── 헤더 ─── */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">공지·뉴스</h1>
          <p className="text-sm text-gray-400 mt-1">홈페이지 공지사항 관리</p>
        </div>
        <Link
          href="/admin/posts/new"
          className="bg-[#1e3a6e] text-white text-sm px-4 py-2 rounded-lg hover:bg-[#152d57] transition-colors"
        >
          + 새 공지 작성
        </Link>
      </div>

      {/* ─── 목록 ─── */}
      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        {loading ? (
          <div className="p-12 text-center text-sm text-gray-400">불러오는 중...</div>
        ) : notices.length === 0 ? (
          <div className="p-12 text-center text-sm text-gray-400">공지사항이 없습니다.</div>
        ) : (
          <table className="w-full text-sm">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 w-16">분류</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500">제목</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 w-28">날짜</th>
                <th className="text-center px-4 py-3 text-xs font-semibold text-gray-500 w-16">고정</th>
                <th className="text-center px-4 py-3 text-xs font-semibold text-gray-500 w-16">공개</th>
                <th className="text-center px-4 py-3 text-xs font-semibold text-gray-500 w-24">관리</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {notices.map((n) => (
                <tr key={n.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-4 py-3">
                    <span className="text-xs px-2 py-0.5 rounded-full bg-[#1e3a6e] text-white">
                      {CATEGORY_LABEL[n.category] ?? n.category}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <p className="font-medium text-gray-900 truncate max-w-xs">{n.title_ko}</p>
                    {n.badge_ko && (
                      <span className="text-xs text-red-500">{n.badge_ko}</span>
                    )}
                  </td>
                  <td className="px-4 py-3 text-xs text-gray-400">
                    {new Date(n.created_at).toLocaleDateString("ko-KR")}
                  </td>
                  <td className="px-4 py-3 text-center">
                    <button
                      onClick={() => togglePin(n.id, n.pinned)}
                      className={`text-lg ${n.pinned ? "opacity-100" : "opacity-20 hover:opacity-60"}`}
                      title={n.pinned ? "고정 해제" : "고정"}
                    >
                      📌
                    </button>
                  </td>
                  <td className="px-4 py-3 text-center">
                    <button
                      onClick={() => togglePublish(n.id, n.is_published)}
                      className={`relative inline-flex h-5 w-9 rounded-full transition-colors ${n.is_published ? "bg-[#1e3a6e]" : "bg-gray-200"}`}
                    >
                      <span className={`inline-block h-4 w-4 mt-0.5 rounded-full bg-white shadow transition-transform ${n.is_published ? "translate-x-4" : "translate-x-0.5"}`} />
                    </button>
                  </td>
                  <td className="px-4 py-3 text-center">
                    <div className="flex items-center justify-center gap-2">
                      <Link
                        href={`/admin/posts/${n.id}/edit`}
                        className="text-xs text-[#1e3a6e] hover:underline"
                      >
                        수정
                      </Link>
                      <button
                        onClick={() => deleteNotice(n.id)}
                        disabled={deleting === n.id}
                        className="text-xs text-red-500 hover:underline disabled:opacity-40"
                      >
                        {deleting === n.id ? "..." : "삭제"}
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
