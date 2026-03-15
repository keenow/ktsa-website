import { useTranslations, useLocale } from "next-intl";
import Link from "next/link";

function RaceCard({ name, date, location, distance, status }: {
  name: string; date: string; location: string; distance: string; status: string;
}) {
  const statusColors: Record<string, string> = {
    "접수중": "bg-green-100 text-green-700",
    "예정": "bg-blue-100 text-blue-700",
    "Open": "bg-green-100 text-green-700",
    "Upcoming": "bg-blue-100 text-blue-700",
  };
  return (
    <div className="border border-gray-200 rounded-xl p-5 hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between mb-3">
        <span className={`text-xs font-medium px-2 py-1 rounded-full ${statusColors[status] || "bg-gray-100 text-gray-600"}`}>{status}</span>
        <span className="text-xs text-gray-400">{distance}</span>
      </div>
      <h3 className="font-semibold text-gray-900 mb-1">{name}</h3>
      <p className="text-sm text-gray-500">{date}</p>
      <p className="text-sm text-gray-400">{location}</p>
    </div>
  );
}

function NewsCard({ title, date, category, excerpt }: {
  title: string; date: string; category: string; excerpt: string;
}) {
  return (
    <div className="border-b border-gray-100 pb-4 last:border-0">
      <span className="text-xs font-medium text-green-600 bg-green-50 px-2 py-0.5 rounded">{category}</span>
      <h3 className="font-medium text-gray-900 mt-2 mb-1">{title}</h3>
      <p className="text-sm text-gray-500 line-clamp-2">{excerpt}</p>
      <p className="text-xs text-gray-400 mt-1">{date}</p>
    </div>
  );
}

export default function HomePage() {
  const t = useTranslations("home");
  const tc = useTranslations("common");
  const locale = useLocale();

  const isKo = locale === "ko";

  const races = isKo ? [
    { name: "2025 KTSA 설악 트레일 50K", date: "2025.05.10", location: "강원도 속초시", distance: "50km", status: "접수중" },
    { name: "2025 지리산 울트라 100K", date: "2025.06.21", location: "경남 하동군", distance: "100km", status: "예정" },
    { name: "2025 한라산 트레일 30K", date: "2025.09.13", location: "제주특별자치도", distance: "30km", status: "예정" },
  ] : [
    { name: "2025 KTSA Seorak Trail 50K", date: "May 10, 2025", location: "Sokcho, Gangwon", distance: "50km", status: "Open" },
    { name: "2025 Jirisan Ultra 100K", date: "Jun 21, 2025", location: "Hadong, Gyeongnam", distance: "100km", status: "Upcoming" },
    { name: "2025 Hallasan Trail 30K", date: "Sep 13, 2025", location: "Jeju Island", distance: "30km", status: "Upcoming" },
  ];

  const news = isKo ? [
    { title: "2025년 대회 일정 발표", date: "2025.01.15", category: "공지", excerpt: "2025년 KTSA 주관 트레일 대회 전체 일정이 확정되었습니다." },
    { title: "설악 트레일 50K 참가 접수 시작", date: "2025.02.01", category: "공지", excerpt: "2025 KTSA 설악 트레일 50K 대회 참가 접수가 시작되었습니다." },
    { title: "2024 지리산 울트라 결과 발표", date: "2024.11.03", category: "결과", excerpt: "2024 지리산 울트라 100K 완주자 명단 및 기록이 공개되었습니다." },
  ] : [
    { title: "2025 Race Calendar Announced", date: "Jan 15, 2025", category: "Notice", excerpt: "The full 2025 KTSA trail race calendar has been confirmed." },
    { title: "Seorak Trail 50K Registration Open", date: "Feb 1, 2025", category: "Notice", excerpt: "Registration for the 2025 KTSA Seorak Trail 50K is now open." },
    { title: "2024 Jirisan Ultra Results", date: "Nov 3, 2024", category: "Result", excerpt: "Finisher list and records for the 2024 Jirisan Ultra 100K are now available." },
  ];

  return (
    <>
      {/* Hero */}
      <section className="bg-gradient-to-br from-green-800 to-green-600 text-white py-24 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-4xl sm:text-5xl font-bold mb-4 leading-tight">{t("hero_title")}</h1>
          <p className="text-xl text-green-100 mb-8">{t("hero_subtitle")}</p>
          <Link
            href={`/${locale}/races`}
            className="inline-block bg-white text-green-700 font-semibold px-8 py-3 rounded-full hover:bg-green-50 transition-colors"
          >
            {t("hero_cta")}
          </Link>
        </div>
      </section>

      {/* Upcoming Races */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 py-16">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-gray-900">{t("upcoming_races")}</h2>
          <Link href={`/${locale}/races`} className="text-sm text-green-600 hover:underline">{t("view_all")} →</Link>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {races.map((race, i) => <RaceCard key={i} {...race} />)}
        </div>
      </section>

      {/* Latest News */}
      <section className="bg-gray-50 py-16">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-900">{t("latest_news")}</h2>
            <Link href={`/${locale}/news`} className="text-sm text-green-600 hover:underline">{t("view_all")} →</Link>
          </div>
          <div className="bg-white rounded-xl border border-gray-100 p-6 space-y-4 max-w-2xl">
            {news.map((item, i) => <NewsCard key={i} {...item} />)}
          </div>
        </div>
      </section>
    </>
  );
}
