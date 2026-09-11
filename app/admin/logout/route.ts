import { NextResponse } from "next/server"
import { ADMIN_COOKIE_NAME, adminCookieOptions } from "@/lib/admin-auth"

export const dynamic = "force-dynamic"

export function POST(request: Request): NextResponse {
  const login = new URL("/admin/login", request.url)
  const response = NextResponse.redirect(login, 303)
  response.cookies.set(ADMIN_COOKIE_NAME, "", adminCookieOptions(0))
  return response
}

export function GET(request: Request): NextResponse {
  return POST(request)
}
