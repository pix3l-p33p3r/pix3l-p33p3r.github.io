import type { ReactNode } from "react"
import DashboardInceptionChart from "@/components/dashboard-inception-chart"
import {
  bookHasPublishedFigures,
  formatGeneratedAt,
  formatMoney,
  formatQty,
  formatWeekdayDate,
  modeLabel,
  orderStatusLabel,
  orderTypeLabel,
  sideLabel,
  type BookOrder,
  type DashboardBook,
  type JournalTrade,
  type OrderSide,
  type Position,
  type TradeJournal,
} from "@/lib/dashboard"

type Props = {
  book: DashboardBook
  journal: TradeJournal
}

function sideClass(side: OrderSide): string {
  switch (side) {
    case "buy":
      return "text-[#00ffff]"
    case "sell":
      return "text-[#ff4800]"
    default: {
      const _exhaustive: never = side
      return _exhaustive
    }
  }
}

function Panel({
  title,
  children,
}: {
  title: string
  children: ReactNode
}) {
  return (
    <section className="border border-[#333] bg-black/60 p-4 md:p-5 shadow-inner shadow-black/50">
      <h2 className="text-xl text-[#00ffff] tracking-wider mb-3">{title}</h2>
      {children}
    </section>
  )
}

function EmptyNote({ children }: { children: ReactNode }) {
  return <p className="text-white/70">{children}</p>
}

function Metric({
  label,
  value,
}: {
  label: string
  value: string
}) {
  return (
    <div className="border border-[#333] bg-black/40 p-3">
      <p className="text-white/50 text-sm tracking-wider">{label}</p>
      <p className="text-2xl text-white mt-1 tabular-nums">{value}</p>
    </div>
  )
}

function TableWrap({ children }: { children: ReactNode }) {
  return <div className="overflow-x-auto">{children}</div>
}

