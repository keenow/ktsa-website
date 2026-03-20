import { useTranslations } from "next-intl";

export default function ContactPage() {
  const t = useTranslations("contact");

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-16">
      <h1 className="text-3xl font-bold text-gray-900 mb-2">{t("title")}</h1>
      <p className="text-gray-500 mb-2">{t("subtitle")}</p>
      <div className="w-12 h-1 bg-[#1e3a6e] mb-12"></div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
        {/* 연락처 */}
        <div>
          <h2 className="text-lg font-semibold text-gray-800 mb-6">Contact Info</h2>
          <div className="space-y-4">
            {/* 주소 */}
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 bg-[#e8edf5] rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5">
                <svg className="w-4 h-4 text-[#1e3a6e]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              </div>
              <div>
                <p className="text-xs text-gray-400 mb-0.5">{t("address")}</p>
                <p className="text-sm text-gray-700">서울특별시 용산구 두텁바위로69길 4, 101호 (후암동)</p>
              </div>
            </div>

            {/* 이메일 */}
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 bg-[#e8edf5] rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5">
                <svg className="w-4 h-4 text-[#1e3a6e]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
              </div>
              <div>
                <p className="text-xs text-gray-400 mb-0.5">{t("email")}</p>
                <p className="text-sm text-gray-400 italic">준비 중</p>
              </div>
            </div>
          </div>
        </div>

        {/* 문의 양식 */}
        <div>
          <h2 className="text-lg font-semibold text-gray-800 mb-6">{t("form_message")}</h2>
          <form className="space-y-4">
            <div>
              <label className="block text-sm text-gray-600 mb-1">{t("form_name")}</label>
              <input
                type="text"
                placeholder={t("form_placeholder_name")}
                className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#e8edf5] focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm text-gray-600 mb-1">{t("form_email")}</label>
              <input
                type="email"
                placeholder={t("form_placeholder_email")}
                className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#e8edf5] focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm text-gray-600 mb-1">{t("form_message")}</label>
              <textarea
                rows={5}
                placeholder={t("form_placeholder_message")}
                className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#e8edf5] focus:border-transparent resize-none"
              />
            </div>
            <button
              type="submit"
              className="w-full bg-[#1e3a6e] text-white font-semibold py-3 rounded-lg hover:bg-[#152d57] transition-colors"
            >
              {t("form_submit")}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
