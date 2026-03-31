import { getTranslations, getLocale } from "next-intl/server";
import Link from "next/link";
import UpcomingRaces from "@/components/UpcomingRaces";
import { createSupabaseServerClient } from "@/lib/supabase-server";

export default async function HomePage() {
  const locale = await getLocale();
  const t = await getTranslations("home");
  const isKo = locale === "ko";

  // ─── 최신 공지 2건 fetch ──────────────────────────────────
  const supabase = await createSupabaseServerClient();
  const { data: notices } = await supabase
    .from("notices")
    .select("id, category, title_ko, title_en, badge_ko, badge_en, url, pinned, created_at")
    .eq("is_published", true)
    .order("pinned", { ascending: false })
    .order("created_at", { ascending: false })
    .limit(2);

  return (
    <>
      {/* Hero */}
      <section className="bg-gradient-to-br from-[#152d57] to-[#1e3a6e] text-white py-24 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-4xl sm:text-5xl font-bold mb-4 leading-tight">{t("hero_title")}</h1>
          <p className="text-xl text-blue-100 mb-8">{t("hero_subtitle")}</p>
          <Link
            href={`/${locale}/races`}
            className="inline-block bg-white text-[#1e3a6e] font-semibold px-8 py-3 rounded-full hover:bg-gray-50 transition-colors"
          >
            {t("hero_cta")}
          </Link>
        </div>
      </section>

      {/* Upcoming Races */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 py-16">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-gray-900">{t("upcoming_races")}</h2>
          <Link href={`/${locale}/races`} className="text-sm text-[#1e3a6e] hover:underline">{t("view_all")} →</Link>
        </div>
        <UpcomingRaces />
      </section>

      {/* Notice */}
      <section className="bg-gray-50 py-16">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-900">{t("latest_news")}</h2>
            <Link href={`/${locale}/news`} className="text-sm text-[#1e3a6e] hover:underline">{t("view_all")} →</Link>
          </div>

          {(!notices || notices.length === 0) ? (
            <div className="bg-white rounded-xl border border-gray-100 p-8 max-w-2xl text-center">
              <p className="text-gray-400 text-sm">
                {isKo ? "공지사항이 없습니다." : "No announcements yet."}
              </p>
            </div>
          ) : (
            <div className="space-y-4 max-w-2xl">
              {notices.map((notice) => (
                <div key={notice.id} className="bg-white rounded-xl border border-gray-100 p-5 hover:shadow-sm transition-shadow">
                  <div className="flex items-center gap-2 mb-2 flex-wrap">
                    <span className="text-xs font-medium px-2 py-0.5 rounded-full bg-[#1e3a6e] text-white">
                      {isKo ? "공지" : "Notice"}
                    </span>
                    {(isKo ? notice.badge_ko : notice.badge_en) && (
                      <span className="text-xs font-medium px-2 py-0.5 rounded-full bg-red-100 text-red-600">
                        {isKo ? notice.badge_ko : notice.badge_en}
                      </span>
                    )}
                    <span className="text-xs text-gray-400 ml-auto">
                      {new Date(notice.created_at).toLocaleDateString("ko-KR", {
                        year: "numeric", month: "2-digit", day: "2-digit",
                      })}
                    </span>
                  </div>
                  <p className="text-sm font-semibold text-gray-900 mb-1 leading-snug">
                    {isKo ? notice.title_ko : notice.title_en}
                  </p>
                  {notice.url && (
                    <a
                      href={notice.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-xs text-[#1e3a6e] hover:underline"
                    >
                      {isKo ? "자세히 보기 →" : "Learn More →"}
                    </a>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </section>
    </>
  );
}
