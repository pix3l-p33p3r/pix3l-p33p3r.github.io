import { cookies } from "next/headers"
import {
  ADMIN_COOKIE_NAME,
  adminCookieOptions,
  createSessionToken,
  verifySessionToken,
} from "@/lib/admin-auth"

export async function hasAdminSession(): Promise<boolean> {
  const token = cookies().get(ADMIN_COOKIE_NAME)?.value
  return verifySessionToken(token)
}

export async function establishAdminSession(): Promise<boolean> {
  const token = await createSessionToken()
  if (!token) return false
  cookies().set(ADMIN_COOKIE_NAME, token, adminCookieOptions())
  return true
}

export function clearAdminSession(): void {
  cookies().set(ADMIN_COOKIE_NAME, "", adminCookieOptions(0))
}
