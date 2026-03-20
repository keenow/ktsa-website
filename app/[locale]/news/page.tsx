import { useTranslations, useLocale } from "next-intl";

export default function NewsPage() {
  const t = useTranslations("news");
  const locale = useLocale();
  const isKo = locale === "ko";

  const items = isKo ? [
    { title: "2025년 대회 전체 일정 확정 발표", date: "2025.01.15", category: "공지", excerpt: "2025년 KTSA 주관 트레일 대회 전체 일정이 확정되었습니다. 설악 50K, 지리산 100K 등 총 5개 대회가 개최될 예정입니다." },
    { title: "설악 트레일 50K 참가 접수 개시", date: "2025.02.01", category: "공지", excerpt: "2025 KTSA 설악 트레일 50K 대회 참가 접수가 시작되었습니다. 선착순 500명 마감이오니 서둘러 신청해 주세요." },
    { title: "트레일러닝 안전 가이드라인 개정", date: "2025.01.28", category: "공지", excerpt: "협회 트레일러닝 안전 가이드라인이 2025년 버전으로 개정되었습니다. 주요 변경사항을 확인해 주세요." },
    { title: "2024 지리산 울트라 100K 결과 발표", date: "2024.11.03", category: "결과", excerpt: "2024 지리산 울트라 100K 완주자 명단 및 기록이 공개되었습니다. 총 342명이 완주에 성공하였습니다." },
    { title: "2024 아시아 트레일 챔피언십 결과", date: "2024.10.15", category: "뉴스", excerpt: "2024 아시아 트레일 챔피언십에서 한국 대표팀이 종합 3위를 기록하였습니다." },
  ] : [
    { title: "2025 Full Race Calendar Confirmed", date: "Jan 15, 2025", category: "Notice", excerpt: "The complete 2025 KTSA trail race calendar is confirmed. Five races including Seorak 50K and Jirisan 100K are scheduled." },
    { title: "Seorak Trail 50K Registration Now Open", date: "Feb 1, 2025", category: "Notice", excerpt: "Registration for the 2025 KTSA Seorak Trail 50K is now open. Limited to 500 runners — register early!" },
    { title: "Updated Trail Running Safety Guidelines", date: "Jan 28, 2025", category: "Notice", excerpt: "KTSA trail running safety guidelines have been updated for 2025. Please review the key changes." },
    { title: "2024 Jirisan Ultra 100K Results", date: "Nov 3, 2024", category: "Result", excerpt: "Finisher list and records for the 2024 Jirisan Ultra 100K are now available. 342 runners finished." },
    { title: "2024 Asia Trail Championship Results", date: "Oct 15, 2024", category: "News", excerpt: "Team Korea finished 3rd overall at the 2024 Asia Trail Championship." },
  ];

  const categoryColors: Record<string, string> = {
    "공지": "bg-blue-50 text-blue-700",
    "뉴스": "bg-[#e8edf5] text-[#152d57]",
    "결과": "bg-orange-50 text-orange-700",
    "Notice": "bg-blue-50 text-blue-700",
    "News": "bg-[#e8edf5] text-[#152d57]",
    "Result": "bg-orange-50 text-orange-700",
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-16">
      <h1 className="text-3xl font-bold text-gray-900 mb-2">{t("title")}</h1>
      <p className="text-gray-500 mb-2">{t("subtitle")}</p>
      <div className="w-12 h-1 bg-[#1e3a6e] mb-10"></div>

      <div className="space-y-0 divide-y divide-gray-100">
        {items.map((item, i) => (
          <article key={i} className="py-6 hover:bg-gray-50 -mx-4 px-4 rounded-lg transition-colors cursor-pointer">
            <div className="flex items-start gap-4">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <span className={`text-xs font-medium px-2 py-0.5 rounded ${categoryColors[item.category] || "bg-gray-100 text-gray-600"}`}>
                    {item.category}
                  </span>
                  <span className="text-xs text-gray-400">{item.date}</span>
                </div>
                <h3 className="font-semibold text-gray-900 mb-1">{item.title}</h3>
                <p className="text-sm text-gray-500 line-clamp-2">{item.excerpt}</p>
              </div>
              <svg className="w-5 h-5 text-gray-300 mt-1 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}
