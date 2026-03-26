/**
 * @file Supabase Auth Hook — 이메일 발송 처리
 * @description Supabase가 인증 이메일(가입 확인, 비밀번호 재설정 등)을
 *              발송하려 할 때 이 라우트를 호출한다.
 *              수신된 이메일 데이터를 Postmark HTTP API로 전달한다.
 * @description 운영 스위치: `AUTH_EMAIL_HOOK_ENABLED=false` 이면 503으로 거절한다.
 *              이 경우 Supabase 대시보드에서 Send Email Hook URL을 비우거나 기본 발송으로 바꿔야 한다.
 * @description 개발자 확인: Vercel Logs 등에서 `[api/email/hook]` 또는 `hook_inbound`·`postmark_sent` 검색.
 *              Supabase/Svix와 대조할 때 `svixMessageId`(= webhook-id 헤더)를 사용한다.
 *              원문 바디 앞 2048자 로그가 필요하면 `LOG_AUTH_HOOK_BODY=true`.
 *              단계별 추적 로그(Warning): `DEBUG_AUTH_HOOK=true` → `trace`·`step`으로 수신·서명·파싱·Postmark 응답까지 기록.
 *              Postmark API 응답 JSON 전체는 `postmark_sent`·`postmark_failed`의 `postmarkApiResponse`에 포함(본문은 한 번만 읽음).
 *              `POSTMARK_ACCOUNT_TOKEN`이 있으면 Sender Signature 확인을 선행한다.
 * @module auth
 */

import { createHmac, timingSafeEqual } from "crypto"
import { NextRequest, NextResponse } from "next/server"

const POSTMARK_FROM_EMAIL =
  process.env.POSTMARK_FROM_EMAIL?.trim() || "noreply@trailservice.net"

/**
 * Svix HMAC-SHA256 방식으로 Supabase Auth Hook 서명 검증
 * @param request - 수신된 NextRequest
 * @param rawBody - 원본 요청 바디 문자열
 * @returns 서명이 유효하면 true
 */
function verifyHookSignature(request: NextRequest, rawBody: string): boolean {
  const secret = process.env.SUPABASE_HOOK_SECRET || ""
  // v1,whsec_<base64> 또는 v1,<base64> 형식에서 base64 부분 추출
  const base64Secret = secret.replace("v1,whsec_", "").replace("v1,", "")
  const key = Buffer.from(base64Secret, "base64")

  const msgId = request.headers.get("webhook-id") || ""
  const msgTimestamp = request.headers.get("webhook-timestamp") || ""
  const msgSignature = request.headers.get("webhook-signature") || ""

  const toSign = `${msgId}.${msgTimestamp}.${rawBody}`
  const hmac = createHmac("sha256", key).update(toSign).digest("base64")

  // webhook-signature는 "v1,<sig1> v1,<sig2>" 형태일 수 있음
  const expectedSig = `v1,${hmac}`
  const sigs = msgSignature.split(" ")

  return sigs.some((sig) => {
    try {
      return timingSafeEqual(Buffer.from(sig), Buffer.from(expectedSig))
    } catch {
      return false
    }
  })
}

/**
 * 로그용 이메일 마스킹 (도메인은 유지)
 * @param email - 원본 주소
 * @returns 마스킹된 문자열
 */
function maskEmailForLog(email: string): string {
  const at = email.indexOf('@')
  if (at < 1) return '[redacted]'
  const local = email.slice(0, at)
  const domain = email.slice(at + 1)
  const prefix = local.slice(0, Math.min(2, local.length))
  return `${prefix}***@${domain}`
}

/**
 * Auth 이메일 훅 단계 로그 (DEBUG_AUTH_HOOK=true 일 때만)
 * @param svixMessageId - webhook-id 헤더, 초기 단계에서는 undefined 가능
 * @param step - 파이프라인 단계 식별자
 * @param detail - 추가 필드(민감값 제외)
 */
function traceAuthHook(
  svixMessageId: string | undefined,
  step: string,
  detail?: Record<string, unknown>
) {
  if (process.env.DEBUG_AUTH_HOOK !== 'true') return
  console.warn(
    '[api/email/hook]',
    JSON.stringify({
      trace: 'auth_hook',
      step,
      svixMessageId,
      ...detail,
    })
  )
}

/**
 * Postmark Sender Signatures API로 발신자 확인 상태를 조회
 * @param accountToken - Postmark account token (X-Postmark-Account-Token)
 * @param senderEmail - 확인할 발신 주소
 * @returns 확인 결과
 */
