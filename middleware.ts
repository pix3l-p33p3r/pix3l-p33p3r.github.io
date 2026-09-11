import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"
import { ADMIN_COOKIE_NAME, isAdminPath, verifySessionToken } from "@/lib/admin-auth"

function wantsHtml(request: NextRequest): boolean {
  const accept = request.headers.get("accept") ?? ""
  return accept.includes("text/html")
}

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl
  if (!isAdminPath(pathname)) return NextResponse.next()
  if (pathname === "/admin/login" || pathname.startsWith("/admin/login/")) {
    return NextResponse.next()
  }
  if (pathname === "/admin/logout" || pathname.startsWith("/admin/logout/")) {
    return NextResponse.next()
  }

  const token = request.cookies.get(ADMIN_COOKIE_NAME)?.value
  if (await verifySessionToken(token)) {
    return NextResponse.next()
  }

  if (wantsHtml(request) && request.method === "GET") {
    const login = request.nextUrl.clone()
    login.pathname = "/admin/login"
    login.search = ""
    login.searchParams.set("next", pathname)
    return NextResponse.redirect(login)
  }

  return new NextResponse("Unauthorized", {
    status: 401,
    headers: {
      "Cache-Control": "private, no-store",
    },
  })
}

export const config = {
  matcher: ["/admin", "/admin/:path*"],
}
