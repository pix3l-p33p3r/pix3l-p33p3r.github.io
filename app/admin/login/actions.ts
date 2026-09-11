"use server"

import { redirect } from "next/navigation"
import { safeAdminNextPath, verifyAdminPassword } from "@/lib/admin-auth"
import { establishAdminSession } from "@/lib/admin-session"

export async function loginAdmin(formData: FormData): Promise<void> {
  const password = String(formData.get("password") ?? "")
  const next = safeAdminNextPath(String(formData.get("next") ?? ""))

  const accepted = await verifyAdminPassword(password)
  if (!accepted) {
    redirect(`/admin/login?error=1&next=${encodeURIComponent(next)}`)
  }

  const session = await establishAdminSession()
  if (!session) {
    redirect(`/admin/login?error=1&next=${encodeURIComponent(next)}`)
  }

  redirect(next)
}
