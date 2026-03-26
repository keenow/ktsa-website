/**
 * @file 온보딩 프로필 입력 페이지
 * @description 이메일 인증 완료 후 이름·전화번호·생년월일·성별·소속클럽을 입력받아
 *              프로필을 완성하는 온보딩 단계.
 * @module auth
 */

"use client"

import { useActionState } from "react"
import { saveOnboardingProfile } from "./actions"

/**
 * 온보딩 완료 페이지 컴포넌트
 * 이메일 인증 후 최초 1회 프로필 정보 입력
 */
export default function JoinCompletePage() {
  const [error, formAction, isPending] = useActionState(
    saveOnboardingProfile,
    null
  )

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
          <p
            style={{
              color: "#90b4e8",
              fontSize: "13px",
              letterSpacing: "0.08em",
              marginBottom: "8px",
              fontWeight: 500,
            }}
          >
            KTSA 한국트레일스포츠협회
          </p>
          <h1
            style={{
              color: "#ffffff",
              fontSize: "22px",
              fontWeight: 700,
              margin: 0,
            }}
          >
            KTSA에 오신 것을 환영합니다 🎉
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

          {/* 전화번호 */}
          <div style={{ marginBottom: "18px" }}>
            <label style={labelStyle}>
              전화번호 <span style={{ color: "#e53e3e" }}>*</span>
            </label>
            <input
              type="tel"
              name="phone"
              required
              placeholder="010-0000-0000"
              pattern="01[0-9]-\d{3,4}-\d{4}"
              style={inputStyle}
            />
          </div>

          {/* 생년월일 */}
          <div style={{ marginBottom: "18px" }}>
            <label style={labelStyle}>
              생년월일 <span style={{ color: "#e53e3e" }}>*</span>
            </label>
            <input
              type="date"
              name="birth_date"
              required
              style={inputStyle}
            />
          </div>

          {/* 성별 */}
          <div style={{ marginBottom: "18px" }}>
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

          {/* 소속 클럽 (선택) */}
          <div style={{ marginBottom: "28px" }}>
            <label style={labelStyle}>소속 클럽 (선택)</label>
            <input
              type="text"
              name="club"
              placeholder="소속 클럽명 (없으면 비워두세요)"
              style={inputStyle}
            />
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
