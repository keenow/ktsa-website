import { useTranslations, useLocale } from "next-intl";

export default function AboutPage() {
  const t = useTranslations("about");
  const locale = useLocale();

  const history = locale === "ko" ? [
    { year: "2010", event: "대한트레일스포츠협회 창립" },
    { year: "2012", event: "첫 공식 대회 개최 — 설악 트레일 30K" },
    { year: "2015", event: "국제 트레일러닝협회(ITRA) 정회원 가입" },
    { year: "2018", event: "전국 10개 지부 설립" },
    { year: "2020", event: "회원 수 5,000명 돌파" },
    { year: "2023", event: "아시아 트레일 챔피언십 유치" },
  ] : [
    { year: "2010", event: "Founded Korea Trail Sports Association" },
    { year: "2012", event: "First official race — Seorak Trail 30K" },
    { year: "2015", event: "Joined ITRA as full member" },
    { year: "2018", event: "Established 10 regional chapters" },
    { year: "2020", event: "Reached 5,000 members" },
    { year: "2023", event: "Hosted Asia Trail Championship" },
  ];

  const executives = [
    { role: locale === "ko" ? "임원" : "Executive", name: "장지윤", affiliation: locale === "ko" ? "제이쎄노 대표" : "CEO, Jayceno" },
    { role: locale === "ko" ? "임원" : "Executive", name: "김영록", affiliation: locale === "ko" ? "락앤런 대표" : "CEO, Rock&Run" },
    { role: locale === "ko" ? "임원" : "Executive", name: "김부경", affiliation: locale === "ko" ? "러너스후드 대표" : "CEO, Runners Hood" },
    { role: locale === "ko" ? "임원" : "Executive", name: "김민수", affiliation: locale === "ko" ? "MS행정사 대표" : "CEO, MS Admin" },
    { role: locale === "ko" ? "임원" : "Executive", name: "이승현", affiliation: locale === "ko" ? "트레일서비스 대표" : "CEO, Trail Service" },
  ];

  const directors = [
    { role: locale === "ko" ? "이사" : "Director", name: "김홍일", affiliation: locale === "ko" ? "제이쎄노 감독" : "Director, Jayceno" },
    { role: locale === "ko" ? "이사" : "Director", name: "장재훈", affiliation: locale === "ko" ? "태백화점 대표" : "CEO, Taebaek Dept. Store" },
    { role: locale === "ko" ? "이사" : "Director", name: "최창휴", affiliation: locale === "ko" ? "길병원 의사" : "Physician, Gil Hospital" },
  ];

  const auditors = [
    { role: locale === "ko" ? "감사" : "Auditor", name: "조상희", affiliation: locale === "ko" ? "前 산악연맹 차장" : "Former Deputy, Alpine Federation" },
  ];

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-16">
      <h1 className="text-3xl font-bold text-gray-900 mb-2">{t("title")}</h1>
      <div className="w-12 h-1 bg-green-600 mb-12"></div>

      {/* Mission & Vision */}
      <section className="mb-16">
        <h2 className="text-xl font-bold text-gray-800 mb-6">{t("mission_title")}</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <div className="bg-green-50 rounded-xl p-6">
            <h3 className="font-semibold text-green-800 mb-2">Mission</h3>
            <p className="text-gray-700 text-sm leading-relaxed">{t("mission")}</p>
          </div>
          <div className="bg-gray-50 rounded-xl p-6">
            <h3 className="font-semibold text-gray-800 mb-2">Vision</h3>
            <p className="text-gray-700 text-sm leading-relaxed">{t("vision")}</p>
          </div>
        </div>
      </section>

      {/* History */}
      <section className="mb-16">
        <h2 className="text-xl font-bold text-gray-800 mb-6">{t("history_title")}</h2>
        <div className="relative border-l-2 border-green-200 pl-6 space-y-6">
          {history.map((item) => (
            <div key={item.year} className="relative">
              <div className="absolute -left-8 w-4 h-4 rounded-full bg-green-600 border-2 border-white"></div>
              <span className="text-xs font-bold text-green-600 bg-green-50 px-2 py-0.5 rounded">{item.year}</span>
              <p className="text-gray-700 mt-1">{item.event}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Leadership */}
      <section>
        <h2 className="text-xl font-bold text-gray-800 mb-8">{t("leadership_title")}</h2>

        {/* 이사회 구성 기준 */}
        <div className="bg-gray-50 rounded-xl p-6 mb-8 text-sm text-gray-600">
          <h3 className="font-semibold text-gray-800 mb-3">
            {locale === "ko" ? "이사회 구성" : "Board Composition"}
          </h3>
          <ul className="grid grid-cols-2 sm:grid-cols-3 gap-2 list-none">
            {(locale === "ko" ? [
              "회장 1인", "부회장 1인 이상", "사무총장 1인",
              "재무이사 1인", "이사 2인 이상", "감사 1인"
            ] : [
              "President ×1", "Vice President ×1+", "Secretary General ×1",
              "Finance Director ×1", "Directors ×2+", "Auditor ×1"
            ]).map((item) => (
              <li key={item} className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-green-600 flex-shrink-0"></span>
                {item}
              </li>
            ))}
          </ul>
        </div>

        {/* 임원 */}
        <h3 className="text-sm font-semibold text-green-700 uppercase tracking-wider mb-4">
          {locale === "ko" ? "임원" : "Executives"}
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
          {executives.map((person) => (
            <MemberCard key={person.name} {...person} />
          ))}
        </div>

        {/* 이사 */}
        <h3 className="text-sm font-semibold text-green-700 uppercase tracking-wider mb-4">
          {locale === "ko" ? "이사" : "Directors"}
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
          {directors.map((person) => (
            <MemberCard key={person.name} {...person} />
          ))}
        </div>

        {/* 감사 */}
        <h3 className="text-sm font-semibold text-green-700 uppercase tracking-wider mb-4">
          {locale === "ko" ? "감사" : "Auditor"}
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {auditors.map((person) => (
            <MemberCard key={person.name} {...person} />
          ))}
        </div>
      </section>
    </div>
  );
}

function MemberCard({ role, name, affiliation }: { role: string; name: string; affiliation: string }) {
  return (
    <div className="border border-gray-200 rounded-xl p-5 flex items-center gap-4">
      <div className="w-12 h-12 bg-green-50 rounded-full flex-shrink-0 flex items-center justify-center">
        <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
        </svg>
      </div>
      <div>
        <p className="text-xs text-green-600 font-medium">{role}</p>
        <p className="font-semibold text-gray-900">{name}</p>
        <p className="text-xs text-gray-400 mt-0.5">{affiliation}</p>
      </div>
    </div>
  );
}