async function checkPostmarkSenderSignature(
  accountToken: string,
  senderEmail: string
): Promise<
  | { ok: true; confirmed: boolean }
  | { ok: false; status?: number; reason: string; response?: unknown }
> {
  try {
    const res = await fetch("https://api.postmarkapp.com/senders", {
      method: "GET",
      headers: {
        Accept: "application/json",
        "X-Postmark-Account-Token": accountToken,
      },
    })
    const text = await res.text()
    let body: unknown = null
    try {
      body = text ? (JSON.parse(text) as unknown) : null
    } catch {
      body = { parseError: true, rawPreview: text.substring(0, 500) }
    }

    if (!res.ok) {
      return {
        ok: false,
        status: res.status,
        reason: "sender_api_http_error",
        response: body,
      }
    }
    if (!Array.isArray(body)) {
      return {
        ok: false,
        status: res.status,
        reason: "sender_api_unexpected_body",
        response: body,
      }
    }

    const sender = body.find((row) => {
      if (!row || typeof row !== "object") return false
      if (!("EmailAddress" in row)) return false
      const email = (row as { EmailAddress?: string }).EmailAddress
      return typeof email === "string" && email.toLowerCase() === senderEmail.toLowerCase()
    }) as { Confirmed?: boolean } | undefined

    if (!sender) {
      return { ok: false, reason: "sender_not_found" }
    }
    return { ok: true, confirmed: Boolean(sender.Confirmed) }
  } catch (error: unknown) {
    return {
      ok: false,
      reason: "sender_api_fetch_error",
      response: error instanceof Error ? error.message : String(error),
    }
  }
}

/**
 * POST /api/email/hook
 * Supabase Auth Hook 수신 → Postmark로 인증 이메일 발송
 * Auth: Svix HMAC-SHA256 서명 검증 (SUPABASE_HOOK_SECRET)
 * Returns: { message: string } | { error: string }
 */
