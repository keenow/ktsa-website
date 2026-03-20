import { useTranslations, useLocale } from "next-intl";
import Link from "next/link";
import { getUpcomingRaces } from "@/content/races-data";

const statusColors: Record<string, string> = {
  "접수마감": "bg-gray-100 text-gray-500",
  "추가접수": "bg-[#dde3f0] text-[#1e3a6e]",
  "접수중":   "bg-[#1e3a6e] text-white",
  "예정":     "bg-blue-50 text-blue-700",
  "Closed":   "bg-gray-100 text-gray-500",
  "Limited":  "bg-[#dde3f0] text-[#1e3a6e]",
  "Open":     "bg-[#1e3a6e] text-white",
  "Upcoming": "bg-blue-50 text-blue-700",
};

export default function HomePage() {
  const t = useTranslations("home");
  const locale = useLocale();
  const isKo = locale === "ko";

  const upcoming = getUpcomingRaces(2);

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
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-2xl">
          {upcoming.map((race, i) => (
            <div key={i} className="border border-gray-200 rounded-xl p-5 hover:shadow-md transition-shadow">
              <div className="flex items-start justify-between mb-3 flex-wrap gap-2">
                <span className={`text-xs font-medium px-2 py-1 rounded-full ${statusColors[isKo ? race.status : race.statusEn] || "bg-gray-100 text-gray-600"}`}>
                  {isKo ? race.status : race.statusEn}
                </span>
                {race.organizer && (
                  <span className="text-xs text-gray-400">{race.organizer}</span>
                )}
              </div>
              <h3 className="font-semibold text-gray-900 mb-1">{isKo ? race.name : race.nameEn}</h3>
              <p className="text-sm text-gray-500">📅 {isKo ? race.date : race.dateEn}</p>
              <p className="text-sm text-gray-400">📍 {isKo ? race.location : race.locationEn}</p>
              {race.courses.length > 0 && (
                <p className="text-xs text-gray-400 mt-2">
                  {race.courses.map(c => c.name).join(" / ")}
                </p>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* Notice */}
      <section className="bg-gray-50 py-16">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-900">{t("latest_news")}</h2>
          </div>
          <div className="bg-white rounded-xl border border-gray-100 p-8 max-w-2xl text-center">
            <p className="text-gray-400 text-sm">
              {isKo ? "공지사항이 준비 중입니다." : "Announcements coming soon."}
            </p>
          </div>
        </div>
      </section>
    </>
  );
}
