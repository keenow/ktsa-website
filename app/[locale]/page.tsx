import { useTranslations, useLocale } from "next-intl";
import Link from "next/link";
import UpcomingRaces from "@/components/UpcomingRaces";

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
