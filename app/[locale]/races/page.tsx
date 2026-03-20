import { useTranslations, useLocale } from "next-intl";

type Course = { name: string; distance: string };

type Race = {
  name: string;
  nameEn: string;
  date: string;
  dateEn: string;
  location: string;
  locationEn: string;
  courses: Course[];
  status: string;
  statusEn: string;
  note?: string;
  noteEn?: string;
  url?: string;
  organizer?: string;
};

const races: Race[] = [
  // ── KOREA 50K ──────────────────────────────────────────
  {
    name: "2026 KOREA 50K 동두천 (DDC)",
    nameEn: "2026 KOREA 50K Dongducheon (DDC)",
    date: "2026년 4월 25일 (토)",
    dateEn: "April 25, 2026 (Sat)",
    location: "경기도 동두천",
    locationEn: "Dongducheon, Gyeonggi",
    courses: [
      { name: "DDC50", distance: "50km" },
      { name: "DDC20", distance: "20km" },
      { name: "DDC10", distance: "10km" },
      { name: "DDC5",  distance: "5km" },
    ],
    status: "접수마감",
    statusEn: "Closed",
    note: "추첨제 접수 마감",
    noteEn: "Lottery registration closed",
    url: "https://korea50k.com",
    organizer: "JSCENO",
  },
  {
    name: "2026 KOREA 50K 춘천 (CC)",
    nameEn: "2026 KOREA 50K Chuncheon (CC)",
    date: "2026년 6월 (날짜 미정)",
    dateEn: "June 2026 (TBD)",
    location: "강원도 춘천",
    locationEn: "Chuncheon, Gangwon",
    courses: [
      { name: "CC50",          distance: "50km" },
      { name: "CC20 SKYRACE®", distance: "20km" },
      { name: "CC15",          distance: "15km" },
    ],
    status: "추가접수",
    statusEn: "Limited",
    note: "취소분 추가 접수 · 4월 16일(목) 12:00 선착순",
    noteEn: "Additional registration Apr 16 (Thu) 12:00, first-come first-served",
    url: "https://korea50k.com",
    organizer: "JSCENO",
  },

  // ── 락앤런 ─────────────────────────────────────────────
  {
    name: "2026 장수 트레일 레이스",
    nameEn: "2026 Jangsu Trail Race",
    date: "2026년 4월 3일 (금)",
    dateEn: "April 3, 2026 (Fri)",
    location: "전북 장수군 장수읍",
    locationEn: "Jangsu, Jeonbuk",
    courses: [
      { name: "70K",      distance: "70km" },
      { name: "38K-P",    distance: "38km" },
      { name: "20K",      distance: "20km" },
      { name: "5K",       distance: "5km" },
      { name: "Vertical", distance: "-" },
      { name: "Kids",     distance: "-" },
    ],
    status: "접수중",
    statusEn: "Open",
    note: "스폰서: 노스페이스",
    noteEn: "Presented by The North Face",
    url: "https://rocknrun.kr",
    organizer: "락앤런",
  },

  // ── 에코라인 / 태백화점 ────────────────────────────────
  {
    name: "2026 BTC 베어트레일캠프 — 킹스로드 영월",
    nameEn: "2026 B.T.C Bear Trail Camp — Kings Road Yeongwol",
    date: "2026년 봄 (날짜 미정)",
    dateEn: "Spring 2026 (TBD)",
    location: "강원도 영월",
    locationEn: "Yeongwol, Gangwon",
    courses: [],
    status: "접수중",
    statusEn: "Open",
    url: "https://m.eco-line.co.kr",
    organizer: "에코라인",
  },
  {
    name: "2026 다이나핏 태백 트레일",
    nameEn: "2026 Dynafit Taebaek Trail",
    date: "2026년 여름 (접수 미개시)",
    dateEn: "Summer 2026 (Registration TBD)",
    location: "강원도 태백",
    locationEn: "Taebaek, Gangwon",
    courses: [
      { name: "51K", distance: "51km" },
      { name: "30K", distance: "30km" },
    ],
    status: "예정",
    statusEn: "Upcoming",
    note: "UTMB 인덱스 신청 가능",
    noteEn: "UTMB Index eligible",
    url: "https://m.eco-line.co.kr",
    organizer: "에코라인",
  },
  {
    name: "2026 레전드 트레일 문경",
    nameEn: "2026 Legend Trail Mungyeong",
    date: "2026년 하반기 (접수 미개시)",
    dateEn: "Second half 2026 (Registration TBD)",
    location: "경북 문경",
    locationEn: "Mungyeong, Gyeongbuk",
    courses: [
      { name: "34K", distance: "34km" },
      { name: "21K", distance: "21km" },
    ],
    status: "예정",
    statusEn: "Upcoming",
    url: "https://m.eco-line.co.kr",
    organizer: "에코라인",
  },
];

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
