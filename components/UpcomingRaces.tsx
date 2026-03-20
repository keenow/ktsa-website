"use client";

import { useLocale } from "next-intl";
import { races } from "@/content/races-data";

function getUpcoming(n = 2) {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const withDate = races
    .filter((r) => r.sortDate !== null && new Date(r.sortDate!) >= today)
    .sort((a, b) => new Date(a.sortDate!).getTime() - new Date(b.sortDate!).getTime());

  const withoutDate = races.filter((r) => r.sortDate === null);

  return [...withDate, ...withoutDate].slice(0, n);
}

const statusStyle: Record<string, { badge: string; bar: string }> = {
  "접수중":   { badge: "bg-[#1e3a6e] text-white",         bar: "bg-[#1e3a6e]" },
  "추가접수": { badge: "bg-[#dde3f0] text-[#1e3a6e] font-semibold", bar: "bg-[#2a4f8f]" },
  "접수마감": { badge: "bg-gray-100 text-gray-400",        bar: "bg-gray-200" },
  "예정":     { badge: "bg-blue-50 text-blue-600",         bar: "bg-blue-200" },
  "Open":     { badge: "bg-[#1e3a6e] text-white",         bar: "bg-[#1e3a6e]" },
  "Limited":  { badge: "bg-[#dde3f0] text-[#1e3a6e] font-semibold", bar: "bg-[#2a4f8f]" },
  "Closed":   { badge: "bg-gray-100 text-gray-400",        bar: "bg-gray-200" },
  "Upcoming": { badge: "bg-blue-50 text-blue-600",         bar: "bg-blue-200" },
};

export default function UpcomingRaces() {
  const locale = useLocale();
  const isKo = locale === "ko";
  const upcoming = getUpcoming(2);

  if (upcoming.length === 0) {
    return (
      <p className="text-gray-400 text-sm">
        {isKo ? "현재 예정된 대회가 없습니다." : "No upcoming races at this time."}
      </p>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-2xl">
      {upcoming.map((race, i) => {
        const statusKey = isKo ? race.status : race.statusEn;
        const style = statusStyle[statusKey] || { badge: "bg-gray-100 text-gray-500", bar: "bg-gray-200" };
        const isOpen = race.status === "접수중" || race.status === "추가접수";

        return (
          <div
            key={i}
            className={`relative rounded-xl overflow-hidden border transition-shadow hover:shadow-lg ${
              isOpen ? "border-[#1e3a6e]/30 shadow-sm" : "border-gray-200"
            }`}
          >
            {/* 상태 컬러 바 */}
            <div className={`h-1 w-full ${style.bar}`} />

            <div className="p-5">
              {/* 상단: 배지 + 주최 */}
              <div className="flex items-center justify-between mb-3">
                <span className={`text-xs px-2.5 py-1 rounded-full ${style.badge}`}>
                  {statusKey}
                </span>
                {race.organizer && (
                  <span className="text-xs text-gray-400">{race.organizer}</span>
                )}
              </div>

              {/* 대회명 */}
              <h3 className={`font-bold text-base mb-3 leading-snug ${isOpen ? "text-gray-900" : "text-gray-500"}`}>
                {isKo ? race.name : race.nameEn}
              </h3>

              {/* 날짜·장소 */}
              <div className="space-y-1.5 mb-3">
                <div className="flex items-center gap-2 text-sm">
                  <span className="text-[#1e3a6e] text-xs font-bold w-4 shrink-0">D</span>
                  <span className={isOpen ? "text-gray-700 font-medium" : "text-gray-400"}>
                    {isKo ? race.date : race.dateEn}
                  </span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <span className="text-[#1e3a6e] text-xs font-bold w-4 shrink-0">L</span>
                  <span className="text-gray-500">{isKo ? race.location : race.locationEn}</span>
                </div>
              </div>

              {/* 코스 태그 */}
              {race.courses.length > 0 && (
                <div className="flex flex-wrap gap-1.5">
                  {race.courses.map((c) => (
                    <span
                      key={c.name}
                      className={`text-xs px-2 py-0.5 rounded border ${
                        isOpen
                          ? "border-[#1e3a6e]/20 text-[#1e3a6e] bg-[#f0f3f9]"
                          : "border-gray-200 text-gray-400 bg-gray-50"
                      }`}
                    >
                      {c.name}
                    </span>
                  ))}
                </div>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}
