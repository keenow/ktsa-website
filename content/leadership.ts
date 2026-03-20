/**
 * 임원진·조직도 콘텐츠
 * 임원 교체, 직책 명칭 변경, 조직도 이미지 교체 시 이 파일만 수정하면 됩니다.
 */

export type Locale = "ko" | "en";

export const leadershipOrgChart = {
  /** `public/` 기준 경로 (PNG·SVG 등). 파일명 바꾸면 여기만 수정 */
  imageSrc: "/org-chart.svg",
  width: 800,
  height: 420,
  alt: {
    ko: "KTSA 조직도",
    en: "KTSA organizational structure",
  },
} as const;

export type Executive = {
  /** 직책 (한국어) */
  titleKo: string;
  /** 직책 (영어) */
  titleEn: string;
  /** 성명 (한국어) */
  nameKo: string;
  /** 성명 (영어) — 해외 공개용 표기가 다를 때만 다르게 적기 */
  nameEn: string;
};

/**
 * 임원진 명단 — 순서가 화면 표시 순서입니다.
 * 실제 인명·직책으로 수정해 사용하세요.
 */
export const executives: Executive[] = [
  {
    titleKo: "회장",
    titleEn: "President",
    nameKo: "김트레일",
    nameEn: "Kim Trail",
  },
  {
    titleKo: "부회장",
    titleEn: "Vice President",
    nameKo: "이마운틴",
    nameEn: "Lee Mountain",
  },
  {
    titleKo: "사무총장",
    titleEn: "Secretary General",
    nameKo: "박런",
    nameEn: "Park Run",
  },
];

export function getExecutiveTitle(exec: Executive, locale: Locale) {
  return locale === "ko" ? exec.titleKo : exec.titleEn;
}

export function getExecutiveName(exec: Executive, locale: Locale) {
  return locale === "ko" ? exec.nameKo : exec.nameEn;
}

export function getOrgChartAlt(locale: Locale) {
  return leadershipOrgChart.alt[locale];
}
