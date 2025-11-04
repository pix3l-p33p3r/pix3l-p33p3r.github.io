import type { Metadata } from "next"
import Image from "next/image"
import Link from "next/link"
import { getProjectBySlug, projects } from "@/lib/projects"

type PageProps = { params: { slug: string } }

export function generateStaticParams() {
  return projects.map((p) => ({ slug: p.slug }))
}

export function generateMetadata({ params }: PageProps): Metadata {
  const project = getProjectBySlug(params.slug)
  const title = project ? `${project.title} — pix3l_p33p3r` : "Project — pix3l_p33p3r"
  const description = project?.summary ?? "Project details"
  const base = "https://www.pixel-peeper.me"
  const url = `${base}/projects/${params.slug}`
  const image = project?.ogImage ?? "/placeholder.jpg"

  return {
    title,
    description,
    alternates: { canonical: url },
    openGraph: {
      title,
      description,
      url,
      siteName: "pix3l_p33p3r",
      images: [{ url: image, width: 1200, height: 630, alt: title }],
      type: "article",
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [image],
    },
  }
}

export default function ProjectPage({ params }: PageProps) {
  const project = getProjectBySlug(params.slug)
  if (!project) {
    return (
      <div className="p-6">
        <h1 className="text-2xl text-[#ff4800] mb-2">Project not found</h1>
        <Link href="/" className="text-[#00ffff] underline">Go back</Link>
      </div>
    )
  }

  return (
    <div className="p-4 md:p-6">
      <article className="max-w-3xl mx-auto bg-black/60 border border-[#333] p-5 shadow-inner shadow-black/50">
        <header className="mb-4">
          <h1 className="text-3xl md:text-4xl text-[#ff4800] tracking-wider mb-2">{project.title}</h1>
          <p className="text-white/90 text-lg">{project.summary}</p>
        </header>

        <div className="mb-4">
          <Image src={project.ogImage ?? "/placeholder.jpg"} alt={`${project.title} cover`} width={1200} height={630} className="w-full h-auto border border-[#333]" />
        </div>

        <div className="flex flex-wrap gap-2 mb-6">
          {project.tags.map((t) => (
            <span key={t} className="bg-[rgba(0,255,255,0.1)] border border-[#00ffff] py-1 px-3 rounded-full text-sm tracking-wider">
              {t}
            </span>
          ))}
        </div>

        <div className="flex gap-3">
          <a href={project.repoUrl} target="_blank" rel="noopener noreferrer" className="text-[#00ffff] border border-[#00ffff] px-4 py-2 inline-block hover:bg-[rgba(0,255,255,0.1)]">
            View Repository
          </a>
          <Link href="/" className="text-white border border-[#333] px-4 py-2 inline-block hover:bg-white/5">Back Home</Link>
        </div>
      </article>
    </div>
  )
}
