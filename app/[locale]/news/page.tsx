import { useTranslations, useLocale } from "next-intl";

export default function NewsPage() {
  const t = useTranslations("news");
  const locale = useLocale();
  const isKo = locale === "ko";

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-16">
      <h1 className="text-3xl font-bold text-gray-900 mb-2">{t("title")}</h1>
      <p className="text-gray-500 mb-2">{t("subtitle")}</p>
      <div className="w-12 h-1 bg-[#1e3a6e] mb-10"></div>

      <div className="bg-gray-50 rounded-xl p-12 text-center">
        <p className="text-gray-400 text-sm">
          {isKo ? "공지사항이 준비 중입니다." : "Announcements coming soon."}
        </p>
      </div>
    </div>
  );
}
