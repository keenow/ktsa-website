import type { NextConfig } from "next";
import createNextIntlPlugin from "next-intl/plugin";

const withNextIntl = createNextIntlPlugin("./i18n/request.ts");

const securityHeaders = [
  // 클릭재킹 방지
  {
    key: "X-Frame-Options",
    value: "SAMEORIGIN",
  },
  // MIME 스니핑 방지
  {
    key: "X-Content-Type-Options",
    value: "nosniff",
  },
  // Referrer 정책 — 외부 사이트에 URL 노출 최소화
  {
    key: "Referrer-Policy",
    value: "strict-origin-when-cross-origin",
  },
  // 브라우저 기능 권한 제한
  {
    key: "Permissions-Policy",
    value: "camera=(), microphone=(), geolocation=(), payment=()",
  },
  // HSTS — HTTPS 강제 (2년, 서브도메인 포함)
  {
    key: "Strict-Transport-Security",
    value: "max-age=63072000; includeSubDomains; preload",
  },
  // XSS 방지 — CSP
  {
    key: "Content-Security-Policy",
    value: [
      "default-src 'self'",
      "script-src 'self' 'unsafe-inline' 'unsafe-eval'", // Next.js 인라인 스크립트 허용
      "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
      "font-src 'self' https://fonts.gstatic.com",
      "img-src 'self' data: blob: https:",
      "connect-src 'self'",
      "frame-ancestors 'self'",
    ].join("; "),
  },
];

const nextConfig: NextConfig = {
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: securityHeaders,
      },
    ];
  },
};

export default withNextIntl(nextConfig);
