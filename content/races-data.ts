export type Course = { name: string; distance: string };

export type Race = {
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
  /** ISO date string for sorting/filtering (YYYY-MM-DD). null = TBD */
  sortDate: string | null;
};

export const races: Race[] = [
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
    sortDate: "2026-04-03",
  },
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
    sortDate: "2026-04-25",
  },
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
    sortDate: null,
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
    sortDate: "2026-06-01",
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
    sortDate: "2026-08-01",
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
    sortDate: "2026-10-01",
  },
];

/** 오늘 기준 가장 가까운 예정 대회 n개 반환 */
export function getUpcomingRaces(n = 2): Race[] {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const withDate = races
    .filter((r) => r.sortDate !== null && new Date(r.sortDate!) >= today)
    .sort((a, b) => new Date(a.sortDate!).getTime() - new Date(b.sortDate!).getTime());

  const withoutDate = races.filter((r) => r.sortDate === null);

  return [...withDate, ...withoutDate].slice(0, n);
}
