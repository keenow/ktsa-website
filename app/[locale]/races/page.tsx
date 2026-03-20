import { useTranslations, useLocale } from "next-intl";
import { races } from "@/content/races-data";

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

export default function RacesPage() {
  const t = useTranslations("races");
  const locale = useLocale();
  const isKo = locale === "ko";

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-16">
      <h1 className="text-3xl font-bold text-gray-900 mb-2">{t("title")}</h1>
      <p className="text-gray-500 mb-2">{t("subtitle")}</p>
      <div className="w-12 h-1 bg-[#1e3a6e] mb-10"></div>

      <div className="space-y-5">
        {races.map((race, i) => (
          <div key={i} className="border border-gray-200 rounded-xl p-5 hover:shadow-md transition-shadow">
            <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2 flex-wrap">
                  <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${statusColors[isKo ? race.status : race.statusEn] || "bg-gray-100 text-gray-600"}`}>
                    {isKo ? race.status : race.statusEn}
                  </span>
                  {race.organizer && (
                    <span className="text-xs text-gray-400 border border-gray-200 px-2 py-0.5 rounded-full">
                      {race.organizer}
                    </span>
                  )}
                </div>
                <h3 className="font-bold text-gray-900 mb-1">{isKo ? race.name : race.nameEn}</h3>
                <div className="flex flex-wrap gap-3 text-sm text-gray-500 mb-2">
                  <span>📅 {isKo ? race.date : race.dateEn}</span>
                  <span>📍 {isKo ? race.location : race.locationEn}</span>
                </div>
                {race.courses.length > 0 && (
                  <div className="flex flex-wrap gap-1.5 mb-2">
                    {race.courses.map((c) => (
                      <span key={c.name} className="text-xs border border-gray-200 rounded-full px-2.5 py-0.5 text-gray-500">
                        {c.name}{c.distance !== "-" ? ` · ${c.distance}` : ""}
                      </span>
                    ))}
                  </div>
                )}
                {(isKo ? race.note : race.noteEn) && (
                  <p className="text-xs text-[#1e3a6e] bg-[#e8edf5] px-3 py-1.5 rounded-lg inline-block mt-1">
                    {isKo ? race.note : race.noteEn}
                  </p>
                )}
              </div>
              {race.url && (
                <a
                  href={race.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="shrink-0 text-sm border border-[#1e3a6e] text-[#1e3a6e] px-4 py-1.5 rounded-lg hover:bg-[#1e3a6e] hover:text-white transition-colors"
                >
                  {isKo ? "바로가기" : "Details"}
                </a>
              )}
            </div>
          </div>
        ))}
      </div>

      <p className="text-xs text-gray-400 mt-8 text-center">
        {isKo
          ? "KTSA 임원사 주관 대회 목록입니다. 접수 및 상세 정보는 각 대회 홈페이지를 확인해 주세요."
          : "Races organized by KTSA member companies. Visit each race website for registration and details."}
      </p>
    </div>
  );
}
