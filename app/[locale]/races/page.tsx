import { useTranslations, useLocale } from "next-intl";

export default function RacesPage() {
  const t = useTranslations("races");
  const locale = useLocale();
  const isKo = locale === "ko";

  const races = isKo ? [
    { name: "2025 KTSA 설악 트레일 50K", date: "2025.05.10", location: "강원도 속초시", distance: "50km", elevation: "2,800m", status: "접수중" },
    { name: "2025 지리산 울트라 100K", date: "2025.06.21", location: "경남 하동군", distance: "100km", elevation: "5,200m", status: "예정" },
    { name: "2025 한라산 트레일 30K", date: "2025.09.13", location: "제주특별자치도", distance: "30km", elevation: "1,950m", status: "예정" },
    { name: "2025 북한산 나이트 트레일 20K", date: "2025.10.04", location: "서울 강북구", distance: "20km", elevation: "1,200m", status: "예정" },
    { name: "2025 덕유산 겨울 트레일 40K", date: "2025.12.06", location: "전북 무주군", distance: "40km", elevation: "2,400m", status: "예정" },
  ] : [
    { name: "2025 KTSA Seorak Trail 50K", date: "May 10, 2025", location: "Sokcho, Gangwon", distance: "50km", elevation: "2,800m", status: "Open" },
    { name: "2025 Jirisan Ultra 100K", date: "Jun 21, 2025", location: "Hadong, Gyeongnam", distance: "100km", elevation: "5,200m", status: "Upcoming" },
    { name: "2025 Hallasan Trail 30K", date: "Sep 13, 2025", location: "Jeju Island", distance: "30km", elevation: "1,950m", status: "Upcoming" },
    { name: "2025 Bukhansan Night Trail 20K", date: "Oct 4, 2025", location: "Seoul", distance: "20km", elevation: "1,200m", status: "Upcoming" },
    { name: "2025 Deogyusan Winter Trail 40K", date: "Dec 6, 2025", location: "Muju, Jeonbuk", distance: "40km", elevation: "2,400m", status: "Upcoming" },
  ];

  const statusColors: Record<string, string> = {
    "접수중": "bg-green-100 text-green-700",
    "예정": "bg-blue-100 text-blue-700",
    "접수마감": "bg-orange-100 text-orange-700",
    "종료": "bg-gray-100 text-gray-500",
    "Open": "bg-green-100 text-green-700",
    "Upcoming": "bg-blue-100 text-blue-700",
    "Closed": "bg-orange-100 text-orange-700",
    "Finished": "bg-gray-100 text-gray-500",
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-16">
      <h1 className="text-3xl font-bold text-gray-900 mb-2">{t("title")}</h1>
      <p className="text-gray-500 mb-2">{t("subtitle")}</p>
      <div className="w-12 h-1 bg-green-600 mb-10"></div>

      {/* Filter Tabs */}
      <div className="flex gap-2 mb-8">
        {[t("filter_all"), t("filter_upcoming"), t("filter_past")].map((label) => (
          <button
            key={label}
            className="px-4 py-1.5 text-sm rounded-full border border-gray-200 text-gray-600 hover:border-green-600 hover:text-green-600 transition-colors first:bg-green-600 first:text-white first:border-green-600"
          >
            {label}
          </button>
        ))}
      </div>

      {/* Race List */}
      <div className="space-y-4">
        {races.map((race, i) => (
          <div key={i} className="border border-gray-200 rounded-xl p-5 hover:shadow-md transition-shadow">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${statusColors[race.status] || "bg-gray-100 text-gray-600"}`}>
                    {race.status}
                  </span>
                </div>
                <h3 className="font-semibold text-gray-900 mb-1">{race.name}</h3>
                <div className="flex flex-wrap gap-3 text-sm text-gray-500">
                  <span>📅 {race.date}</span>
                  <span>📍 {race.location}</span>
                  <span>🏃 {race.distance}</span>
                  <span>⛰️ {race.elevation}</span>
                </div>
              </div>
              <div>
                <button className="w-full sm:w-auto bg-green-600 text-white text-sm px-5 py-2 rounded-lg hover:bg-green-700 transition-colors">
                  {t("detail")}
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
