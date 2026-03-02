import type { Session } from "@/lib/stack-history"

export interface SessionShareSummary {
  bbProfit: number
  durationMinutes: number
  snapshotCount: number
}

export function calculateShareSummary(session: Session): SessionShareSummary | null {
  if (session.snapshots.length < 2) return null

  const first = session.snapshots[0]
  const last = session.snapshots[session.snapshots.length - 1]

  // length >= 2 を事前チェック済みのため first/last は必ず存在するが、
  // TypeScript の noUncheckedIndexedAccess では undefined の可能性が残る。
  if (!first || !last) return null

  return {
    bbProfit: last.bbValue - first.bbValue,
    durationMinutes: Math.round((last.timestamp - first.timestamp) / (60 * 1000)),
    snapshotCount: session.snapshots.length,
  }
}

function formatDuration(minutes: number): string {
  const hours = Math.floor(minutes / 60)
  const mins = minutes % 60
  if (hours === 0) return `${mins}m`
  return `${hours}h ${mins}m`
}

function formatBBProfit(bbProfit: number): string {
  const formatted = bbProfit.toFixed(1)
  if (bbProfit > 0) return `+${formatted}`
  return formatted
}

export function generateShareText(summary: SessionShareSummary): string {
  const profit = formatBBProfit(summary.bbProfit)
  const duration = formatDuration(summary.durationMinutes)
  return `Session Result: ${profit}BB (${duration}) \u{1F4CA} #PokerChipCalc`
}
