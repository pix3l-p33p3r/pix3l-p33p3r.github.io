import { redirect } from "next/navigation"
import AdminAnalyticsDashboard from "@/components/admin-analytics-dashboard"
import { hasAdminSession } from "@/lib/admin-session"
import { loadAdminAnalytics } from "@/lib/load-admin-analytics"

export const dynamic = "force-dynamic"

export const metadata = {
  title: "Admin analytics",
  robots: { index: false, follow: false, nocache: true },
}

export default async function AdminAnalyticsPage() {
  if (!(await hasAdminSession())) {
    redirect("/admin/login")
  }

  const snapshot = await loadAdminAnalytics()

  return (
    <main
      id="main-content"
      tabIndex={-1}
      className="border border-[#333] bg-[rgba(20,20,20,0.7)] p-4 md:p-6 overflow-auto"
    >
      <AdminAnalyticsDashboard snapshot={snapshot} />
    </main>
  )
}
