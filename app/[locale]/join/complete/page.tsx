/**
 * @file 온보딩 프로필 입력 페이지
 * @description 이메일 인증 완료 후 이름·전화번호·생년월일·성별을 입력받아
 *              프로필을 완성하는 온보딩 단계.
 * @module auth
 */

"use client"

import { useState } from "react"
import { useActionState } from "react"
import { saveOnboardingProfile } from "./actions"

// ─── 국가 코드 목록 ──────────────────────────────────────────

const COUNTRY_CODES = [
  { label: "🇰🇷 대한민국", value: "+82" },
  { label: "🇺🇸 미국/캐나다", value: "+1" },
  { label: "🇨🇳 중국", value: "+86" },
  { label: "🇯🇵 일본", value: "+81" },
  { label: "🇬🇧 영국", value: "+44" },
  { label: "🇦🇺 호주", value: "+61" },
  { label: "🇩🇪 독일", value: "+49" },
  { label: "🇫🇷 프랑스", value: "+33" },
  { label: "기타 (직접입력)", value: "other" },
]

// ─── 전화번호 자동 포맷 ─────────────────────────────────────

/**
 * 한국 전화번호 자동 포맷 (010-XXXX-XXXX)
 */
function formatKoreanPhone(raw: string): string {
  const d = raw.replace(/\D/g, "").slice(0, 11)
  if (d.startsWith("010")) {
    if (d.length <= 3) return d
    if (d.length <= 7) return `${d.slice(0, 3)}-${d.slice(3)}`
    return `${d.slice(0, 3)}-${d.slice(3, 7)}-${d.slice(7)}`
  }
  if (d.startsWith("02")) {
    if (d.length <= 2) return d
    if (d.length <= 6) return `${d.slice(0, 2)}-${d.slice(2)}`
    return `${d.slice(0, 2)}-${d.slice(2, 6)}-${d.slice(6)}`
  }
  if (d.length <= 3) return d
  if (d.length <= 7) return `${d.slice(0, 3)}-${d.slice(3)}`
  return `${d.slice(0, 3)}-${d.slice(3, 7)}-${d.slice(7)}`
}

/**
 * 숫자·공백·하이픈만 허용 (해외 번호용)
 */
function filterForeignPhone(raw: string): string {
  return raw.replace(/[^\d\s\-]/g, "")
}

/**
 * 온보딩 완료 페이지 컴포넌트
 * 이메일 인증 후 최초 1회 프로필 정보 입력
 */
