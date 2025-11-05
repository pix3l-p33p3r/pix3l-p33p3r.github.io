// Sanitize user input to prevent XSS attacks
export function sanitizeInput(input: string): string {
  if (!input || typeof input !== "string") return ""

  return input
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#x27;")
    .replace(/\//g, "&#x2F;")
}

// Validate URLs to prevent open redirect attacks
export function isValidUrl(url: string): boolean {
  try {
    const urlObj = new URL(url)
    // Only allow http and https protocols
    return ["http:", "https:", "mailto:"].includes(urlObj.protocol)
  } catch {
    return false
  }
}

// Validate email addresses
export function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email) && email.length <= 254
}

// Generate CSRF token (for future form implementations)
export function generateCSRFToken(): string {
  if (typeof window === "undefined") return ""
  const array = new Uint8Array(32)
  crypto.getRandomValues(array)
  return Array.from(array, (byte) => byte.toString(16).padStart(2, "0")).join("")
}

// Validate CSRF token
export function validateCSRFToken(token: string, storedToken: string): boolean {
  return token === storedToken && token.length === 64
}
