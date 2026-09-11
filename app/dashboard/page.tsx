import type { Metadata } from "next"
import PageChrome from "@/components/page-chrome"
import DashboardBook from "@/components/dashboard-book"
import { getDashboardSnapshot } from "@/lib/dashboard"
import { SITE_NAME, SITE_URL } from "@/lib/site"

const title = `Public book — ${SITE_NAME}`
const description =
  "Pixel Peeper weekday public book: paper equity, positions, orders, inception curve, and trade journal."

export const metadata: Metadata = {
  title,
  description,
  alternates: { canonical: `${SITE_URL}/dashboard` },
  openGraph: {
    title,
    description,
    url: `${SITE_URL}/dashboard`,
    siteName: SITE_NAME,
    images: [{ url: "/og/default.svg", width: 1200, height: 630, alt: title }],
  },
  twitter: {
    card: "summary_large_image",
    title,
    description,
    images: ["/og/default.svg"],
  },
}

export default async function DashboardPage() {
  const { book, journal } = await getDashboardSnapshot()

  return (
    <PageChrome>
      <main
        id="main-content"
        tabIndex={-1}
        className="border border-[#333] bg-[rgba(20,20,20,0.7)] p-4 md:p-6 overflow-auto"
      >
        <DashboardBook book={book} journal={journal} />
      </main>
    </PageChrome>
  )
}
