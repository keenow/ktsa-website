import { useTranslations, useLocale } from "next-intl";
import { notices } from "@/content/notices-data";

/**
 * @file 뉴스·공지 페이지
 * @description KTSA 공지사항 및 뉴스 목록
 * @module ui
 */

const categoryColors: Record<string, string> = {
  "공지":   "bg-[#1e3a6e] text-white",
  "뉴스":   "bg-blue-50 text-blue-700",
  "결과":   "bg-green-50 text-green-700",
  "Notice": "bg-[#1e3a6e] text-white",
  "News":   "bg-blue-50 text-blue-700",
  "Result": "bg-green-50 text-green-700",
};

export default function NewsPage() {
  const t = useTranslations("news");
  const locale = useLocale();
  const isKo = locale === "ko";

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-16">
      <h1 className="text-3xl font-bold text-gray-900 mb-2">{t("title")}</h1>
      <p className="text-gray-500 mb-2">{t("subtitle")}</p>
      <div className="w-12 h-1 bg-[#1e3a6e] mb-10"></div>

      <div className="space-y-5">
        {notices.map((notice) => (
          <div
            key={notice.id}
            className="border border-gray-200 rounded-xl p-5 hover:shadow-md transition-shadow"
          >
            {/* ─── 카테고리 + 배지 ─── */}
            <div className="flex items-center gap-2 mb-2 flex-wrap">
              <span
                className={`text-xs font-medium px-2 py-0.5 rounded-full ${
                  categoryColors[isKo ? notice.category : notice.categoryEn] ??
                  "bg-gray-100 text-gray-500"
                }`}
              >
                {isKo ? notice.category : notice.categoryEn}
              </span>
              {notice.badge && (
                <span className="text-xs font-medium px-2 py-0.5 rounded-full bg-red-100 text-red-600">
                  {isKo ? notice.badge : notice.badgeEn}
                </span>
              )}
              <span className="text-xs text-gray-400 ml-auto">{notice.date}</span>
            </div>

            {/* ─── 제목 ─── */}
            <h3 className="font-bold text-gray-900 mb-2 leading-snug">
              {isKo ? notice.title : notice.titleEn}
            </h3>

            {/* ─── 요약 ─── */}
            <p className="text-sm text-gray-600 leading-relaxed mb-3 whitespace-pre-line">
              {isKo ? notice.summary : notice.summaryEn}
            </p>

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
        ))}
      </div>
    </div>
  );
}
