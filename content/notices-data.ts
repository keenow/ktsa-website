/**
 * @file KTSA 공지사항 데이터
 * @module ui
 */

export type Notice = {
  id: string;
  category: string;
  categoryEn: string;
  title: string;
  titleEn: string;
  date: string;
  summary: string;
  summaryEn: string;
  url?: string;
  badge?: string;
  badgeEn?: string;
};

export const notices: Notice[] = [
  {
    id: "aptrc-2026-team-korea",
    category: "공지",
    categoryEn: "Notice",
    title: "2026 APTRC 대한민국 선수단 선발 안내",
    titleEn: "2026 APTRC – Korea National Team Selection Notice",
    date: "2026-03-31",
    summary:
      "제2회 아시아 태평양 트레일 러닝 챔피언십(APTRC)이 2026년 11월 중국 우이산에서 개최됩니다. 대한민국 선수단은 ITRA PI를 기준으로 선발 예정이며, 선수단 접수 일정이 확정되는 대로 국가 대표 출전 자격이 있는 선수에게 이메일이 발송됩니다.\n\n챔피언십 경기 일정\n• 11월 26일(목): 롱 트레일 80km\n• 11월 27일(금): U23 & 숏 트레일 40km\n\n공식 홈페이지는 현재 업데이트 중입니다.",
    summaryEn:
      "The 2nd APTRC will be held in Wuyishan, China in November 2026. The Korea national team will be selected based on ITRA PI scores. Athletes eligible for national team participation will be notified by email once registration schedule is confirmed.\n\nChampionship Schedule\n• Nov 26 (Thu): Long Trail 80 km\n• Nov 27 (Fri): U23 & Short Trail 40 km\n\nThe official website is currently being updated.",
    url: "https://www.aptrc2026.com/ko",
    badge: "선수단 모집",
    badgeEn: "Team Selection",
  },
  {
    id: "aptrc-2026-open",
    category: "공지",
    categoryEn: "Notice",
    title: "제2회 APTRC 오픈경기 참가 안내 (마감 4월 10일)",
    titleEn: "2nd APTRC Open Race Registration – Deadline April 10",
    date: "2026-03-31",
    summary:
      "제2회 APTRC는 제11회 그랜드 우이산 슈퍼 트레일 레이스와 동시 개최됩니다. 아마추어 선수들이 참가할 수 있는 오픈경기(100/60/35/20/10km)는 11월 28–29일 진행되며, 참가 신청 마감은 4월 10일입니다.",
    summaryEn:
      "The 2nd APTRC is co-hosted with the 11th Grand Wuyi Super Trail Race. Open categories (100/60/35/20/10 km) for amateur runners run November 28–29. Registration closes April 10.",
    url: "https://www.wuyitrail.com/",
    badge: "마감임박",
    badgeEn: "Closing Soon",
  },
];
