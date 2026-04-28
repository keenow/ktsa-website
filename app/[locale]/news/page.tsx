import { getLocale, getTranslations } from "next-intl/server";
import { createSupabaseServerClient } from "@/lib/supabase-server";
import Image from "next/image";
import MarkdownBody from "@/components/MarkdownBody";

/**
 * @file 뉴스·공지 페이지
 * @description Supabase notices 테이블에서 공지 목록 fetch
 * @module ui
 */

const categoryColors: Record<string, string> = {
  notice: "bg-[#1e3a6e] text-white",
  news:   "bg-blue-50 text-blue-700",
  result: "bg-green-50 text-green-700",
};

const categoryLabel: Record<string, { ko: string; en: string }> = {
  notice: { ko: "공지", en: "Notice" },
  news:   { ko: "뉴스", en: "News" },
  result: { ko: "결과", en: "Result" },
};

export default async function NewsPage() {
  const locale = await getLocale();
  const t = await getTranslations("news");
  const isKo = locale === "ko";

  const supabase = await createSupabaseServerClient();
  const { data: notices } = await supabase
    .from("notices")
    .select("*")
    .eq("is_published", true)
    .order("pinned", { ascending: false })
    .order("created_at", { ascending: false });

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-16">
      <h1 className="text-3xl font-bold text-gray-900 mb-2">{t("title")}</h1>
      <p className="text-gray-500 mb-2">{t("subtitle")}</p>
      <div className="w-12 h-1 bg-[#1e3a6e] mb-10"></div>

      {(!notices || notices.length === 0) ? (
        <div className="bg-gray-50 rounded-xl p-12 text-center">
          <p className="text-gray-400 text-sm">
            {isKo ? "공지사항이 없습니다." : "No announcements yet."}
          </p>
        </div>
      ) : (
        <div className="space-y-5">
          {notices.map((notice) => {
            const cat = categoryLabel[notice.category] ?? { ko: "공지", en: "Notice" };
            const dateStr = new Date(notice.created_at).toLocaleDateString("ko-KR", {
              year: "numeric", month: "2-digit", day: "2-digit",
            });

            return (
              <div
                key={notice.id}
                className="border border-gray-200 rounded-xl p-5 hover:shadow-md transition-shadow"
              >
                {/* ─── 카테고리 + 배지 ─── */}
                <div className="flex items-center gap-2 mb-2 flex-wrap">
                  <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${categoryColors[notice.category] ?? "bg-gray-100 text-gray-500"}`}>
                    {isKo ? cat.ko : cat.en}
                  </span>
                  {notice.pinned && (
                    <span className="text-xs font-medium px-2 py-0.5 rounded-full bg-yellow-100 text-yellow-700">
                      {isKo ? "고정" : "Pinned"}
                    </span>
                  )}
                  {(isKo ? notice.badge_ko : notice.badge_en) && (
                    <span className="text-xs font-medium px-2 py-0.5 rounded-full bg-red-100 text-red-600">
                      {isKo ? notice.badge_ko : notice.badge_en}
                    </span>
                  )}
                  <span className="text-xs text-gray-400 ml-auto">{dateStr}</span>
                </div>

                {/* ─── 제목 ─── */}
                <h3 className="font-bold text-gray-900 mb-2 leading-snug">
                  {isKo ? notice.title_ko : notice.title_en}
                </h3>

                {/* ─── 이미지 ─── */}
                {notice.image_url && (
                  <div className="mb-3 rounded-lg overflow-hidden">
                    <Image
                      src={notice.image_url}
                      alt={isKo ? notice.title_ko : notice.title_en}
                      width={800}
                      height={400}
                      className="w-full object-cover max-h-72"
                      unoptimized
                    />
                  </div>
                )}

                {/* ─── 본문 ─── */}
                {(isKo ? notice.body_ko : notice.body_en) && (
                  <MarkdownBody
                    content={isKo ? notice.body_ko : notice.body_en}
                    className="mb-3 text-sm"
                  />
                )}

                {/* ─── 링크 ─── */}
                {notice.url && (
                  <a
                    href={notice.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-block text-sm border border-[#1e3a6e] text-[#1e3a6e] px-4 py-1.5 rounded-lg hover:bg-[#1e3a6e] hover:text-white transition-colors"
                  >
                    {isKo ? "자세히 보기" : "Learn More"}
                  </a>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
