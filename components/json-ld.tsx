import { SITE_URL } from "@/lib/site"

const graph = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "WebSite",
      "@id": `${SITE_URL}/#website`,
      name: "Pixel Peeper",
      url: SITE_URL,
    },
    {
      "@type": "Person",
      "@id": `${SITE_URL}/#person`,
      name: "Pixel Peeper",
      url: SITE_URL,
      sameAs: ["https://github.com/pix3l-p33p3r", "https://x.com/PiX3L_P33P3R"],
    },
  ],
}

export default function JsonLd() {
  return (
    <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(graph) }} />
  )
}
