/**
 * @file Supabase Auth Hook — 이메일 발송 처리
 * @description Supabase가 인증 이메일(가입 확인, 비밀번호 재설정 등)을
 *              발송하려 할 때 이 라우트를 호출한다.
 *              수신된 이메일 데이터를 Postmark HTTP API로 전달한다.
 * @module auth
 */

import { NextRequest, NextResponse } from "next/server"

/**
 * POST /api/email/hook
 * Supabase Auth Hook 수신 → Postmark로 인증 이메일 발송
 * Auth: SUPABASE_HOOK_SECRET Bearer 토큰 검증
 * Returns: { message: string } | { error: string }
 */
export async function POST(request: NextRequest) {
  // ─── Hook 시크릿 검증 ────────────────────────────────
  const authHeader = request.headers.get("authorization")
  const hookSecret = process.env.SUPABASE_HOOK_SECRET
  if (!hookSecret || authHeader !== `Bearer ${hookSecret}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  // ─── 페이로드 파싱 ───────────────────────────────────
  const body = await request.json()
  const { user, email_data } = body
  // email_data: { token, token_hash, redirect_to, email_action_type, site_url, token_new, token_hash_new }

  if (!user?.email || !email_data) {
    return NextResponse.json({ error: "Invalid payload" }, { status: 400 })
  }

  // ─── 이메일 타입별 제목/내용 설정 ───────────────────
  const actionType = email_data.email_action_type
  let subject = ""
  let htmlBody = ""

  const confirmUrl = `${email_data.site_url}/api/auth/confirm?token_hash=${email_data.token_hash}&type=${actionType}&next=/ko/my/dashboard`

  if (actionType === "signup") {
    subject = "[KTSA] 이메일 인증을 완료해주세요"
    htmlBody = `
      <div style="font-family: sans-serif; max-width: 480px; margin: 0 auto; padding: 32px;">
        <h2 style="color: #1e3a6e;">KTSA 한국트레일스포츠협회</h2>
        <p>안녕하세요, KTSA에 가입해주셔서 감사합니다.</p>
        <p>아래 버튼을 클릭하여 이메일 인증을 완료해주세요.</p>
        <a href="${confirmUrl}" style="display:inline-block;background:#1e3a6e;color:#fff;padding:12px 24px;border-radius:8px;text-decoration:none;margin:16px 0;">이메일 인증하기</a>
        <p style="color:#888;font-size:12px;">이 링크는 24시간 후 만료됩니다.</p>
      </div>
    `
  } else if (actionType === "recovery") {
    subject = "[KTSA] 비밀번호 재설정 링크"
    htmlBody = `
      <div style="font-family: sans-serif; max-width: 480px; margin: 0 auto; padding: 32px;">
        <h2 style="color: #1e3a6e;">KTSA 비밀번호 재설정</h2>
        <p>비밀번호 재설정을 요청하셨습니다.</p>
        <a href="${confirmUrl}" style="display:inline-block;background:#1e3a6e;color:#fff;padding:12px 24px;border-radius:8px;text-decoration:none;margin:16px 0;">비밀번호 재설정하기</a>
        <p style="color:#888;font-size:12px;">요청하지 않으셨다면 무시해주세요. 링크는 1시간 후 만료됩니다.</p>
      </div>
    `
  } else if (actionType === "email_change") {
    subject = "[KTSA] 이메일 변경 확인"
    htmlBody = `
      <div style="font-family: sans-serif; max-width: 480px; margin: 0 auto; padding: 32px;">
        <h2 style="color: #1e3a6e;">KTSA 이메일 변경</h2>
        <p>이메일 변경을 요청하셨습니다.</p>
        <a href="${confirmUrl}" style="display:inline-block;background:#1e3a6e;color:#fff;padding:12px 24px;border-radius:8px;text-decoration:none;margin:16px 0;">이메일 변경 확인하기</a>
      </div>
    `
  } else {
    subject = "[KTSA] 인증 요청"
    htmlBody = `<p><a href="${confirmUrl}">여기를 클릭하여 인증을 완료해주세요.</a></p>`
  }

  // ─── Postmark HTTP API 발송 ──────────────────────────
  const postmarkRes = await fetch("https://api.postmarkapp.com/email", {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
      "X-Postmark-Server-Token": process.env.POSTMARK_SERVER_TOKEN!,
    },
    body: JSON.stringify({
      From: "noreply@trailkorea.org",
      To: user.email,
      Subject: subject,
      HtmlBody: htmlBody,
      MessageStream: "outbound",
    }),
  })

  if (!postmarkRes.ok) {
    const err = await postmarkRes.json()
    console.error("Postmark 발송 실패:", err)
    return NextResponse.json({ error: "Email send failed" }, { status: 500 })
  }

  return NextResponse.json({ message: "Email sent" }, { status: 200 })
}
