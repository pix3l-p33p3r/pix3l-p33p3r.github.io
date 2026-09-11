/** Password-gated admin session helpers (Edge + Node via Web Crypto). */

import { ADMIN_PATH_PREFIX, isAdminPath } from "@/lib/admin-path"

export { ADMIN_PATH_PREFIX, isAdminPath }

export const ADMIN_COOKIE_NAME = "pp_admin_session"
export const ADMIN_SESSION_TTL_SECONDS = 60 * 60 * 12

const TOKEN_VERSION = "v1"

function textBytes(value: string): Uint8Array {
  return new TextEncoder().encode(value)
}

function bytesToHex(bytes: ArrayBuffer | Uint8Array): string {
  const view = bytes instanceof Uint8Array ? bytes : new Uint8Array(bytes)
  return Array.from(view, (b) => b.toString(16).padStart(2, "0")).join("")
}

function hexToBytes(hex: string): Uint8Array | null {
  if (!/^[0-9a-f]+$/i.test(hex) || hex.length % 2 !== 0) return null
  const out = new Uint8Array(hex.length / 2)
  for (let i = 0; i < out.length; i++) {
    out[i] = Number.parseInt(hex.slice(i * 2, i * 2 + 2), 16)
  }
  return out
}

function timingSafeEqualBytes(a: Uint8Array, b: Uint8Array): boolean {
  if (a.length !== b.length) return false
  let diff = 0
  for (let i = 0; i < a.length; i++) diff |= a[i] ^ b[i]
  return diff === 0
}

async function sha256Bytes(value: string): Promise<Uint8Array> {
  const digest = await crypto.subtle.digest("SHA-256", textBytes(value))
  return new Uint8Array(digest)
}

async function hmacHex(secret: string, message: string): Promise<string> {
  const key = await crypto.subtle.importKey(
    "raw",
    textBytes(secret),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"],
  )
  const signature = await crypto.subtle.sign("HMAC", key, textBytes(message))
  return bytesToHex(signature)
}

export function readAdminPassword(): string | null {
  const password =
    process.env.ADMIN_DASHBOARD_PASSWORD?.trim() ||
    process.env.ANALYTICS_DASHBOARD_PASSWORD?.trim() ||
    ""
  return password.length > 0 ? password : null
}

export function isAdminPasswordConfigured(): boolean {
  return readAdminPassword() !== null
}

function sessionSecret(password: string): string {
  const explicit = process.env.ADMIN_SESSION_SECRET?.trim()
  if (explicit) return explicit
  return `pp-admin-session:${password}`
}

export async function passwordsMatch(provided: string, expected: string): Promise<boolean> {
  const [providedHash, expectedHash] = await Promise.all([sha256Bytes(provided), sha256Bytes(expected)])
  return timingSafeEqualBytes(providedHash, expectedHash)
}

export async function verifyAdminPassword(provided: string): Promise<boolean> {
  const expected = readAdminPassword()
  if (!expected || provided.length === 0) {
    await passwordsMatch(provided || "x", "unconfigured")
    return false
  }
  return passwordsMatch(provided, expected)
}

export async function createSessionToken(nowMs = Date.now()): Promise<string | null> {
  const password = readAdminPassword()
  if (!password) return null
  const exp = Math.floor(nowMs / 1000) + ADMIN_SESSION_TTL_SECONDS
  const payload = `${TOKEN_VERSION}.${exp}`
  const sig = await hmacHex(sessionSecret(password), payload)
  return `${payload}.${sig}`
}

export async function verifySessionToken(token: string | undefined | null, nowMs = Date.now()): Promise<boolean> {
  if (!token) return false
  const password = readAdminPassword()
  if (!password) return false

  const parts = token.split(".")
  if (parts.length !== 3) return false
  const [version, expRaw, sig] = parts
  if (version !== TOKEN_VERSION || !expRaw || !sig) return false

  const exp = Number.parseInt(expRaw, 10)
  if (!Number.isFinite(exp) || exp * 1000 <= nowMs) return false

  const expected = await hmacHex(sessionSecret(password), `${version}.${expRaw}`)
  const expectedBytes = hexToBytes(expected)
  const providedBytes = hexToBytes(sig)
  if (!expectedBytes || !providedBytes) return false
  return timingSafeEqualBytes(expectedBytes, providedBytes)
}

export function safeAdminNextPath(value: string | null | undefined): string {
  if (!value || !value.startsWith(ADMIN_PATH_PREFIX)) return "/admin/analytics"
  if (value.startsWith("//") || value.includes("://")) return "/admin/analytics"
  return value
}

export function adminCookieOptions(maxAge = ADMIN_SESSION_TTL_SECONDS) {
  return {
    httpOnly: true,
    sameSite: "lax" as const,
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge,
  }
}
