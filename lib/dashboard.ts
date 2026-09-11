import fs from "node:fs"
import path from "node:path"

/**
 * Public weekday book for /dashboard.
 *
 * Herald: overwrite `data/dashboard/book.json` and `data/dashboard/trades.json`
 * on each ship. Set `generated_at` to an ISO-8601 instant (the page formats it
 * in Africa/Casablanca). Keep `mode: "paper"` until a live desk exists.
 * Null money fields mean unpublished — never write invented P&L.
 * `inception.points` are weekday `YYYY-MM-DD` only (no Sat/Sun rows).
 */
export const DASHBOARD_TZ = "Africa/Casablanca"
const DATA_DIR = path.join(process.cwd(), "data", "dashboard")

export type BookMode = "paper" | "live"
export type OrderSide = "buy" | "sell"
export type OrderType = "market" | "limit" | "stop" | "stop_limit"
export type OrderStatus = "open" | "pending"
export type InceptionKind = "close" | "live"

export type Balances = {
  equity: number | null
  cash: number | null
  unsettled: number | null
  buying_power: number | null
  currency: string
}

export type Position = {
  symbol: string
  qty: number
  avg_cost: number | null
  last: number | null
  bid: number | null
  ask: number | null
  market_value: number | null
}

export type BookOrder = {
  id: string
  symbol: string
  side: OrderSide
  qty: number
  filled_qty: number
  type: OrderType
  limit_price: number | null
  status: OrderStatus
  submitted_at: string | null
}

export type InceptionPoint = {
  date: string
  close: number
  kind: InceptionKind
}

export type BakedInceptionMark = "prior_close" | "live_mark"

export type BakedInceptionPoint = {
  date: string
  close: number
  mark: BakedInceptionMark
}

export type DashboardBook = {
  mode: BookMode
  timezone: typeof DASHBOARD_TZ
  generated_at: string | null
  balances: Balances
  positions: Position[]
  orders: BookOrder[]
  inception: {
    start: string | null
    points: InceptionPoint[]
  }
  baked_curve: BakedInceptionPoint[]
  warnings: string[]
}

export type JournalTrade = {
  id: string
  date: string
  symbol: string
  side: OrderSide
  qty: number
  price: number | null
  thesis: string
}

export type TradeJournal = {
  timezone: typeof DASHBOARD_TZ
  trades: JournalTrade[]
  warnings: string[]
}

const EMPTY_BALANCES: Balances = {
  equity: null,
  cash: null,
  unsettled: null,
  buying_power: null,
  currency: "USD",
}

function emptyBook(warnings: string[] = []): DashboardBook {
  return {
    mode: "paper",
    timezone: DASHBOARD_TZ,
    generated_at: null,
    balances: { ...EMPTY_BALANCES },
    positions: [],
    orders: [],
    inception: { start: null, points: [] },
    baked_curve: [],
    warnings,
  }
}

function emptyJournal(warnings: string[] = []): TradeJournal {
  return {
    timezone: DASHBOARD_TZ,
    trades: [],
    warnings,
  }
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value)
}

function asString(value: unknown): string | null {
  return typeof value === "string" && value.trim() ? value.trim() : null
}

function asNullableNumber(value: unknown): number | null {
  if (value === null || value === undefined || value === "") return null
  if (typeof value !== "number" || !Number.isFinite(value)) return null
  return value
}

function asNumber(value: unknown, fallback = 0): number {
  const parsed = asNullableNumber(value)
  return parsed === null ? fallback : parsed
}

function asYmd(value: unknown): string | null {
  if (typeof value !== "string") return null
  return /^\d{4}-\d{2}-\d{2}$/.test(value) ? value : null
}

function asIsoInstant(value: unknown): string | null {
  if (typeof value !== "string" || !value.trim()) return null
  const parsed = new Date(value)
  if (Number.isNaN(parsed.getTime())) return null
  return parsed.toISOString()
}

