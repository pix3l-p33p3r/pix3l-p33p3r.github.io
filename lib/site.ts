/** Canonical production site URL (no trailing slash). */
export const SITE_URL = "https://www.pixel-peeper.tech"

export const SITE_NAME = "pix3l_p33p3r"

/** Raster OG card. The SVG stays the source drawing. */
export const DEFAULT_OG_PATH = "/og/default.png"

const LEGACY_OG = "/og/default.svg"

export function resolveOgImage(src?: string | null): string {
  if (!src || src === LEGACY_OG) return DEFAULT_OG_PATH
  return src
}
