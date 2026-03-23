import { useTranslations, useLocale } from "next-intl";
import Link from "next/link";

export default function Footer() {
  const t = useTranslations("footer");
  const tc = useTranslations("nav");
  const locale = useLocale();

  return (
    <footer className="bg-gray-900 text-gray-300 mt-16">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-10">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">

          {/* 법인 정보 */}
          <div className="space-y-1 text-sm text-gray-400">
            <p className="font-semibold text-white mb-2">{t("association")}</p>
            <p>{t("representative")}</p>
            <p>{t("address")}</p>
            <p>{t("reg_number")}</p>
          </div>

          {/* 메뉴 */}
          <div>
            <ul className="flex flex-wrap gap-x-6 gap-y-2 text-sm">
              <li><Link href={`/${locale}/about`} className="hover:text-white transition-colors">{tc("about")}</Link></li>
              <li><Link href={`/${locale}/races`} className="hover:text-white transition-colors">{tc("races")}</Link></li>
              <li><Link href={`/${locale}/news`} className="hover:text-white transition-colors">{tc("news")}</Link></li>
              <li><Link href={`/${locale}/contact`} className="hover:text-white transition-colors">{tc("contact")}</Link></li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-8 pt-6 text-xs text-gray-600 text-center space-y-2">
          <div>
            <Link href={`/${locale}/privacy`} className="hover:text-gray-300 transition-colors underline underline-offset-2">
              {t("privacy_policy")}
            </Link>
          </div>
          <div>{t("copyright")}</div>
        </div>
      </div>
    </footer>
  );
}