function PositionsTable({
  rows,
  currency,
}: {
  rows: Position[]
  currency: string
}) {
  if (rows.length === 0) {
    return <EmptyNote>No positions published. Paper desk — Herald has not written a book yet.</EmptyNote>
  }
  return (
    <TableWrap>
      <table className="w-full text-left text-sm md:text-base border-collapse">
        <caption className="sr-only">Open positions with last, bid, and ask</caption>
        <thead>
          <tr className="text-white/50 border-b border-[#333]">
            <th className="py-2 pr-3 font-normal">Symbol</th>
            <th className="py-2 pr-3 font-normal">Qty</th>
            <th className="py-2 pr-3 font-normal">Avg</th>
            <th className="py-2 pr-3 font-normal">Last</th>
            <th className="py-2 pr-3 font-normal">Bid</th>
            <th className="py-2 pr-3 font-normal">Ask</th>
            <th className="py-2 font-normal">Mkt value</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => (
            <tr key={row.symbol} className="border-b border-[#222]">
              <td className="py-2 pr-3 text-[#00ffff]">{row.symbol}</td>
              <td className="py-2 pr-3 tabular-nums">{formatQty(row.qty)}</td>
              <td className="py-2 pr-3 tabular-nums">{formatMoney(row.avg_cost, currency)}</td>
              <td className="py-2 pr-3 tabular-nums">{formatMoney(row.last, currency)}</td>
              <td className="py-2 pr-3 tabular-nums">{formatMoney(row.bid, currency)}</td>
              <td className="py-2 pr-3 tabular-nums">{formatMoney(row.ask, currency)}</td>
              <td className="py-2 tabular-nums">{formatMoney(row.market_value, currency)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </TableWrap>
  )
}

function OrdersTable({
  rows,
  currency,
}: {
  rows: BookOrder[]
  currency: string
}) {
  if (rows.length === 0) {
    return <EmptyNote>No open or pending orders in the published paper book.</EmptyNote>
  }
  return (
    <TableWrap>
      <table className="w-full text-left text-sm md:text-base border-collapse">
        <caption className="sr-only">Open and pending orders</caption>
        <thead>
          <tr className="text-white/50 border-b border-[#333]">
            <th className="py-2 pr-3 font-normal">Id</th>
            <th className="py-2 pr-3 font-normal">Symbol</th>
            <th className="py-2 pr-3 font-normal">Side</th>
            <th className="py-2 pr-3 font-normal">Qty</th>
            <th className="py-2 pr-3 font-normal">Type</th>
            <th className="py-2 pr-3 font-normal">Limit</th>
            <th className="py-2 font-normal">Status</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => (
            <tr key={row.id} className="border-b border-[#222]">
              <td className="py-2 pr-3 text-white/70">{row.id}</td>
              <td className="py-2 pr-3 text-[#00ffff]">{row.symbol}</td>
              <td className={`py-2 pr-3 ${sideClass(row.side)}`}>{sideLabel(row.side)}</td>
              <td className="py-2 pr-3 tabular-nums">
                {formatQty(row.filled_qty)}/{formatQty(row.qty)}
              </td>
              <td className="py-2 pr-3">{orderTypeLabel(row.type)}</td>
              <td className="py-2 pr-3 tabular-nums">{formatMoney(row.limit_price, currency)}</td>
              <td className="py-2">{orderStatusLabel(row.status)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </TableWrap>
  )
}

function TradesJournal({
  rows,
  currency,
}: {
  rows: JournalTrade[]
  currency: string
}) {
  if (rows.length === 0) {
    return (
      <EmptyNote>
        No journal entries yet. When Herald publishes fills, each row carries the thesis — this page will not invent one.
      </EmptyNote>
    )
  }
  return (
    <ul className="space-y-3">
      {rows.map((row) => (
        <li key={row.id} className="border border-[#333] bg-black/40 p-3">
          <div className="flex flex-wrap gap-x-4 gap-y-1 text-sm md:text-base">
            <span className="text-white/50">{formatWeekdayDate(row.date)}</span>
            <span className="text-[#00ffff]">{row.symbol}</span>
            <span className={sideClass(row.side)}>{sideLabel(row.side)}</span>
            <span className="tabular-nums">{formatQty(row.qty)}</span>
            <span className="tabular-nums">{formatMoney(row.price, currency)}</span>
          </div>
          {row.thesis ? (
            <p className="text-white/80 mt-2">{row.thesis}</p>
          ) : (
            <p className="text-white/50 mt-2">No thesis published for this fill.</p>
          )}
        </li>
      ))}
    </ul>
  )
}

export default function DashboardBook({ book, journal }: Props) {
  const currency = book.balances.currency
  const published = bookHasPublishedFigures(book) || journal.trades.length > 0
  const warnings = [...book.warnings, ...journal.warnings]
  const paper = book.mode === "paper"

  return (
    <div className="max-w-5xl mx-auto space-y-4 md:space-y-5">
      <header className="border border-[#333] bg-black/60 p-4 md:p-5 shadow-inner shadow-black/50">
        <div className="flex flex-wrap items-center gap-3 mb-2">
          <h1 className="text-3xl md:text-4xl text-[#ff4800] tracking-wider">Public book</h1>
          <span
            className={`border px-3 py-1 text-sm tracking-wider ${
              paper ? "border-[#ff4800] text-[#ff4800]" : "border-[#00ffff] text-[#00ffff]"
            }`}
          >
            {modeLabel(book.mode)}
          </span>
        </div>
        <p className="text-white/80">
          Pixel Peeper weekday desk. Equity, cash, unsettled, buying power, positions, open orders, and the inception
          curve — published from on-repo files, not a live broker socket.
        </p>
        <p className="text-white/50 text-sm mt-2">
          generated_at · {formatGeneratedAt(book.generated_at)}
        </p>
      </header>

      <aside
        className={`border p-4 ${
          paper ? "border-[#ff4800] bg-[rgba(255,72,0,0.08)]" : "border-[#00ffff] bg-[rgba(0,255,255,0.06)]"
        }`}
      >
        {paper ? (
          <p>
            <span className="text-[#ff4800] tracking-wider">PAPER BOOK.</span>{" "}
            <span className="text-white/80">
              No live desk on this ship. Empty fields are unpublished — they are not zeros, and this page does not
              invent P&L.
            </span>
          </p>
        ) : (
          <p className="text-white/80">
            Live public book as Herald published it in-repo. Figures below are only what the JSON contains.
          </p>
        )}
        {!published ? (
          <p className="text-white/70 mt-2">
            Waiting on the first weekday ship. Structure is ready; overwrite{" "}
            <code className="text-[#00ffff]">data/dashboard/book.json</code> and{" "}
            <code className="text-[#00ffff]">data/dashboard/trades.json</code> to fill it.
          </p>
        ) : null}
      </aside>

      {warnings.length > 0 ? (
        <aside className="border border-[#333] bg-black/60 p-4 text-white/60 text-sm">
          <p className="tracking-wider text-[#ff4800] mb-1">Loader notes</p>
          <ul className="list-disc pl-5 space-y-1">
            {warnings.map((warning) => (
              <li key={warning}>{warning}</li>
            ))}
          </ul>
        </aside>
      ) : null}

      <Panel title="Balances">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          <Metric label="Equity" value={formatMoney(book.balances.equity, currency)} />
          <Metric label="Cash" value={formatMoney(book.balances.cash, currency)} />
          <Metric label="Unsettled" value={formatMoney(book.balances.unsettled, currency)} />
          <Metric label="Buying power" value={formatMoney(book.balances.buying_power, currency)} />
        </div>
      </Panel>

      <Panel title="Inception">
        <DashboardInceptionChart points={book.baked_curve} currency={currency} />
      </Panel>

      <Panel title="Positions">
        <PositionsTable rows={book.positions} currency={currency} />
      </Panel>

      <Panel title="Open / pending orders">
        <OrdersTable rows={book.orders} currency={currency} />
      </Panel>

      <Panel title="Trades journal">
        <TradesJournal rows={journal.trades} currency={currency} />
      </Panel>
    </div>
  )
}
