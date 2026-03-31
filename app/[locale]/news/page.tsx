import { useTranslations, useLocale } from "next-intl";

/**
 * @file 뉴스·공지 페이지
 * @description KTSA 공지사항 및 뉴스 목록
 * @module ui
 */

type Notice = {
  id: string;
  category: string;
  categoryEn: string;
  title: string;
  titleEn: string;
  date: string;
  summary: string;
  summaryEn: string;
  url?: string;
  badge?: string;  // 강조 배지 (예: "NEW", "마감임박")
  badgeEn?: string;
};

const notices: Notice[] = [
  {
    id: "aptrc-2026-team-korea",
    category: "공지",
    categoryEn: "Notice",
    title: "2026 APTRC 대한민국 선수단 선발 안내",
    titleEn: "2026 APTRC – Korea National Team Selection Notice",
    date: "2026-03-31",
    summary:
      "제2회 아시아 태평양 트레일 러닝 챔피언십(APTRC)이 2026년 11월 중국 우이산에서 개최됩니다. 대한민국 선수단은 ITRA PI를 기준으로 선발 예정이며, 선수단 접수 일정이 확정되는 대로 국가 대표 출전 자격이 있는 선수에게 이메일이 발송됩니다. 대한민국 대표 선수들의 많은 관심과 출전을 부탁드립니다.\n\n챔피언십 경기 일정\n• 11월 26일(목): 롱 트레일 80km\n• 11월 27일(금): U23 & 숏 트레일 40km\n\n공식 홈페이지는 현재 업데이트 중입니다.",
    summaryEn:
      "The 2nd Asia Pacific Trail Running Championships (APTRC) will be held in Wuyishan, China in November 2026. The Korea national team will be selected based on ITRA PI scores. Athletes eligible for national team participation will be notified by email once the registration schedule is confirmed.\n\nChampionship Schedule\n• Nov 26 (Thu): Long Trail 80 km\n• Nov 27 (Fri): U23 & Short Trail 40 km\n\nThe official website is currently being updated.",
    url: "https://www.aptrc2026.com/ko",
    badge: "선수단 모집",
    badgeEn: "Team Selection",
  },
  {
    id: "aptrc-2026-open",
    category: "공지",
    categoryEn: "Notice",
    title: "제2회 APTRC 오픈경기 참가 안내 (마감 4월 10일)",
    titleEn: "2nd APTRC Open Race Registration – Deadline April 10",
    date: "2026-03-31",
    summary:
      "제2회 APTRC는 제11회 그랜드 우이산 슈퍼 트레일 레이스와 동시 개최됩니다. 아마추어 선수들이 참가할 수 있는 오픈경기(100/60/35/20/10km)는 11월 28–29일 진행되며, 참가 신청 마감은 4월 10일입니다.",
    summaryEn:
      "The 2nd APTRC is co-hosted with the 11th Grand Wuyi Super Trail Race. Open categories (100/60/35/20/10 km) for amateur runners run November 28–29. Registration closes April 10.",
    url: "https://www.wuyitrail.com/",
    badge: "마감임박",
    badgeEn: "Closing Soon",
  },
];

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
