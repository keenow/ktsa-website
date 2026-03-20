import { useTranslations, useLocale } from "next-intl";
import OrgChart from "@/components/OrgChart";

export default function AboutPage() {
  const t = useTranslations("about");
  const locale = useLocale() as "ko" | "en";

  const history = locale === "ko" ? [
    { year: "2025. 11", event: "대한트레일스포츠협회 고유번호 취득 (비영리 사단법인)" },
    { year: "2025. 12", event: "대한트레일스포츠협회 설립 · 사업자 등록" },
    { year: "2026. 03", event: "공식 웹사이트 오픈" },
  ] : [
    { year: "Nov 2025", event: "Registered as non-profit association (Unique No. acquired)" },
    { year: "Dec 2025", event: "Korea Trail Sports Association officially founded" },
    { year: "Mar 2026", event: "Official website launched" },
  ];

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-16">
      <h1 className="text-3xl font-bold text-gray-900 mb-2">{t("title")}</h1>
      <div className="w-12 h-1 bg-[#1e3a6e] mb-12"></div>

      {/* Mission & Vision */}
      <section className="mb-16">
        <h2 className="text-xl font-bold text-gray-800 mb-6">{t("mission_title")}</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <div className="bg-[#e8edf5] rounded-xl p-6">
            <h3 className="font-semibold text-[#152d57] mb-2">Mission</h3>
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
        <div className="relative border-l-2 border-[#c0ccdf] pl-6 space-y-6">
          {history.map((item) => (
            <div key={item.year} className="relative">
              <div className="absolute -left-8 w-4 h-4 rounded-full bg-[#1e3a6e] border-2 border-white"></div>
              <span className="text-xs font-bold text-[#1e3a6e] bg-[#e8edf5] px-2 py-0.5 rounded">{item.year}</span>
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
