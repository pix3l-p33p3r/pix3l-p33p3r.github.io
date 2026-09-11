import { redirect } from "next/navigation"
import { isAdminPasswordConfigured } from "@/lib/admin-auth"
import { hasAdminSession } from "@/lib/admin-session"
import { loginAdmin } from "@/app/admin/login/actions"

export const dynamic = "force-dynamic"

export const metadata = {
  title: "Admin gate",
  robots: { index: false, follow: false, nocache: true },
}

export default async function AdminLoginPage({
  searchParams,
}: {
  searchParams: { error?: string; next?: string }
}) {
  if (await hasAdminSession()) {
    redirect("/admin/analytics")
  }

  const configured = isAdminPasswordConfigured()
  const denied = searchParams.error === "1"
  const next = searchParams.next?.startsWith("/admin") ? searchParams.next : "/admin/analytics"

  return (
    <main
      id="main-content"
      tabIndex={-1}
      className="min-h-[70vh] flex items-center justify-center border border-[#333] bg-[rgba(20,20,20,0.7)] p-6"
    >
      <div className="w-full max-w-md border border-[#333] bg-black/60 p-6">
        <p className="font-mono text-xs tracking-widest text-[#00ffff]/70 mb-2">ADMIN_GATE</p>
        <h1 className="text-2xl text-[#ff4800] tracking-wider mb-3">Analytics login</h1>
        <p className="text-white/70 text-sm mb-5">
          Private KPI console for Pixel Peeper. Unauthenticated visitors do not see metrics.
        </p>

        {!configured ? (
          <p className="border border-[#ff4800]/60 text-[#ff4800] text-sm p-3 mb-4">
            Dashboard password is not configured on this environment. Set{" "}
            <code className="text-[#00ffff]">ADMIN_DASHBOARD_PASSWORD</code> on the Vercel project. See{" "}
            <code className="text-[#00ffff]">docs/ADMIN_ANALYTICS.md</code>.
          </p>
        ) : null}

        {denied ? (
          <p className="border border-[#ff4800]/60 text-[#ff4800] text-sm p-3 mb-4" role="alert">
            Access denied.
          </p>
        ) : null}

        <form action={loginAdmin} className="flex flex-col gap-4">
          <input type="hidden" name="next" value={next} />
          <label className="flex flex-col gap-2 text-sm text-white/80">
            Password
            <input
              type="password"
              name="password"
              autoComplete="current-password"
              required
              disabled={!configured}
              className="bg-black border border-[#333] px-3 py-2 text-white min-h-11 focus:border-[#00ffff] outline-none disabled:opacity-50"
            />
          </label>
          <button
            type="submit"
            disabled={!configured}
            className="min-h-11 border border-[#00ffff] text-[#00ffff] tracking-wider hover:bg-[rgba(0,255,255,0.08)] disabled:opacity-50 disabled:cursor-not-allowed"
          >
            ENTER
          </button>
        </form>
      </div>
    </main>
  )
}
