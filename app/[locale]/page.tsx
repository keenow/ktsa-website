import { useTranslations, useLocale } from "next-intl";
import Link from "next/link";
import UpcomingRaces from "@/components/UpcomingRaces";
import { notices } from "@/content/notices-data";

export default function HomePage() {
  const t = useTranslations("home");
  const locale = useLocale();
  const isKo = locale === "ko";

  return (
    <>
      {/* Hero */}
      <section className="bg-gradient-to-br from-[#152d57] to-[#1e3a6e] text-white py-24 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-4xl sm:text-5xl font-bold mb-4 leading-tight">{t("hero_title")}</h1>
          <p className="text-xl text-blue-100 mb-8">{t("hero_subtitle")}</p>
          <Link
            href={`/${locale}/races`}
            className="inline-block bg-white text-[#1e3a6e] font-semibold px-8 py-3 rounded-full hover:bg-gray-50 transition-colors"
          >
            {t("hero_cta")}
          </Link>
        </div>
      </section>

      {/* Upcoming Races */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 py-16">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-gray-900">{t("upcoming_races")}</h2>
          <Link href={`/${locale}/races`} className="text-sm text-[#1e3a6e] hover:underline">{t("view_all")} →</Link>
        </div>
        <UpcomingRaces />
      </section>

      {/* Notice */}
      <section className="bg-gray-50 py-16">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-900">{t("latest_news")}</h2>
            <Link href={`/${locale}/news`} className="text-sm text-[#1e3a6e] hover:underline">{t("view_all")} →</Link>
          </div>
          <div className="space-y-4 max-w-2xl">
            {notices.slice(0, 2).map((notice) => (
              <div key={notice.id} className="bg-white rounded-xl border border-gray-100 p-5 hover:shadow-sm transition-shadow">
                <div className="flex items-center gap-2 mb-2 flex-wrap">
                  <span className="text-xs font-medium px-2 py-0.5 rounded-full bg-[#1e3a6e] text-white">
                    {isKo ? notice.category : notice.categoryEn}
                  </span>
                  {notice.badge && (
                    <span className="text-xs font-medium px-2 py-0.5 rounded-full bg-red-100 text-red-600">
                      {isKo ? notice.badge : notice.badgeEn}
                    </span>
                  )}
                  <span className="text-xs text-gray-400 ml-auto">{notice.date}</span>
                </div>
                <p className="text-sm font-semibold text-gray-900 mb-1 leading-snug">
                  {isKo ? notice.title : notice.titleEn}
                </p>
                {notice.url && (
                  <a
                    href={notice.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xs text-[#1e3a6e] hover:underline"
                  >
                    {isKo ? "자세히 보기 →" : "Learn More →"}
                  </a>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