export default function JoinCompletePage() {
  const [error, formAction, isPending] = useActionState(
    saveOnboardingProfile,
    null
  )

  // ─── 전화번호 상태 ───────────────────────────────────────
  const [countryCode, setCountryCode] = useState("+82")
  const [customCode, setCustomCode] = useState("")
  const [localPhone, setLocalPhone] = useState("")

  const isKorea = countryCode === "+82"
  const isOther = countryCode === "other"
  const finalCode = isOther ? customCode : countryCode

  // DB 저장값: "+82 10-8778-3593" 형식 (+82 선택 시 앞의 0 제거)
  const phoneValue = finalCode
    ? `${finalCode} ${isKorea ? localPhone.replace(/^0/, "") : localPhone}`
    : ""

  function handleLocalPhoneChange(raw: string) {
    if (isKorea) {
      setLocalPhone(formatKoreanPhone(raw))
    } else {
      setLocalPhone(filterForeignPhone(raw))
    }
  }

  function handleCountryCodeChange(val: string) {
    setCountryCode(val)
    setLocalPhone("")
  }

  // ─── 생년월일 상태 ───────────────────────────────────────
  const [birthYear, setBirthYear] = useState("")
  const [birthMonth, setBirthMonth] = useState("")
  const [birthDay, setBirthDay] = useState("")

  // 세 값이 모두 선택됐을 때 YYYY-MM-DD 조합
  const birthDate =
    birthYear && birthMonth && birthDay
      ? `${birthYear}-${birthMonth.padStart(2, "0")}-${birthDay.padStart(2, "0")}`
      : ""

  // ─── 연도 목록 (2010 → 1930) ─────────────────────────────
  const years = Array.from({ length: 2010 - 1930 + 1 }, (_, i) => 2010 - i)

  return (
    <main
      style={{
        minHeight: "100vh",
        backgroundColor: "#f5f7fa",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "24px 16px",
        fontFamily: "'Noto Sans KR', sans-serif",
      }}
    >
      <div
        style={{
          width: "100%",
          maxWidth: "480px",
          backgroundColor: "#ffffff",
          borderRadius: "16px",
          overflow: "hidden",
          boxShadow: "0 4px 24px rgba(0,0,0,0.10)",
        }}
      >
        {/* ─── 헤더 ─────────────────────────────────── */}
        <div
          style={{
            backgroundColor: "#1e3a6e",
            padding: "32px 32px 28px",
            textAlign: "center",
          }}
        >
          <h1
            style={{
              color: "#ffffff",
              fontSize: "22px",
              fontWeight: 700,
              margin: 0,
            }}
          >
            한국트레일스포츠협회에 오신 것을 환영합니다
          </h1>
          <p
            style={{
              color: "#b8cfe8",
              fontSize: "14px",
              marginTop: "10px",
              marginBottom: 0,
            }}
          >
            아래 정보를 입력하면 가입이 완료됩니다.
          </p>
        </div>

        {/* ─── 폼 ───────────────────────────────────── */}
        <form action={formAction} style={{ padding: "32px" }}>
          {/* 에러 메시지 */}
          {error && (
            <div
              style={{
                backgroundColor: "#fff0f0",
                border: "1px solid #fca5a5",
                borderRadius: "8px",
                padding: "12px 16px",
                marginBottom: "20px",
                color: "#b91c1c",
                fontSize: "14px",
              }}
            >
              {error}
            </div>
          )}

          {/* 이름 */}
          <div style={{ marginBottom: "18px" }}>
            <label style={labelStyle}>
              이름 <span style={{ color: "#e53e3e" }}>*</span>
            </label>
            <input
              type="text"
              name="name"
              required
              placeholder="홍길동"
              style={inputStyle}
            />
          </div>

          {/* 전화번호 — 국가 코드 선택 + 로컬 번호 입력 */}
          <div style={{ marginBottom: "18px" }}>
            <label style={labelStyle}>
              전화번호 <span style={{ color: "#e53e3e" }}>*</span>
            </label>
            <div style={{ display: "flex", gap: "8px" }}>
              {/* 국가 코드 select */}
              <select
                value={countryCode}
                onChange={(e) => handleCountryCodeChange(e.target.value)}
                style={{ ...inputStyle, flex: "0 0 auto", width: "160px" }}
              >
                {COUNTRY_CODES.map((c) => (
                  <option key={c.value} value={c.value}>
                    {c.label}
                  </option>
                ))}
              </select>

              {/* 기타: 코드 직접 입력 */}
              {isOther && (
                <input
                  type="text"
                  placeholder="+00"
                  value={customCode}
                  onChange={(e) =>
                    setCustomCode(e.target.value.replace(/[^\d+]/g, ""))
                  }
                  style={{ ...inputStyle, flex: "0 0 auto", width: "72px" }}
                />
              )}

              {/* 로컬 번호 입력 */}
              <input
                type="tel"
                placeholder={isKorea ? "010-0000-0000" : "전화번호"}
                value={localPhone}
                onChange={(e) => handleLocalPhoneChange(e.target.value)}
                style={{ ...inputStyle, flex: 1 }}
              />
            </div>

            {/* 최종 조합값을 서버로 전달 */}
            <input type="hidden" name="phone" value={phoneValue} />
          </div>

          {/* 생년월일 — 년/월/일 select */}
          <div style={{ marginBottom: "18px" }}>
            <label style={labelStyle}>
              생년월일 <span style={{ color: "#e53e3e" }}>*</span>
            </label>
            <div style={{ display: "flex", gap: "8px" }}>
              {/* 년 */}
              <select
                value={birthYear}
                onChange={(e) => setBirthYear(e.target.value)}
                style={{ ...inputStyle, flex: "0 0 auto", width: "110px" }}
              >
                <option value="">년</option>
                {years.map((y) => (
                  <option key={y} value={String(y)}>
                    {y}년
                  </option>
                ))}
              </select>

              {/* 월 */}
              <select
                value={birthMonth}
                onChange={(e) => setBirthMonth(e.target.value)}
                style={{ ...inputStyle, flex: "0 0 auto", width: "80px" }}
              >
                <option value="">월</option>
                {Array.from({ length: 12 }, (_, i) => i + 1).map((m) => (
                  <option key={m} value={String(m)}>
                    {m}월
                  </option>
                ))}
              </select>

              {/* 일 */}
              <select
                value={birthDay}
                onChange={(e) => setBirthDay(e.target.value)}
                style={{ ...inputStyle, flex: "0 0 auto", width: "80px" }}
              >
                <option value="">일</option>
                {Array.from({ length: 31 }, (_, i) => i + 1).map((d) => (
                  <option key={d} value={String(d)}>
                    {d}일
                  </option>
                ))}
              </select>
            </div>

            {/* 세 값을 합쳐 YYYY-MM-DD로 서버에 전달 */}
            <input type="hidden" name="birth_date" value={birthDate} />
          </div>

          {/* 성별 */}
          <div style={{ marginBottom: "28px" }}>
            <label style={labelStyle}>
              성별 <span style={{ color: "#e53e3e" }}>*</span>
            </label>
            <select name="gender" required style={inputStyle} defaultValue="">
              <option value="" disabled>
                선택해주세요
              </option>
              <option value="M">남성</option>
              <option value="F">여성</option>
              <option value="OTHER">기타</option>
            </select>
          </div>

          {/* 제출 버튼 */}
          <button
            type="submit"
            disabled={isPending}
            style={{
              width: "100%",
              padding: "14px",
              backgroundColor: isPending ? "#7a9cc4" : "#1e3a6e",
              color: "#ffffff",
              border: "none",
              borderRadius: "10px",
              fontSize: "16px",
              fontWeight: 700,
              cursor: isPending ? "not-allowed" : "pointer",
              transition: "background-color 0.2s",
            }}
          >
            {isPending ? "저장 중..." : "가입 완료하기"}
          </button>
        </form>
      </div>
    </main>
  )
}

// ─── 스타일 상수 ─────────────────────────────────────────

const labelStyle: React.CSSProperties = {
  display: "block",
  marginBottom: "6px",
  fontSize: "14px",
  fontWeight: 600,
  color: "#2d3748",
}

const inputStyle: React.CSSProperties = {
  width: "100%",
  padding: "10px 14px",
  border: "1px solid #cbd5e0",
  borderRadius: "8px",
  fontSize: "15px",
  color: "#1a202c",
  backgroundColor: "#fff",
  boxSizing: "border-box",
  outline: "none",
}
