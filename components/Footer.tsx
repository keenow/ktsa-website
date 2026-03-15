import { useTranslations, useLocale } from "next-intl";
import Link from "next/link";

export default function Footer() {
  const t = useTranslations("footer");
  const tc = useTranslations("nav");
  const locale = useLocale();

  return (
    <footer className="bg-gray-900 text-gray-300 mt-16">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Brand */}
          <div>
            <div className="flex items-center gap-2 mb-3">
              <div className="w-8 h-8 bg-green-600 rounded-full flex items-center justify-center">
                <span className="text-white font-bold text-sm">K</span>
              </div>
              <span className="font-bold text-white text-lg">KTSA</span>
            </div>
            <p className="text-sm text-gray-400">{t("association")}</p>
          </div>

          {/* Links */}
          <div>
            <h3 className="text-white font-semibold mb-3 text-sm">Menu</h3>
            <ul className="space-y-2 text-sm">
              <li><Link href={`/${locale}/about`} className="hover:text-white transition-colors">{tc("about")}</Link></li>
              <li><Link href={`/${locale}/races`} className="hover:text-white transition-colors">{tc("races")}</Link></li>
              <li><Link href={`/${locale}/news`} className="hover:text-white transition-colors">{tc("news")}</Link></li>
              <li><Link href={`/${locale}/contact`} className="hover:text-white transition-colors">{tc("contact")}</Link></li>
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h3 className="text-white font-semibold mb-3 text-sm">Legal</h3>
            <ul className="space-y-2 text-sm">
              <li><Link href={`/${locale}/privacy`} className="hover:text-white transition-colors">{t("privacy")}</Link></li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-8 pt-6 text-sm text-gray-500 text-center">
          {t("copyright")}
        </div>
      </div>
    </footer>
  );
}