export function casablancaYmd(now = new Date()): string {
  return new Intl.DateTimeFormat("en-CA", {
    timeZone: DASHBOARD_TZ,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(now)
}

export function weekdayName(ymd: string): string | null {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(ymd)) return null
  return new Intl.DateTimeFormat("en-US", {
    timeZone: DASHBOARD_TZ,
    weekday: "short",
  }).format(new Date(`${ymd}T12:00:00.000Z`))
}

export function isWeekdayYmd(ymd: string): boolean {
  const name = weekdayName(ymd)
  return name === "Mon" || name === "Tue" || name === "Wed" || name === "Thu" || name === "Fri"
}

function parseMode(value: unknown, warnings: string[]): BookMode {
  if (value === "paper" || value === "live") return value
  if (value !== undefined) warnings.push(`Unknown book mode "${String(value)}"; defaulting to paper.`)
  return "paper"
}

function parseSide(value: unknown): OrderSide | null {
  return value === "buy" || value === "sell" ? value : null
}

function parseOrderType(value: unknown): OrderType | null {
  switch (value) {
    case "market":
    case "limit":
    case "stop":
    case "stop_limit":
      return value
    default:
      return null
  }
}

function parseOrderStatus(value: unknown): OrderStatus | null {
  return value === "open" || value === "pending" ? value : null
}

function parseInceptionKind(value: unknown): InceptionKind {
  return value === "live" ? "live" : "close"
}

function parseBalances(raw: unknown, warnings: string[]): Balances {
  if (!isRecord(raw)) {
    warnings.push("balances missing; unpublished paper fields used.")
    return { ...EMPTY_BALANCES }
  }
  const currency = asString(raw.currency) ?? "USD"
  return {
    equity: asNullableNumber(raw.equity),
    cash: asNullableNumber(raw.cash),
    unsettled: asNullableNumber(raw.unsettled),
    buying_power: asNullableNumber(raw.buying_power),
    currency,
  }
}

function parsePositions(raw: unknown, warnings: string[]): Position[] {
  if (raw === undefined) return []
  if (!Array.isArray(raw)) {
    warnings.push("positions must be an array; ignored.")
    return []
  }
  const rows: Position[] = []
  raw.forEach((item, index) => {
    if (!isRecord(item)) {
      warnings.push(`positions[${index}] is not an object; skipped.`)
      return
    }
    const symbol = asString(item.symbol)
    if (!symbol) {
      warnings.push(`positions[${index}] missing symbol; skipped.`)
      return
    }
    rows.push({
      symbol,
      qty: asNumber(item.qty),
      avg_cost: asNullableNumber(item.avg_cost),
      last: asNullableNumber(item.last),
      bid: asNullableNumber(item.bid),
      ask: asNullableNumber(item.ask),
      market_value: asNullableNumber(item.market_value),
    })
  })
  return rows
}

function parseOrders(raw: unknown, warnings: string[]): BookOrder[] {
  if (raw === undefined) return []
  if (!Array.isArray(raw)) {
    warnings.push("orders must be an array; ignored.")
    return []
  }
  const rows: BookOrder[] = []
  raw.forEach((item, index) => {
    if (!isRecord(item)) {
      warnings.push(`orders[${index}] is not an object; skipped.`)
      return
    }
    const id = asString(item.id) ?? `order-${index + 1}`
    const symbol = asString(item.symbol)
    const side = parseSide(item.side)
    const type = parseOrderType(item.type)
    const status = parseOrderStatus(item.status)
    if (!symbol || !side || !type || !status) {
      warnings.push(`orders[${index}] missing symbol/side/type/status; skipped.`)
      return
    }
    rows.push({
      id,
      symbol,
      side,
      qty: asNumber(item.qty),
      filled_qty: asNumber(item.filled_qty),
      type,
      limit_price: asNullableNumber(item.limit_price),
      status,
      submitted_at: asIsoInstant(item.submitted_at) ?? asString(item.submitted_at),
    })
  })
  return rows
}

function parseInceptionPoints(raw: unknown, warnings: string[]): InceptionPoint[] {
  if (raw === undefined) return []
  if (!Array.isArray(raw)) {
    warnings.push("inception.points must be an array; ignored.")
    return []
  }
  const rows: InceptionPoint[] = []
  raw.forEach((item, index) => {
    if (!isRecord(item)) {
      warnings.push(`inception.points[${index}] is not an object; skipped.`)
      return
    }
    const date = asYmd(item.date)
    const close = asNullableNumber(item.close)
    if (!date || close === null) {
      warnings.push(`inception.points[${index}] needs weekday date + close; skipped.`)
      return
    }
    if (!isWeekdayYmd(date)) {
      warnings.push(`inception.points[${index}] ${date} is not a weekday; dropped (no weekend spans).`)
      return
    }
    rows.push({
      date,
      close,
      kind: parseInceptionKind(item.kind),
    })
  })
  rows.sort((a, b) => a.date.localeCompare(b.date))
  return rows
}

export function bakeInceptionCurve(points: InceptionPoint[], now = new Date()): BakedInceptionPoint[] {
  const today = casablancaYmd(now)
  return points
    .filter((point) => isWeekdayYmd(point.date))
    .map((point) => ({
      date: point.date,
      close: point.close,
      mark: point.date === today ? "live_mark" : "prior_close",
    }))
}

function parseBook(raw: unknown): DashboardBook {
  const warnings: string[] = []
  if (!isRecord(raw)) {
    return emptyBook(["book.json is not an object; paper empty book used."])
  }
  if (raw.timezone && raw.timezone !== DASHBOARD_TZ) {
    warnings.push(`timezone "${String(raw.timezone)}" ignored; book is Africa/Casablanca.`)
  }
  const inceptionRaw = isRecord(raw.inception) ? raw.inception : {}
  if (raw.inception !== undefined && !isRecord(raw.inception)) {
    warnings.push("inception must be an object; empty curve used.")
  }
  const start = asYmd(inceptionRaw.start)
  if (inceptionRaw.start && !start) {
    warnings.push("inception.start must be YYYY-MM-DD; ignored.")
  }
  if (start && !isWeekdayYmd(start)) {
    warnings.push(`inception.start ${start} is not a weekday; ignored.`)
  }
  const points = parseInceptionPoints(inceptionRaw.points, warnings)
  return {
    mode: parseMode(raw.mode, warnings),
    timezone: DASHBOARD_TZ,
    generated_at: asIsoInstant(raw.generated_at),
    balances: parseBalances(raw.balances, warnings),
    positions: parsePositions(raw.positions, warnings),
    orders: parseOrders(raw.orders, warnings),
    inception: {
      start: start && isWeekdayYmd(start) ? start : null,
      points,
    },
    baked_curve: bakeInceptionCurve(points),
    warnings,
  }
}

function parseTrades(raw: unknown, warnings: string[]): JournalTrade[] {
  if (raw === undefined) return []
  if (!Array.isArray(raw)) {
    warnings.push("trades must be an array; ignored.")
    return []
  }
  const rows: JournalTrade[] = []
  raw.forEach((item, index) => {
    if (!isRecord(item)) {
      warnings.push(`trades[${index}] is not an object; skipped.`)
      return
    }
    const date = asYmd(item.date)
    const symbol = asString(item.symbol)
    const side = parseSide(item.side)
    const thesis = typeof item.thesis === "string" ? item.thesis.trim() : ""
    if (!date || !symbol || !side) {
      warnings.push(`trades[${index}] needs weekday date, symbol, and side; skipped.`)
      return
    }
    if (!isWeekdayYmd(date)) {
      warnings.push(`trades[${index}] ${date} is not a weekday; skipped.`)
      return
    }
    rows.push({
      id: asString(item.id) ?? `trade-${index + 1}`,
      date,
      symbol,
      side,
      qty: asNumber(item.qty),
      price: asNullableNumber(item.price),
      thesis,
    })
  })
  rows.sort((a, b) => b.date.localeCompare(a.date) || a.symbol.localeCompare(b.symbol))
  return rows
}

function parseJournal(raw: unknown): TradeJournal {
  const warnings: string[] = []
  if (!isRecord(raw)) {
    return emptyJournal(["trades.json is not an object; empty journal used."])
  }
  if (raw.timezone && raw.timezone !== DASHBOARD_TZ) {
    warnings.push(`timezone "${String(raw.timezone)}" ignored; journal is Africa/Casablanca.`)
  }
  return {
    timezone: DASHBOARD_TZ,
    trades: parseTrades(raw.trades, warnings),
    warnings,
  }
}

function readJsonFile(filename: string): unknown {
  const filePath = path.join(DATA_DIR, filename)
  if (!fs.existsSync(filePath)) return null
  return JSON.parse(fs.readFileSync(filePath, "utf8")) as unknown
}

export async function getDashboardBook(): Promise<DashboardBook> {
  try {
    const raw = readJsonFile("book.json")
    if (raw === null) return emptyBook(["book.json missing; paper empty book used."])
    return parseBook(raw)
  } catch {
    return emptyBook(["book.json could not be parsed; paper empty book used."])
  }
}

export async function getTradeJournal(): Promise<TradeJournal> {
  try {
    const raw = readJsonFile("trades.json")
    if (raw === null) return emptyJournal(["trades.json missing; empty journal used."])
    return parseJournal(raw)
  } catch {
    return emptyJournal(["trades.json could not be parsed; empty journal used."])
  }
}

export async function getDashboardSnapshot(): Promise<{ book: DashboardBook; journal: TradeJournal }> {
  const [book, journal] = await Promise.all([getDashboardBook(), getTradeJournal()])
  return { book, journal }
}

export function formatMoney(value: number | null, currency: string): string {
  if (value === null) return "—"
  try {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency,
      maximumFractionDigits: 2,
    }).format(value)
  } catch {
    return `${value.toFixed(2)} ${currency}`
  }
}

