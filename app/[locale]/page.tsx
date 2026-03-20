import { useTranslations, useLocale } from "next-intl";
import Link from "next/link";

function RaceCard({ name, date, location, courses, status }: {
  name: string; date: string; location: string; courses: string; status: string;
}) {
  const statusColors: Record<string, string> = {
    "접수마감": "bg-gray-100 text-gray-500",
    "추가접수": "bg-[#dde3f0] text-[#1e3a6e]",
    "Closed": "bg-gray-100 text-gray-500",
    "Limited": "bg-[#dde3f0] text-[#1e3a6e]",
  };
  return (
    <div className="border border-gray-200 rounded-xl p-5 hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between mb-3">
        <span className={`text-xs font-medium px-2 py-1 rounded-full ${statusColors[status] || "bg-gray-100 text-gray-600"}`}>{status}</span>
        <span className="text-xs text-gray-400">{courses}</span>
      </div>
      <h3 className="font-semibold text-gray-900 mb-1">{name}</h3>
      <p className="text-sm text-gray-500">📅 {date}</p>
      <p className="text-sm text-gray-400">📍 {location}</p>
    </div>
  );
}

export default function HomePage() {
  const t = useTranslations("home");
  const locale = useLocale();
  const isKo = locale === "ko";

  const races = isKo ? [
    {
      name: "2026 KOREA 50K 동두천 (DDC)",
      date: "2026년 4월 25일 (토)",
      location: "경기도 동두천",
      courses: "50K / 20K / 10K / 5K",
      status: "접수마감",
    },
    {
      name: "2026 KOREA 50K 춘천 (CC)",
      date: "2026년 6월 (예정)",
      location: "강원도 춘천",
      courses: "50K / 20K SKYRACE® / 15K",
      status: "추가접수",
    },
  ] : [
    {
      name: "2026 KOREA 50K Dongducheon (DDC)",
      date: "April 25, 2026 (Sat)",
      location: "Dongducheon, Gyeonggi",
      courses: "50K / 20K / 10K / 5K",
      status: "Closed",
    },
    {
      name: "2026 KOREA 50K Chuncheon (CC)",
      date: "June 2026 (TBD)",
      location: "Chuncheon, Gangwon",
      courses: "50K / 20K SKYRACE® / 15K",
      status: "Limited",
    },
  ];

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
          {races.map((race, i) => <RaceCard key={i} {...race} />)}
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
