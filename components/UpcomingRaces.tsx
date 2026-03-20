"use client";

import { useLocale } from "next-intl";
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

function getUpcoming(n = 2) {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const withDate = races
    .filter((r) => r.sortDate !== null && new Date(r.sortDate!) >= today)
    .sort((a, b) => new Date(a.sortDate!).getTime() - new Date(b.sortDate!).getTime());

  const withoutDate = races.filter((r) => r.sortDate === null);

  return [...withDate, ...withoutDate].slice(0, n);
}

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
          <h3 className="font-semibold text-gray-900 mb-1">
            {isKo ? race.name : race.nameEn}
          </h3>
          <p className="text-sm text-gray-500">📅 {isKo ? race.date : race.dateEn}</p>
          <p className="text-sm text-gray-400">📍 {isKo ? race.location : race.locationEn}</p>
          {race.courses.length > 0 && (
            <p className="text-xs text-gray-400 mt-2">
              {race.courses.map((c) => c.name).join(" / ")}
            </p>
          )}
        </div>
      ))}
    </div>
  );
}
