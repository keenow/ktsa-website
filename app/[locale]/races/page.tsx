import { useTranslations, useLocale } from "next-intl";

export default function RacesPage() {
  const t = useTranslations("races");
  const locale = useLocale();
  const isKo = locale === "ko";

  const races = isKo ? [
    {
      name: "2026 KOREA 50K 동두천 (DDC)",
      date: "2026년 4월 25일 (토)",
      location: "경기도 동두천",
      courses: [
        { name: "DDC50", distance: "50km" },
        { name: "DDC20", distance: "20km" },
        { name: "DDC10", distance: "10km" },
        { name: "DDC5",  distance: "5km" },
      ],
      status: "접수마감",
      note: "추첨제 접수 마감",
    },
    {
      name: "2026 KOREA 50K 춘천 (CC)",
      date: "2026년 6월 (날짜 미정)",
      location: "강원도 춘천",
      courses: [
        { name: "CC50",         distance: "50km" },
        { name: "CC20 SKYRACE®", distance: "20km" },
        { name: "CC15",          distance: "15km" },
      ],
      status: "추가접수",
      note: "취소분 추가 접수 4월 16일(목) 12:00 선착순",
    },
  ] : [
    {
      name: "2026 KOREA 50K Dongducheon (DDC)",
      date: "April 25, 2026 (Sat)",
      location: "Dongducheon, Gyeonggi",
      courses: [
        { name: "DDC50", distance: "50km" },
        { name: "DDC20", distance: "20km" },
        { name: "DDC10", distance: "10km" },
        { name: "DDC5",  distance: "5km" },
      ],
      status: "Closed",
      note: "Lottery registration closed",
    },
    {
      name: "2026 KOREA 50K Chuncheon (CC)",
      date: "June 2026 (Date TBD)",
      location: "Chuncheon, Gangwon",
      courses: [
        { name: "CC50",          distance: "50km" },
        { name: "CC20 SKYRACE®", distance: "20km" },
        { name: "CC15",          distance: "15km" },
      ],
      status: "Limited",
      note: "Additional registration: Apr 16 (Thu) 12:00, first-come first-served",
    },
  ];

  const statusColors: Record<string, string> = {
    "접수마감": "bg-gray-100 text-gray-500",
    "추가접수": "bg-[#dde3f0] text-[#1e3a6e]",
    "Closed":   "bg-gray-100 text-gray-500",
    "Limited":  "bg-[#dde3f0] text-[#1e3a6e]",
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-16">
      <h1 className="text-3xl font-bold text-gray-900 mb-2">{t("title")}</h1>
      <p className="text-gray-500 mb-2">{t("subtitle")}</p>
      <div className="w-12 h-1 bg-[#1e3a6e] mb-10"></div>

      <div className="space-y-6">
        {races.map((race, i) => (
          <div key={i} className="border border-gray-200 rounded-xl p-6 hover:shadow-md transition-shadow">
            <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3 mb-4">
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${statusColors[race.status] || "bg-gray-100 text-gray-600"}`}>
                    {race.status}
                  </span>
                </div>
                <h3 className="font-bold text-gray-900 text-lg mb-1">{race.name}</h3>
                <div className="flex flex-wrap gap-3 text-sm text-gray-500">
                  <span>📅 {race.date}</span>
                  <span>📍 {race.location}</span>
                </div>
                {race.note && (
                  <p className="text-xs text-[#1e3a6e] mt-2 bg-[#e8edf5] px-3 py-1.5 rounded-lg inline-block">
                    {race.note}
                  </p>
                )}
              </div>
            </div>

            {/* 코스 목록 */}
            <div className="flex flex-wrap gap-2 mt-3">
              {race.courses.map((c) => (
                <span
                  key={c.name}
                  className="text-xs border border-gray-200 rounded-full px-3 py-1 text-gray-600"
                >
                  {c.name} · {c.distance}
                </span>
              ))}
            </div>
          </div>
        ))}
      </div>

      <p className="text-xs text-gray-400 mt-8 text-center">
        {isKo
          ? "대회 접수 및 상세 정보: korea50k.com"
          : "Registration & details: korea50k.com"}
      </p>
    </div>
  );
}
