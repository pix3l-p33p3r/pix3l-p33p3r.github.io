import type { Metadata } from "next"
import Link from "next/link"
import Projects from "@/components/projects"
import { SITE_NAME, SITE_URL } from "@/lib/site"

export const metadata: Metadata = {
  title: `Projects — ${SITE_NAME}`,
  description: "Projects in systems, hardware, and DevSecOps.",
  alternates: { canonical: `${SITE_URL}/projects` },
}

export default function ProjectsIndex() {
  return (
    <main className="p-4 md:p-6">
      <div className="max-w-4xl mx-auto">
        <p className="mb-4">
          <Link href="/" className="text-[#00ffff] underline">
            Back Home
          </Link>
        </p>
        <Projects />
      </div>
    </main>
  )
}
