/**
 * 임원진·조직도 콘텐츠 (KTSA 공식 조직도 기준)
 * 인사·직책 변경 시 이 파일만 수정하면 됩니다.
 */

export type Locale = "ko" | "en";

export const leadershipOrgChart = {
  /** 공식 조직도 그래픽 (`public/` 기준) */
  imageSrc: "/org-chart-official.png",
  width: 1024,
  height: 874,
  alt: {
    ko: "KTSA 조직도 — 대한트레일스포츠협회",
    en: "KTSA organizational structure — Korea Trail Sports Association",
  },
} as const;

/** 상단 거버넌스 구조 (라벨만) */
export const governanceLevels = [
  { labelKo: "총회", labelEn: "General Assembly" },
  { labelKo: "이사회 (임원)", labelEn: "Board of Directors" },
] as const;

export type OrgMember = {
  titleKo: string;
  titleEn: string;
  nameKo: string;
  /** 괄호 안 소속·직함 (한글) */
  affiliationKo: string;
  /** 로마자 표기 */
  nameEn: string;
  affiliationEn: string;
};

/** 중앙 임원 라인 — 표시 순서 = 조직도 흐름 */
export const leadershipOfficers: OrgMember[] = [
  {
    titleKo: "회장",
    titleEn: "President",
    nameKo: "장지윤",
    affiliationKo: "제이제노 대표",
    nameEn: "Jey Jang",
    affiliationEn: "Representative, JayGeno",
  },
  {
    titleKo: "부회장",
    titleEn: "Vice President",
    nameKo: "김영록",
    affiliationKo: "학현천 대표",
    nameEn: "Kim Yeongrok",
    affiliationEn: "Representative, Hakhyeoncheon",
  },
  {
    titleKo: "부회장",
    titleEn: "Vice President",
    nameKo: "김부경",
    affiliationKo: "러너스월드 대표",
    nameEn: "Kim Bugyeong",
    affiliationEn: "Representative, Runners World",
  },
  {
    titleKo: "사무총장",
    titleEn: "Secretary General",
    nameKo: "김민수",
    affiliationKo: "MD 런닝사 대표",
    nameEn: "Kim Minsu",
    affiliationEn: "Representative, MD Running",
  },
  {
    titleKo: "재무이사",
    titleEn: "Treasurer",
    nameKo: "이승현",
    affiliationKo: "트레일서비스 대표",
    nameEn: "Lee Seunghyeon",
    affiliationEn: "Representative, Trail Service",
  },
];

/** 이사회 구성 — 이사·감사 (조직도 우측 명단) */
export const directorsAndAuditors: OrgMember[] = [
  {
    titleKo: "이사",
    titleEn: "Director",
    nameKo: "김홍일",
    affiliationKo: "테라노 감독",
    nameEn: "Kim Hongil",
    affiliationEn: "Coach, Terano",
  },
  {
    titleKo: "이사",
    titleEn: "Director",
    nameKo: "장재훈",
    affiliationKo: "태백회원 대표",
    nameEn: "Jang Jaehun",
    affiliationEn: "Taebaek members’ representative",
  },
  {
    titleKo: "이사",
    titleEn: "Director",
    nameKo: "최창휴",
    affiliationKo: "길별림 이사",
    nameEn: "Choi Changhyu",
    affiliationEn: "Gilbyeolrim",
  },
  {
    titleKo: "감사",
    titleEn: "Auditor",
    nameKo: "조상희",
    affiliationKo: "화산국경영 차장",
    nameEn: "Jo Sanghui",
    affiliationEn: "Deputy Manager, Hwasan Gukgyeongyeong",
  },
];

export type CommitteeSection = {
  titleKo: string;
  titleEn: string;
  itemsKo: string[];
  itemsEn: string[];
};

/** 조직도 하단 — 거버넌스 / 위원회·운영기구 */
export const committeeSections: CommitteeSection[] = [
  {
    titleKo: "거버넌스",
    titleEn: "Governance",
    itemsKo: ["총회 (사무총장)", "이사회"],
    itemsEn: [
      "General Assembly (Secretary General)",
      "Board of Directors",
    ],
  },
  {
    titleKo: "위원회·운영기구",
    titleEn: "Committees & operational bodies",
    itemsKo: [
      "Race Medic Committee",
      "TROF(Trail Running Organiser Forum) — 한국 트레일 대회 주최자 포럼",
    ],
    itemsEn: [
      "Race Medic Committee",
      "TROF (Trail Running Organiser Forum) — forum of race organisers in Korea",
    ],
  },
];

export function getOrgMemberTitle(m: OrgMember, locale: Locale) {
  return locale === "ko" ? m.titleKo : m.titleEn;
}

export function getOrgMemberLine(m: OrgMember, locale: Locale) {
  return locale === "ko"
    ? `${m.nameKo} (${m.affiliationKo})`
    : `${m.nameEn} (${m.affiliationEn})`;
}

export function getOrgChartAlt(locale: Locale) {
  return leadershipOrgChart.alt[locale];
}

export function getCommitteeItems(section: CommitteeSection, locale: Locale) {
  return locale === "ko" ? section.itemsKo : section.itemsEn;
}

export function getCommitteeTitle(section: CommitteeSection, locale: Locale) {
  return locale === "ko" ? section.titleKo : section.titleEn;
}
