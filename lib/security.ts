/** Validate URLs before opening (http/https/mailto only). */
export function isValidUrl(url: string): boolean {
  try {
    const urlObj = new URL(url)
    return ["http:", "https:", "mailto:"].includes(urlObj.protocol)
  } catch {
    return false
  }
}