export function formatQty(value: number): string {
  return new Intl.NumberFormat("en-US", { maximumFractionDigits: 4 }).format(value)
}

export function formatGeneratedAt(iso: string | null): string {
  if (!iso) return "not published"
  const parsed = new Date(iso)
  if (Number.isNaN(parsed.getTime())) return "not published"
  const stamp = new Intl.DateTimeFormat("en-GB", {
    timeZone: DASHBOARD_TZ,
    dateStyle: "medium",
    timeStyle: "short",
  }).format(parsed)
  return `${stamp} ${DASHBOARD_TZ}`
}

export function formatWeekdayDate(ymd: string): string {
  const parsed = new Date(`${ymd}T12:00:00.000Z`)
  if (Number.isNaN(parsed.getTime())) return ymd
  return new Intl.DateTimeFormat("en-GB", {
    timeZone: DASHBOARD_TZ,
    weekday: "short",
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(parsed)
}

export function modeLabel(mode: BookMode): string {
  switch (mode) {
    case "paper":
      return "PAPER"
    case "live":
      return "LIVE"
    default: {
      const _exhaustive: never = mode
      return _exhaustive
    }
  }
}

export function sideLabel(side: OrderSide): string {
  switch (side) {
    case "buy":
      return "BUY"
    case "sell":
      return "SELL"
    default: {
      const _exhaustive: never = side
      return _exhaustive
    }
  }
}

export function orderTypeLabel(type: OrderType): string {
  switch (type) {
    case "market":
      return "MKT"
    case "limit":
      return "LMT"
    case "stop":
      return "STP"
    case "stop_limit":
      return "STP LMT"
    default: {
      const _exhaustive: never = type
      return _exhaustive
    }
  }
}

export function orderStatusLabel(status: OrderStatus): string {
  switch (status) {
    case "open":
      return "OPEN"
    case "pending":
      return "PENDING"
    default: {
      const _exhaustive: never = status
      return _exhaustive
    }
  }
}

export function inceptionMarkLabel(mark: BakedInceptionMark): string {
  switch (mark) {
    case "prior_close":
      return "prior close"
    case "live_mark":
      return "live mark"
    default: {
      const _exhaustive: never = mark
      return _exhaustive
    }
  }
}

export function bookHasPublishedFigures(book: DashboardBook): boolean {
  const { balances } = book
  return (
    balances.equity !== null ||
    balances.cash !== null ||
    balances.unsettled !== null ||
    balances.buying_power !== null ||
    book.positions.length > 0 ||
    book.orders.length > 0 ||
    book.baked_curve.length > 0
  )
}