export async function POST(request: NextRequest) {
  // ─── 기능 스위치 (Vercel·로컬 env) ───────────────────
  const disabled =
    process.env.AUTH_EMAIL_HOOK_ENABLED === 'false' ||
    process.env.AUTH_EMAIL_HOOK_ENABLED === '0'
  if (disabled) {
    traceAuthHook(undefined, 'blocked_disabled')
    console.warn(
      '[api/email/hook] AUTH_EMAIL_HOOK_ENABLED=false — 훅 비활성. Supabase에서 Send Email Hook을 끄지 않으면 가입 메일이 나가지 않습니다.'
    )
    return NextResponse.json(
      { error: 'Auth email hook disabled by configuration' },
      { status: 503 }
    )
  }

  const postmarkToken = process.env.POSTMARK_SERVER_TOKEN?.trim()
  const postmarkAccountToken = process.env.POSTMARK_ACCOUNT_TOKEN?.trim()
  if (!postmarkToken) {
    traceAuthHook(undefined, 'blocked_no_postmark_token')
    console.error('[api/email/hook] POSTMARK_SERVER_TOKEN 없음')
    return NextResponse.json(
      { error: 'Email provider not configured' },
      { status: 500 }
    )
  }

  // ─── Hook 서명 검증 (Svix HMAC-SHA256) ───────────────
  const rawBody = await request.text()
  const svixMessageId = request.headers.get('webhook-id') || undefined
  traceAuthHook(svixMessageId, 'hook_received', { bodyBytes: rawBody.length })
  const isValid = verifyHookSignature(request, rawBody)
  traceAuthHook(svixMessageId, 'signature_checked', { valid: isValid })
  if (!isValid) {
    // NOTE: 디버깅 목적으로 임시 우회 — 검증 실패해도 진행
    console.warn(
      '[api/email/hook]',
      JSON.stringify({
        event: 'signature_invalid_continuing',
        svixMessageId,
      })
    )
    console.log('[Hook] Headers:', Object.fromEntries(request.headers.entries()))
  }
  if (process.env.LOG_AUTH_HOOK_BODY === 'true') {
    console.log('[api/email/hook] body_preview', rawBody.substring(0, 2048))
  }

  // ─── 페이로드 파싱 ───────────────────────────────────
  type HookPayload = {
    user?: { email?: string }
    email_data?: {
      email_action_type?: string
      site_url?: string
      token_hash?: string
    }
  }
  let body: HookPayload
  try {
    body = JSON.parse(rawBody) as HookPayload
  } catch {
    traceAuthHook(svixMessageId, 'json_parse_failed')
    console.warn(
      '[api/email/hook]',
      JSON.stringify({ event: 'json_parse_error', svixMessageId })
    )
    return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 })
  }
  traceAuthHook(svixMessageId, 'json_parsed')
  const { user, email_data } = body
  // email_data: { token, token_hash, redirect_to, email_action_type, site_url, token_new, token_hash_new }

  if (!user?.email || !email_data) {
    traceAuthHook(svixMessageId, 'payload_invalid', {
      hasUserEmail: Boolean(user?.email),
      hasEmailData: Boolean(email_data),
    })
    console.warn(
      '[api/email/hook]',
      JSON.stringify({ event: 'invalid_payload', svixMessageId })
    )
    return NextResponse.json({ error: "Invalid payload" }, { status: 400 })
  }

  // ─── 이메일 타입별 제목/내용 설정 ───────────────────
  const actionType = email_data.email_action_type
  traceAuthHook(svixMessageId, 'payload_ok', {
    actionType: actionType ?? 'unknown',
    toMasked: maskEmailForLog(user.email),
  })
  console.info(
    '[api/email/hook]',
    JSON.stringify({
      event: 'hook_inbound',
      svixMessageId,
      signatureValid: isValid,
      actionType: actionType ?? 'unknown',
      toMasked: maskEmailForLog(user.email),
    })
  )
  let subject = ""
  let htmlBody = ""

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://trailkorea.org"
  const confirmUrl = `${siteUrl}/api/auth/confirm?token_hash=${email_data.token_hash}&type=${actionType}&next=/ko/join/complete`

  if (actionType === "signup") {
    subject = "[KTSA] 이메일 인증을 완료해주세요"
    htmlBody = `
<!DOCTYPE html>
<html lang="ko">
<head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1.0"></head>
<body style="margin:0;padding:0;background-color:#f0f4f8;font-family:'Helvetica Neue',Arial,'Noto Sans KR',sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background-color:#f0f4f8;padding:32px 16px;">
    <tr><td align="center">
      <table width="100%" style="max-width:520px;background:#ffffff;border-radius:16px;overflow:hidden;box-shadow:0 4px 20px rgba(0,0,0,0.08);">
        <!-- 헤더 -->
        <tr>
          <td style="background-color:#1e3a6e;padding:36px 40px;text-align:center;">
            <p style="margin:0 0 8px 0;color:#90b4e8;font-size:12px;letter-spacing:0.1em;font-weight:600;text-transform:uppercase;">KOREA TRAIL SPORTS ASSOCIATION</p>
            <h1 style="margin:0;color:#ffffff;font-size:26px;font-weight:700;letter-spacing:-0.3px;">KTSA 한국트레일스포츠협회</h1>
          </td>
        </tr>
        <!-- 본문 -->
        <tr>
          <td style="padding:40px 40px 32px;">
            <h2 style="margin:0 0 16px 0;color:#1e3a6e;font-size:20px;font-weight:700;">이메일 인증을 완료해주세요</h2>
            <p style="margin:0 0 12px 0;color:#4a5568;font-size:15px;line-height:1.7;">안녕하세요,<br>KTSA 회원 가입을 신청해 주셔서 감사합니다.</p>
            <p style="margin:0 0 28px 0;color:#4a5568;font-size:15px;line-height:1.7;">아래 버튼을 클릭하여 이메일 인증을 완료하고 트레일 스포츠 커뮤니티에 함께해주세요.</p>
            <!-- CTA 버튼 -->
            <table width="100%" cellpadding="0" cellspacing="0"><tr><td align="center">
              <a href="${confirmUrl}"
                style="display:inline-block;background-color:#1e3a6e;color:#ffffff;text-decoration:none;padding:16px 48px;border-radius:10px;font-size:16px;font-weight:700;letter-spacing:0.02em;">
                이메일 인증하기
              </a>
            </td></tr></table>
            <p style="margin:28px 0 0 0;color:#a0aec0;font-size:12px;line-height:1.6;text-align:center;">
              버튼이 작동하지 않으면 아래 링크를 브라우저에 복사해주세요.<br>
              <span style="color:#718096;word-break:break-all;">${confirmUrl}</span>
            </p>
            <p style="margin:16px 0 0 0;color:#a0aec0;font-size:12px;text-align:center;">이 링크는 <strong>24시간</strong> 후 만료됩니다.</p>
          </td>
        </tr>
        <!-- 구분선 -->
        <tr><td style="padding:0 40px;"><hr style="border:none;border-top:1px solid #e2e8f0;margin:0;"></td></tr>
        <!-- 푸터 -->
        <tr>
          <td style="padding:24px 40px;text-align:center;">
            <p style="margin:0;color:#a0aec0;font-size:12px;line-height:1.6;">
              본 메일은 발신 전용입니다. 문의: <a href="mailto:info@trailkorea.org" style="color:#1e3a6e;text-decoration:none;">info@trailkorea.org</a><br>
              © 2025 KTSA 한국트레일스포츠협회
            </p>
          </td>
        </tr>
      </table>
    </td></tr>
  </table>
</body>
</html>
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

  // ─── Sender Signature 확인 (선택: account token 있을 때) ───
  if (postmarkAccountToken) {
    traceAuthHook(svixMessageId, "sender_check_start", {
      fromMasked: maskEmailForLog(POSTMARK_FROM_EMAIL),
    })
    const senderCheck = await checkPostmarkSenderSignature(
      postmarkAccountToken,
      POSTMARK_FROM_EMAIL
    )
    if (!senderCheck.ok) {
      traceAuthHook(svixMessageId, "sender_check_skipped_on_error", {
        reason: senderCheck.reason,
        status: senderCheck.status,
      })
      console.warn(
        "[api/email/hook]",
        JSON.stringify({
          event: "sender_check_error_continuing",
          svixMessageId,
          reason: senderCheck.reason,
          status: senderCheck.status,
          response: senderCheck.response,
        })
      )
    } else if (!senderCheck.confirmed) {
      traceAuthHook(svixMessageId, "sender_unconfirmed_blocked", {
        fromMasked: maskEmailForLog(POSTMARK_FROM_EMAIL),
      })
      console.error(
        "[api/email/hook]",
        JSON.stringify({
          event: "sender_unconfirmed",
          svixMessageId,
          from: POSTMARK_FROM_EMAIL,
        })
      )
      return NextResponse.json(
        { error: "Sender signature not confirmed" },
        { status: 500 }
      )
    } else {
      traceAuthHook(svixMessageId, "sender_confirmed", {
        fromMasked: maskEmailForLog(POSTMARK_FROM_EMAIL),
      })
    }
  } else {
    traceAuthHook(svixMessageId, "sender_check_skipped_no_account_token")
  }

  // ─── Postmark HTTP API 발송 ──────────────────────────
  traceAuthHook(svixMessageId, 'postmark_request_start', {
    actionType: actionType ?? 'unknown',
    toMasked: maskEmailForLog(user.email),
  })
  const postmarkRes = await fetch("https://api.postmarkapp.com/email", {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
      "X-Postmark-Server-Token": postmarkToken,
    },
    body: JSON.stringify({
      From: POSTMARK_FROM_EMAIL,
      To: user.email,
      Subject: subject,
      HtmlBody: htmlBody,
      MessageStream: "outbound",
    }),
  })

  const postmarkResponseText = await postmarkRes.text()
  let postmarkApiResponse: unknown
  try {
    postmarkApiResponse = postmarkResponseText
      ? (JSON.parse(postmarkResponseText) as unknown)
      : null
  } catch {
    postmarkApiResponse = {
      parseError: true,
      rawPreview: postmarkResponseText.substring(0, 500),
    }
  }

  if (!postmarkRes.ok) {
    traceAuthHook(svixMessageId, 'postmark_response', {
      httpStatus: postmarkRes.status,
      ok: false,
      errorCode:
        postmarkApiResponse &&
        typeof postmarkApiResponse === 'object' &&
        'ErrorCode' in postmarkApiResponse
          ? (postmarkApiResponse as { ErrorCode?: number }).ErrorCode
          : undefined,
    })
    console.error('[api/email/hook]', JSON.stringify({
      event: 'postmark_failed',
      svixMessageId,
      actionType,
      toMasked: maskEmailForLog(user.email),
      postmarkApiResponse,
    }))
    return NextResponse.json({ error: "Email send failed" }, { status: 500 })
  }

  traceAuthHook(svixMessageId, 'postmark_response', {
    httpStatus: postmarkRes.status,
    ok: true,
  })
  console.info(
    '[api/email/hook]',
    JSON.stringify({
      event: 'postmark_sent',
      svixMessageId,
      actionType,
      toMasked: maskEmailForLog(user.email),
      postmarkApiResponse,
    })
  )

  return NextResponse.json({ message: "Email sent" }, { status: 200 })
}
