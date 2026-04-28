"use client";

/**
 * @file 마크다운 본문 렌더링 컴포넌트
 * @description 공지·뉴스 본문의 마크다운 텍스트를 HTML로 변환하여 표시.
 *              표(table), 목록, 제목, 강조 등 GFM 문법 지원.
 * @module ui
 */

import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

interface MarkdownBodyProps {
  content: string;
  className?: string;
}

/**
 * 마크다운 본문 렌더러
 * @param content - 마크다운 문자열
 * @param className - 추가 클래스
 */
export default function MarkdownBody({ content, className = "" }: MarkdownBodyProps) {
  return (
    <div className={`prose prose-sm max-w-none text-gray-700 ${className}`}>
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        components={{
          // ─── 표 스타일 ──────────────────────────────────
          table: ({ children }) => (
            <div className="overflow-x-auto my-4">
              <table className="w-full border-collapse text-sm">
                {children}
              </table>
            </div>
          ),
          thead: ({ children }) => (
            <thead className="bg-[#1e3a6e] text-white">{children}</thead>
          ),
          th: ({ children }) => (
            <th className="border border-gray-300 px-3 py-2 text-left font-semibold whitespace-nowrap">
              {children}
            </th>
          ),
          td: ({ children }) => (
            <td className="border border-gray-200 px-3 py-2">{children}</td>
          ),
          tr: ({ children }) => (
            <tr className="even:bg-gray-50">{children}</tr>
          ),
          // ─── 제목 스타일 ─────────────────────────────────
          h1: ({ children }) => (
            <h1 className="text-xl font-bold text-gray-900 mt-6 mb-2">{children}</h1>
          ),
          h2: ({ children }) => (
            <h2 className="text-lg font-bold text-gray-900 mt-5 mb-2">{children}</h2>
          ),
          h3: ({ children }) => (
            <h3 className="text-base font-semibold text-gray-800 mt-4 mb-1">{children}</h3>
          ),
          // ─── 목록 스타일 ─────────────────────────────────
          ul: ({ children }) => (
            <ul className="list-disc list-inside space-y-1 my-2 pl-2">{children}</ul>
          ),
          ol: ({ children }) => (
            <ol className="list-decimal list-inside space-y-1 my-2 pl-2">{children}</ol>
          ),
          // ─── 링크 스타일 ─────────────────────────────────
          a: ({ href, children }) => (
            <a
              href={href}
              target="_blank"
              rel="noopener noreferrer"
              className="text-[#1e3a6e] underline hover:text-blue-800"
            >
              {children}
            </a>
          ),
          // ─── 단락 ───────────────────────────────────────
          p: ({ children }) => (
            <p className="my-2 leading-relaxed">{children}</p>
          ),
        }}
      >
        {content}
      </ReactMarkdown>
    </div>
  );
}
