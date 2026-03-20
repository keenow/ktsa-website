import { useTranslations, useLocale } from "next-intl";
import OrgChart from "@/components/OrgChart";

export default function AboutPage() {
  const t = useTranslations("about");
  const locale = useLocale() as "ko" | "en";

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

      {/* Leadership — OrgChart 컴포넌트 */}
      <section>
        <OrgChart locale={locale} />
      </section>
    </div>
  );
}
