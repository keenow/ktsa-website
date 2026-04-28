"use client";

/**
 * @file 마크다운 본문 렌더링 컴포넌트
 * @description 공지·뉴스 본문의 마크다운 텍스트를 HTML로 변환하여 표시.
 *              표(table), 목록, 제목, 강조 등 GFM 문법 지원.
 *              외부 패키지 없이 순수 파싱으로 구현 (Vercel Edge 호환)
 * @module ui
 */

interface MarkdownBodyProps {
  content: string;
  className?: string;
}

/** 마크다운 인라인 요소(굵게, 이탤릭, 링크) 변환 */
function parseInline(text: string): string {
  return text
    .replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>")
    .replace(/\*(.+?)\*/g, "<em>$1</em>")
    .replace(/\[([^\]]+)\]\(([^)]+)\)/g,
      '<a href="$2" target="_blank" rel="noopener noreferrer" class="text-[#1e3a6e] underline hover:text-blue-800">$1</a>')
    .replace(/`([^`]+)`/g, '<code class="bg-gray-100 px-1 rounded text-sm">$1</code>');
}

/** 마크다운 → HTML 변환 */
function parseMarkdown(md: string): string {
  const lines = md.split("\n");
  const html: string[] = [];
  let i = 0;

  while (i < lines.length) {
    const line = lines[i];

    // ─── 빈 줄 ───────────────────────────────────────
    if (line.trim() === "") { i++; continue; }

    // ─── 제목 ────────────────────────────────────────
    if (/^#{1,3}\s/.test(line)) {
      const level = line.match(/^(#+)/)?.[1].length ?? 1;
      const text = parseInline(line.replace(/^#+\s/, ""));
      const sizes = ["text-xl", "text-lg", "text-base"];
      const cls = `${sizes[Math.min(level, 3) - 1]} font-bold text-gray-900 mt-5 mb-2`;
      html.push(`<h${level} class="${cls}">${text}</h${level}>`);
      i++; continue;
    }

    // ─── 표 ──────────────────────────────────────────
    if (line.trim().startsWith("|") && i + 1 < lines.length && /^\|[-| ]+\|/.test(lines[i + 1])) {
      const headers = line.split("|").filter((_, idx, arr) => idx > 0 && idx < arr.length - 1);
      let tableHtml = '<div class="overflow-x-auto my-4"><table class="w-full border-collapse text-sm">';
      tableHtml += '<thead class="bg-[#1e3a6e] text-white"><tr>';
      headers.forEach(h => {
        tableHtml += `<th class="border border-gray-300 px-3 py-2 text-left font-semibold whitespace-nowrap">${parseInline(h.trim())}</th>`;
      });
      tableHtml += "</tr></thead><tbody>";
      i += 2; // 헤더 + 구분선 건너뜀
      let rowIdx = 0;
      while (i < lines.length && lines[i].trim().startsWith("|")) {
        const cells = lines[i].split("|").filter((_, idx, arr) => idx > 0 && idx < arr.length - 1);
        const rowCls = rowIdx % 2 === 1 ? " class=\"bg-gray-50\"" : "";
        tableHtml += `<tr${rowCls}>`;
        cells.forEach(c => {
          tableHtml += `<td class="border border-gray-200 px-3 py-2">${parseInline(c.trim())}</td>`;
        });
        tableHtml += "</tr>";
        i++; rowIdx++;
      }
      tableHtml += "</tbody></table></div>";
      html.push(tableHtml);
      continue;
    }

    // ─── 목록 ────────────────────────────────────────
    if (/^[-*]\s/.test(line)) {
      let listHtml = '<ul class="list-disc list-inside space-y-1 my-2 pl-2">';
      while (i < lines.length && /^[-*]\s/.test(lines[i])) {
        listHtml += `<li class="text-gray-700">${parseInline(lines[i].replace(/^[-*]\s/, ""))}</li>`;
        i++;
      }
      listHtml += "</ul>";
      html.push(listHtml);
      continue;
    }

    // ─── 번호 목록 ───────────────────────────────────
    if (/^\d+\.\s/.test(line)) {
      let listHtml = '<ol class="list-decimal list-inside space-y-1 my-2 pl-2">';
      while (i < lines.length && /^\d+\.\s/.test(lines[i])) {
        listHtml += `<li class="text-gray-700">${parseInline(lines[i].replace(/^\d+\.\s/, ""))}</li>`;
        i++;
      }
      listHtml += "</ol>";
      html.push(listHtml);
      continue;
    }

    // ─── 일반 단락 ───────────────────────────────────
    html.push(`<p class="my-2 leading-relaxed text-gray-700">${parseInline(line)}</p>`);
    i++;
  }

  return html.join("\n");
}

/**
 * 마크다운 본문 렌더러
 * @param content - 마크다운 문자열
 * @param className - 추가 클래스
 */
export default function MarkdownBody({ content, className = "" }: MarkdownBodyProps) {
  const html = parseMarkdown(content);
  return (
    <div
      className={`text-sm ${className}`}
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
}
