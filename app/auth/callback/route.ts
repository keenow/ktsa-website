import { NextRequest, NextResponse } from "next/server"

export async function GET(request: NextRequest) {
  const url = new URL(request.url)
  const newUrl = new URL(`/ko/auth/callback${url.search}`, url.origin)
  return NextResponse.redirect(newUrl)
}
