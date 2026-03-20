/**
 * KTSA 조직도 데이터
 * ─────────────────────────────────────────────
 * 이 파일만 수정하면 조직도가 자동으로 업데이트됩니다.
 * 새 직책 추가, 인원 교체, 위원회 수정 모두 여기서.
 */

// ─── 타입 정의 ────────────────────────────────

/** 이름·소속 등 다국어 텍스트 */
export interface I18nText {
  ko: string;
  en: string;
}

/** 단일 직책 객체 */
export interface OrgMember {
  role: I18nText;        // 직책 (예: 회장, President)
  name: string;          // 이름 (공식 표기, 한국어)
  nameEn?: string;       // 영문 이름 (없으면 name 사용)
  org: I18nText;         // 소속 기관
  color?: OrgColor;      // 박스 색상 (기본값은 레이어별로 자동 지정)
}

/** 위원회·운영 기구 */
export interface Committee {
  name: I18nText;
  description?: I18nText;
}

/** 사용 가능한 박스 색상 */
export type OrgColor = "navy" | "green" | "orange" | "amber" | "teal" | "slate";


// ─── 거버넌스 계층 ─────────────────────────────

/** 최고 의결기구 */
export const generalAssembly: I18nText = {
  ko: "총회",
  en: "General Assembly",
};

/** 이사회 */
export const boardOfDirectors: I18nText = {
  ko: "이사회 (임원)",
  en: "Board of Directors",
};


// ─── 이사·감사 ─────────────────────────────────

export const boardMembers: OrgMember[] = [
  {
    role: { ko: "이사", en: "Director" },
    name: "김홍일",
    nameEn: "Kim Hong-il",
    org: { ko: "제이쎄노 감독", en: "Director, JSCENO" },
  },
  {
    role: { ko: "이사", en: "Director" },
    name: "장재훈",
    nameEn: "Jang Jae-hun",
    org: { ko: "태백화점 대표", en: "CEO, Taebaek" },
  },
  {
    role: { ko: "이사", en: "Director" },
    name: "최창휴",
    nameEn: "Choi Chang-hyu",
    org: { ko: "길병원 의사", en: "Physician, Gil Hospital" },
  },
  {
    role: { ko: "감사", en: "Auditor" },
    name: "조상희",
    nameEn: "Jo Sang-hee",
    org: { ko: "(전)산악연맹 차장", en: "Former Deputy Director, Alpine Federation" },
  },
];


// ─── 회장 ──────────────────────────────────────

export const president: OrgMember = {
  role: { ko: "회장", en: "President" },
  name: "장지윤",
  nameEn: "Jang Ji-yun",
  org: { ko: "제이쎄노 대표", en: "CEO, JSCENO" },
  color: "orange",
};


// ─── 회장 직속 임원 ────────────────────────────
// 순서: 화면 왼쪽 → 오른쪽

export const vicePresidents: OrgMember[] = [
  {
    role: { ko: "부회장", en: "Vice President" },
    name: "김영록",
    nameEn: "Kim Yeong-rok",
    org: { ko: "락앤런 대표", en: "CEO, Lock&Run" },
    color: "orange",
  },
  {
    role: { ko: "부회장", en: "Vice President" },
    name: "김부경",
    nameEn: "Kim Bu-gyeong",
    org: { ko: "러너스후드 대표", en: "CEO, Runners Hood" },
    color: "orange",
  },
];

export const secretaryGeneral: OrgMember = {
  role: { ko: "사무처장", en: "Secretary General" },
  name: "김민수",
  nameEn: "Kim Min-su",
  org: { ko: "MS행정사 대표", en: "CEO, MS Admin" },
  color: "teal",
};

export const treasurer: OrgMember = {
  role: { ko: "재무이사", en: "Treasurer" },
  name: "이승현",
  nameEn: "Lee Seunghyun",
  org: { ko: "트레일서비스 대표", en: "CEO, Trail Service" },
  color: "amber",
};


// ─── 위원회 및 운영 기구 ───────────────────────

export const committees: Committee[] = [
  {
    name: { ko: "대회 의료 위원회", en: "Race Medic Committee" },
  },
  {
    name: { ko: "TROF (트레일러닝 대회 조직포럼)", en: "TROF (Trail Running Organiser Forum)" },
    description: {
      ko: "국내 대회 조직자 포럼",
      en: "Forum of Race Organisers in Korea",
    },
  },
];
